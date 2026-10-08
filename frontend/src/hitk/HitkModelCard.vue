<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { modelLogos, type ModelLogoKey } from './modelLogos'

defineProps<{ model: { logo?: ModelLogoKey; image?: string; name: string; maker: string } }>()
const card = ref<HTMLElement>()
let frame = 0
let pointerX = 0
let pointerY = 0
let motion: MediaQueryList | undefined
const properties = ['--model-x', '--model-y', '--model-rotate-x', '--model-rotate-y', '--model-light-x', '--model-light-y']

function paintPointer() {
  frame = 0
  if (!card.value || motion?.matches) return
  const rect = card.value.getBoundingClientRect()
  if (!rect.width || !rect.height) return
  const x = Math.max(-1, Math.min(1, (pointerX - rect.left) / rect.width * 2 - 1))
  const y = Math.max(-1, Math.min(1, (pointerY - rect.top) / rect.height * 2 - 1))
  const values = [`${x * 3.5}px`, `${y * 2.5}px`, `${-y * 4}deg`, `${x * 4}deg`, `${(x + 1) * 50}%`, `${(y + 1) * 50}%`]
  properties.forEach((property, index) => card.value?.style.setProperty(property, values[index]))
}
function followPointer(event: PointerEvent) {
  if (event.pointerType !== 'mouse' || motion?.matches) return
  pointerX = event.clientX
  pointerY = event.clientY
  if (!frame) frame = requestAnimationFrame(paintPointer)
}
function resetPointer() {
  if (frame) cancelAnimationFrame(frame)
  frame = 0
  properties.forEach(property => card.value?.style.removeProperty(property))
}
onMounted(() => {
  motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  motion.addEventListener?.('change', resetPointer)
})
onBeforeUnmount(() => {
  resetPointer()
  motion?.removeEventListener?.('change', resetPointer)
})
</script>

<template>
  <div ref="card" class="hitk-model-card" @pointerenter="followPointer" @pointermove="followPointer" @pointerleave="resetPointer" @pointercancel="resetPointer">
    <span class="hitk-model-mark">
      <svg v-if="model.logo" :viewBox="modelLogos[model.logo].viewBox" fill="currentColor" fill-rule="evenodd" aria-hidden="true">
        <path v-for="(path, index) in modelLogos[model.logo].paths" :key="index" :d="path.d" :fill-opacity="path.opacity" />
      </svg>
      <img v-else :src="model.image" alt="" aria-hidden="true" class="dark:invert" />
    </span>
    <span class="hitk-model-name">{{ model.name }}</span>
    <span class="hitk-model-maker">{{ model.maker }}</span>
  </div>
</template>

<style scoped>
.hitk-model-card { position: relative; isolation: isolate; display: flex; width: 100%; min-width: 0; flex-direction: column; align-items: center; padding: 12px 4px; border: 1px solid transparent; border-radius: 16px; color: #262626; transition: border-color 180ms ease, box-shadow 180ms ease; }
.hitk-model-card::before { content: ''; position: absolute; inset: 0; z-index: -1; border-radius: inherit; background: radial-gradient(110px circle at var(--model-light-x, 50%) var(--model-light-y, 50%), rgb(0 0 0 / 0.05), transparent 75%), var(--hitk-light-surface); opacity: 0; transition: opacity 180ms ease; }
.hitk-model-mark { display: grid; width: 44px; height: 44px; place-items: center; transform: none; transition: transform 200ms ease-out; }
.hitk-model-mark > :is(svg, img) { width: 32px; height: 32px; object-fit: contain; }
.hitk-model-name { margin-top: 8px; color: #171717; font-size: 12px; font-weight: 600; white-space: nowrap; }
.hitk-model-maker { margin-top: 2px; color: #737373; font-size: 12px; }
.dark .hitk-model-card { color: #e5e5e5; }
.dark .hitk-model-card::before { background: radial-gradient(110px circle at var(--model-light-x, 50%) var(--model-light-y, 50%), rgb(255 255 255 / 0.09), transparent 75%), var(--hitk-dark-surface); }
.dark .hitk-model-name { color: #fff; }
.dark .hitk-model-maker { color: #a3a3a3; }
@media (min-width: 640px) { .hitk-model-name { font-size: 14px; } }
@media (hover: hover) and (pointer: fine) {
  .hitk-model-card:hover { border-color: #d4d4d4; box-shadow: 0 6px 18px rgb(0 0 0 / 0.07); }
  .dark .hitk-model-card:hover { border-color: #525252; box-shadow: 0 6px 18px rgb(0 0 0 / 0.2); }
  .hitk-model-card:hover::before { opacity: 1; }
  .hitk-model-card:hover .hitk-model-mark { transform: perspective(320px) translate3d(var(--model-x, 0px), calc(-2px + var(--model-y, 0px)), 0) rotateX(var(--model-rotate-x, 0deg)) rotateY(var(--model-rotate-y, 0deg)) scale(1.08); }
}
@media (prefers-reduced-motion: reduce) {
  .hitk-model-card, .hitk-model-card::before, .hitk-model-mark { transition: none; }
  .hitk-model-card:hover .hitk-model-mark { transform: none; }
}
</style>
