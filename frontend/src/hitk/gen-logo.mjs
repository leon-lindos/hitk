// Generate public/logo.svg (node src/hitk/gen-logo.mjs public/logo.svg 1.2 1.5 2.2): one frame of the thinking-orbs "connecting" (web) mode on an ink tile,
// drawn with the 64px preset, heavier dots and strands so it still reads at favicon size.
import { MODE_FRAMES, resolvePreset } from './vendor/engine.js'
import { scaleRadii } from './vendor/scale.js'
import fs from 'node:fs'

const [, , out, tArg, radArg, lineArg] = process.argv
const VIEW = 512, GEOM = 64, DRAWN = 392
const T = Number(tArg || 0.6), RAD = Number(radArg || 1.6), LINE = Number(lineArg || 2.2)
const { mode, speed, opts } = resolvePreset('connecting', 64)
const frame = MODE_FRAMES[mode](GEOM, T * speed, scaleRadii(opts, RAD))
const K = DRAWN / GEOM, PAD = (VIEW - DRAWN) / 2
const g = (w) => Math.round((1 - Math.min(1, Math.max(0, w))) * 255)   // upstream inkColor, dark background
const f = (n) => +n.toFixed(3)
const lines = frame.lines.map((l) => `<line x1="${f(l.x1)}" y1="${f(l.y1)}" x2="${f(l.x2)}" y2="${f(l.y2)}" stroke="rgb(${g(l.white)},${g(l.white)},${g(l.white)})" stroke-opacity="${f(Math.min(1, (l.a ?? 1) * 1.6))}" stroke-width="${f(l.w * LINE)}"/>`)
const dots = frame.dots.map((d) => `<circle cx="${f(d.x)}" cy="${f(d.y)}" r="${f(d.r)}" fill="rgb(${g(d.white)},${g(d.white)},${g(d.white)})" fill-opacity="${f(d.a ?? 1)}"/>`)
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEW} ${VIEW}" role="img" aria-labelledby="title">
  <title id="title">Hi, Token</title>
  <!-- A frame of the "connecting" thinking orb (thinking-orbs, MIT, Jakub Antalik); see src/hitk/THIRD_PARTY_NOTICES.md -->
  <rect width="${VIEW}" height="${VIEW}" rx="112" fill="#111111"/>
  <g transform="translate(${PAD} ${PAD}) scale(${f(K)})" stroke-linecap="round">
    ${lines.join('\n    ')}
    ${dots.join('\n    ')}
  </g>
</svg>
`
fs.writeFileSync(out, svg)
console.log(out.split('/').pop(), frame.dots.length, 'dots', frame.lines.length, 'lines', svg.length, 'bytes')
