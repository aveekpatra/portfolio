import { deviceSizes, imageSizes } from './media.config.mjs'

// When NEXT_PUBLIC_MEDIA_URL is set (production on Vercel), images load from
// GitHub Pages, where .github/workflows/media.yml publishes them. Otherwise
// Next.js resizes them as usual.
const media = process.env.NEXT_PUBLIC_MEDIA_URL

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
  },
  images: media
    ? {
        loader: 'custom',
        loaderFile: './src/lib/image-loader.js',
        deviceSizes,
        imageSizes,
      }
    : { deviceSizes, imageSizes },
}

export default nextConfig
