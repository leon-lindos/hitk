<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { isLocaleLoading } from '@/i18n'
import ThinkingOrb from './ThinkingOrb.vue'

const { t } = useI18n()
let page: HTMLElement | null = null
let wasInert = false
let previousFocus: HTMLElement | null = null

function lockPage() {
  if (page) return
  previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
  page = document.getElementById('app')
  if (page) {
    wasInert = page.hasAttribute('inert')
    page.setAttribute('inert', '')
  }
}

function restorePage() {
  if (page && !wasInert) page.removeAttribute('inert')
  page = null
  if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true })
  previousFocus = null
}

onBeforeUnmount(restorePage)
</script>

<template>
  <Teleport to="body">
    <Transition name="locale-loading" @before-enter="lockPage" @after-leave="restorePage">
      <div
        v-if="isLocaleLoading"
        class="hitk-locale-loading"
        role="status"
        aria-live="polite"
        @wheel.prevent
        @touchmove.prevent
      >
        <ThinkingOrb state="working" :size="144" theme="light" :speed="0.8" organic />
        <span class="sr-only">{{ t('common.loading') }}</span>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.hitk-locale-loading {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: grid;
  place-content: center;
  background: #fff;
  color: #171717;
  cursor: wait;
  touch-action: none;
  overscroll-behavior: none;
}

/* Cover the old language quickly, then reveal the translated page just as fast. */
.locale-loading-enter-active,
.locale-loading-leave-active {
  transition: opacity 100ms ease-out;
}

.locale-loading-enter-from,
.locale-loading-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .locale-loading-enter-active,
  .locale-loading-leave-active {
    transition: none;
  }
}
</style>
