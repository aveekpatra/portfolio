import { createContext, useContext, useEffect, useRef } from 'react'
import { motion } from 'motion/react'

export const ease = [0.22, 1, 0.36, 1]
// Eases in gently from rest and lands softly, for things that should seem to
// condense out of nothing rather than arrive.
export const feather = [0.45, 0, 0.2, 1]

// Scales every duration, delay and stagger at once, so the whole site can be
// made faster or slower without changing its rhythm. Below 1 is faster.
export const pace = 0.85

// Applies `pace` to a transition, including per-property ones.
export function paced(transition) {
  let out = { ...transition }
  for (let key of ['duration', 'delay', 'delayChildren', 'staggerChildren']) {
    if (typeof out[key] === 'number') out[key] *= pace
  }
  for (let [key, value] of Object.entries(out)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      out[key] = paced(value)
    }
  }
  return out
}

// Each kind of thing moves the way its material would.
const materials = {
  // Headings come into focus.
  ink: {
    hidden: { opacity: 0, y: 6, filter: 'blur(6px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration: 1.1, ease: feather },
    transitionEnd: { filter: 'none' },
  },
  // Body copy condenses out of a soft haze: it becomes visible first and
  // sharpens a moment after, so it reads as appearing, not dropping.
  text: {
    hidden: { opacity: 0, y: 4, filter: 'blur(8px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: {
      default: { duration: 1.5, ease: feather },
      opacity: { duration: 1.2, ease: feather },
    },
    transitionEnd: { filter: 'none' },
  },
  // Cards are sheets: they surface from a larger haze with barely any travel,
  // and never scale.
  surface: {
    hidden: { opacity: 0, y: 8, filter: 'blur(14px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: {
      default: { duration: 1.8, ease: feather },
      opacity: { duration: 1.3, ease: feather },
    },
    transitionEnd: { filter: 'none' },
  },
  // Icons and logos are small objects: they pop into place.
  object: {
    hidden: { opacity: 0, scale: 0.85 },
    show: { opacity: 1, scale: 1 },
    transition: {
      default: { type: 'spring', bounce: 0.25, duration: 0.9 },
      opacity: { duration: 0.8, ease: feather },
    },
  },
  fade: {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
    transition: { duration: 0.9, ease: feather },
  },
  // Only orchestrates its children.
  none: { hidden: {}, show: {}, transition: {} },
}

const SceneContext = createContext(null)

// Seconds until `at` in the page's timeline. Called when an animation starts, not during render.
function timeLeft(start, at) {
  if (typeof at === 'function') at = at()
  at *= pace
  if (!start?.current) return at
  return Math.max(0, at - (performance.now() - start.current) / 1000)
}

// One scene per page. Times passed to `at` are seconds from when the page appeared.
export function Scene({ children }) {
  let start = useRef(null)

  useEffect(() => {
    start.current = performance.now()
  }, [])

  return <SceneContext.Provider value={start}>{children}</SceneContext.Provider>
}

export function variantsFor(
  material,
  { step = 0, childDelay = 0, delay } = {},
) {
  let m = materials[material]
  let show = (custom) => {
    // Items take their delay from the parent's stagger, so only a Reveal sets one.
    let d = delay ? delay(custom) : 0
    // Per-property timings replace the shared one, so each needs the delay too.
    let timing = paced({
      ...m.transition,
      delayChildren: childDelay,
      staggerChildren: step,
    })
    timing.delayChildren += d
    if (delay) {
      timing.delay = d
      for (let key of Object.keys(timing)) {
        if (typeof timing[key] === 'object' && !Array.isArray(timing[key])) {
          timing[key] = { ...timing[key], delay: d }
        }
      }
    }
    return {
      ...m.show,
      transition: timing,
      ...(m.transitionEnd && { transitionEnd: m.transitionEnd }),
    }
  }
  return { hidden: m.hidden, show }
}

// Something that appears on its own: at a point in the page's timeline, or when
// it scrolls into view, whichever is later. Children made with `RevealItem`
// follow it, `step` seconds apart.
export function Reveal({
  as = 'div',
  material = 'surface',
  at = 0,
  inView = false,
  step,
  childDelay,
  children,
  ...props
}) {
  let start = useContext(SceneContext)
  let Component = motion[as]
  let delay = () => timeLeft(start, at)
  let trigger = inView
    ? {
        whileInView: 'show',
        viewport: { once: true, margin: '0px 0px -12% 0px' },
      }
    : { animate: 'show' }

  return (
    <Component
      data-reveal=""
      initial="hidden"
      variants={variantsFor(material, { step, childDelay, delay })}
      {...trigger}
      {...props}
    >
      {children}
    </Component>
  )
}

// Part of a Reveal. It waits for its parent and can stagger its own children.
export function RevealItem({
  as = 'div',
  material = 'text',
  step,
  childDelay,
  variants,
  children,
  ...props
}) {
  let Component = motion[as]
  let own = variantsFor(material, { step, childDelay })

  return (
    <Component
      data-reveal=""
      variants={variants ? { ...own, ...variants } : own}
      {...props}
    >
      {children}
    </Component>
  )
}

// A heading said word by word. `pauses` adds extra time after a given word,
// like a breath after "Hi,".
export function Words({ text, at = 0, step = 0.09, pauses = {} }) {
  let words = text.split(' ')
  let t = at

  return words.map((word, index) => {
    let wordAt = t
    t += step + (pauses[index] ?? 0)
    return (
      <span key={index}>
        <Reveal as="span" material="ink" at={wordAt} className="inline-block">
          {word}
        </Reveal>
        {index < words.length - 1 && ' '}
      </span>
    )
  })
}
