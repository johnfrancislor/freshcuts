import '../src/index.css'

export const metadata = {
  title: 'Fresh Cuts Lawn Care & Landscaping | Grand Rapids, MI',
  description:
    'Locally owned lawn care and landscaping in Grand Rapids, MI. Mulch, planting, retaining walls, patios, clean-ups and snow removal. Licensed & insured. Free estimates 7 days a week.',
  icons: { icon: { url: '/favicon.svg', type: 'image/svg+xml' } },
}

export const viewport = {
  themeColor: '#1b4527',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta property="og:title" content="Fresh Cuts Lawn Care & Landscaping" />
        <meta property="og:description" content="Beautiful yards start here. Free estimates 7 days a week across the Greater Grand Rapids area." />
        <meta property="og:image" content="/images/work/front-beds-red-mulch.webp" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,600&display=swap"
          rel="stylesheet"
        />
        <link rel="preload" as="image" href="/images/stock/hero.webp" />
      </head>
      <body>{children}</body>
    </html>
  )
}
