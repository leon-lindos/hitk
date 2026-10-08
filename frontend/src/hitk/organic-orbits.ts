// Hi, Token's variation on the thinking-orbs orbit geometry. The original
// engine still draws the faint background orbits; see THIRD_PARTY_NOTICES.md.
import { MODE_FRAMES } from './vendor/engine.js'
import type { ModeFrame } from './types'

const TAU = Math.PI * 2

function random(index: number, salt: number): number {
  const value = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453
  return value - Math.floor(value)
}

// Stable per-particle randomness keeps the motion continuous between frames.
const particles = Array.from({ length: 36 }, (_, index) => ({
  phase: random(index, 1) * TAU,
  longitude: random(index, 2) * TAU,
  inclination: Math.acos(2 * random(index, 3) - 1),
  radius: 0.43 + 0.51 * random(index, 4),
  ellipse: 0.68 + 0.3 * random(index, 5),
  dotRadius: 0.4 + 4 * random(index, 6) ** 2.6,
  rate: (0.12 + 1.65 * random(index, 7) ** 2) * (random(index, 8) > 0.5 ? 1 : -1),
  drift: (0.04 + 0.14 * random(index, 9)) * (random(index, 10) > 0.5 ? 1 : -1),
  pulse: 0.18 + 0.32 * random(index, 11)
}))

export const frameOrganicOrbits: ModeFrame = (size, time, options) => {
  const frame = MODE_FRAMES.orbits(size, time, {
    ...options,
    particles: 0,
    ghostA: (options.ghostA ?? 0.5) * 0.65
  })
  const radius = size * 0.41
  const scale = (size / 144) ** 0.65
  const yaw = time * 0.12
  const cosYaw = Math.cos(yaw), sinYaw = Math.sin(yaw)
  const cosTilt = Math.cos(0.3), sinTilt = Math.sin(0.3)
  const count = Math.min(particles.length, (options.orbitN ?? 12) * (options.particles ?? 3))

  for (const particle of particles.slice(0, count)) {
    const { phase, rate } = particle
    // Independent phases, speeds and directions, with smooth acceleration.
    const angle = phase + time * rate
      + 0.3 * Math.sin(time * (Math.abs(rate) * 0.8 + 0.12) + phase)
      + 0.12 * Math.sin(time * (Math.abs(rate) * 0.37 + 0.09) + phase * 2)
    const longitude = particle.longitude + time * particle.drift
    const inclination = particle.inclination + 0.22 * Math.sin(time * particle.pulse + phase)
    const orbitRadius = radius * particle.radius * (0.92 + 0.07 * Math.sin(time * particle.pulse + phase))
    const u = Math.cos(angle) * orbitRadius
    const v = Math.sin(angle) * orbitRadius * particle.ellipse
    const cosLongitude = Math.cos(longitude), sinLongitude = Math.sin(longitude)
    const x = cosLongitude * u - Math.cos(inclination) * sinLongitude * v
    const y = Math.sin(inclination) * v
    const z = -sinLongitude * u - Math.cos(inclination) * cosLongitude * v
    const rotatedX = x * cosYaw + z * sinYaw
    const rotatedZ = -x * sinYaw + z * cosYaw
    const projectedY = y * cosTilt - rotatedZ * sinTilt
    const depthZ = y * sinTilt + rotatedZ * cosTilt
    const depth = (depthZ / radius + 1) / 2

    frame.dots.push({
      x: size / 2 + rotatedX,
      y: size / 2 - projectedY,
      z: depthZ,
      r: Math.max(0.35, particle.dotRadius * scale * (0.7 + 0.3 * depth)),
      white: 0.32 - 0.26 * depth,
      a: 0.65 + 0.35 * depth
    })
  }

  frame.dots.sort((a, b) => a.z - b.z)
  return frame
}
