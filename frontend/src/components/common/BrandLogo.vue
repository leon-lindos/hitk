<template>
  <span class="brand-logo" :class="{ 'brand-logo-seal': !customLogo }">
    <img :src="customLogo || BRAND.logo" :alt="name || BRAND.name" />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { BRAND } from '@/config/brand'
import { sanitizeUrl } from '@/utils/url'

const props = defineProps<{ src?: string; name?: string }>()
const customLogo = computed(() => props.src && props.src !== BRAND.logo
  ? sanitizeUrl(props.src, { allowRelative: true, allowDataUrl: true }) : '')
</script>

<style scoped>
.brand-logo { display: inline-block; position: relative; overflow: hidden; flex-shrink: 0; }
.brand-logo img { width: 100%; height: 100%; object-fit: contain; }
.brand-logo-seal { mix-blend-mode: multiply; }
.brand-logo-seal img { position: absolute; width: 152.83582%; height: 152.83582%; max-width: none; left: -27.31343%; top: -25.07463%; }
:global(.dark) .brand-logo-seal { mix-blend-mode: normal; border-radius: 4px; }
</style>
