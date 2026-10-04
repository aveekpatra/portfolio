// Builds _site/ for GitHub Pages: every image in public/ and src/images/ as
// WebP at each width in media.config.mjs. src/lib/image-loader.js reads from
// here, so the site's images use GitHub's bandwidth rather than Vercel's.
//
//   node scripts/media.mjs

import { mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

import { deviceSizes, imageSizes } from '../media.config.mjs'

const out = '_site'
const widths = [...imageSizes, ...deviceSizes]
const ext = /\.(?:jpe?g|png|webp)$/i

async function files(dir) {
  let entries = await readdir(dir, { withFileTypes: true, recursive: true })
  return entries
    .filter((e) => e.isFile() && ext.test(e.name))
    .map((e) => path.join(e.parentPath, e.name))
}

let jobs = []
for (let file of await files('public')) {
  jobs.push([file, path.relative('public', file).replace(ext, '')])
}
// Imports lose their folder on the way through Next.js, so names must be unique.
let names = new Map()
for (let file of await files('src/images')) {
  let name = path.basename(file).replace(ext, '')
  if (names.has(name)) {
    throw new Error(`${file} and ${names.get(name)} have the same name`)
  }
  names.set(name, file)
  jobs.push([file, `images/${name}`])
}

await rm(out, { recursive: true, force: true })
for (let [file, name] of jobs) {
  let { width } = await sharp(file).metadata()
  await mkdir(path.join(out, path.dirname(name)), { recursive: true })
  for (let w of widths) {
    await sharp(file)
      .resize({ width: Math.min(w, width) })
      .webp({ quality: 80, effort: 5 })
      .toFile(path.join(out, `${name}-${w}.webp`))
  }
}
await writeFile(path.join(out, '.nojekyll'), '')
console.log(`${jobs.length} images, ${jobs.length * widths.length} files`)
