import {
  createContext,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

// A tiny isometric kit: x runs down-right, y down-left, z up. Shapes are drawn
// in the order given, so place them back to front.
const C = Math.cos(Math.PI / 6)

export function iso(x, y, z = 0) {
  return [(x - y) * C, (x + y) * 0.5 - z]
}

function pts(list) {
  return list
    .map((p) =>
      iso(...p)
        .map((n) => +n.toFixed(2))
        .join(','),
    )
    .join(' ')
}

const palettes = {
  dark: {
    stroke: 'rgba(255,255,255,0.42)',
    faint: 'rgba(255,255,255,0.09)',
    top: '#3a3a3a',
    left: '#2f2f2f',
    right: '#272727',
    accent: '#efefef',
    ink: '#1c1c1c',
  },
  light: {
    stroke: '#b5b5b5',
    faint: 'rgba(35,35,35,0.07)',
    top: '#fbfbfb',
    left: '#f1f1f1',
    right: '#e7e7e7',
    accent: '#232323',
    ink: '#d6d6d6',
  },
}

const Palette = createContext(palettes.dark)
const usePal = () => useContext(Palette)

// With `fit`, the frame shrinks to the drawing after mount (the grid behind it
// doesn't count), so nothing is cut off whatever coordinates a scene uses.
export function Scene({
  tone = 'dark',
  viewBox,
  grid,
  fit = true,
  pad = 10,
  className,
  children,
}) {
  let svg = useRef(null)
  let content = useRef(null)
  let [box, setBox] = useState(viewBox)

  // Move only while on screen, and never for people who ask for less motion.
  useEffect(() => {
    let el = svg.current
    let still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    function play(on) {
      el.dataset.isoPlay = on && !still ? 'true' : 'false'
      if (on && !still) el.unpauseAnimations?.()
      else el.pauseAnimations?.()
    }
    play(false)
    let io = new IntersectionObserver(([e]) => play(e.isIntersecting), {
      rootMargin: '80px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useLayoutEffect(() => {
    if (!fit || !content.current) return
    let b = content.current.getBBox()
    setBox(
      [b.x - pad, b.y - pad, b.width + pad * 2, b.height + pad * 2]
        .map((n) => +n.toFixed(1))
        .join(' '),
    )
  }, [fit, pad])

  return (
    <Palette.Provider value={palettes[tone]}>
      <svg
        ref={svg}
        viewBox={box}
        data-iso-play="false"
        overflow="visible"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
        aria-hidden="true"
        className={className}
      >
        {grid && <Grid {...grid} />}
        <g ref={content}>{children}</g>
      </svg>
    </Palette.Provider>
  )
}

export function Box({
  x = 0,
  y = 0,
  z = 0,
  w,
  d,
  h,
  top,
  dashed,
  ghost,
  march,
  hatch,
}) {
  let t = usePal()
  let fill = (f) => (ghost ? 'none' : f)
  // Fine vertical lines on the two visible sides, like a draughtsman's shading.
  let hatching = []
  if (hatch) {
    for (let i = hatch; i < w; i += hatch)
      hatching.push([
        [x + i, y + d, z],
        [x + i, y + d, z + h],
      ])
    for (let i = hatch; i < d; i += hatch)
      hatching.push([
        [x + w, y + i, z],
        [x + w, y + i, z + h],
      ])
  }
  let common = {
    stroke: t.stroke,
    strokeWidth: 0.8,
    strokeDasharray: dashed || ghost ? '2.5 3' : undefined,
    className: march ? 'iso-march' : undefined,
  }
  return (
    <g>
      <polygon
        {...common}
        fill={fill(t.left)}
        points={pts([
          [x, y + d, z],
          [x + w, y + d, z],
          [x + w, y + d, z + h],
          [x, y + d, z + h],
        ])}
      />
      <polygon
        {...common}
        fill={fill(t.right)}
        points={pts([
          [x + w, y, z],
          [x + w, y + d, z],
          [x + w, y + d, z + h],
          [x + w, y, z + h],
        ])}
      />
      {hatching.length > 0 && (
        <g stroke={t.stroke} strokeWidth={0.45} opacity={0.55}>
          {hatching.map((l, i) => (
            <polyline key={i} points={pts(l)} />
          ))}
        </g>
      )}
      <polygon
        {...common}
        fill={fill(top ?? t.top)}
        points={pts([
          [x, y, z + h],
          [x + w, y, z + h],
          [x + w, y + d, z + h],
          [x, y + d, z + h],
        ])}
      />
    </g>
  )
}

// A flat sheet lying at height z.
export function Plane({
  x = 0,
  y = 0,
  z = 0,
  w,
  d,
  fill,
  dashed,
  strong,
  march,
}) {
  let t = usePal()
  return (
    <polygon
      className={march ? 'iso-march' : undefined}
      stroke={t.stroke}
      strokeWidth={strong ? 1 : 0.8}
      strokeDasharray={dashed ? '2.5 3' : undefined}
      fill={fill === undefined ? t.top : fill}
      points={pts([
        [x, y, z],
        [x + w, y, z],
        [x + w, y + d, z],
        [x, y + d, z],
      ])}
    />
  )
}

export function Cylinder({ x = 0, y = 0, z = 0, r, h, rings = 0 }) {
  let t = usePal()
  let [cx, cy] = iso(x, y, z)
  let rx = r * Math.SQRT2 * C
  let ry = r * Math.SQRT2 * 0.5
  return (
    <g stroke={t.stroke} strokeWidth={0.8}>
      <path
        fill={t.left}
        d={`M${cx - rx} ${cy} A${rx} ${ry} 0 0 0 ${cx + rx} ${cy} V${cy - h} H${cx - rx} Z`}
      />
      {Array.from({ length: rings }, (_, i) => {
        let ly = cy - ((i + 1) * h) / (rings + 1)
        return (
          <path
            key={i}
            d={`M${cx - rx} ${ly} A${rx} ${ry} 0 0 0 ${cx + rx} ${ly}`}
          />
        )
      })}
      <ellipse cx={cx} cy={cy - h} rx={rx} ry={ry} fill={t.top} />
    </g>
  )
}

export function Line({ points, dashed, faint, strong, width, march }) {
  let t = usePal()
  return (
    <polyline
      className={march ? 'iso-march' : undefined}
      points={pts(points)}
      stroke={strong ? t.accent : faint ? t.faint : t.stroke}
      strokeWidth={width ?? 0.8}
      strokeDasharray={dashed ? '2.5 3' : undefined}
    />
  )
}

export function Dot({ x, y, z = 0, r = 1.8, hollow }) {
  let t = usePal()
  let [cx, cy] = iso(x, y, z)
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill={hollow ? t.top : t.accent}
      stroke={hollow ? t.stroke : 'none'}
      strokeWidth={0.8}
    />
  )
}

// Drifts its children up and back. Give neighbours different timings so a
// drawing breathes instead of bouncing in step.
export function Float({ y = -3, dur = 4, delay = 0, children }) {
  return (
    <g
      className="iso-float"
      style={{
        '--iso-y': `${y}px`,
        '--iso-dur': `${dur}s`,
        '--iso-delay': `${-delay}s`,
      }}
    >
      {children}
    </g>
  )
}

function pathOf(points) {
  return (
    'M' +
    points
      .map((p) =>
        iso(...p)
          .map((n) => +n.toFixed(2))
          .join(' '),
      )
      .join(' L')
  )
}

// A dot that runs along a path, fading in at the start and out at the end.
// `rest` is the share of each loop spent waiting before the next run.
export function Traveler({
  points,
  d,
  dur = 3,
  delay = 0,
  rest = 0.25,
  r = 1.7,
  keyPoints,
  keyTimes,
}) {
  let t = usePal()
  let path = d ?? pathOf(points)
  let run = 1 - rest
  let begin = `${-delay}s`
  // With no rest it simply circles, always visible.
  if (!rest && !keyPoints) {
    return (
      <circle r={r} fill={t.accent}>
        <animateMotion
          path={path}
          dur={`${dur}s`}
          begin={begin}
          repeatCount="indefinite"
        />
      </circle>
    )
  }
  return (
    <circle r={r} fill={t.accent} opacity="0">
      <animateMotion
        path={path}
        dur={`${dur}s`}
        begin={begin}
        repeatCount="indefinite"
        calcMode="linear"
        keyPoints={keyPoints ?? '0;1;1'}
        keyTimes={keyTimes ?? `0;${run.toFixed(3)};1`}
      />
      <animate
        attributeName="opacity"
        dur={`${dur}s`}
        begin={begin}
        repeatCount="indefinite"
        values="0;1;1;0;0"
        keyTimes={`0;0.08;${(run - 0.06).toFixed(3)};${run.toFixed(3)};1`}
      />
    </circle>
  )
}

// A ring that ripples out from a point, like a live status dot.
export function Ripple({ x, y, z = 0, r = 3, delay = 0 }) {
  let t = usePal()
  let [cx, cy] = iso(x, y, z)
  return (
    <circle
      className="iso-ripple"
      style={{ '--iso-delay': `${delay}s` }}
      cx={cx}
      cy={cy}
      r={r}
      fill={t.accent}
    />
  )
}

// The outline of a set of points, for filling solid shapes drawn from samples.
function hull(points) {
  let p = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1])
  let cross = (o, a, b) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  let lower = []
  for (let q of p) {
    while (lower.length >= 2 && cross(lower.at(-2), lower.at(-1), q) <= 0)
      lower.pop()
    lower.push(q)
  }
  let upper = []
  for (let q of p.reverse()) {
    while (upper.length >= 2 && cross(upper.at(-2), upper.at(-1), q) <= 0)
      upper.pop()
    upper.push(q)
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)]
}

const flat = (list) =>
  list.map((p) => p.map((n) => +n.toFixed(2)).join(',')).join(' ')

// Splits a sampled curve on a sphere into the parts facing us and the parts
// behind, so the far side can be drawn fainter.
function sides(samples) {
  let front = [],
    back = [],
    run = [],
    facing = null
  for (let { p, n } of samples) {
    let f = n[0] + n[1] + n[2] > 0
    if (facing !== null && f !== facing) {
      ;(facing ? front : back).push(run)
      run = [run.at(-1)]
    }
    facing = f
    run.push(p)
  }
  if (run.length > 1) (facing ? front : back).push(run)
  return { front, back }
}

// A wireframe globe: lines of latitude and longitude, the far side faint.
export function WireSphere({
  x = 0,
  y = 0,
  z = 0,
  r,
  lat = 5,
  lon = 12,
  hemi,
}) {
  let t = usePal()
  let at = (phi, th) => {
    let n = [
      Math.cos(phi) * Math.cos(th),
      Math.cos(phi) * Math.sin(th),
      Math.sin(phi),
    ]
    return { p: iso(x + r * n[0], y + r * n[1], z + r * n[2]), n }
  }
  let lo = hemi ? 0 : -Math.PI / 2
  let shell = []
  for (let i = 0; i <= 24; i++)
    for (let j = 0; j < 48; j++)
      shell.push(
        at(lo + (i / 24) * (Math.PI / 2 - lo), (j / 48) * Math.PI * 2).p,
      )
  let curves = []
  for (let k = hemi ? 0 : 1; k < lat; k++) {
    let phi = lo + (k / lat) * (Math.PI / 2 - lo)
    curves.push(
      Array.from({ length: 97 }, (_, j) => at(phi, (j / 96) * Math.PI * 2)),
    )
  }
  for (let m = 0; m < lon; m++) {
    let th = (m / lon) * Math.PI * 2
    curves.push(
      Array.from({ length: 49 }, (_, i) =>
        at(lo + (i / 48) * (Math.PI / 2 - lo), th),
      ),
    )
  }
  let split = curves.map(sides)
  return (
    <g>
      <polygon
        points={flat(hull(shell))}
        fill={t.top}
        stroke={t.stroke}
        strokeWidth={0.8}
      />
      <g stroke={t.stroke} strokeWidth={0.5} opacity={0.3}>
        {split.flatMap((c, i) =>
          c.back.map((run, j) => (
            <polyline key={`${i}b${j}`} points={flat(run)} />
          )),
        )}
      </g>
      <g stroke={t.stroke} strokeWidth={0.6}>
        {split.flatMap((c, i) =>
          c.front.map((run, j) => (
            <polyline key={`${i}f${j}`} points={flat(run)} />
          )),
        )}
      </g>
    </g>
  )
}

// A circle lying flat at height z, as a path, for things that orbit.
export function orbit(x, y, z, r, steps = 72) {
  return (
    'M' +
    Array.from({ length: steps + 1 }, (_, i) => {
      let a = (i / steps) * Math.PI * 2
      return iso(x + r * Math.cos(a), y + r * Math.sin(a), z)
        .map((n) => +n.toFixed(2))
        .join(' ')
    }).join(' L')
  )
}

export function OrbitRing({ x, y, z, r, dashed }) {
  let t = usePal()
  return (
    <path
      d={orbit(x, y, z, r)}
      stroke={t.stroke}
      strokeWidth={0.7}
      strokeDasharray={dashed ? '2.5 3' : undefined}
    />
  )
}

// A rippling sheet drawn as a grid.
export function WaveMesh({ x, y, w, d, n = 9, amp = 6, z = 0 }) {
  let t = usePal()
  let at = (u, v) => [
    x + u * w,
    y + v * d,
    z + amp * Math.sin(u * Math.PI * 2.2 + 0.6) * Math.cos(v * Math.PI * 1.1),
  ]
  let steps = 28
  let rows = Array.from({ length: n + 1 }, (_, i) =>
    Array.from({ length: steps + 1 }, (_, j) => at(j / steps, i / n)),
  )
  let cols = Array.from({ length: n + 1 }, (_, i) =>
    Array.from({ length: steps + 1 }, (_, j) => at(i / n, j / steps)),
  )
  return (
    <g stroke={t.stroke} strokeWidth={0.55}>
      {[...rows, ...cols].map((line, i) => (
        <polyline
          key={i}
          points={pts(line)}
          opacity={
            i === 0 || i === n || i === n + 1 || i === 2 * n + 1 ? 1 : 0.6
          }
        />
      ))}
    </g>
  )
}

// A flat ring on the floor, like a washer.
export function Ring({ x, y, z = 0, r, inner, h, hole }) {
  let t = usePal()
  let [cx, cy] = iso(x, y, z + h)
  let rx = inner * Math.SQRT2 * C
  let ry = inner * Math.SQRT2 * 0.5
  return (
    <g>
      <Cylinder x={x} y={y} z={z} r={r} h={h} />
      <ellipse
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        fill={hole}
        stroke={t.stroke}
        strokeWidth={0.8}
      />
      <path
        d={`M${cx - rx} ${cy} A${rx} ${ry} 0 0 1 ${cx + rx} ${cy} L${cx + rx} ${cy + Math.min(h, ry)} A${rx} ${ry} 0 0 0 ${cx - rx} ${cy + Math.min(h, ry)} Z`}
        fill={t.right}
        stroke={t.stroke}
        strokeWidth={0.6}
        opacity={0.8}
      />
    </g>
  )
}

// A word printed on the floor.
export function Label({ x, y, z = 0, size = 5, children }) {
  let t = usePal()
  let [sx, sy] = iso(x, y, z)
  return (
    <text
      transform={`matrix(${C} 0.5 ${-C} 0.5 ${sx} ${sy})`}
      fontSize={size}
      fontWeight={600}
      letterSpacing={0.8}
      fill={t.stroke}
      stroke="none"
      style={{ fontFamily: 'var(--font-geist-sans)' }}
    >
      {children}
    </text>
  )
}

// The AP mark as a solid block, standing on the floor. The faces that carry
// the letters are inked, so the mark reads at a glance; the rest is paper.
export function MarkBlock({ x, y, z = 0, k = 3, depth = 14, hole }) {
  let t = usePal()
  let X = (mx) => x + mx * k
  let Z = (my) => z + (14 - my) * k
  let y1 = y + depth
  let face = (list, Y) => pts(list.map(([mx, my]) => [X(mx), Y, Z(my)]))
  let line = { stroke: t.stroke, strokeWidth: 0.8, strokeLinejoin: 'round' }
  return (
    <g>
      {/* A: the upright side, then its face. */}
      <polygon
        {...line}
        fill={t.right}
        points={pts([
          [X(10), y, Z(0)],
          [X(10), y1, Z(0)],
          [X(10), y1, Z(14)],
          [X(10), y, Z(14)],
        ])}
      />
      <polygon
        fill={t.accent}
        points={face(
          [
            [0, 14],
            [10, 0],
            [10, 14],
          ],
          y1,
        )}
      />
      <polygon
        fill={hole}
        points={face(
          [
            [5.75, 8.7],
            [8.4, 8.7],
            [8.4, 12.4],
            [3.11, 12.4],
          ],
          y1,
        )}
      />
      {/* P: the top, the slope, then its face. */}
      <polygon
        {...line}
        fill={t.top}
        points={pts([
          [X(11.4), y, Z(0)],
          [X(21.4), y, Z(0)],
          [X(21.4), y1, Z(0)],
          [X(11.4), y1, Z(0)],
        ])}
      />
      <polygon
        {...line}
        fill={t.right}
        points={pts([
          [X(21.4), y, Z(0)],
          [X(11.4), y, Z(14)],
          [X(11.4), y1, Z(14)],
          [X(21.4), y1, Z(0)],
        ])}
      />
      <polygon
        fill={t.accent}
        points={face(
          [
            [11.4, 0],
            [21.4, 0],
            [11.4, 14],
          ],
          y1,
        )}
      />
      <polygon
        fill={hole}
        points={face(
          [
            [13, 1.6],
            [18.29, 1.6],
            [15.65, 5.3],
            [13, 5.3],
          ],
          y1,
        )}
      />
    </g>
  )
}

// Lines of "text" running along x on a sheet at height z.
export function Lines({ x, y, z, widths, gap = 6 }) {
  return widths.map((w, i) => (
    <Line
      key={i}
      points={[
        [x, y + i * gap, z],
        [x + w, y + i * gap, z],
      ]}
    />
  ))
}

// Faint floor grid, faded out at the edges.
export function Grid({ size = 200, step = 10, z = 0, fade = true }) {
  let t = usePal()
  let id = useId()
  let lines = []
  for (let i = -size; i <= size; i += step) {
    lines.push(
      <polyline
        key={`x${i}`}
        points={pts([
          [i, -size, z],
          [i, size, z],
        ])}
      />,
      <polyline
        key={`y${i}`}
        points={pts([
          [-size, i, z],
          [size, i, z],
        ])}
      />,
    )
  }
  let [, cy] = iso(0, 0, z)
  return (
    <g>
      {fade && (
        <defs>
          <radialGradient
            id={`${id}g`}
            gradientUnits="userSpaceOnUse"
            cx="0"
            cy={cy}
            r={size * 0.95}
          >
            <stop offset="0" stopColor="#fff" />
            <stop offset="0.6" stopColor="#fff" stopOpacity="0.35" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id={`${id}m`}>
            <rect
              x={-size * 2}
              y={-size * 2}
              width={size * 4}
              height={size * 4}
              fill={`url(#${id}g)`}
            />
          </mask>
        </defs>
      )}
      <g
        stroke={t.faint}
        strokeWidth={0.6}
        mask={fade ? `url(#${id}m)` : undefined}
        style={fade ? { maskType: 'luminance' } : undefined}
      >
        {lines}
      </g>
    </g>
  )
}

/* Service illustrations, drawn for the dark panel. */

// Atollon: CRM records feed a vector store, an agent works over both, and an
// answer comes out. Each part drifts on its own; dots carry work between them.
export function AgentsArt(props) {
  let t = palettes.dark
  let records = [0, 1, 2, 3]
  let pipes = [
    [
      [-58, -22, 0],
      [-42, -22, 0],
      [-42, -8, 0],
      [-28, -8, 0],
    ],
    [
      [49, -58, 0],
      [12, -58, 0],
      [12, -28, 0],
    ],
    [
      [28, 12, 0],
      [46, 12, 0],
      [46, 50, 0],
    ],
  ]
  let bars = [
    [0, 0, 7],
    [1, 0, 12],
    [2, 0, 5],
    [3, 0, 9],
    [0, 1, 10],
    [1, 1, 4],
    [2, 1, 14],
    [3, 1, 6],
    [0, 2, 5],
    [1, 2, 9],
    [2, 2, 7],
    [3, 2, 11],
  ]
  return (
    <Scene
      viewBox="-150 -110 300 190"
      grid={{ size: 150, step: 12 }}
      {...props}
    >
      {/* Pipes on the floor, with work moving along them. */}
      {pipes.map((p, i) => (
        <g key={i}>
          <Line dashed march points={p} />
          <Traveler points={p} dur={3.4} delay={i * 1.1} r={1.5} />
        </g>
      ))}

      {/* Records: a deck of CRM cards, fanned upward. */}
      <Plane x={-98} y={-42} w={40} d={30} dashed fill={null} />
      <Label x={-98} y={-6}>
        CRM
      </Label>
      {records.map((i) => {
        let x = -96 + i * 1.2
        let y = -40 - i * 1.2
        let z = 5 + i * 8
        return (
          <Float key={i} y={-1 - i * 0.8} dur={5.2} delay={1.4 - i * 0.3}>
            <Plane x={x} y={y} z={z} w={36} d={26} />
            <path
              d={orbit(x + 7, y + 8, z, 3.2, 28)}
              stroke={t.stroke}
              strokeWidth={0.6}
              fill={i === 3 ? t.accent : 'none'}
            />
            <Lines x={x + 13} y={y + 6} z={z} widths={[16, 10]} gap={4} />
            <Plane x={x + 13} y={y + 16} z={z} w={11} d={4} fill={t.left} />
            {i === 3 && (
              <>
                <Line
                  strong
                  points={[
                    [x - 2, y - 2, z],
                    [x + 38, y - 2, z],
                    [x + 38, y + 28, z],
                    [x - 2, y + 28, z],
                    [x - 2, y - 2, z],
                  ]}
                />
                {[
                  [x - 2, y - 2],
                  [x + 38, y - 2],
                  [x + 38, y + 28],
                  [x - 2, y + 28],
                ].map(([hx, hy]) => (
                  <Dot key={`${hx}${hy}`} x={hx} y={hy} z={z} r={1.3} />
                ))}
              </>
            )}
          </Float>
        )
      })}

      {/* Vectors: a store, and a field of embeddings beside it. */}
      <Cylinder x={62} y={-58} r={13} h={28} rings={3} />
      <Float y={-2} dur={4.4} delay={0.8}>
        <Box x={56} y={-64} z={30} w={12} d={12} h={3} />
      </Float>
      <Label x={36} y={10}>
        VECTORS
      </Label>
      {bars.map(([i, j, h]) => {
        let box = <Box x={34 + i * 7} y={-24 + j * 7} w={4} d={4} h={h} />
        return j === 1 ? (
          <Float key={`${i}${j}`} y={-2} dur={3.6} delay={i * 0.5}>
            {box}
          </Float>
        ) : (
          <g key={`${i}${j}`}>{box}</g>
        )
      })}

      {/* The agent: a globe over its base, with work circling it. */}
      <Box x={-28} y={-28} w={56} d={56} h={7} hatch={3} />
      <Box x={-20} y={-20} z={7} w={40} d={40} h={4} hatch={3} />
      <Label x={-26} y={34}>
        AGENT
      </Label>
      <Float y={-3} dur={5.6} delay={0}>
        <OrbitRing x={0} y={0} z={33} r={28} dashed />
        <WireSphere x={0} y={0} z={33} r={17} lat={6} lon={12} />
        <Traveler d={orbit(0, 0, 33, 28)} dur={7} rest={0} r={1.6} />
        <Traveler
          d={orbit(0, 0, 33, 28)}
          dur={7}
          delay={3.5}
          rest={0}
          r={1.6}
        />
      </Float>

      {/* The answer: two replies, the latest one checked. */}
      <Plane x={40} y={52} w={36} d={24} dashed fill={null} />
      <Label x={40} y={82}>
        ANSWER
      </Label>
      <Float y={-2} dur={4.8} delay={1.9}>
        <Plane x={42} y={54} z={8} w={32} d={18} />
        <Lines x={47} y={59} z={8} widths={[20, 14]} gap={4} />
      </Float>
      <Float y={-3.5} dur={4.8} delay={2.3}>
        <Plane x={46} y={58} z={20} w={28} d={14} strong />
        <Lines x={51} y={62} z={20} widths={[16]} gap={4} />
        <Line
          strong
          width={1.2}
          points={[
            [64, 66, 20],
            [66, 68, 20],
            [70, 63, 20],
          ]}
        />
      </Float>

      {/* Odd blocks, drifting. */}
      <Float y={-3} dur={4.2} delay={2.6}>
        <Box x={-66} y={40} w={8} d={8} h={8} />
      </Float>
      <Float y={-2.5} dur={5} delay={0.4}>
        <Box x={90} y={0} w={6} d={6} h={6} />
      </Float>
    </Scene>
  )
}

// A crowd, and the few people it's for.
export function AudienceArt(props) {
  let t = palettes.dark
  let picked = ['1,1', '2,1', '1,2']
  let cells = []
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 4; j++) cells.push([i, j])
  }
  cells.sort((a, b) => a[0] + a[1] - (b[0] + b[1]))
  let corners = [
    [-50, -28],
    [-6, -28],
    [-6, 16],
    [-50, 16],
  ]
  return (
    <Scene viewBox="-150 -95 300 175" grid={{ size: 140, step: 14 }} {...props}>
      <Plane x={-50} y={-28} w={44} d={44} dashed march fill={null} />
      {corners.map(([x, y]) => (
        <Dot key={`${x}${y}`} x={x} y={y} hollow r={2.2} />
      ))}
      <Traveler
        points={[...corners, corners[0]].map(([x, y]) => [x, y, 0])}
        dur={7}
        rest={0}
        r={1.5}
      />
      {cells.map(([i, j]) => {
        let pick = picked.indexOf(`${i},${j}`)
        let box = (
          <Box
            x={-66 + i * 22}
            y={-44 + j * 22}
            w={10}
            d={10}
            h={pick >= 0 ? 22 : 10}
            top={pick >= 0 ? t.accent : undefined}
          />
        )
        return pick >= 0 ? (
          <Float key={`${i}${j}`} y={-3} dur={3.8} delay={pick * 0.7}>
            {box}
          </Float>
        ) : (
          <g key={`${i}${j}`}>{box}</g>
        )
      })}
    </Scene>
  )
}

// Steps through a product, and the one that feels wrong.
export function JourneyArt(props) {
  let heights = [10, 22, 34, 24, 58]
  let tops = heights.map((h, i) => [-82 + i * 34 + 12, 2, h])
  // The walker pauses at the step that feels wrong.
  let screen = tops.map((p) => iso(...p))
  let lengths = screen
    .slice(1)
    .map((p, i) => Math.hypot(p[0] - screen[i][0], p[1] - screen[i][1]))
  let total = lengths.reduce((a, b) => a + b, 0)
  let atWrong = lengths.slice(0, 3).reduce((a, b) => a + b, 0) / total
  let f = atWrong.toFixed(3)
  return (
    <Scene viewBox="-150 -95 300 175" grid={{ size: 140, step: 14 }} {...props}>
      {heights.map((h, i) => (
        <g key={i}>
          {i === 3 && (
            <Box x={-82 + i * 34} y={-10} w={24} d={24} h={46} ghost march />
          )}
          <Box x={-82 + i * 34} y={-10} w={24} d={24} h={h} />
        </g>
      ))}
      <Line dashed points={tops} />
      {tops.map(([x, y, z], i) =>
        i === 3 ? (
          <g key={i}>
            <Ripple x={x} y={y} z={z} r={3} />
            <Ripple x={x} y={y} z={z} r={3} delay={0.3} />
            <Dot x={x} y={y} z={z} hollow r={5} />
            <Dot x={x} y={y} z={z} />
          </g>
        ) : (
          <Dot key={i} x={x} y={y} z={z} />
        ),
      )}
      <Traveler
        points={tops}
        dur={6}
        rest={0.1}
        r={2.2}
        keyPoints={`0;${f};${f};1;1`}
        keyTimes="0;0.35;0.6;0.9;1"
      />
    </Scene>
  )
}

export function StackArt(props) {
  return (
    <Scene
      viewBox="-150 -110 300 190"
      grid={{ size: 140, step: 14 }}
      {...props}
    >
      {[
        [-45, -45],
        [35, -45],
        [35, 35],
        [-45, 35],
      ].map(([x, y]) => (
        <Line
          key={`${x}${y}`}
          dashed
          points={[
            [x + 5, y + 5, 0],
            [x + 5, y + 5, 64],
          ]}
        />
      ))}
      {/* Data */}
      <Float y={-1} dur={5} delay={0}>
        <Box x={-45} y={-45} w={90} d={90} h={6} />
        <Cylinder x={-15} y={-10} z={6} r={12} h={16} rings={2} />
        <Cylinder x={15} y={15} z={6} r={12} h={16} rings={2} />
      </Float>
      {/* Logic */}
      <Float y={-3} dur={5} delay={0.3}>
        <Box x={-45} y={-45} z={30} w={90} d={90} h={6} />
        {[-25, 0, 25].map((x) =>
          [-25, 0, 25].map((y) => (
            <Dot key={`${x}${y}`} x={x} y={y} z={36} r={1.4} />
          )),
        )}
        <Line
          points={[
            [-25, -25, 36],
            [25, -25, 36],
            [25, 25, 36],
          ]}
        />
        <Line
          points={[
            [-25, 0, 36],
            [0, 0, 36],
            [0, 25, 36],
          ]}
        />
        <Traveler
          points={[
            [-25, -25, 36],
            [25, -25, 36],
            [25, 25, 36],
          ]}
          dur={3.2}
          r={1.8}
        />
        <Traveler
          points={[
            [-25, 0, 36],
            [0, 0, 36],
            [0, 25, 36],
          ]}
          dur={3.2}
          delay={1.6}
          r={1.8}
        />
      </Float>
      {/* Interface */}
      <Float y={-5} dur={5} delay={0.6}>
        <Box x={-45} y={-45} z={60} w={90} d={90} h={6} />
        <Box x={-35} y={-35} z={66} w={70} d={18} h={3} />
        <Box x={-35} y={-10} z={66} w={30} d={45} h={3} />
        <Box x={2} y={-10} z={66} w={33} d={20} h={3} />
      </Float>
    </Scene>
  )
}

/* The closing scene, drawn on paper. */
export function WorkshopArt(props) {
  let mark = [100 + 10 * 4.4, 104, 14 * 4.4]
  let arcs = [
    [iso(-245, -45, 9), iso(-120, -150, 170), iso(0, 0, 80)],
    [iso(0, 0, 80), iso(130, -10, 160), iso(...mark)],
    [iso(-170, 100, 7), iso(-70, 175, 70), iso(40, 178, 6)],
  ]
  let curve = ([from, via, to]) =>
    `M${from[0]} ${from[1]} Q${via[0]} ${via[1]} ${to[0]} ${to[1]}`
  let footprint = [
    [-205, 65],
    [-135, 65],
    [-135, 135],
    [-205, 135],
  ]
  return (
    <Scene
      tone="light"
      viewBox="-430 -262 860 452"
      grid={{ size: 420, step: 16 }}
      fit={false}
      {...props}
    >
      {/* Horizon */}
      <line
        x1="-430"
        x2="430"
        y1="0"
        y2="0"
        stroke="#d6d6d6"
        strokeWidth="0.8"
        strokeDasharray="3 4"
      />
      {/* Back: building blocks, a wave, a column. */}
      {[
        [-90, -250, 0.3],
        [-60, -200, 1.9],
      ].map(([bx, by, delay]) => (
        <Float key={bx} y={-3} dur={5.2} delay={delay}>
          <Box x={bx} y={by} w={36} d={24} h={14} />
          {[
            [9, 6],
            [27, 6],
            [9, 18],
            [27, 18],
          ].map(([dx, dy]) => (
            <Cylinder
              key={`${dx}${dy}`}
              x={bx + dx + 4}
              y={by + dy + 2}
              z={14}
              r={4}
              h={4}
            />
          ))}
        </Float>
      ))}
      <WaveMesh x={-300} y={-95} w={110} d={95} amp={9} n={10} />
      <Cylinder x={175} y={-75} r={20} h={64} rings={4} />
      <Float y={-4} dur={4.6} delay={0.8}>
        <Box x={110} y={-170} w={22} d={22} h={22} />
      </Float>

      {/* Centre: a hatched plinth under a wireframe dome, with an orbit. */}
      <Box x={-75} y={-75} w={150} d={150} h={18} hatch={5} />
      <Box x={-55} y={-55} z={18} w={110} d={110} h={14} hatch={5} />
      <WireSphere x={0} y={0} z={32} r={46} hemi lat={5} lon={16} />
      <Float y={-5} dur={4.2} delay={0}>
        <OrbitRing x={0} y={0} z={58} r={66} dashed />
        <Traveler d={orbit(0, 0, 58, 66)} dur={9} rest={0} r={2.6} />
        <Dot x={0} y={0} z={80} r={3} />
      </Float>

      {/* Front left: a ring with its footprint marked out. */}
      <Plane x={-205} y={65} w={70} d={70} dashed march fill={null} />
      {footprint.map(([fx, fy]) => (
        <Dot key={`${fx}${fy}`} x={fx} y={fy} hollow r={2.6} />
      ))}
      <Ring x={-170} y={100} r={28} inner={15} h={7} hole="#efefef" />

      {/* Front: a chart on a sheet, lifted off the floor. */}
      <Plane x={10} y={160} w={70} d={40} dashed fill={null} />
      <Float y={-4} dur={4.8} delay={2.2}>
        <Plane x={14} y={164} z={10} w={62} d={32} />
        <Lines x={20} y={170} z={10} widths={[26, 18]} gap={5} />
        {[
          [52, 12],
          [58, 20],
          [64, 9],
          [70, 16],
        ].map(([bx, h]) => (
          <Box key={bx} x={bx - 2} y={182} z={10} w={4} d={4} h={h} />
        ))}
      </Float>
      <Float y={-3} dur={3.9} delay={2.8}>
        <Box x={-40} y={215} w={20} d={20} h={20} />
      </Float>

      {/* Front right: the mark itself, made solid. */}
      <MarkBlock x={100} y={90} k={4.4} depth={14} hole="#efefef" />

      {/* Far right: pillars, and plates floating over their footprint. */}
      {[
        [262, -24, 14],
        [280, -24, 24],
        [298, -24, 34],
      ].map(([px, py, h]) => (
        <Cylinder key={px} x={px} y={py} r={5} h={h} rings={1} />
      ))}
      <Plane x={226} y={60} w={44} d={34} dashed fill={null} />
      {[0, 1, 2].map((i) => (
        <Float key={i} y={-2 - i} dur={5} delay={1 - i * 0.3}>
          <Plane x={228 - i * 2} y={62 - i * 2} z={6 + i * 9} w={40} d={30} />
        </Float>
      ))}

      {/* The paths that tie it together, with something always on its way. */}
      {arcs.map((arc, i) => (
        <g key={i}>
          <ArcPath from={arc[0]} via={arc[1]} to={arc[2]} />
          <Traveler d={curve(arc)} dur={4.4} delay={i * 1.3} r={2.4} />
          <Traveler d={curve(arc)} dur={4.4} delay={i * 1.3 + 2.2} r={2.4} />
        </g>
      ))}
    </Scene>
  )
}

function ArcPath({ from, via, to }) {
  let t = usePal()
  let d = `M${from[0]} ${from[1]} Q${via[0]} ${via[1]} ${to[0]} ${to[1]}`
  let mid = [
    0.25 * from[0] + 0.5 * via[0] + 0.25 * to[0],
    0.25 * from[1] + 0.5 * via[1] + 0.25 * to[1],
  ]
  return (
    <g>
      <path
        d={d}
        stroke={t.accent}
        strokeWidth="0.9"
        strokeDasharray="2 3"
        opacity="0.8"
      />
      {[from, mid, to].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="2.6" fill={t.accent} />
      ))}
    </g>
  )
}
