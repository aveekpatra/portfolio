import { useId } from 'react'
import { motion, useReducedMotion } from 'motion/react'

import { pace } from '@/components/Reveal'
import { signatureBox, signaturePaths } from '@/components/signature-paths'

// Each stroke shades from one blue to the next along its own direction, deep
// at the edges of the name and brighter toward its middle.
const shades = [
  ['#0c55a3', '#2f7fd3'], // A
  ['#3a8edc', '#56c1d8'], // A, crossbar
  ['#2f7fd3', '#4aa8e6'], // v
  ['#4aa8e6', '#56c1d8'], // e
  ['#56c1d8', '#3f9be0'], // e
  ['#3f9be0', '#1f63b8'], // k
  ['#5ab8ea', '#2a72c6'], // P
  ['#3a8edc', '#56c1d8'], // a
  ['#56c1d8', '#3aa0c8'], // t
  ['#6ccbe2', '#4aa8e6'], // t, crossbar
  ['#4aa8e6', '#2a72c6'], // r
  ['#2a72c6', '#0c55a3'], // a
  ['#1f63b8', '#3f9be0'], // tail
]

const strokeWidth = 2.6
const pad = strokeWidth
const viewBox = [
  signatureBox.x - pad,
  signatureBox.y - pad,
  signatureBox.width + pad * 2,
  signatureBox.height + pad * 2,
].join(' ')

// One pen, one speed: longer strokes take longer. A short lift between words.
const speed = 190 // units per second, about 2.5s for the whole name
let clock = 0.2
const timing = signaturePaths.map((path, i) => {
  if (i > 0 && signaturePaths[i - 1].word !== path.word) clock += 0.12
  let duration = Math.max(0.12, path.len / speed)
  let start = clock
  clock += duration * 0.92
  return { start, duration }
})

// My name, written in single pen strokes the way Apple writes "hello".
export function Signature({ className }) {
  let id = useId()
  let still = useReducedMotion()

  return (
    <svg
      viewBox={viewBox}
      aria-hidden="true"
      data-signature=""
      className={className}
    >
      <defs>
        {signaturePaths.map((path, i) => (
          <linearGradient
            key={i}
            id={`${id}s${i}`}
            gradientUnits="userSpaceOnUse"
            x1={path.from[0]}
            y1={path.from[1]}
            x2={path.to[0]}
            y2={path.to[1]}
          >
            <stop offset="0" stopColor={shades[i % shades.length][0]} />
            <stop offset="1" stopColor={shades[i % shades.length][1]} />
          </linearGradient>
        ))}
      </defs>
      <g
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {signaturePaths.map((path, i) => (
          <motion.path
            key={i}
            d={path.d}
            transform={`translate(${path.x} ${path.y})`}
            stroke={`url(#${id}s${i})`}
            initial={still ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: {
                duration: timing[i].duration * pace,
                delay: timing[i].start * pace,
                ease: [0.4, 0, 0.6, 1],
              },
              opacity: { duration: 0.01, delay: timing[i].start * pace },
            }}
          />
        ))}
      </g>
    </svg>
  )
}
