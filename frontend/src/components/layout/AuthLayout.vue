<template>
  <div class="fyro-public fyro-auth">
    <div class="fyro-auth-shell">
      <section class="fyro-auth-intro">
        <router-link to="/" class="fyro-auth-brand">
          <img :src="siteLogo || '/logo.svg'" :alt="siteName" width="64" height="64" />
          <h1>{{ siteName }}</h1>
        </router-link>
        <p class="fyro-auth-subtitle">{{ siteSubtitle }}</p>
        <div class="fyro-auth-art" aria-hidden="true">
          <img :src="BRAND.illustration" alt="" width="960" height="640" />
        </div>
      </section>
      <main class="fyro-auth-panel">
        <div class="fyro-auth-card"><slot /></div>
        <div class="fyro-auth-links"><slot name="footer" /></div>
      </main>
    </div>
    <footer class="fyro-auth-footer">&copy; {{ currentYear }} {{ siteName }}</footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAppStore } from '@/stores'
import { sanitizeUrl } from '@/utils/url'
import { BRAND } from '@/config/brand'

const appStore = useAppStore()

const siteName = computed(() => appStore.siteName || BRAND.name)
const siteLogo = computed(() => sanitizeUrl(appStore.siteLogo || BRAND.logo, { allowRelative: true, allowDataUrl: true }))
const siteSubtitle = computed(() => appStore.cachedPublicSettings?.site_subtitle || BRAND.subtitle)

const currentYear = computed(() => new Date().getFullYear())

onMounted(() => {
  appStore.fetchPublicSettings()
})
</script>

<style scoped>
.fyro-auth { min-height: 100svh; padding: 3rem 2rem 1.5rem; display: flex; flex-direction: column; justify-content: center; }
.fyro-auth-shell { width: 100%; max-width: 1080px; margin: auto; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 440px); align-items: center; gap: clamp(3rem, 8vw, 7rem); }
.fyro-auth-intro, .fyro-auth-panel { min-width: 0; }
.fyro-auth-brand { display: flex; align-items: center; gap: 1rem; width: fit-content; max-width: 100%; }
.fyro-auth-brand img { width: 64px; height: 64px; object-fit: contain; flex-shrink: 0; }
.fyro-auth-brand h1 { font-family: var(--fyro-display); font-size: 2rem; line-height: 1.4; overflow-wrap: anywhere; }
.fyro-auth-subtitle { margin-top: 1.5rem; font-size: 1.125rem; line-height: 1.8; color: var(--fyro-muted); overflow-wrap: anywhere; }
.fyro-auth-art { margin-top: 2.5rem; isolation: isolate; }
.fyro-auth-art img { width: 100%; height: auto; mix-blend-mode: multiply; }
.fyro-auth-card { padding: 2rem; background: var(--fyro-surface); border: 1px solid var(--fyro-line); border-radius: 6px; box-shadow: 0 12px 40px rgb(36 39 37 / 4%); }
.fyro-auth-links { margin-top: 1.5rem; text-align: center; font-size: .875rem; }
.fyro-auth-footer { margin-top: 3rem; text-align: center; color: var(--fyro-muted); font-size: .75rem; }
:global(.dark) .fyro-auth-art { background: #f4f0e8; border-radius: 4px; }
:global(.dark) .fyro-auth-art img { mix-blend-mode: normal; }
@media (max-width: 767px) {
  .fyro-auth { padding: 1.75rem 1rem 1.25rem; }
  .fyro-auth-shell { max-width: 440px; grid-template-columns: minmax(0, 1fr); gap: 2rem; }
  .fyro-auth-brand { margin-inline: auto; gap: .75rem; }
  .fyro-auth-brand h1 { font-size: 1.5rem; }
  .fyro-auth-brand img { width: 48px; height: 48px; }
  .fyro-auth-subtitle { margin-top: .75rem; text-align: center; font-size: .875rem; }
  .fyro-auth-art { display: none; }
  .fyro-auth-card { padding: 1.5rem; }
}
</style>
