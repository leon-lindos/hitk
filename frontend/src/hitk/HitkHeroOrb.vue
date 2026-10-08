<script setup lang="ts">
// The large "connecting" orb behind the home page terminal; place it as the first child of a positioned box.
import ThinkingOrb from './ThinkingOrb.vue'
</script>

<template>
  <span class="hitk-hero-orb" aria-hidden="true">
    <ThinkingOrb state="connecting" :size="500" :speed="0.35" />
  </span>
</template>
