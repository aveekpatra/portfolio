import Image from 'next/image'
import clsx from 'clsx'

// How each product is shown. Mac apps sit in a real MacBook Pro, the Android
// app in a phone drawn to real dimensions, and websites as plain pages.

// A Mac app on a MacBook Pro 16-inch, front view. Each mockup is made ahead
// of time with scripts/mac-mockup.mjs, from Apple's product bezel and a
// full-screen 16-inch screenshot, at 2110 x 1288 (5 pixels per millimetre).
const mac = { w: 2110, h: 1288 }
const macs = {
  Speek: {
    src: '/devices/speek-mac.webp',
    alt: "Speek's main window on a Mac",
  },
  Lexyos: {
    src: '/devices/lexyos-mac.webp',
    alt: 'Lexyos on the Mac, with the inbox, projects and a day timeline',
  },
}

export function MacBook({
  app,
  sizes = '(min-width: 1024px) 600px, 90vw',
  className,
}) {
  return (
    <Image
      src={macs[app].src}
      alt={macs[app].alt}
      width={mac.w}
      height={mac.h}
      sizes={sizes}
      className={clsx('h-auto w-full', className)}
    />
  )
}

// An Android phone, drawn in millimetres at 70.5 x 147.4: a metal band, black
// glass and the screen, each corner a fixed distance inside the last, so
// they're concentric. Sizes are in container units, so the phone keeps its
// shape at any width.
const phone = { w: 70.5, h: 147.4, r: 11.2, band: 0.8, bezel: 1.5 }
const mm = (v) => `${(v / phone.w) * 100}cqw`
// Real size next to the MacBook above, as a share of its width.
const phoneToMac = (phone.w * 5) / mac.w

export function AndroidPhone({
  src,
  alt,
  sizes = '(min-width: 1024px) 220px, 40vw',
  className,
}) {
  let inset = phone.band + phone.bezel
  return (
    <div className={clsx('@container', className)}>
      <div
        className="relative"
        style={{ aspectRatio: `${phone.w} / ${phone.h}` }}
      >
        {/* Volume and power keys on the right edge. */}
        <span
          className="absolute bg-[#3a3b3f]"
          style={{
            right: mm(-0.5),
            top: mm(31),
            width: mm(1),
            height: mm(19),
            borderRadius: mm(0.5),
          }}
        />
        <span
          className="absolute bg-[#3a3b3f]"
          style={{
            right: mm(-0.5),
            top: mm(55),
            width: mm(1),
            height: mm(9),
            borderRadius: mm(0.5),
          }}
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(160deg,#55565b,#2a2b2f_30%,#1d1e21_70%,#3d3e42)] shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.22)]"
          style={{ borderRadius: mm(phone.r) }}
        />
        <div
          className="absolute bg-[#050505]"
          style={{
            inset: mm(phone.band),
            borderRadius: mm(phone.r - phone.band),
          }}
        />
        <div
          className="absolute overflow-hidden bg-black"
          style={{ inset: mm(inset), borderRadius: mm(phone.r - inset) }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            className="object-cover object-top"
          />
          {/* The camera, centred in the status bar. */}
          <span
            className="absolute rounded-full bg-black ring-[0.5px] ring-white/10"
            style={{
              top: mm(1.8),
              left: `calc(50% - ${mm(1.5)})`,
              width: mm(3),
              height: mm(3),
            }}
          />
        </div>
      </div>
    </div>
  )
}

// Lexyos on the Mac and on Android, side by side at their real sizes and
// standing on the same line. The phone is nearer, so on hover it lifts a
// little more and a beat later.
const macShare = 0.84

export function LexyosDevices({ sizes = '(min-width: 1024px) 400px, 80vw' }) {
  return (
    <div className="relative">
      <div
        className="transition-transform duration-700 ease-power3 group-hover:-translate-y-[1.5%]"
        style={{ width: `${macShare * 100}%` }}
      >
        <MacBook app="Lexyos" sizes={sizes} />
      </div>
      <div
        className="absolute right-0 bottom-0 transition-transform delay-75 duration-700 ease-power3 group-hover:-translate-y-[4%]"
        style={{ width: `${macShare * phoneToMac * 100}%` }}
      >
        <AndroidPhone
          src="/shots/lexyos-phone.jpg"
          alt="The Lexyos Today list on Android"
          sizes="(min-width: 1024px) 80px, 15vw"
        />
      </div>
    </div>
  )
}

// A flat field for a device to stand in. Its corners are set by whoever
// places it, so they can follow the card around it.
export function Stage({ tone = 'light', className, children }) {
  return (
    <div
      className={clsx(
        'relative isolate overflow-hidden',
        tone === 'dark' ? 'bg-[#1f1f1f]' : 'bg-white',
        className,
      )}
    >
      {children}
    </div>
  )
}

// Places a piece in a stage. Position lives here and never moves; the hover
// lift lives on the inner layer, so the two never fight.
function Piece({ style, rise = 1.5, delay = 0, children }) {
  return (
    <div className="absolute" style={style}>
      <div
        className="transition-transform duration-700 ease-power3 group-hover:translate-y-[var(--rise)]"
        style={{ '--rise': `-${rise}%`, transitionDelay: `${delay}ms` }}
      >
        {children}
      </div>
    </div>
  )
}

// On a 16:10 stage the MacBook stands at the bottom edge, which cuts through
// its base, as if the stage were the desk.
const desk = 0.02 // how far below the edge the feet sit, as a share of width
function macTop(width) {
  return `${((0.625 + desk - (width * mac.h) / mac.w) / 0.625) * 100}%`
}

function MacScene({ app }) {
  let width = 0.9
  return (
    <Piece style={{ left: '5%', width: '90%', top: macTop(width) }}>
      <MacBook app={app} sizes="(min-width: 768px) 340px, 90vw" />
    </Piece>
  )
}

function LexyosScene() {
  let width = 0.95
  return (
    <Piece
      style={{ left: '2.5%', width: '95%', top: macTop(width * macShare) }}
      rise={0}
    >
      <LexyosDevices sizes="(min-width: 768px) 300px, 80vw" />
    </Piece>
  )
}

// A website is shown as itself: the page, filling the card, edge to edge.
export function SiteShot({ src, alt, tone, className }) {
  return (
    <div
      className={clsx(
        'relative aspect-[16/10] overflow-hidden rounded-[12px]',
        tone === 'dark' ? 'bg-black' : 'bg-[#e4e4e4]',
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 560px, 100vw"
        className="object-cover object-top transition-transform duration-500 ease-power3 group-hover:scale-[1.02]"
      />
    </div>
  )
}

const sites = { Aturno: '/shots/aturno.jpg', Renko: '/shots/renko.jpg' }

// The picture at the top of a home page card.
export function ProductMedia({ name, tone = 'light', className }) {
  if (name === 'Speek' || name === 'Lexyos') {
    return (
      <Stage
        tone={tone}
        className={clsx('aspect-[16/10] rounded-[12px]', className)}
      >
        {name === 'Speek' ? <MacScene app="Speek" /> : <LexyosScene />}
      </Stage>
    )
  }
  return (
    <SiteShot
      src={sites[name]}
      alt={`The ${name} website`}
      tone={tone}
      className={className}
    />
  )
}
