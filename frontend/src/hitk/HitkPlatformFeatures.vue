<script setup lang="ts">
// TokenOS capability showcase: an illustrative deployment diagram, feature groups and rollout steps.
// Each claim maps to an existing platform capability (see docs/hitk/PLAN.md); verify before adding new ones.
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Icon from '@/components/icons/Icon.vue'
import ThinkingOrb from './ThinkingOrb.vue'
import { modelLogos, type ModelLogoKey } from './modelLogos'

defineProps<{ isDark: boolean }>()
const { t } = useI18n()

const clients = computed(() => [
  { icon: 'terminal', name: 'Claude Code' },
  { icon: 'terminal', name: 'Codex' },
  { icon: 'terminal', name: 'Gemini CLI' },
  { icon: 'cube', name: t('hitk.os.archApps') }
] as const)

const layers = computed(() => [
  { icon: 'key', text: t('hitk.os.layerAccess') },
  { icon: 'swap', text: t('hitk.os.layerRouting') },
  { icon: 'dollar', text: t('hitk.os.layerBudgets') },
  { icon: 'chartBar', text: t('hitk.os.layerLogs') }
] as const)

const providers: { logo: ModelLogoKey; name: string }[] = [
  { logo: 'Claude', name: 'Anthropic' },
  { logo: 'OpenAI', name: 'OpenAI' },
  { logo: 'Gemini', name: 'Google' },
  { logo: 'Grok', name: 'xAI' }
]

const features = computed(() => [
  {
    icon: 'globe', title: t('hitk.os.unifiedTitle'), text: t('hitk.os.unifiedText'),
    points: [t('hitk.os.unifiedPoint1'), t('hitk.os.unifiedPoint2'), t('hitk.os.unifiedPoint3')]
  },
  {
    icon: 'swap', title: t('hitk.os.routingTitle'), text: t('hitk.os.routingText'),
    points: [t('hitk.os.routingPoint1'), t('hitk.os.routingPoint2'), t('hitk.os.routingPoint3')]
  },
  {
    icon: 'key', title: t('hitk.os.accessTitle'), text: t('hitk.os.accessText'),
    points: [t('hitk.os.accessPoint1'), t('hitk.os.accessPoint2'), t('hitk.os.accessPoint3')]
  },
  {
    icon: 'dollar', title: t('hitk.os.budgetsTitle'), text: t('hitk.os.budgetsText'),
    points: [t('hitk.os.budgetsPoint1'), t('hitk.os.budgetsPoint2'), t('hitk.os.budgetsPoint3')]
  },
  {
    icon: 'shield', title: t('hitk.os.securityTitle'), text: t('hitk.os.securityText'),
    points: [t('hitk.os.securityPoint1'), t('hitk.os.securityPoint2'), t('hitk.os.securityPoint3')]
  },
  {
    icon: 'chartBar', title: t('hitk.os.opsTitle'), text: t('hitk.os.opsText'),
    points: [t('hitk.os.opsPoint1'), t('hitk.os.opsPoint2'), t('hitk.os.opsPoint3')]
  }
] as const)

const steps = computed(() => [
  { title: t('hitk.os.step1Title'), text: t('hitk.os.step1Text') },
  { title: t('hitk.os.step2Title'), text: t('hitk.os.step2Text') },
  { title: t('hitk.os.step3Title'), text: t('hitk.os.step3Text') },
  { title: t('hitk.os.step4Title'), text: t('hitk.os.step4Text') }
])
</script>

<template>
  <div class="os-showcase" data-testid="tokenos-features">
    <!-- How TokenOS sits inside the enterprise environment -->
    <section class="os-section" aria-labelledby="tokenos-architecture-title">
      <div class="os-heading">
        <p class="os-eyebrow">{{ t('hitk.os.archEyebrow') }}</p>
        <h2 id="tokenos-architecture-title" class="os-title">{{ t('hitk.os.archTitle') }}</h2>
        <p class="os-lead">{{ t('hitk.os.archDescription') }}</p>
      </div>
      <figure class="os-arch">
        <div class="os-arch-flow">
          <div class="os-arch-boundary">
            <p class="os-arch-boundary-label"><Icon name="lock" size="sm" />{{ t('hitk.os.archBoundary') }}</p>
            <div class="os-arch-inner">
              <div class="os-arch-node">
                <p class="os-arch-label">{{ t('hitk.os.archClients') }}</p>
                <ul class="os-arch-list">
                  <li v-for="client in clients" :key="client.name"><Icon :name="client.icon" size="sm" />{{ client.name }}</li>
                </ul>
              </div>
              <span class="os-arch-link" aria-hidden="true"><span></span></span>
              <div class="os-arch-core">
                <div class="os-arch-core-head">
                  <span class="os-arch-core-orb" aria-hidden="true">
                    <ThinkingOrb state="connecting" :size="36" :theme="isDark ? 'dark' : 'light'" />
                  </span>
                  <span class="os-arch-core-name">
                    <strong>TokenOS</strong>
                    <small>{{ t('hitk.os.archEndpoint') }}</small>
                  </span>
                </div>
                <ul class="os-arch-layers">
                  <li v-for="layer in layers" :key="layer.text"><Icon :name="layer.icon" size="sm" />{{ layer.text }}</li>
                </ul>
                <p class="os-arch-store"><Icon name="database" size="sm" />{{ t('hitk.os.archStore') }}</p>
              </div>
            </div>
          </div>
          <span class="os-arch-link os-arch-link-out" aria-hidden="true"><span></span></span>
          <div class="os-arch-node os-arch-providers">
            <p class="os-arch-label">{{ t('hitk.os.archProviders') }}</p>
            <ul class="os-arch-logos">
              <li v-for="provider in providers" :key="provider.name">
                <svg :viewBox="modelLogos[provider.logo].viewBox" fill="currentColor" fill-rule="evenodd" aria-hidden="true">
                  <path v-for="(path, index) in modelLogos[provider.logo].paths" :key="index" :d="path.d" :fill-opacity="path.opacity" />
                </svg>
                <span>{{ provider.name }}</span>
              </li>
            </ul>
            <p class="os-arch-more">{{ t('hitk.os.archMore') }}</p>
          </div>
        </div>
        <figcaption class="os-arch-caption">{{ t('hitk.os.archCaption') }}</figcaption>
      </figure>
    </section>

    <!-- Feature groups -->
    <section class="os-section" aria-labelledby="tokenos-features-title">
      <div class="os-heading">
        <p class="os-eyebrow">{{ t('hitk.os.featuresEyebrow') }}</p>
        <h2 id="tokenos-features-title" class="os-title">{{ t('hitk.os.featuresTitle') }}</h2>
        <p class="os-lead">{{ t('hitk.os.featuresDescription') }}</p>
      </div>
      <ul class="os-feature-grid">
        <li v-for="feature in features" :key="feature.title" class="os-card os-feature">
          <span class="os-icon"><Icon :name="feature.icon" size="md" /></span>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.text }}</p>
          <ul class="os-points">
            <li v-for="point in feature.points" :key="point"><Icon name="check" size="sm" :stroke-width="2" />{{ point }}</li>
          </ul>
        </li>
      </ul>
    </section>

    <!-- Rollout -->
    <section class="os-section" aria-labelledby="tokenos-rollout-title">
      <div class="os-heading">
        <p class="os-eyebrow">{{ t('hitk.os.stepsEyebrow') }}</p>
        <h2 id="tokenos-rollout-title" class="os-title">{{ t('hitk.os.stepsTitle') }}</h2>
      </div>
      <ol class="os-steps">
        <li v-for="(step, index) in steps" :key="step.title" class="os-step">
          <span class="os-step-index" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
          <h3>{{ step.title }}</h3>
          <p>{{ step.text }}</p>
        </li>
      </ol>
    </section>
  </div>
</template>

<style scoped>
.os-showcase {
  display: grid;
  gap: 6rem;
}
.os-heading {
  max-width: 42rem;
  margin-inline: auto;
  text-align: center;
}
.os-eyebrow {
  color: rgb(115 115 115);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.os-title {
  margin-top: 0.75rem;
  color: rgb(23 23 23);
  font-size: 1.875rem;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.025em;
  text-wrap: balance;
}
.os-lead {
  margin-top: 1rem;
  color: rgb(82 82 82);
  text-wrap: pretty;
}
.dark .os-eyebrow { color: rgb(163 163 163); }
.dark .os-title { color: white; }
.dark .os-lead { color: rgb(212 212 212); }
@media (min-width: 768px) {
  /* Wide enough to break CJK headings only at punctuation, so words such as 安全 stay whole. */
  .os-title { font-size: 2.25rem; word-break: keep-all; overflow-wrap: anywhere; }
}

/* Shared surfaces, matching the landing page cards and icons. */
.os-card {
  border: 1px solid rgb(229 229 229 / 0.8);
  border-radius: 1rem;
  background: linear-gradient(145deg, rgb(255 255 255 / 0.95), rgb(247 247 247 / 0.85));
  backdrop-filter: blur(8px);
  transition: border-color 160ms ease, box-shadow 160ms ease;
}
.dark .os-card {
  border-color: rgb(38 38 38);
  background: linear-gradient(145deg, rgb(37 37 37 / 0.95), rgb(22 22 22 / 0.9));
}
.os-icon {
  display: inline-flex;
  width: 2.5rem;
  height: 2.5rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  background: var(--hitk-ink-gradient);
  color: white;
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.15);
}
.dark .os-icon {
  background: var(--hitk-pearl-gradient);
  color: rgb(10 10 10);
}

/* Deployment diagram */
.os-arch {
  margin-top: 3rem;
}
.os-arch-flow {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.os-arch-boundary {
  position: relative;
  padding: 2.75rem 1rem 1rem;
  border: 1.5px dashed rgb(163 163 163 / 0.8);
  border-radius: 1.5rem;
  background: rgb(255 255 255 / 0.45);
}
.dark .os-arch-boundary {
  border-color: rgb(82 82 82);
  background: rgb(23 23 23 / 0.45);
}
.os-arch-boundary-label {
  position: absolute;
  top: 0.875rem;
  left: 1.125rem;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: rgb(82 82 82);
  font-size: 0.75rem;
  font-weight: 600;
}
.dark .os-arch-boundary-label { color: rgb(212 212 212); }
.os-arch-inner {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.os-arch-node,
.os-arch-core {
  min-width: 0;
  padding: 1.125rem;
  border: 1px solid rgb(229 229 229 / 0.9);
  border-radius: 1rem;
  background: linear-gradient(145deg, rgb(255 255 255 / 0.96), rgb(247 247 247 / 0.9));
}
.dark .os-arch-node,
.dark .os-arch-core {
  border-color: rgb(38 38 38);
  background: linear-gradient(145deg, rgb(37 37 37 / 0.96), rgb(22 22 22 / 0.92));
}
.os-arch-label {
  color: rgb(115 115 115);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.dark .os-arch-label { color: rgb(163 163 163); }
.os-arch-list,
.os-arch-layers {
  display: grid;
  gap: 0.5rem;
  margin-top: 0.75rem;
}
.os-arch-list li,
.os-arch-layers li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  padding: 0.5rem 0.75rem;
  border: 1px solid rgb(229 229 229);
  border-radius: 0.625rem;
  background: rgb(250 250 250);
  color: rgb(38 38 38);
  font-size: 0.875rem;
  font-weight: 500;
}
.dark .os-arch-list li,
.dark .os-arch-layers li {
  border-color: rgb(52 52 52);
  background: rgb(28 28 28);
  color: rgb(229 229 229);
}
.os-arch-list li :deep(svg),
.os-arch-layers li :deep(svg) {
  flex-shrink: 0;
  color: rgb(115 115 115);
}
.dark .os-arch-list li :deep(svg),
.dark .os-arch-layers li :deep(svg) { color: rgb(163 163 163); }
.os-arch-core {
  border-color: rgb(163 163 163 / 0.55);
  box-shadow: 0 10px 30px rgb(0 0 0 / 0.06);
}
.dark .os-arch-core {
  border-color: rgb(82 82 82);
  box-shadow: 0 10px 30px rgb(0 0 0 / 0.3);
}
.os-arch-core-head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.os-arch-core-orb {
  display: inline-flex;
  width: 2.75rem;
  height: 2.75rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 0.875rem;
  background: var(--hitk-light-surface);
  box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.06);
}
.dark .os-arch-core-orb {
  background: var(--hitk-dark-surface);
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.08);
}
.os-arch-core-name {
  display: grid;
  min-width: 0;
}
.os-arch-core-name strong {
  color: rgb(23 23 23);
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}
.os-arch-core-name small {
  color: rgb(115 115 115);
  font-size: 0.75rem;
}
.dark .os-arch-core-name strong { color: white; }
.dark .os-arch-core-name small { color: rgb(163 163 163); }
.os-arch-layers li {
  background: white;
}
.dark .os-arch-layers li { background: rgb(33 33 33); }
.os-arch-store {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.875rem;
  color: rgb(82 82 82);
  font-size: 0.8125rem;
}
.dark .os-arch-store { color: rgb(212 212 212); }
.os-arch-logos {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;
  margin-top: 0.75rem;
}
.os-arch-logos li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  padding: 0.5rem 0.625rem;
  border: 1px solid rgb(229 229 229);
  border-radius: 0.625rem;
  background: rgb(250 250 250);
  color: rgb(38 38 38);
  font-size: 0.8125rem;
  font-weight: 500;
}
.dark .os-arch-logos li {
  border-color: rgb(52 52 52);
  background: rgb(28 28 28);
  color: rgb(229 229 229);
}
.os-arch-logos svg {
  width: 1.125rem;
  height: 1.125rem;
  flex-shrink: 0;
}
.os-arch-logos span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.os-arch-more {
  margin-top: 0.625rem;
  color: rgb(115 115 115);
  font-size: 0.75rem;
}
.dark .os-arch-more { color: rgb(163 163 163); }
.os-arch-caption {
  max-width: 42rem;
  margin: 1.25rem auto 0;
  color: rgb(115 115 115);
  font-size: 0.8125rem;
  text-align: center;
  text-wrap: pretty;
}
.dark .os-arch-caption { color: rgb(163 163 163); }

/* Request flow connectors: vertical on narrow screens, horizontal on wide ones. */
.os-arch-link {
  position: relative;
  align-self: center;
  width: 2px;
  height: 2rem;
  flex-shrink: 0;
  background: repeating-linear-gradient(180deg, rgb(163 163 163) 0 4px, transparent 4px 8px);
}
.dark .os-arch-link {
  background: repeating-linear-gradient(180deg, rgb(115 115 115) 0 4px, transparent 4px 8px);
}
.os-arch-link > span {
  position: absolute;
  left: 50%;
  top: 0;
  width: 6px;
  height: 6px;
  margin-left: -3px;
  border-radius: 999px;
  background: rgb(38 38 38);
  animation: os-flow-down 1.8s ease-in-out infinite;
}
.dark .os-arch-link > span { background: rgb(245 245 245); }
@keyframes os-flow-down {
  from { transform: translateY(0); opacity: 0; }
  20%, 80% { opacity: 1; }
  to { transform: translateY(calc(2rem - 6px)); opacity: 0; }
}
@keyframes os-flow-right {
  from { transform: translateX(0); opacity: 0; }
  20%, 80% { opacity: 1; }
  to { transform: translateX(calc(2.5rem - 6px)); opacity: 0; }
}
@media (min-width: 1024px) {
  .os-arch-flow,
  .os-arch-inner {
    flex-direction: row;
    align-items: center;
  }
  .os-arch-boundary {
    flex: 1 1 0;
    min-width: 0;
    padding: 3rem 1.5rem 1.5rem;
  }
  .os-arch-inner > .os-arch-node { flex: 0.85 1 0; }
  .os-arch-inner > .os-arch-core { flex: 1.15 1 0; }
  .os-arch-providers { flex: 0 0 13.5rem; }
  .os-arch-logos { grid-template-columns: minmax(0, 1fr); }
  .os-arch-link {
    width: 2.5rem;
    height: 2px;
    background: repeating-linear-gradient(90deg, rgb(163 163 163) 0 4px, transparent 4px 8px);
  }
  .dark .os-arch-link {
    background: repeating-linear-gradient(90deg, rgb(115 115 115) 0 4px, transparent 4px 8px);
  }
  .os-arch-link > span {
    left: 0;
    top: 50%;
    margin-left: 0;
    margin-top: -3px;
    animation-name: os-flow-right;
  }
}
@media (min-width: 640px) and (max-width: 1023px) {
  .os-arch-logos { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

/* Feature groups */
.os-feature-grid {
  display: grid;
  gap: 1.25rem;
  margin-top: 3rem;
}
.os-feature {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
}
.os-feature h3 {
  margin-top: 1rem;
  color: rgb(23 23 23);
  font-weight: 600;
}
.os-feature > p {
  margin-top: 0.5rem;
  color: rgb(82 82 82);
  font-size: 0.875rem;
}
.dark .os-feature h3 { color: white; }
.dark .os-feature > p { color: rgb(212 212 212); }
.os-points {
  display: grid;
  gap: 0.5rem;
  margin-top: 1.125rem;
  padding-top: 1.125rem;
  border-top: 1px solid rgb(229 229 229 / 0.9);
}
.dark .os-points { border-top-color: rgb(38 38 38); }
.os-points li {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  color: rgb(64 64 64);
  font-size: 0.875rem;
}
.dark .os-points li { color: rgb(212 212 212); }
.os-points li :deep(svg) {
  flex-shrink: 0;
  margin-top: 0.1875rem;
  color: rgb(115 115 115);
}
.dark .os-points li :deep(svg) { color: rgb(163 163 163); }
@media (min-width: 768px) {
  .os-feature-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (min-width: 1024px) {
  .os-feature-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

/* Rollout steps */
.os-steps {
  display: grid;
  gap: 1.25rem;
  margin-top: 3rem;
  counter-reset: none;
}
.os-step {
  position: relative;
  padding: 1.5rem 0 0;
  border-top: 1px solid rgb(212 212 212);
}
.dark .os-step { border-top-color: rgb(52 52 52); }
.os-step-index {
  color: rgb(163 163 163);
  font-size: 0.875rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.04em;
}
.dark .os-step-index { color: rgb(115 115 115); }
.os-step h3 {
  margin-top: 0.5rem;
  color: rgb(23 23 23);
  font-weight: 600;
}
.os-step p {
  margin-top: 0.5rem;
  color: rgb(82 82 82);
  font-size: 0.875rem;
}
.dark .os-step h3 { color: white; }
.dark .os-step p { color: rgb(212 212 212); }
@media (min-width: 768px) {
  .os-steps { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2rem; }
}
@media (min-width: 1024px) {
  .os-steps { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

@media (hover: hover) and (pointer: fine) {
  .os-card:hover {
    border-color: rgb(163 163 163 / 0.5);
    box-shadow: 0 5px 16px rgb(0 0 0 / 0.045);
  }
  .dark .os-card:hover {
    border-color: rgb(115 115 115 / 0.55);
    box-shadow: 0 5px 16px rgb(0 0 0 / 0.16);
  }
}
@media (prefers-reduced-motion: reduce) {
  .os-card { transition: none; }
  .os-arch-link > span { animation: none; opacity: 0; }
}
@media (forced-colors: active) {
  .os-arch-link,
  .dark .os-arch-link { background: CanvasText; }
  .os-arch-link > span { display: none; }
}
</style>
