<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Icon from '@/components/icons/Icon.vue'
import ThinkingOrb from './ThinkingOrb.vue'
import { modelLogos } from './modelLogos'

defineProps<{ active: boolean; isDark: boolean }>()
const { t } = useI18n()
// Illustrative dashboard values only; no account or usage data is requested by the landing page.
const keys = [
  { name: 'prod-claude', logo: 'Claude' },
  { name: 'prod-gpt', logo: 'OpenAI' },
  { name: 'prod-gemini', logo: 'Gemini' }
] as const
</script>

<template>
  <div class="platform-preview" data-testid="hitk-platform-preview">
    <div class="platform-intro">
      <div class="platform-intro-copy">
        <p class="platform-eyebrow">{{ t('hitk.platformConsole') }}</p>
        <p class="platform-brand">Hi, Token</p>
        <p class="platform-description">{{ t('hitk.platformConsoleSummary') }}</p>
      </div>
      <span class="platform-orb" aria-hidden="true">
        <ThinkingOrb state="working" organic :size="100" :speed="0.7" :theme="isDark ? 'dark' : 'light'" :paused="!active" />
      </span>
    </div>

    <dl class="platform-stats">
      <div><dt>{{ t('hitk.platformKeyCount') }}</dt><dd>3</dd></div>
      <div><dt>{{ t('hitk.platformModelCount') }}</dt><dd>12</dd></div>
      <div><dt>{{ t('hitk.platformTokenCount') }}</dt><dd>128<span>K</span></dd></div>
    </dl>

    <div class="platform-endpoint">
      <Icon name="globe" size="sm" />
      <span class="platform-endpoint-label">{{ t('hitk.endpointLabel') }}</span>
      <code>https://hitk.ai</code>
    </div>

    <div class="platform-key-heading">
      <span>{{ t('hitk.platformKeyCount') }}</span>
      <span>{{ t('hitk.platformExample') }}</span>
    </div>
    <ul class="platform-keys">
      <li v-for="key in keys" :key="key.name">
        <span class="platform-key-icon" aria-hidden="true">
          <svg :viewBox="modelLogos[key.logo].viewBox" fill="currentColor" fill-rule="evenodd">
            <path v-for="(path, index) in modelLogos[key.logo].paths" :key="index" :d="path.d" :fill-opacity="path.opacity" />
          </svg>
        </span>
        <span class="platform-key-detail"><strong>{{ key.name }}</strong><code>sk-••••••••••••</code></span>
        <span class="platform-key-status"><span aria-hidden="true"></span>{{ t('hitk.platformKeyActive') }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.platform-preview {
  padding: 18px 24px 20px;
  background: var(--preview-panel);
  color: var(--preview-text);
}
.platform-intro {
  display: flex;
  min-height: 100px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.platform-intro-copy { min-width: 0; }
.platform-eyebrow { color: var(--preview-muted); font-size: 10px; }
.platform-brand { margin-top: 4px; font-size: 23px; font-weight: 650; letter-spacing: -0.04em; }
.platform-description { margin-top: 5px; color: var(--preview-muted); font-size: 10px; line-height: 1.7; }
.platform-orb { flex-shrink: 0; }
.platform-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin-top: 12px; }
.platform-stats > div { display: flex; flex-direction: column; border: 1px solid var(--preview-border); border-radius: 8px; padding: 10px 12px; background: var(--preview-surface-fill); }
.platform-stats dt { color: var(--preview-muted); font-size: 10px; }
.platform-stats dd { margin-top: auto; padding-top: 4px; font-size: 19px; font-weight: 600; line-height: 1.2; font-variant-numeric: tabular-nums; }
.platform-stats dd span { margin-left: 2px; font-size: 12px; }
.platform-endpoint { display: flex; flex-wrap: wrap; align-items: center; gap: 7px; margin-top: 17px; font-size: 10px; }
.platform-endpoint-label { color: var(--preview-muted); }
.platform-endpoint code { margin-left: auto; font-size: 11px; }
.platform-key-heading { display: flex; justify-content: space-between; gap: 10px; margin: 17px 0 8px; font-size: 10px; }
.platform-key-heading > span:last-child { color: var(--preview-muted); }
.platform-keys { overflow: hidden; border: 1px solid var(--preview-border); border-radius: 9px; }
.platform-keys li { display: flex; align-items: center; gap: 10px; padding: 10px 12px; }
.platform-keys li + li { border-top: 1px solid var(--preview-border); }
.platform-key-icon { display: flex; width: 25px; height: 25px; flex-shrink: 0; align-items: center; justify-content: center; border-radius: 6px; background: var(--preview-surface-fill); }
.platform-key-icon svg { width: 16px; height: 16px; }
.platform-key-detail { display: flex; min-width: 0; flex-direction: column; gap: 2px; }
.platform-key-detail strong { font-size: 11px; font-weight: 500; }
.platform-key-detail code { color: var(--preview-muted); font-size: 9px; }
.platform-key-status { display: flex; flex-shrink: 0; align-items: center; gap: 5px; margin-left: auto; color: var(--preview-muted); font-size: 9px; }
.platform-key-status > span { width: 4px; height: 4px; border-radius: 50%; background: currentColor; }
@media (max-width: 380px) {
  .platform-preview { padding: 16px; }
  .platform-stats { gap: 6px; }
  .platform-stats > div { padding: 10px 8px; }
  .platform-stats dd { font-size: 17px; }
  .platform-keys li { padding: 10px; }
}
</style>
