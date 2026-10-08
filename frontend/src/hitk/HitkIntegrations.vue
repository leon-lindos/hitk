<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Icon from '@/components/icons/Icon.vue'
import HitkTerminal from './HitkTerminal.vue'
import HitkPlatformPreview from './HitkPlatformPreview.vue'
import HitkSlidingIndicator from './HitkSlidingIndicator.vue'
import ThinkingOrb from './ThinkingOrb.vue'
import { modelLogos } from './modelLogos'
import ccSwitchLogo from './cc-switch-logo.svg'
import magpieLogo from './magpie-logo.svg'

withDefaults(defineProps<{ isDark?: boolean }>(), { isDark: false })
const { t } = useI18n()
const tabs = [
  { id: 'hitk', name: 'Hi, Token', logo: null, caption: 'hitkCaption' },
  { id: 'cli', name: 'CLI', logo: null, caption: 'cliCaption' },
  { id: 'ccswitch', name: 'CC Switch', logo: ccSwitchLogo, caption: 'ccCaption' },
  { id: 'magpie', name: 'Magpie', logo: magpieLogo, caption: 'magpieCaption' }
] as const
type Integration = typeof tabs[number]['id']
const activeTab = ref<Integration>('hitk')
const activeIntegration = computed(() => tabs.find(tab => tab.id === activeTab.value) ?? tabs[0])
const agentModels = [
  { agent: 'Claude Code', model: 'Claude', logo: 'Claude' },
  { agent: 'Codex', model: 'GPT', logo: 'OpenAI' },
  { agent: 'Gemini CLI', model: 'Gemini', logo: 'Gemini' }
] as const

function onTabKeydown(event: KeyboardEvent, index: number) {
  let next: number
  switch (event.key) {
    case 'ArrowRight': next = (index + 1) % tabs.length; break
    case 'ArrowLeft': next = (index + tabs.length - 1) % tabs.length; break
    case 'Home': next = 0; break
    case 'End': next = tabs.length - 1; break
    default: return
  }
  event.preventDefault()
  activeTab.value = tabs[next].id
  const button = event.currentTarget as HTMLButtonElement
  button.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus()
}
</script>

<template>
  <div class="hitk-integrations" data-testid="hitk-integrations">
    <h3 class="mb-4 text-sm font-semibold text-gray-900 dark:text-white">{{ t('hitk.toolsTitle') }}</h3>
    <div class="integration-tabs" role="tablist" :aria-label="t('hitk.integrationTabs')">
      <HitkSlidingIndicator :value="activeTab" />
      <button
        v-for="(tab, index) in tabs"
        :id="`hitk-integration-tab-${tab.id}`"
        :key="tab.id"
        type="button"
        role="tab"
        :aria-selected="activeTab === tab.id"
        :aria-controls="`hitk-integration-panel-${tab.id}`"
        :tabindex="activeTab === tab.id ? 0 : -1"
        @click="activeTab = tab.id"
        @keydown="onTabKeydown($event, index)"
      >
        <ThinkingOrb v-if="tab.id === 'hitk'" state="connecting" :size="18" :speed="0.6" :theme="isDark ? 'dark' : 'light'" />
        <img v-else-if="tab.logo" :src="tab.logo" alt="" aria-hidden="true" class="tool-logo" :class="{ 'magpie-mark': tab.id === 'magpie' }" />
        <Icon v-else name="terminal" size="sm" />
        {{ tab.name }}
      </button>
    </div>

    <div class="integration-window" :class="{ 'is-terminal': activeTab === 'cli' }">
      <div class="window-chrome">
        <div class="window-lights" aria-hidden="true"><span></span><span></span><span></span></div>
        <span class="window-name">
          <ThinkingOrb v-if="activeTab === 'hitk'" state="connecting" :size="16" :speed="0.6" :theme="isDark ? 'dark' : 'light'" />
          <img v-else-if="activeIntegration.logo" :src="activeIntegration.logo" alt="" aria-hidden="true" class="tool-logo" :class="{ 'magpie-mark': activeTab === 'magpie' }" />
          {{ activeTab === 'cli' ? 'Terminal' : activeIntegration.name }}
        </span>
        <span class="preview-label">{{ t('hitk.integrationPreview') }}</span>
      </div>

      <!-- Overlaid grid cells reserve the tallest preview at every width and locale, so tabs never move the page. -->
      <div class="integration-stage">
        <div
          v-for="tab in tabs"
          :id="`hitk-integration-panel-${tab.id}`"
          :key="tab.id"
          role="tabpanel"
          :aria-labelledby="`hitk-integration-tab-${tab.id}`"
          :aria-hidden="activeTab !== tab.id"
          :inert="activeTab !== tab.id"
          :tabindex="activeTab === tab.id ? 0 : -1"
          class="integration-panel"
          :class="{ 'is-active': activeTab === tab.id }"
        >
          <HitkPlatformPreview v-if="tab.id === 'hitk'" :active="activeTab === 'hitk'" :is-dark="isDark" />
          <HitkTerminal v-else-if="tab.id === 'cli'" />

          <div v-else-if="tab.id === 'ccswitch'" class="app-preview cc-preview">
            <div class="client-strip" aria-hidden="true">
              <span class="selected">Claude Code</span><span>Codex</span><span>Gemini CLI</span>
            </div>
            <div class="preview-heading">
              <Icon name="download" size="md" />
              <span>{{ t('hitk.ccImportTitle') }}</span>
            </div>
            <dl class="config-fields">
              <div>
                <dt>{{ t('hitk.providerName') }}</dt>
                <dd class="provider-value"><span class="provider-monogram" aria-hidden="true">Hi,</span> Hi, Token</dd>
              </div>
              <div>
                <dt>{{ t('hitk.endpointLabel') }}</dt>
                <dd class="mono">https://hitk.ai</dd>
              </div>
              <div>
                <dt>API Key</dt>
                <dd class="mono muted">sk-••••••••••••••••</dd>
              </div>
            </dl>
            <div class="import-note"><Icon name="checkCircle" size="sm" />{{ t('hitk.ccImportNote') }}</div>
          </div>

          <div v-else class="app-preview magpie-preview">
            <div class="app-navigation" aria-hidden="true">
              <span>{{ t('hitk.magpieAgents') }}</span>
              <span class="selected">{{ t('hitk.magpieProviders') }}</span>
              <span>{{ t('hitk.magpieGateway') }}</span>
            </div>
            <div class="magpie-provider">
              <span class="provider-monogram" aria-hidden="true">Hi,</span>
              <span class="provider-details"><strong>Hi, Token</strong><span class="mono muted">https://hitk.ai</span></span>
              <Icon name="checkCircle" size="md" class="ml-auto shrink-0" />
            </div>
            <div class="provider-connection" aria-hidden="true"><span></span><Icon name="arrowDown" size="sm" /></div>
            <p class="agent-label">{{ t('hitk.magpieModels') }}</p>
            <ul class="agent-models">
              <li v-for="item in agentModels" :key="item.agent">
                <span class="agent-name">
                  <svg class="h-4 w-4 shrink-0" :viewBox="modelLogos[item.logo].viewBox" fill="currentColor" fill-rule="evenodd" aria-hidden="true">
                    <path v-for="(path, index) in modelLogos[item.logo].paths" :key="index" :d="path.d" :fill-opacity="path.opacity" />
                  </svg>
                  {{ item.agent }}
                </span>
                <span class="agent-model"><span class="muted">hitk /</span> {{ item.model }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="integration-captions">
      <p v-for="tab in tabs" :key="tab.id" :class="{ 'is-active': activeTab === tab.id }" :aria-hidden="activeTab !== tab.id">
        {{ t(`hitk.${tab.caption}`) }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.hitk-integrations {
  --preview-bg: #fff;
  --preview-surface: #f5f5f5;
  --preview-border: #e5e5e5;
  --preview-text: #262626;
  --preview-muted: #737373;
  --preview-panel: var(--hitk-light-surface);
  --preview-surface-fill: linear-gradient(145deg, #fafafa, #f0f0f0);
  --preview-contrast-fill: var(--hitk-ink-gradient);
  width: 100%;
  color: var(--preview-text);
}
.dark .hitk-integrations {
  --preview-bg: #171717;
  --preview-surface: #222;
  --preview-border: #353535;
  --preview-text: #e5e5e5;
  --preview-muted: #a3a3a3;
  --preview-panel: var(--hitk-dark-surface);
  --preview-surface-fill: linear-gradient(145deg, #303030, #222);
  --preview-contrast-fill: var(--hitk-pearl-gradient);
}
.integration-tabs { --hitk-switch-radius: 7px; position: relative; isolation: isolate; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 4px; margin-bottom: 16px; border: 1px solid var(--preview-border); border-radius: 11px; padding: 4px; background: var(--preview-surface-fill); }
.integration-tabs button { position: relative; z-index: 1; display: flex; min-width: 0; align-items: center; justify-content: center; gap: 7px; border-radius: 7px; padding: 10px 6px; color: var(--preview-muted); font-size: 12px; font-weight: 600; transition: background-color 160ms, color 160ms, box-shadow 160ms, filter 160ms; }
.integration-tabs button:hover { color: var(--preview-text); }
.integration-tabs button[aria-selected='true'] { color: var(--preview-text); }
.integration-tabs button:focus-visible, .integration-panel:focus-visible { outline: 2px solid #888; outline-offset: 3px; }
.integration-window { overflow: hidden; border: 1px solid var(--preview-border); border-radius: 14px; background: var(--preview-panel); box-shadow: 0 20px 55px -30px #00000065; }
.window-chrome { display: flex; min-height: 43px; align-items: center; gap: 12px; border-bottom: 1px solid var(--preview-border); padding: 10px 16px; background: var(--preview-surface-fill); font-size: 11px; transition: background 150ms; }
.window-lights { display: flex; gap: 5px; }
.window-lights span { width: 7px; height: 7px; border-radius: 50%; background: #a3a3a3; opacity: 0.6; }
.window-name { display: inline-flex; align-items: center; gap: 7px; font-weight: 600; }
.tool-logo { width: 18px; height: 18px; flex-shrink: 0; object-fit: contain; }
.window-name .tool-logo { width: 16px; height: 16px; }
.dark .magpie-mark { filter: invert(1); }
.preview-label { margin-left: auto; color: var(--preview-muted); font-size: 10px; }
.is-terminal .window-chrome { border-color: #303030; background: linear-gradient(145deg, #343434, #232323); color: #d4d4d4; }
.is-terminal .preview-label { color: #a3a3a3; }
.integration-stage, .integration-captions { display: grid; }
.integration-panel { grid-area: 1 / 1; min-width: 0; visibility: hidden; opacity: 0; transform: translateY(4px); transition: opacity 160ms ease, transform 160ms ease; }
.integration-panel.is-active { visibility: visible; opacity: 1; transform: translateY(0); }
.integration-panel > * { height: 100%; }
.app-preview { display: flex; min-height: 360px; flex-direction: column; padding: 20px 24px; background: var(--preview-panel); font-size: 12px; }
.client-strip, .app-navigation { display: flex; flex-wrap: wrap; align-items: center; gap: 5px; color: var(--preview-muted); font-size: 10px; }
.client-strip { margin-bottom: 21px; }
.client-strip span, .app-navigation span { border-radius: 5px; padding: 5px 9px; }
.client-strip .selected { background: var(--preview-contrast-fill); color: var(--preview-bg); }
.preview-heading { display: flex; align-items: center; gap: 8px; margin-bottom: 17px; font-size: 13px; font-weight: 600; }
.config-fields { display: grid; gap: 13px; }
.config-fields dt { margin-bottom: 5px; color: var(--preview-muted); font-size: 10px; }
.config-fields dd { display: flex; min-height: 36px; align-items: center; gap: 8px; border: 1px solid var(--preview-border); border-radius: 6px; padding: 7px 10px; overflow-wrap: anywhere; }
.provider-value { font-weight: 600; }
.provider-monogram { display: inline-flex; width: 23px; height: 23px; flex-shrink: 0; align-items: center; justify-content: center; border-radius: 6px; background: var(--preview-contrast-fill); color: var(--preview-bg); font-size: 10px; font-weight: 700; }
.mono { font-family: ui-monospace, monospace; font-size: 11px; }
.muted { color: var(--preview-muted); }
.import-note { display: flex; align-items: center; gap: 7px; margin-top: 17px; font-size: 10px; color: var(--preview-muted); }
.import-note svg { flex-shrink: 0; }
.magpie-preview { background: var(--preview-surface-fill); }
.app-navigation { margin-bottom: 23px; }
.app-navigation .selected { background: var(--preview-panel); color: var(--preview-text); box-shadow: 0 1px 3px #00000015; }
.magpie-provider { display: flex; align-items: center; gap: 12px; border: 1px solid var(--preview-border); border-radius: 9px; padding: 15px; background: var(--preview-panel); }
.magpie-provider .provider-monogram { width: 32px; height: 32px; font-size: 13px; }
.provider-details { display: flex; min-width: 0; flex-direction: column; gap: 3px; }
.provider-details .mono { overflow-wrap: anywhere; }
.provider-connection { display: flex; height: 34px; flex-direction: column; align-items: center; justify-content: center; color: var(--preview-muted); }
.provider-connection > span { height: 9px; border-left: 1px dashed var(--preview-muted); }
.agent-label { margin-bottom: 9px; color: var(--preview-muted); font-size: 10px; }
.agent-models { overflow: hidden; border: 1px solid var(--preview-border); border-radius: 9px; background: var(--preview-panel); }
.agent-models li { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 13px 12px; }
.agent-models li + li { border-top: 1px solid var(--preview-border); }
.agent-name { display: flex; align-items: center; gap: 8px; font-size: 11px; }
.agent-model { font-size: 10px; white-space: nowrap; }
.integration-captions { margin-top: 18px; }
.integration-captions p { grid-area: 1 / 1; visibility: hidden; color: var(--preview-muted); font-size: 12px; line-height: 1.8; }
.integration-captions p.is-active { visibility: visible; }
@media (max-width: 560px) {
  .integration-tabs { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 380px) {
  .integration-tabs button { gap: 5px; font-size: 11px; }
  .app-preview { padding: 20px 16px; }
  .agent-models li { padding: 13px 9px; }
  .agent-name { gap: 6px; font-size: 10px; }
}
@media (prefers-reduced-motion: reduce) {
  .integration-tabs button, .window-chrome, .integration-panel { transition: none; }
  .integration-panel { transform: none; }
}
</style>
