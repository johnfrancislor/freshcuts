# Fresh Cuts Lawn Care & Landscaping: website revamp

Static, single-page redesign of http://www.freshcutslawncareandlandscaping.com (Grand Rapids, MI).
Built with React + Next.js (static export). No backend.

## Run

```bash
npm install
npm run dev      # local dev server
npm run preview  # serve the built out/ folder locally
npm run build    # static export in out/ (deploy anywhere static: Netlify, Vercel, Cloudflare Pages)
```

## Where things live

- `src/data.js`: all business content (phone, services, coupons, warranties, gallery list, service areas). Edit copy here.
- `app/layout.jsx`: page <head> (title, meta, fonts). `app/page.jsx` renders `src/App.jsx`.
- `src/components/`: Hero, page sections, contact form and footer.
- `src/index.css`: all styles; brand colors are CSS variables at the top.
- `public/images/work/`: the client's own job photos, cropped from the old site's gallery slides.
- `public/images/stock/`: free-license Unsplash photos (hero, service cards, reviews banner).

## Backend-ready spots (if the client wants them)

- **Contact form** (`src/components/Contact.jsx`): currently opens the visitor's email app pre-filled (mailto).
  Swap `handleSubmit` for Formspree / Netlify Forms / an API endpoint.
- **Reviews**: currently links to Facebook; could embed real reviews or a Google reviews widget.
- **Specials**: hard-coded in `data.js`; could move to a CMS.
