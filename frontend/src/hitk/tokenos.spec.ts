import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'

vi.mock('@/router', () => ({
  default: {
    currentRoute: { value: { name: 'PrivatePlatform', params: {}, meta: { titleKey: 'hitk.privatePlatform' } } }
  }
}))
vi.mock('@/stores/app', () => ({
  useAppStore: () => ({ siteName: 'Hi, Token', cachedPublicSettings: null })
}))
vi.mock('@/stores/auth', () => ({ useAuthStore: () => ({ isAdmin: false }) }))
vi.mock('@/stores/adminSettings', () => ({ useAdminSettingsStore: () => ({ customMenuItems: [] }) }))

beforeEach(() => {
  vi.resetModules()
  vi.stubGlobal('__INTLIFY_JIT_COMPILATION__', true)
  localStorage.clear()
  vi.spyOn(navigator, 'language', 'get').mockReturnValue('en-US')
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  localStorage.clear()
  document.documentElement.lang = 'en'
})

async function mountPlatformPage() {
  const { i18n, initI18n, setLocale } = await import('@/i18n')
  const { default: HitkLanding } = await import('./HitkLanding.vue')
  await initI18n()
  const wrapper = mount(HitkLanding, {
    props: {
      service: 'private-platform',
      siteName: 'Hi, Token', siteLogo: '', docUrl: '', showModelPlazaEntry: false,
      isAuthenticated: false, dashboardPath: '/dashboard', userInitial: '', isDark: false
    },
    global: {
      plugins: [i18n],
      stubs: { RouterLink: RouterLinkStub, HitkBackdrop: true, HitkHeroOrb: true, HitkLogo: true, ThinkingOrb: true, LocaleSwitcher: true }
    }
  })
  return { wrapper, setLocale }
}

describe('TokenOS page', () => {
  it('names the product TokenOS in the hero and the service switch', async () => {
    const { wrapper } = await mountPlatformPage()
    try {
      const heading = wrapper.get('h1')
      expect(heading.attributes('aria-label')).toBe('TokenOS')
      expect(heading.text().replace(/\s/g, '')).toBe('TokenOS')
      expect(wrapper.get('nav').text()).toContain('TokenOS')
      expect(wrapper.text()).not.toMatch(/Hi, ?TKOS/)
      expect(wrapper.find('.hitk-price-tag').exists()).toBe(false)
    } finally {
      wrapper.unmount()
    }
  })

  it('shows the architecture, six feature groups, four rollout steps and one contact link', async () => {
    const { wrapper } = await mountPlatformPage()
    try {
      const features = wrapper.get('[data-testid="tokenos-features"]')
      expect(features.text()).toContain('Enterprise private environment')
      expect(features.text()).toContain('Single API endpoint')
      expect(features.findAll('.os-feature')).toHaveLength(6)
      for (const card of features.findAll('.os-feature')) {
        expect(card.findAll('.os-points li')).toHaveLength(3)
      }
      expect(features.findAll('.os-step')).toHaveLength(4)
      expect(wrapper.text()).toContain('Deploy TokenOS in the enterprise environment')
      const contacts = wrapper.findAll('a').filter(link => link.attributes('href')?.startsWith('mailto:contact@hitk.ai?'))
      expect(contacts.map(link => link.attributes('href'))).toEqual([
        'mailto:contact@hitk.ai?subject=TokenOS%20private%20API%20platform',
        'mailto:contact@hitk.ai?subject=TokenOS%20private%20API%20platform'
      ])
    } finally {
      wrapper.unmount()
    }
  })

  it('switches the showcase copy with the language', async () => {
    const { wrapper, setLocale } = await mountPlatformPage()
    try {
      for (const [locale, boundary, feature, cta] of [
        ['zh', '企业私有环境', '调度与故障切换', '在企业环境中部署 TokenOS'],
        ['zh-TW', '企業私有環境', '排程與故障切換', '在企業環境中部署 TokenOS'],
        ['ja', '企業のプライベート環境', 'スケジューリングとフェイルオーバー', '企業環境に TokenOS を導入']
      ] as const) {
        await setLocale(locale)
        await flushPromises()
        expect(wrapper.text()).toContain(boundary)
        expect(wrapper.text()).toContain(feature)
        expect(wrapper.text()).toContain(cta)
        expect(wrapper.get('nav').text()).toContain('TokenOS')
        expect(wrapper.get('h1').attributes('aria-label')).toBe('TokenOS')
        expect(document.title).toBe('TokenOS - Hi, Token')
      }
    } finally {
      wrapper.unmount()
    }
  }, 10000)
})
