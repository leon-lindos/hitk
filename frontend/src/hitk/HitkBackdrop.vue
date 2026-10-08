<script setup lang="ts">
// Page backdrop for the public pages: the dot field, optionally with one large, slow "connecting" orb behind the content.
import ThinkingOrb from './ThinkingOrb.vue'

withDefaults(defineProps<{ orb?: boolean }>(), { orb: true })
</script>

<template>
  <div class="hitk-backdrop" aria-hidden="true">
    <div class="hitk-backdrop-dots"></div>
    <div v-if="orb" class="hitk-backdrop-orb">
      <ThinkingOrb state="connecting" :size="620" :speed="0.35" />
    </div>
  </div>
</template>
