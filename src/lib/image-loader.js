// Finds an image on GitHub Pages, where scripts/media.mjs saves each one as
// WebP at every width in media.config.mjs. Files from public/ keep their path;
// imports from src/images/ arrive as /_next/static/media/<name>.<hash>.<ext>
// (/_next/static/immutable/media/ on Vercel) and live under images/<name>.
const base = process.env.NEXT_PUBLIC_MEDIA_URL
const ext = /\.(?:jpe?g|png|webp)$/

export default function githubPagesLoader({ src, width }) {
  let imported = src.match(
    /^\/_next\/static\/(?:[\w-]+\/)?media\/(.+)\.[^.]+\.\w+$/,
  )
  let name = imported
    ? `images/${imported[1]}`
    : src.replace(/^\//, '').replace(ext, '')
  return `${base}/${name}-${width}.webp`
}
