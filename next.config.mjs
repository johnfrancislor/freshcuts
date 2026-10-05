// Static export: `npm run build` writes plain HTML/CSS/JS to out/ (deploy anywhere static).
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
}

export default nextConfig
