# Frontend Defense Ready Guide

This note is a practical guide for understanding this frontend, especially if you are preparing to explain the code in a defense, interview, demo, or review.

The goal is not to memorize every line. The goal is to understand the structure, the vocabulary, and the reason each piece exists.

## 1. What This Frontend Is

This project is a React + TypeScript frontend built with Vite. It is a booking-oriented website with pages for home, rooms, venues, blog posts, policies, maintenance mode, and user actions like booking or contacting the business.

The app is organized into reusable parts:

- `pages` are full screens or routes.
- `components` are reusable UI pieces.
- `hooks` contain reusable logic.
- `lib` contains API helpers, utilities, formatters, validators, and low-level code.
- `routes` defines what page appears for each URL.

If you understand those five folders, you already understand most of the project.

## 2. The Main Technologies

This app uses a few common frontend tools:

- React: builds the user interface from components.
- TypeScript: adds types so the code is easier to maintain and safer to refactor.
- Vite: the build tool and dev server.
- React Router: handles navigation between pages.
- TanStack Query: handles API fetching, caching, loading, and error states.
- Swiper: creates carousels and sliders.
- Tailwind CSS classes: styles the UI directly in the markup.

You do not need to know every library deeply at first. Start by understanding what problem each one solves.

## 3. The Fundamentals You Should Know

### React basics

React code is usually written as components. A component is just a function that returns UI.

Example idea:

- Input: data, props, state, or API results.
- Process: conditional logic and rendering decisions.
- Output: JSX, which looks like HTML but is actually JavaScript syntax.

### TypeScript basics

TypeScript helps describe the shape of data.

Some important words:

- `interface`: describes an object shape, often used for API responses.
- `type`: another way to describe types, often used for unions or helper types.
- `generic`: a type placeholder like `<T>` that makes code reusable.

### State and effects

- `useState` stores local UI state.
- `useEffect` runs side effects, such as fetching data or setting timers.
- Custom hooks like `useApiQuery` wrap repeated logic so components stay smaller.

### Routing

Routes connect URLs to pages. When the URL changes, React Router decides which page component should render.

### API communication

The frontend usually does not talk directly to the database. It calls an API endpoint, receives JSON, and renders that data.

## 4. How To Read Code In This Repo

When you open a file, read it in this order:

1. Find the imports.
2. Look for the main function or component.
3. Find the data source.
4. Check the conditions for loading, error, and empty states.
5. Read the returned JSX last.

That order works well because it shows you what the component depends on before you get lost in UI details.

### A good reading path for this app

Start at:

- [src/main.tsx](../src/main.tsx)
- [src/App.tsx](../src/App.tsx)
- [src/routes/route.ts](../src/routes/route.ts)
- the page you want to understand, such as [src/pages/Home/OurGallery.tsx](../src/pages/Home/OurGallery.tsx)
- shared logic in [src/lib](../src/lib)

## 5. Example: How To Understand `OurGallery.tsx`

The gallery page is a very good example because it shows most of the important frontend patterns.

### What the component is doing

The component:

- fetches gallery images from the API,
- shows a loading skeleton while the request is running,
- shows an error message if the request fails,
- shows an empty state if there are no images,
- renders a Swiper carousel when images exist.

### The control flow

The logic is basically:

1. Ask the API for galleries.
2. Wait for the result.
3. If loading, show a skeleton.
4. If error, show a failure message.
5. If no images, show an empty state.
6. Otherwise, render the carousel.

That is a common frontend pattern: loading -> error -> empty -> success.

### Why the gallery duplicates images

In [src/pages/Home/OurGallery.tsx](../src/pages/Home/OurGallery.tsx), the code duplicates gallery items only when there are very few images.

The reason is simple: a carousel that loops needs enough slides to feel smooth. If there are only a few images, duplicating them helps Swiper loop properly without looking broken.

This is a behavior decision, not just a random implementation detail.

### Why the image uses `loading="lazy"`

Lazy loading tells the browser to wait before downloading images that are not immediately visible.

This improves performance because:

- the first screen loads faster,
- the browser uses less network bandwidth early,
- the page feels lighter on mobile devices.

## 6. What Some Common Code Words Mean

### `const`

`const` means the variable cannot be reassigned.

Use it when the reference should stay the same. Most React code uses `const` because values are usually defined once and read many times.

Example idea:

- `const galleries = galleriesResponse?.data ?? []` means “use the response data if it exists, otherwise use an empty array.”

### `let`

`let` is used when a value will be reassigned later.

In this codebase, `let` appears when a variable may be replaced by a different version depending on logic.

### `interface`

An `interface` defines the shape of an object.

Example in the gallery:

- `GalleryItem` says each item should have `id` and `image`.
- `ApiResponse` says the API should return `success` and `data`.

That helps TypeScript catch mistakes early.

### `async` and `await`

These are used for asynchronous work, like API calls.

- `async` marks a function that will wait for something.
- `await` pauses execution until the promise finishes.

### `map`

`map` transforms every item in an array into a new item.

In the gallery, `map` turns API data into Swiper slides.

### `useApiQuery<T>`

The `<T>` part is a generic. It means the hook can work with different response shapes, not just one fixed type.

In the gallery, it is used as `useApiQuery<ApiResponse>()`, which tells TypeScript what the API should return.

## 7. How The API Layer Works

This project separates API concerns into reusable helpers.

### `endpoints`

`endpoints` is a centralized list of API URL paths.

Why this matters:

- you avoid hardcoding URLs everywhere,
- if an endpoint changes, you update one place,
- the code becomes easier to read.

### `queryKeys`

Query keys identify cached API data in TanStack Query.

They are important because TanStack Query uses them to:

- cache results,
- refetch data,
- invalidate stale data,
- keep different API requests separate.

### `useApiQuery`

The custom hook in [src/lib/api/queries/useApiQuery.ts](../src/lib/api/queries/useApiQuery.ts) wraps `useQuery` and automatically does a GET request.

So instead of repeating the same query logic everywhere, components call the hook and get:

- `data`
- `isLoading`
- `error`

That keeps UI code cleaner and makes the data flow more consistent.

## 8. Why Use This Pattern Instead Of Another

### Why use a custom hook for fetching?

Because it removes repeated code.

Without it, every component would need to know how to fetch, cache, and handle errors on its own. With a hook, that logic is shared.

### Why use query keys?

Because cache management needs stable identifiers.

If two requests have different parameters, they should not share the same cache entry. Query keys solve that.

### Why use component-level conditional rendering?

Because the UI needs to show different states depending on data availability.

This is one of the most common frontend responsibilities:

- loading state,
- error state,
- empty state,
- success state.

### Why use Tailwind utility classes?

Because they let you style directly in the component without creating a separate CSS file for every small detail.

This is useful for fast iteration and consistent spacing, sizing, and layout.

## 9. How To Read JSX Without Getting Lost

JSX usually contains three things:

- structure,
- logic,
- styling.

Read it from the outside inward:

1. What is the root element?
2. What conditional branches exist?
3. What data is being looped over?
4. What happens on click, hover, or load?
5. What styles change the look and behavior?

If JSX feels confusing, ignore the visual classes first and focus on the data flow.

## 10. Common Terms You May Hear In Review

- Component: a reusable UI function.
- Hook: reusable logic that starts with `use`.
- Props: values passed into a component.
- State: data managed inside a component.
- Endpoint: an API URL.
- Query key: the cache identity for a request.
- Skeleton: placeholder UI shown while data loads.
- Carousel: a sliding image or card viewer.
- Responsive: layout that adapts to screen size.
- Accessibility: making the app easier for people using assistive technology.

## 11. Questions You Should Be Able To Answer About This Codebase

If someone asks you about the frontend, you should be able to explain:

- What is the entry point of the app?
- How does routing work?
- Where does data come from?
- What happens while data is loading?
- What happens when the API fails?
- Why are query keys used?
- Why are endpoints centralized?
- Why do some components use custom hooks?
- Why does the gallery duplicate images for small lists?
- Why does the app use TypeScript interfaces?

## 12. A Simple Strategy For Reading Any File

Use this mental checklist:

1. What imports does it rely on?
2. What data does it receive or fetch?
3. What state or variables does it create?
4. What conditions change what gets rendered?
5. What external library behavior is being used?
6. What is the user experience if something fails?

If you answer those six questions, you usually understand the file well enough to defend it.

## 13. Short Glossary For Beginners

- `JSX`: React syntax that looks like HTML.
- `props`: input values for a component.
- `hook`: reusable React logic.
- `interface`: a type blueprint for object data.
- `generic`: a type placeholder used for reusable code.
- `endpoint`: the API path being called.
- `loading state`: UI shown while waiting for data.
- `error state`: UI shown when something fails.
- `fallback`: a safe alternative when data is missing.
- `lazy loading`: delaying resource loading until needed.

## 14. Final Note

The best way to learn this frontend is to trace one feature from start to finish:

- route entry,
- page component,
- data hook,
- API endpoint,
- render output,
- loading/error/empty behavior.

If you can explain one feature clearly, you can usually explain the whole app.
