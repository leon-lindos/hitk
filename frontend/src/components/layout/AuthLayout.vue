<template>
  <div class="fyro-auth relative flex min-h-screen items-center justify-center overflow-hidden p-4">
    <!-- Background -->
    <div class="fyro-auth-paper absolute inset-0"></div>

    <!-- Decorative Elements -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="fyro-auth-signal absolute inset-0"></div>
    </div>

    <!-- Content Container -->
    <div class="relative z-10 w-full max-w-md">
      <!-- Logo/Brand -->
      <div class="mb-8 text-center">
        <!-- Custom Logo or Default Logo -->
        <template v-if="settingsLoaded">
          <div
            class="fyro-auth-logo mb-4 inline-flex h-20 w-20 items-center justify-center overflow-hidden"
          >
            <img :src="siteLogo || '/logo.svg'" alt="Logo" class="h-full w-full object-contain" />
          </div>
          <h1 class="fyro-auth-title mb-2 text-3xl font-normal">
            {{ siteName }}
          </h1>
          <p class="fyro-auth-subtitle text-sm">
            {{ siteSubtitle }}
          </p>
        </template>
      </div>

      <!-- Card Container -->
      <div class="fyro-auth-card rounded-sm p-8">
        <slot />
      </div>

      <!-- Footer Links -->
      <div class="mt-6 text-center text-sm">
        <slot name="footer" />
      </div>

      <!-- Copyright -->
      <div class="fyro-auth-footer mt-8 text-center text-xs">
        &copy; {{ currentYear }} {{ siteName }}. All rights reserved.
      </div>
    </div>
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
const settingsLoaded = computed(() => appStore.publicSettingsLoaded)

const currentYear = computed(() => new Date().getFullYear())

onMounted(() => {
  appStore.fetchPublicSettings()
})
</script>

<style scoped>
.fyro-auth { color: #242725; font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif; }
.fyro-auth-paper { background: #f4f0e8; }
.fyro-auth-signal { opacity: .2; background: radial-gradient(ellipse at 20% 28%, transparent 0 12%, rgba(182,58,43,.14) 12.2% 12.4%, transparent 12.6%), radial-gradient(ellipse at 84% 72%, transparent 0 16%, rgba(36,39,37,.1) 16.2% 16.35%, transparent 16.6%); }
.fyro-auth-logo { border-radius: 8px; mix-blend-mode: multiply; }
.fyro-auth-logo img { width: 140%; height: 140%; object-fit: contain; }
.fyro-auth-title { color: #242725; font-family: "Songti SC", "STSong", "Noto Serif SC", Georgia, serif; letter-spacing: .02em; }
.fyro-auth-subtitle, .fyro-auth-footer { color: #61665e; }
.fyro-auth-card { background: rgba(250,248,242,.82); border: 1px solid rgba(36,39,37,.14); box-shadow: 0 20px 50px rgba(36,39,37,.09); }
:global(.dark) .fyro-auth-paper { background: #1e211f; }
:global(.dark) .fyro-auth { color: #f4f0e8; }
:global(.dark) .fyro-auth-title { color: #f4f0e8; }
:global(.dark) .fyro-auth-card { background: rgba(36,39,37,.92); border-color: rgba(244,240,232,.18); }
:global(.dark) .fyro-auth-logo { mix-blend-mode: normal; background: #f4f0e8; }
</style>
