// Puts a Mac screenshot into the MacBook Pro 16-inch frame and saves the
// finished mockup. The frame is Apple's product bezel ("MacBook Pro M5 16-inch
// Silver.png" from developer.apple.com/design/resources), which stays out of
// the repo; only finished mockups are kept here.
//
//   node scripts/mac-mockup.mjs <bezel.png> <screenshot> <out.webp>

import sharp from 'sharp'

let [bezel, shot, out] = process.argv.slice(2)
if (!out) {
  console.error(
    'usage: node scripts/mac-mockup.mjs <bezel.png> <screenshot> <out.webp>',
  )
  process.exit(1)
}

// The bezel image is 4260 x 2840. Crop it to the device and halve it, which
// leaves the 16-inch screen opening at 191, 28, 1728 x 1117.
let frame = await sharp(bezel)
  .extract({ left: 20, top: 247, width: 4220, height: 2576 })
  .resize(2110, 1288)
  .png()
  .toBuffer()

// The screenshot runs a pixel under the bezel on every side.
let screen = await sharp(shot)
  .resize(1730, 1119, { fit: 'cover', position: 'top' })
  .toBuffer()

await sharp({
  create: { width: 2110, height: 1288, channels: 4, background: '#0000' },
})
  .composite([
    { input: screen, left: 190, top: 27 },
    { input: frame, left: 0, top: 0 },
  ])
  .webp({ quality: 90, alphaQuality: 100, effort: 6 })
  .toFile(out)

console.log(out)
