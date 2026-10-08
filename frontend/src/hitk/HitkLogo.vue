<script setup lang="ts">
// Brand mark: the site logo set in admin settings if any, otherwise a live "connecting" orb on an ink tile.
import ThinkingOrb from './ThinkingOrb.vue'

withDefaults(defineProps<{
  /** Sanitized custom logo URL; empty falls back to the orb. */
  src?: string
  /** Orb size in CSS pixels; keep it a little smaller than the box. */
  orbSize?: number
}>(), { src: '', orbSize: 32 })
</script>

<template>
  <img v-if="src" :src="src" alt="Logo" class="h-full w-full object-contain" />
  <span v-else class="hitk-logo" role="img" aria-label="Logo">
    <ThinkingOrb state="connecting" :size="orbSize" theme="dark" :speed="0.6" />
  </span>
</template>
