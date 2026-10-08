<script setup lang="ts">
// Port of thinking-orbs@0.3.2's React <ThinkingOrb>, taken from the local thinking-orbs-vue package (MIT,
// see THIRD_PARTY_NOTICES.md). HiTK changes: any pixel size (the nearest upstream tier supplies the preset,
// the engine draws the geometry at the real size), and decorative by default (aria-hidden unless `label`).
import { computed, onMounted, onBeforeUnmount, onActivated, onDeactivated, ref, watch } from 'vue'
import { MODE_FRAMES, paintFrame, resolvePreset } from './vendor/engine.js'
import { frameOrganicOrbits } from './organic-orbits'
import { ORB_STATES } from './types'
import type { OrbState, OrbSize, OrbTheme } from './types'

const props = withDefaults(defineProps<{
  state?: OrbState
  /** CSS pixels; 64 / 32 / 20 match upstream exactly. */
  size?: number
  theme?: OrbTheme
  /** Multiplier on the preset speed; 0 holds the t = 0 frame. */
  speed?: number
  /** More varied particle sizes, speeds and paths for the working state. */
  organic?: boolean
  paused?: boolean
  /** Accessible name; without it the orb is hidden from assistive technology. */
  label?: string
}>(), { state: 'working', size: 64, theme: 'auto', speed: 1, organic: false, paused: false })

const canvas = ref<HTMLCanvasElement>()
const state = computed<OrbState>(() => ORB_STATES.includes(props.state) ? props.state : 'working')
const size = computed(() => Number.isFinite(props.size) && props.size > 0 ? props.size : 64)
const tier = computed<OrbSize>(() => size.value < 26 ? 20 : size.value < 48 ? 32 : 64)
const speed = computed(() => Number.isFinite(props.speed) && props.speed >= 0 ? props.speed : 1)

let ctx: CanvasRenderingContext2D | null = null
let raf = 0
let loop: (() => void) | null = null
let reduced = false
let intersecting = true
let active = true
let dark = false
let dpr = 1
let intersection: IntersectionObserver | undefined
let mutations: MutationObserver | undefined
let colorQuery: MediaQueryList | undefined
let motionQuery: MediaQueryList | undefined

function resolveDark() {
  if (props.theme !== 'auto') return props.theme === 'dark'
  for (let el: HTMLElement | null | undefined = canvas.value; el; el = el.parentElement) {
    const theme = el.getAttribute('data-theme')
    if (theme === 'dark' || theme === 'light') return theme === 'dark'
    if (el.classList.contains('dark')) return true
    if (el.classList.contains('light')) return false
  }
  return colorQuery?.matches ?? false
}

function stop() {
  cancelAnimationFrame(raf)
  raf = 0
}
function run() {
  stop()
  if (loop && active && intersecting && !document.hidden && !props.paused) raf = requestAnimationFrame(loop)
}

function configure() {
  if (!ctx || !canvas.value) return
  stop()
  loop = null
  const c = ctx, s = size.value, d = dark
  dpr = Math.min(2, window.devicePixelRatio || 1)
  const px = Math.round(s * dpr)
  if (canvas.value.width !== px) canvas.value.width = px
  if (canvas.value.height !== px) canvas.value.height = px
  const { mode, speed: baseSpeed, opts } = resolvePreset(state.value, tier.value)
  const frameFn = props.organic && state.value === 'working' ? frameOrganicOrbits : MODE_FRAMES[mode]
  const effSpeed = baseSpeed * speed.value
  const paint = (tSec: number) => {
    c.setTransform(dpr, 0, 0, dpr, 0, 0)
    c.clearRect(0, 0, s, s)
    paintFrame(c, frameFn(s, tSec, opts), d)
  }
  if (reduced) { paint(0.6); return }
  loop = () => { paint((performance.now() / 1e3) * effSpeed); raf = requestAnimationFrame(loop!) }
  paint((performance.now() / 1e3) * effSpeed)
  run()
}
const onTheme = () => { const next = resolveDark(); if (next !== dark) { dark = next; configure() } }
const onMotion = () => { reduced = !!motionQuery?.matches; configure() }
const onResize = () => { if (Math.min(2, window.devicePixelRatio || 1) !== dpr) configure() }

watch(() => [props.state, props.size, props.speed, props.organic, props.paused], configure, { flush: 'post' })
watch(() => props.theme, () => { dark = resolveDark(); configure() }, { flush: 'post' })
onMounted(() => {
  ctx = canvas.value?.getContext('2d') ?? null
  if (!ctx) return
  colorQuery = window.matchMedia('(prefers-color-scheme: dark)')
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  colorQuery.addEventListener('change', onTheme)
  motionQuery.addEventListener('change', onMotion)
  document.addEventListener('visibilitychange', run)
  window.addEventListener('resize', onResize)
  if (typeof IntersectionObserver !== 'undefined') {
    intersection = new IntersectionObserver(([entry]) => {
      intersecting = entry?.isIntersecting ?? true
      run()
    })
    intersection.observe(canvas.value!)
  }
  mutations = new MutationObserver(onTheme)
  for (let el: HTMLElement | null | undefined = canvas.value; el; el = el.parentElement) {
    mutations.observe(el, { attributes: true, attributeFilter: ['class', 'data-theme'] })
  }
  reduced = motionQuery.matches
  dark = resolveDark()
  configure()
})
onActivated(() => { active = true; run() })
onDeactivated(() => { active = false; stop() })
onBeforeUnmount(() => {
  stop()
  intersection?.disconnect()
  mutations?.disconnect()
  colorQuery?.removeEventListener('change', onTheme)
  motionQuery?.removeEventListener('change', onMotion)
  document.removeEventListener('visibilitychange', run)
  window.removeEventListener('resize', onResize)
  ctx = null
})
</script>

<template>
  <canvas
    ref="canvas"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
    :style="{ width: `${size}px`, height: `${size}px`, display: 'block' }"
  />
</template>
