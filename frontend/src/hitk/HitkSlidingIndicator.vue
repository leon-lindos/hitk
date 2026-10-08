<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps<{ value: string }>()
const indicator = ref<HTMLElement>()
const bounds = ref<{ left: string; top: string; width: string; height: string }>()
let observer: ResizeObserver | undefined

function measure() {
  const container = indicator.value?.parentElement
  const selected = container?.querySelector<HTMLElement>('[aria-current="page"], [aria-selected="true"]')
  if (!container || !selected) return
  const parent = container.getBoundingClientRect()
  const target = selected.getBoundingClientRect()
  bounds.value = {
    left: `${target.left - parent.left - container.clientLeft + container.scrollLeft}px`,
    top: `${target.top - parent.top - container.clientTop + container.scrollTop}px`,
    width: `${target.width}px`,
    height: `${target.height}px`
  }
}

watch(() => props.value, measure, { flush: 'post' })
onMounted(() => {
  measure()
  if (typeof ResizeObserver !== 'undefined' && indicator.value?.parentElement) {
    observer = new ResizeObserver(measure)
    observer.observe(indicator.value.parentElement)
    indicator.value.parentElement.querySelectorAll('button, a').forEach(el => observer?.observe(el))
  }
  window.addEventListener('resize', measure)
})
onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('resize', measure)
})
</script>

<template>
  <span ref="indicator" class="hitk-sliding-indicator" :class="{ 'is-ready': bounds }" :style="bounds" aria-hidden="true" />
</template>

<style scoped>
.hitk-sliding-indicator {
  position: absolute;
  z-index: 0;
  pointer-events: none;
  border: 1px solid var(--hitk-secondary-border);
  border-radius: var(--hitk-switch-radius, 999px);
  background: var(--hitk-secondary-fill);
  box-shadow: var(--hitk-secondary-shadow);
  visibility: hidden;
  transition: left 240ms cubic-bezier(0.22, 1, 0.36, 1), top 240ms cubic-bezier(0.22, 1, 0.36, 1), width 240ms ease, height 240ms ease;
}
.hitk-sliding-indicator.is-ready { visibility: visible; }
@media (prefers-reduced-motion: reduce) {
  .hitk-sliding-indicator { transition: none; }
}
@media (forced-colors: active) {
  .hitk-sliding-indicator { border-color: Highlight; }
}
</style>
