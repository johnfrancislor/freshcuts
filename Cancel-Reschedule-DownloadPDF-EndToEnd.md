# Cancel, Reschedule, and Download PDF (End-to-End Technical Guide)

This document explains the three Step 5 receipt actions in detail:

1. Cancel booking
2. Reschedule booking
3. Download billing statement as PDF

For each feature, this guide shows:

- where the flow starts in the UI
- which endpoint is fetched
- request payload and expected response behavior
- backend controller/service logic
- realtime/event behavior
- exact files to inspect first when debugging

---

## 1) Where the overall Step 5 flow starts

### Frontend route entry

- Route config: `client-marcelinos/src/routes/route.ts`
  - `/booking-receipt/:receipt_token` uses `Booking` page with `current_step: 5`

### Receipt page to Step5 handoff

- `client-marcelinos/src/pages/Booking/BookingReceiptPage.tsx`
  - imports Step5 at line 9
  - decides receipt API path at lines 213-215:
    - `/bookings/reference/{reference}` (legacy)
    - `/bookings/receipt/{token}` (UUID receipt token)
  - fetches receipt via `useApiQuery` at line 228

### Step 5 action page

- Main action UI: `client-marcelinos/src/pages/Booking/Steps/Step5.tsx`
- This is where the three buttons/actions are rendered:
  - Download Receipt
  - Reschedule Booking
  - Cancel Booking

---

## 2) Shared API client used by all three actions

- Axios wrapper: `client-marcelinos/src/lib/api/apiClient.ts`
  - Uses env-based `baseURL`
  - Sends `x-api-key` header if configured
  - Normalizes API errors from `error.response.data.message`

- Mutation helper: `client-marcelinos/src/lib/api/mutations/useApiMutation.ts`
  - Used by cancel and reschedule actions

---

## 3) Cancel booking feature

## 3.1 Frontend start point

- Cancel button + modal wiring:
  - `client-marcelinos/src/pages/Booking/Steps/Step5.tsx`
  - Cancel mutation defined at line 643
  - Button area around lines 1625-1645
  - Modal submit calls cancel endpoint at lines 1667-1669

- Modal component:
  - `client-marcelinos/src/components/modals/CancelBookingContent.tsx`

## 3.2 What the frontend fetches

### A) Send OTP (cancel purpose)

- File: `CancelBookingContent.tsx`
- Call at lines 84-85:
  - `POST /bookings/{reference}/otp/send`
  - Body:

```json
{
  "purpose": "cancel"
}
```

- OTP UI guards:
  - resend timer (`resendIn`)
  - pending-state lock
  - requires reference number

### B) Confirm cancel

- File: `Step5.tsx`
- Call at lines 1668-1669:
  - `PATCH /bookings/{reference}/cancel`
  - Body:

```json
{
  "otp": "123456"
}
```

- UI behavior:
  - sets `isProcessingCancel` true immediately (line 1664)
  - keeps button locked until status update or error
  - unlocks only on error (line 1678)

## 3.3 Backend routes and logic

### Route registration

- `Marcelinos-Backend/routes/api.php`
  - line 73: `POST /bookings/{booking:reference_number}/otp/send`
  - line 75: `PATCH /bookings/{booking:reference_number}/cancel`

### Controller methods

- `Marcelinos-Backend/app/Http/Controllers/API/BookingController.php`
  - line 45: `sendBookingOtp(Request $request, Booking $booking)`
  - line 1168: `cancel(Request $request, Booking $booking)`

### OTP verification details

- `Marcelinos-Backend/app/Services/BookingActionOtpService.php`
  - OTP TTL: line 20 (`TTL_MINUTES = 10`)
  - OTP generation: line 47 (`random_int(0, 999999)`)
  - OTP cached hashed: line 54
  - consume-on-verify: line 74 (`verifyAndConsume`) and line 100 (`Cache::forget($key)`)

### Cancellation financial breakdown

- `Marcelinos-Backend/app/Support/CancellationPolicy.php`
  - line 10: `feePercent()`
  - line 29: `breakdown(total, amountPaid)`

- In cancel flow, controller computes breakdown before response:
  - `BookingController.php` lines 1210+.

## 3.4 Realtime behavior for cancel

- Controller broadcasts at line 1229:
  - `broadcast(new BookingCancelled($booking))->toOthers();`

- Event payload source:
  - `Marcelinos-Backend/app/Events/BookingCancelled.php`
  - payload includes `booking_status` and `payment_status` (line 33)

- Frontend listener:
  - `Step5.tsx` lines 73-75 (`echo.private(...).listen('.booking.cancelled', ...)`)

### Important implementation note

Current listener reads `e.status` (line 75), while backend event exposes `booking_status`.
If realtime status does not update as expected, check this payload key mismatch first.

---

## 4) Reschedule booking feature

## 4.1 Frontend start point

- Reschedule button and modal open:
  - `Step5.tsx` lines 1598-1618

- Modal component:
  - `client-marcelinos/src/components/modals/RescheduleBookingContent.tsx`

## 4.2 What the frontend fetches

### A) Fetch blocked dates for calendar validation

- File: `RescheduleBookingContent.tsx`
- `useApiQuery` at lines 131-133:
  - `GET /blocked-dates?booking_reference={reference}`

Why this fetch matters:

- The modal validates the entire selected stay window, not only the check-in date.
- Overlap logic is handled by `stayOverlapsBlocked` (line 23).

### B) Send OTP (reschedule purpose)

- File: `RescheduleBookingContent.tsx`
- Call at lines 234-235:
  - `POST /bookings/{reference}/otp/send`
  - Body:

```json
{
  "purpose": "reschedule"
}
```

### C) Confirm reschedule

- File: `RescheduleBookingContent.tsx`
- Call at line 270:
  - `PATCH /bookings/{reference}/reschedule`

- Body fields built at lines 272-281:

```json
{
  "check_in": "YYYY-MM-DD",
  "check_out": "YYYY-MM-DD or YYYY-MM-DD 23:59:59 (venue same-day case)",
  "days": 2,
  "otp": "123456",
  "booking_type": "venue",
  "venue_event_date": "YYYY-MM-DD"
}
```

Note: `booking_type` and `venue_event_date` are included only for venue same-day flow.

## 4.3 Backend routes and logic

### Route registration

- `Marcelinos-Backend/routes/api.php`
  - line 86: `PATCH /bookings/{reference}/reschedule`

### Controller method

- `Marcelinos-Backend/app/Http/Controllers/API/BookingController.php`
  - line 1244: `reschedule(Request $request, $reference)`

Key backend checks:

1. Validates `check_in`, `check_out`, `otp`
2. Rejects expired-unpaid booking
3. Rejects pending verification booking
4. Rejects cancelled/completed booking
5. Validates room and venue availability for new window
6. Verifies OTP (line 1329)
7. Recomputes total price and payment status
8. Updates booking fields (`check_in`, `check_out`, `total_price`, `payment_status`, `booking_status=rescheduled`)
9. Broadcasts `BookingRescheduled` (line 1353)

## 4.4 Realtime behavior for reschedule

- Frontend listens in `Step5.tsx` line 84 on private booking channel.
- Backend event `BookingRescheduled` currently broadcasts on public `bookings` channel:
  - `Marcelinos-Backend/app/Events/BookingRescheduled.php` line 34: `new Channel('bookings')`

### Important implementation note

If reschedule realtime updates are missed on Step5, first verify channel consistency:

- frontend: private `booking.{reference}` listener
- backend: public `bookings` broadcaster

---

## 5) Download billing statement as PDF feature

## 5.1 Frontend start point

- Download function:
  - `client-marcelinos/src/pages/Booking/Steps/Step5.tsx`
  - line 873: `downloadReceipt()`

- Download button:
  - line 1549 (`onClick={downloadReceipt}`)

## 5.2 What the frontend fetches

- API call at lines 882-884:
  - `GET /bookings/{reference}/billing-statement/pdf`
  - axios config: `{ responseType: "blob" }`

- Blob handling:
  - create object URL at line 887
  - mobile path: `window.open(pdfUrl, '_blank')` at line 890
  - desktop path: anchor download filename at line 900

## 5.3 Backend routes and logic

### Route registration

- `Marcelinos-Backend/routes/api.php`
  - line 76: `GET /bookings/{booking:reference_number}/billing-statement/pdf`
  - includes `throttle:receipt_lookup`

### Controller method

- `Marcelinos-Backend/app/Http/Controllers/API/BookingController.php`
  - line 167: `downloadBillingStatementPdf(string $token)`

Flow:

1. Finds booking by reference/token (`findReceiptBooking`)
2. Returns 404 if missing
3. Rejects pending verification booking
4. Builds server-side billing data (`buildBillingStatementData`)
5. Renders PDF via DomPDF:
   - `Pdf::loadView('billing-statements.step5', $statement)`
6. Returns downloadable PDF response

Server-side rendering is important because it avoids relying on editable frontend DOM values.

---

## 6) Exact backend endpoints used by these 3 features

From `Marcelinos-Backend/routes/api.php`:

1. `POST /bookings/{booking:reference_number}/otp/send`
2. `PATCH /bookings/{booking:reference_number}/cancel`
3. `PATCH /bookings/{reference}/reschedule`
4. `GET /bookings/{booking:reference_number}/billing-statement/pdf`
5. (Reschedule support) `GET /blocked-dates?booking_reference={reference}`

---

## 7) Where to start debugging (recommended order)

If one of the three features fails, start in this order:

1. Frontend action source in Step5
   - `client-marcelinos/src/pages/Booking/Steps/Step5.tsx`
2. Modal logic (OTP + payload)
   - `client-marcelinos/src/components/modals/CancelBookingContent.tsx`
   - `client-marcelinos/src/components/modals/RescheduleBookingContent.tsx`
3. API route binding
   - `Marcelinos-Backend/routes/api.php`
4. Booking controller method
   - `Marcelinos-Backend/app/Http/Controllers/API/BookingController.php`
5. OTP service internals
   - `Marcelinos-Backend/app/Services/BookingActionOtpService.php`
6. Cancellation fee policy source (if amount mismatch)
   - `Marcelinos-Backend/app/Support/CancellationPolicy.php`
   - `Marcelinos-Backend/app/Http/Controllers/API/PaymentSettingsController.php`
7. Realtime channel and payload compatibility
   - `client-marcelinos/src/pages/Booking/Steps/Step5.tsx`
   - `Marcelinos-Backend/app/Events/BookingCancelled.php`
   - `Marcelinos-Backend/app/Events/BookingRescheduled.php`

---

## 8) Quick payload reference

### Send OTP for cancel

```http
POST /bookings/{reference}/otp/send
Content-Type: application/json

{ "purpose": "cancel" }
```

### Cancel booking

```http
PATCH /bookings/{reference}/cancel
Content-Type: application/json

{ "otp": "123456" }
```

### Send OTP for reschedule

```http
POST /bookings/{reference}/otp/send
Content-Type: application/json

{ "purpose": "reschedule" }
```

### Reschedule booking

```http
PATCH /bookings/{reference}/reschedule
Content-Type: application/json

{
  "check_in": "2026-05-10",
  "check_out": "2026-05-12",
  "days": 2,
  "otp": "123456"
}
```

### Download PDF

```http
GET /bookings/{reference}/billing-statement/pdf
Accept: application/pdf
```

---

## 9) Additional notes

- Cancellation fee percent is dynamic and comes from payment settings/cached config, not only hardcoded UI text.
- OTPs are single-use and expire after 10 minutes.
- The blocked-date fetch is mandatory for accurate reschedule validation before submit.
- PDF content is generated on backend from booking records for integrity.
