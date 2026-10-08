<script setup lang="ts">
// Two public product pages share navigation and branding. HomeView supplies settings and auth state.
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import LocaleSwitcher from '@/components/common/LocaleSwitcher.vue'
import Icon from '@/components/icons/Icon.vue'
import HitkBackdrop from './HitkBackdrop.vue'
import HitkHeroOrb from './HitkHeroOrb.vue'
import HitkLogo from './HitkLogo.vue'
import HitkIntegrations from './HitkIntegrations.vue'
import HitkPlatformFeatures from './HitkPlatformFeatures.vue'
import HitkSlidingIndicator from './HitkSlidingIndicator.vue'
import HitkModelCard from './HitkModelCard.vue'
import ThinkingOrb from './ThinkingOrb.vue'
import type { ModelLogoKey } from './modelLogos'
import jevLogo from './jev-logo.svg'
import nanoBananaLogo from './nano-banana-logo.svg'

const props = withDefaults(defineProps<{
  service?: 'token-api' | 'private-platform'
  siteName: string
  siteLogo: string
  docUrl: string
  showModelPlazaEntry: boolean
  isAuthenticated: boolean
  dashboardPath: string
  userInitial: string
  isDark: boolean
}>(), { service: 'token-api' })
defineEmits<{ (e: 'toggle-theme'): void }>()

const { t } = useI18n()

const contactEmail = 'contact@hitk.ai'
const mailto = (subject: string) => `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}`
const tokenHref = mailto('Token API access')
const platformHref = mailto('TokenOS private API platform')
const isPrivate = computed(() => props.service === 'private-platform')
const year = new Date().getFullYear()

const tokenPoints = computed(() => [
  { icon: 'server', title: t('hitk.routingTitle'), text: t('hitk.routingDescription') },
  { icon: 'shield', title: t('hitk.accessTitle'), text: t('hitk.accessDescription') },
  { icon: 'swap', title: t('hitk.protocolTitle'), text: t('hitk.protocolDescription') },
  { icon: 'chart', title: t('hitk.intelligenceTitle'), text: t('hitk.intelligenceDescription') },
  { icon: 'dollar', title: t('hitk.usageTitle'), text: t('hitk.usageDescription') }
] as const)

const platformPoints = computed(() => [
  { icon: 'shield', title: t('hitk.securityTitle'), text: t('hitk.securityDescription') },
  { icon: 'dollar', title: t('hitk.budgetsTitle'), text: t('hitk.budgetsDescription') },
  { icon: 'database', title: t('hitk.sourcesTitle'), text: t('hitk.sourcesDescription') }
] as const)

// Models the Token API serves (logos: src/hitk/modelLogos.ts)
const models: { id: string; logo?: ModelLogoKey; image?: string; name: string; maker: string }[] = [
  { id: 'claude', logo: 'Claude', name: 'Claude', maker: 'Anthropic' },
  { id: 'gpt', logo: 'OpenAI', name: 'GPT', maker: 'OpenAI' },
  { id: 'gemini', logo: 'Gemini', name: 'Gemini', maker: 'Google' },
  { id: 'grok', logo: 'Grok', name: 'Grok', maker: 'xAI' },
  { id: 'deepseek', logo: 'DeepSeek', name: 'DeepSeek', maker: 'DeepSeek' },
  { id: 'qwen', logo: 'Qwen', name: 'Qwen', maker: 'Alibaba' },
  { id: 'glm', logo: 'ZAI', name: 'GLM', maker: 'Z.ai' },
  { id: 'kimi', logo: 'Kimi', name: 'Kimi', maker: 'Moonshot AI' },
  { id: 'minimax', logo: 'Minimax', name: 'MiniMax', maker: 'MiniMax' },
  { id: 'nano-banana', image: nanoBananaLogo, name: 'Nano Banana', maker: 'Google' },
  { id: 'jev', image: jevLogo, name: 'Jev', maker: 'TypeSafe AI' },
  { id: 'seed', logo: 'Doubao', name: 'Seedream · Seedance', maker: 'ByteDance' }
]
</script>

<template>
  <div data-testid="hitk-landing" class="hitk-landing relative flex min-h-screen flex-col overflow-hidden bg-gray-50 dark:bg-dark-950">
    <HitkBackdrop :orb="false" />

    <!-- Header -->
    <header class="relative z-20 px-4 py-4 sm:px-6">
      <div class="hitk-landing-header mx-auto max-w-6xl">
        <router-link to="/home" class="flex min-w-0 items-center gap-2 justify-self-start sm:gap-3">
          <span class="hitk-landing-brand-mark h-8 w-8 shrink-0 overflow-hidden rounded-lg shadow-sm sm:h-10 sm:w-10 sm:rounded-xl">
            <HitkLogo :src="siteLogo" :orb-size="30" />
          </span>
          <span class="truncate text-sm font-semibold text-gray-900 sm:text-base dark:text-white">{{ siteName }}</span>
        </router-link>

        <nav class="hitk-service-switch" :aria-label="t('hitk.services')">
          <HitkSlidingIndicator :value="service" />
          <router-link
            to="/home"
            class="hitk-service-link"
            :class="{ 'is-active': !isPrivate }"
            :aria-current="!isPrivate ? 'page' : undefined"
          >Token API</router-link>
          <router-link
            to="/private-platform"
            class="hitk-service-link"
            :class="{ 'is-active': isPrivate }"
            :aria-current="isPrivate ? 'page' : undefined"
          >
            {{ t('hitk.platformNav') }}
          </router-link>
        </nav>

        <div class="flex min-w-0 items-center justify-self-end gap-1 sm:gap-2">
          <router-link
            v-if="showModelPlazaEntry"
            to="/model-plaza"
            class="mr-2 hidden text-sm text-gray-600 transition-colors hover:text-gray-900 xl:inline dark:text-dark-300 dark:hover:text-white"
          >{{ t('hitk.models') }}</router-link>
          <a
            v-if="docUrl"
            :href="docUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="mr-2 hidden text-sm text-gray-600 transition-colors hover:text-gray-900 xl:inline dark:text-dark-300 dark:hover:text-white"
          >
            {{ t('home.docs') }}
          </a>
          <LocaleSwitcher />
          <button
            type="button"
            class="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-dark-400 dark:hover:bg-dark-800 dark:hover:text-white"
            :title="isDark ? t('home.switchToLight') : t('home.switchToDark')"
            @click="$emit('toggle-theme')"
          >
            <Icon :name="isDark ? 'sun' : 'moon'" size="md" />
          </button>
          <router-link
            v-if="isAuthenticated"
            :to="dashboardPath"
            :aria-label="t('home.dashboard')"
            class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gray-900 p-1 text-xs font-medium text-white transition-colors hover:bg-gray-800 sm:pr-3 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            <span class="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px] font-semibold dark:bg-gray-900/10">
              {{ userInitial }}
            </span>
            <span class="hidden sm:inline">{{ t('home.dashboard') }}</span>
          </router-link>
          <router-link
            v-else
            to="/login"
            class="inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-gray-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            {{ t('home.login') }}
          </router-link>
        </div>
      </div>
    </header>

    <Transition name="hitk-service" mode="out-in">
      <main :key="service" class="relative z-10 flex-1" :data-service="service">
        <!-- Hero -->
        <section class="relative px-6 pb-16 pt-16 text-center md:pb-20 md:pt-24">
          <div class="relative mx-auto max-w-3xl">
            <HitkHeroOrb class="hitk-landing-hero-orb" />
            <p class="relative mb-5 text-xs font-medium uppercase tracking-[0.16em] text-gray-500 dark:text-dark-400">
              {{ isPrivate ? t('hitk.selfHosted') : 'Token API' }}
            </p>
            <div class="hitk-hero-heading" :class="{ 'has-price-tag': !isPrivate }">
              <h1
                class="relative text-5xl font-bold tracking-tight text-gray-900 md:text-7xl dark:text-white"
                :aria-label="isPrivate ? 'TokenOS' : undefined"
              >
                <span v-if="isPrivate" class="tokenos-title" aria-hidden="true"><span>Token</span><span class="tokenos-title-os">OS</span></span>
                <template v-else>{{ siteName }}</template>
              </h1>
              <span v-if="!isPrivate" class="hitk-price-tag">{{ t('hitk.priceTag') }}</span>
            </div>
            <p class="relative mx-auto mt-5 max-w-xl text-lg text-gray-600 dark:text-dark-300">
              {{ isPrivate ? t('hitk.platformSummary') : t('hitk.tagline') }}
            </p>
            <div class="relative mt-9 flex flex-wrap items-center justify-center gap-3">
              <a :href="isPrivate ? platformHref : tokenHref" class="btn btn-primary px-7 py-3 text-base">
                {{ t('hitk.contactSales') }}
                <Icon name="arrowRight" size="md" :stroke-width="2" />
              </a>
              <router-link v-if="!isPrivate" :to="isAuthenticated ? dashboardPath : '/login'" class="btn btn-secondary px-7 py-3 text-base">
                {{ isAuthenticated ? t('home.goToDashboard') : t('hitk.customerLogin') }}
              </router-link>
            </div>
          </div>
        </section>

        <!-- Token API -->
        <section v-if="!isPrivate" id="token-api" class="px-6 pb-20 pt-12 md:pt-16">
          <div class="mx-auto max-w-6xl">
            <div class="flex flex-col items-center gap-14 lg:flex-row lg:items-center">
              <div class="min-w-0 flex-1">
                <p class="text-xs font-medium uppercase tracking-[0.14em] text-gray-500 dark:text-dark-400">{{ t('hitk.tokenEyebrow') }}</p>
                <h2 class="mt-3 text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl dark:text-white">{{ t('hitk.tokenTitle') }}</h2>
                <p class="mt-4 max-w-lg text-gray-600 dark:text-dark-300">
                  {{ t('hitk.tokenDescription') }}
                </p>
                <ul class="mt-8 space-y-6">
                  <li v-for="point in tokenPoints" :key="point.title" class="flex gap-4">
                    <span class="hitk-landing-icon"><Icon :name="point.icon" size="md" /></span>
                    <span>
                      <span class="block font-semibold text-gray-900 dark:text-white">{{ point.title }}</span>
                      <span class="mt-1 block text-sm text-gray-600 dark:text-dark-300">{{ point.text }}</span>
                    </span>
                  </li>
                </ul>
                <div class="mt-9 flex flex-wrap items-center gap-4">
                  <a :href="tokenHref" class="btn btn-primary px-6 py-2.5">{{ t('hitk.requestAccess') }}</a>
                  <router-link
                    :to="isAuthenticated ? dashboardPath : '/login'"
                    class="text-sm text-gray-600 hover:text-gray-900 dark:text-dark-300 dark:hover:text-white"
                  >
                    {{ isAuthenticated ? t('home.goToDashboard') : t('hitk.existingCustomer') }}
                  </router-link>
                </div>
              </div>
              <div class="flex w-full min-w-0 flex-1 flex-col items-center lg:items-end">
                <HitkIntegrations :is-dark="isDark" class="max-w-[520px]" />
              </div>
            </div>

            <div class="mt-20">
              <p class="text-center text-xs font-medium uppercase tracking-[0.14em] text-gray-500 dark:text-dark-400">
                {{ t('hitk.availableModels') }}
              </p>
              <ul class="hitk-model-grid mt-10">
                <li
                  v-for="model in models"
                  :key="model.id"
                  class="hitk-landing-model min-w-0 py-2"
                >
                  <HitkModelCard :model="model" />
                </li>
              </ul>
              <p class="mt-8 text-center text-sm text-gray-500 dark:text-dark-400">
                {{ t('hitk.moreModels') }}
                <router-link
                  v-if="showModelPlazaEntry"
                  to="/model-plaza"
                  class="ml-1 inline-flex items-center gap-1 font-medium text-gray-900 hover:underline dark:text-white"
                >
                  {{ t('hitk.browseModels') }} <Icon name="arrowRight" size="sm" :stroke-width="2" />
                </router-link>
              </p>
            </div>
          </div>
        </section>

        <!-- Private API Platform -->
        <section v-else id="private-platform" class="px-6 pb-20 pt-12 md:pt-16">
          <div class="mx-auto max-w-6xl">
            <div class="hitk-landing-panel relative overflow-hidden px-6 py-14 md:px-12">
              <div class="hitk-landing-platform-orb" aria-hidden="true">
                <ThinkingOrb state="working" :size="460" :speed="0.35" organic :theme="isDark ? 'dark' : 'light'" />
              </div>
              <div class="relative max-w-2xl">
                <h2 class="text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl dark:text-white">
                  {{ t('hitk.platformTitle') }}
                </h2>
                <p class="mt-4 text-gray-600 dark:text-dark-300">
                  {{ t('hitk.platformDescription') }}
                </p>
              </div>
              <div class="relative mt-10 grid gap-5 md:grid-cols-3">
                <div v-for="point in platformPoints" :key="point.title" class="hitk-landing-card p-6">
                  <span class="hitk-landing-icon"><Icon :name="point.icon" size="md" /></span>
                  <h3 class="mt-4 font-semibold text-gray-900 dark:text-white">{{ point.title }}</h3>
                  <p class="mt-2 text-sm text-gray-600 dark:text-dark-300">{{ point.text }}</p>
                </div>
              </div>
            </div>

            <HitkPlatformFeatures :is-dark="isDark" class="mt-24" />

            <div class="hitk-landing-panel mt-24 px-6 py-12 text-center md:px-12">
              <h2 class="text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl dark:text-white">
                {{ t('hitk.os.ctaTitle') }}
              </h2>
              <p class="mx-auto mt-3 max-w-xl text-gray-600 dark:text-dark-300">{{ t('hitk.os.ctaText') }}</p>
              <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
                <a :href="platformHref" class="btn btn-primary px-7 py-3 text-base">
                  <Icon name="mail" size="md" />
                  {{ t('hitk.contactSales') }}
                </a>
                <span class="text-sm text-gray-600 dark:text-dark-300">{{ contactEmail }}</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Transition>

    <footer class="relative z-10 border-t border-gray-200/70 px-6 py-8 dark:border-dark-800">
      <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 text-sm text-gray-500 dark:text-dark-400">
        <span>&copy; {{ year }} {{ siteName }}</span>
        <div class="flex items-center gap-5">
          <a :href="`mailto:${contactEmail}`" class="hover:text-gray-900 dark:hover:text-white">{{ contactEmail }}</a>
          <a
            v-if="docUrl"
            :href="docUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-gray-900 dark:hover:text-white"
          >
            {{ t('home.docs') }}
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.hitk-hero-heading {
  position: relative;
  width: fit-content;
  max-width: 100%;
  margin-inline: auto;
}
.hitk-hero-heading.has-price-tag { margin-top: 40px; }
.hitk-price-tag {
  position: absolute;
  right: -32px;
  bottom: calc(100% - 6px);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 9px;
  border: 1px solid #c4c4c4;
  border-radius: 5px 8px 8px 5px;
  background: var(--hitk-secondary-fill);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.85), 0 2px 5px rgb(0 0 0 / 0.08);
  color: #404040;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.015em;
  white-space: nowrap;
  transform: rotate(-8deg);
  transform-origin: left bottom;
}
.hitk-price-tag::before {
  content: '';
  width: 4px;
  height: 4px;
  flex-shrink: 0;
  border: 1px solid #a3a3a3;
  border-radius: 50%;
  background: rgb(0 0 0 / 0.04);
}
.dark .hitk-price-tag {
  border-color: #646464;
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.12), 0 2px 6px rgb(0 0 0 / 0.2);
  color: #f5f5f5;
}
.dark .hitk-price-tag::before {
  border-color: #a3a3a3;
  background: rgb(0 0 0 / 0.2);
}
@media (min-width: 640px) {
  .hitk-hero-heading.has-price-tag { margin-top: 0; }
  .hitk-price-tag { right: -54px; gap: 8px; padding: 7px 11px; font-size: 14px; }
}
@media (forced-colors: active) {
  .hitk-price-tag { background: Canvas; border-color: CanvasText; color: CanvasText; box-shadow: none; }
}
.tokenos-title {
  display: inline-flex;
  align-items: baseline;
}
/* A fixed metal face with a continuous light pass: only the reflection moves. */
.tokenos-title-os {
  --tokenos-ink: #202124;
  --tokenos-metal: linear-gradient(180deg, #50565e 0%, #17191d 42%, #3c4148 72%, #202124 100%);
  --tokenos-reflection: linear-gradient(110deg, transparent 36%, rgb(112 121 133 / 0.3) 44%, #7b8490 50%, rgb(112 121 133 / 0.3) 56%, transparent 64%);
  position: relative;
  display: inline-block;
  color: var(--tokenos-ink);
}
.dark .tokenos-title-os {
  --tokenos-ink: #e5e7eb;
  --tokenos-metal: linear-gradient(180deg, #fff 0%, #b6bec9 44%, #e7ebf0 76%, #c5ccd5 100%);
  --tokenos-reflection: linear-gradient(110deg, transparent 36%, rgb(255 255 255 / 0.3) 44%, #fff 50%, rgb(255 255 255 / 0.3) 56%, transparent 64%);
}
@supports (background-clip: text) or (-webkit-background-clip: text) {
  .tokenos-title-os {
    background: var(--tokenos-metal);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .tokenos-title-os::after {
    content: 'OS';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image: var(--tokenos-reflection);
    background-size: 250% 100%;
    background-repeat: no-repeat;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: tokenos-light-pass 5.6s linear infinite;
    animation-delay: -1.4s;
  }
}
@keyframes tokenos-light-pass {
  from { background-position: 120% 0; }
  to { background-position: -20% 0; }
}
@media (prefers-reduced-motion: reduce) {
  .tokenos-title-os::after { animation: none; background-position: 50% 0; }
}
@media (forced-colors: active) {
  .tokenos-title-os { background: none; color: CanvasText; }
  .tokenos-title-os::after { content: none; animation: none; }
}
.hitk-landing-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 1.25rem 0.5rem;
}
.hitk-landing-header > :last-child {
  grid-column: 2;
  grid-row: 1;
}
.hitk-service-switch {
  position: relative;
  isolation: isolate;
  display: grid;
  grid-template-columns: auto auto;
  grid-column: 1 / -1;
  grid-row: 2;
  justify-self: center;
  max-width: 100%;
  gap: 0.25rem;
  padding: 0.25rem;
  border: 1px solid rgb(229 229 229 / 0.85);
  border-radius: 999px;
  background: linear-gradient(145deg, rgb(250 250 250 / 0.95), rgb(237 237 237 / 0.9));
}
.hitk-service-link {
  position: relative;
  z-index: 1;
  min-width: 0;
  border-radius: 999px;
  padding: 0.625rem 1rem;
  color: rgb(115 115 115);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25rem;
  text-align: center;
  white-space: nowrap;
  transition: color 160ms ease, background-color 160ms ease, box-shadow 160ms ease, filter 160ms ease;
}
.hitk-service-link:hover {
  color: rgb(23 23 23);
}
.hitk-service-link.is-active {
  color: rgb(23 23 23);
}
.hitk-service-link:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 3px;
}
.dark .hitk-service-switch {
  border-color: rgb(38 38 38);
  background: var(--hitk-dark-surface);
}
.dark .hitk-service-link {
  color: rgb(163 163 163);
}
.dark .hitk-service-link:hover,
.dark .hitk-service-link.is-active {
  color: white;
}
.hitk-service-enter-active,
.hitk-service-leave-active {
  transition: opacity 140ms ease;
}
.hitk-service-enter-from,
.hitk-service-leave-to {
  opacity: 0;
}
@media (min-width: 1280px) {
  .hitk-landing-header {
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    column-gap: 1.5rem;
  }
  .hitk-service-switch {
    grid-column: 2;
    grid-row: 1;
  }
  .hitk-landing-header > :last-child {
    grid-column: 3;
  }
}
@media (max-width: 359px) {
  .hitk-landing-brand-mark {
    display: none;
  }
  .hitk-service-link {
    padding-inline: 0.75rem;
  }
}
@media (prefers-reduced-motion: reduce) {
  .hitk-service-link,
  .hitk-service-enter-active,
  .hitk-service-leave-active {
    transition: none;
  }
}
.hitk-landing-card {
  border-radius: 1rem;
  border: 1px solid rgb(229 229 229 / 0.8);
  background: linear-gradient(145deg, rgb(255 255 255 / 0.95), rgb(247 247 247 / 0.85));
  backdrop-filter: blur(8px);
  transition: border-color 160ms ease, box-shadow 160ms ease;
}
.dark .hitk-landing-card {
  border-color: rgb(38 38 38);
  background: linear-gradient(145deg, rgb(37 37 37 / 0.95), rgb(22 22 22 / 0.9));
}
.hitk-landing-panel {
  border-radius: 1.5rem;
  border: 1px solid rgb(229 229 229 / 0.8);
  background: linear-gradient(145deg, rgb(255 255 255 / 0.7), rgb(245 245 245 / 0.65));
}
.dark .hitk-landing-panel {
  border-color: rgb(38 38 38);
  background: linear-gradient(145deg, rgb(31 31 31 / 0.8), rgb(16 16 16 / 0.75));
}
.hitk-landing-icon {
  display: inline-flex;
  height: 2.5rem;
  width: 2.5rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  background: var(--hitk-ink-gradient);
  color: rgb(255 255 255);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.15);
}
.dark .hitk-landing-icon {
  background: var(--hitk-pearl-gradient);
  color: rgb(10 10 10);
}
.hitk-model-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2.5rem 1rem;
}
.hitk-landing-model {
  display: flex;
  width: calc((100% - 1rem) / 2);
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: rgb(38 38 38);
}
.dark .hitk-landing-model {
  color: rgb(229 229 229);
}
@media (hover: hover) and (pointer: fine) {
  .hitk-service-link:hover {
    box-shadow: inset 0 0 0 1px var(--hitk-hover-outline), 0 2px 5px rgb(0 0 0 / 0.04);
  }
  .hitk-landing-card:hover {
    border-color: rgb(163 163 163 / 0.5);
    box-shadow: 0 5px 16px rgb(0 0 0 / 0.045);
  }
  .dark .hitk-landing-card:hover {
    border-color: rgb(115 115 115 / 0.55);
    box-shadow: 0 5px 16px rgb(0 0 0 / 0.16);
  }
}
@media (prefers-reduced-motion: reduce) {
  .hitk-landing-card {
    transition: none;
  }
}
@media (min-width: 640px) {
  .hitk-landing-model {
    width: calc((100% - 2rem) / 3);
  }
}
@media (min-width: 1280px) {
  .hitk-landing-model {
    width: calc((100% - 5rem) / 6);
  }
}
.hitk-landing-hero-orb {
  opacity: 0.3;
}
.hitk-landing-platform-orb {
  pointer-events: none;
  position: absolute;
  right: -7rem;
  top: 50%;
  opacity: 0.35;
  transform: translateY(-50%);
}
@media (max-width: 767px) {
  .hitk-landing-platform-orb {
    right: -12rem;
    opacity: 0.2;
  }
}
</style>
