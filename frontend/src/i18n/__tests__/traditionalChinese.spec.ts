import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import zh from '../locales/zh'
import zhTW from '../locales/zh-TW'
import ja from '../locales/ja'
import en from '../locales/en'
import { zhTW as hitkMessages } from '@/hitk/locale-messages'

vi.mock('@/router', () => ({
  default: {
    currentRoute: { value: { name: 'Login', params: {}, meta: { titleKey: 'home.login' } } }
  }
}))
vi.mock('@/stores/app', () => ({
  useAppStore: () => ({ siteName: 'Hi, Token', cachedPublicSettings: null })
}))
vi.mock('@/stores/auth', () => ({ useAuthStore: () => ({ isAdmin: false }) }))
vi.mock('@/stores/adminSettings', () => ({ useAdminSettingsStore: () => ({ customMenuItems: [] }) }))
vi.mock('@/api/admin/compliance', () => ({
  default: { accept: vi.fn(async () => ({ required: false })) }
}))

beforeEach(() => {
  vi.resetModules()
  // Match production's CSP-safe JIT for this integration suite only.
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

describe('Hi, Token language preferences', () => {
  it.each(['zh-TW', 'zh-HK', 'zh-MO', 'zh-Hant', 'zh-Hant-TW', 'zh-Hant-CN', 'yue-HK'])(
    'uses Traditional Chinese for browser language %s', async (language) => {
      vi.spyOn(navigator, 'language', 'get').mockReturnValue(language)
      const { getLocale, initI18n } = await import('../index')
      await initI18n()
      expect(getLocale()).toBe('zh-TW')
      expect(document.documentElement.lang).toBe('zh-TW')
    }
  )

  it.each(['en', 'zh', 'zh-TW', 'ja'])('respects a saved %s preference on reload', async (saved) => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue(saved === 'en' ? 'zh-HK' : 'en-US')
    localStorage.setItem('sub2api_locale', saved)
    const { getLocale, initI18n } = await import('../index')
    await initI18n()
    expect(getLocale()).toBe(saved)
    expect(document.documentElement.lang).toBe(saved)
  })

  it('keeps the upstream Simplified Chinese preference', async () => {
    localStorage.setItem('sub2api_locale', 'zh')
    expect((await import('../index')).getLocale()).toBe('zh')
  })

  it.each([
    ['zh', 'zh'], ['zh-CN', 'zh'], ['zh-SG', 'zh'], ['zh-Hans', 'zh'],
    ['zh-Hans-HK', 'zh'], ['zh-Hans-TW', 'zh'], ['ja', 'ja'], ['ja-JP', 'ja']
  ])('matches browser language %s to %s', async (language, expected) => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue(language)
    const { getLocale, initI18n } = await import('../index')
    await initI18n()
    expect(getLocale()).toBe(expected)
    expect(document.documentElement.lang).toBe(expected)
  })

  it('falls back to English for an unsupported preference and browser language', async () => {
    localStorage.setItem('sub2api_locale', 'invalid')
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('fr-FR')
    const { getLocale, setLocale } = await import('../index')
    await setLocale('unsupported')
    expect(getLocale()).toBe('en')
  })

  it('switches messages, title and document language and saves the selection', async () => {
    const { i18n, initI18n, setLocale } = await import('../index')
    await initI18n()
    await setLocale('zh-TW')
    expect(i18n.global.t('common.save')).toBe('儲存')
    expect(i18n.global.t('common.selectedCount', { count: 3 })).toContain('3')
    expect(document.title).toBe('登入 - Hi, Token')
    expect(document.documentElement.lang).toBe('zh-TW')
    expect(localStorage.getItem('sub2api_locale')).toBe('zh-TW')
    await setLocale('en')
    expect(i18n.global.t('common.save')).toBe('Save')
    expect(document.title).toBe('Login - Hi, Token')
  })

  it.each([
    ['zh', '保存', '登录'], ['ja', '保存', 'ログイン']
  ])('switches to %s with working interpolation and a localized title', async (code, save, login) => {
    const { i18n, initI18n, setLocale } = await import('../index')
    await initI18n()
    await setLocale(code)
    expect(i18n.global.t('common.save')).toBe(save)
    expect(i18n.global.t('auth.signUpToStart', { siteName: 'Hi, Token' })).toContain('Hi, Token')
    expect(i18n.global.t('common.selectedCount', { count: 3 })).toContain('3')
    expect(document.title).toBe(`${login} - Hi, Token`)
    expect(document.documentElement.lang).toBe(code)
    expect(localStorage.getItem('sub2api_locale')).toBe(code)
  })

  it('works when storage access is denied', async () => {
    vi.spyOn(localStorage, 'getItem').mockImplementation(() => { throw new Error('Denied') })
    vi.spyOn(localStorage, 'setItem').mockImplementation(() => { throw new Error('Denied') })
    const { initI18n, setLocale, getLocale } = await import('../index')
    await initI18n()
    await setLocale('zh-TW')
    expect(getLocale()).toBe('zh-TW')
    expect(document.title).toBe('登入 - Hi, Token')
  })

  it.each([
    ['zh-TW', '我已阅读、理解并同意 Sub2API 部署与运营合规承诺'],
    ['zh', '我已阅读、理解并同意 Sub2API 部署与运营合规承诺'],
    ['ja', 'I have read, understood, and agree to the Sub2API Deployment and Operation Compliance Commitment']
  ])('keeps the %s compliance acknowledgment consistent with the backend contract', async (code, phrase) => {
    const { createPinia, setActivePinia } = await import('pinia')
    const { setLocale } = await import('../index')
    const { useAdminComplianceStore } = await import('@/stores/adminCompliance')
    const { default: complianceAPI } = await import('@/api/admin/compliance')
    setActivePinia(createPinia())
    await setLocale(code)
    const store = useAdminComplianceStore()
    store.requireAcknowledgement()
    // The source agreement's exact phrase must not be translated or rebranded.
    expect(store.expectedPhrase).toBe(phrase)
    await store.accept(store.expectedPhrase)
    expect(complianceAPI.accept).toHaveBeenCalledWith({
      phrase: store.expectedPhrase,
      language: code
    })
    store.$dispose()
  })
})

describe('Traditional Chinese content', () => {
  it('keeps the authored landing copy intact', () => {
    expect(zhTW.hitk).toEqual(hitkMessages.hitk)
  })

  it('preserves interpolation variables and every mention of Hi, Token', () => {
    function check(source: Record<string, unknown>, translated: Record<string, unknown>) {
      for (const [key, value] of Object.entries(source)) {
        if (typeof value === 'string') {
          const target = translated[key] as string
          const placeholders = /\{(?:[a-zA-Z_]\w*|\d+)\}/g
          // Japanese grammar can reorder named variables; preserve their identity and count.
          expect((target.match(placeholders) ?? []).sort(), key).toEqual((value.match(placeholders) ?? []).sort())
          expect(target.match(/Hi, Token/g), key).toEqual(value.match(/Hi, Token/g))
        } else {
          check(value as Record<string, unknown>, translated[key] as Record<string, unknown>)
        }
      }
    }
    check(zh, zhTW)
    check(en, ja)
  })

  it('preserves onboarding HTML and technical identifiers in Japanese', async () => {
    function check(source: Record<string, unknown>, translated: Record<string, unknown>) {
      for (const [key, value] of Object.entries(source)) {
        if (typeof value === 'string') {
          const target = translated[key] as string
          const tags = /<\/?(?:div|p|b|strong|span|ul|li|br|em|code|a)(?:\s[^>]*|\/?)>/g
          expect(target.match(tags), key).toEqual(value.match(tags))
          const identifiers = /\b(?:read:user|user:email|image_generation|image_gen)\b|\/(?:v1|responses|messages)(?:\/[a-z]+)*/g
          for (const identifier of value.match(identifiers) ?? []) {
            expect(target, key).toContain(identifier)
          }
        } else {
          check(value as Record<string, unknown>, translated[key] as Record<string, unknown>)
        }
      }
    }
    check(en, ja)
    const { japaneseInline } = await import('@/hitk/inline-ja')
    const githubHint = japaneseInline('GitHub OAuth App 需要 read:user user:email 权限，回调地址填写下方后端地址。')
    expect(githubHint).toContain('read:user')
    expect(githubHint).toContain('user:email')
    expect(japaneseInline('Google OAuth 客户端需要 openid email profile 范围，并在凭据里登记后端回调地址。')).toContain('openid email profile')
  })

  it('switches the landing page through the visible language menu without changing the brand or destinations', async () => {
    const { i18n, initI18n } = await import('../index')
    const { default: HitkLanding } = await import('@/hitk/HitkLanding.vue')
    const { default: LocaleSwitcher } = await import('@/components/common/LocaleSwitcher.vue')
    await initI18n()
    const wrapper = mount(HitkLanding, {
      props: {
        siteName: 'Hi, Token', siteLogo: '', docUrl: '/docs', showModelPlazaEntry: true,
        isAuthenticated: false, dashboardPath: '/dashboard', userInitial: '', isDark: false
      },
      global: {
        plugins: [i18n],
        stubs: { RouterLink: RouterLinkStub, HitkBackdrop: true, HitkHeroOrb: true, HitkLogo: true, ThinkingOrb: true }
      }
    })
    try {
      expect(wrapper.text()).toContain('Stable, secure, affordable AI APIs for business.')
      const switcher = wrapper.getComponent(LocaleSwitcher)
      expect(switcher.isVisible()).toBe(true)
      await switcher.get('button').trigger('click')
      expect(switcher.text()).toContain('English')
      await switcher.findAll('button').find(button => button.text() === '繁體中文')!.trigger('click')
      await vi.waitFor(() => expect(switcher.get('button').attributes('disabled')).toBeUndefined(), { timeout: 2000 })
      await flushPromises()
      expect(wrapper.get('h1').text()).toBe('Hi, Token')
      expect(wrapper.text()).toContain('穩定、安全、價格實惠的企業級 AI API。')
      expect(wrapper.text()).toContain('聯絡業務')
      expect(wrapper.text()).toContain('搭配團隊慣用的工具')
      expect(wrapper.text()).toContain('Seedream · Seedance')
      expect(wrapper.text()).not.toContain('圖像 · 影片')
      expect(wrapper.text()).toContain('# 設定 API 網址與金鑰')
      expect(wrapper.text()).not.toContain('Contact sales')
      expect(wrapper.findAll('a').map(link => link.attributes('href'))).toContain('mailto:contact@hitk.ai?subject=Token%20API%20access')
      expect(wrapper.findAllComponents(RouterLinkStub).some(link => link.props('to') === '/login')).toBe(true)
      expect(localStorage.getItem('sub2api_locale')).toBe('zh-TW')
      await switcher.get('button').trigger('click')
      await switcher.findAll('button').find(button => button.text() === 'English')!.trigger('click')
      await vi.waitFor(() => expect(switcher.get('button').attributes('disabled')).toBeUndefined(), { timeout: 2000 })
      await flushPromises()
      expect(wrapper.text()).toContain("Works with your team's tools")
      expect(wrapper.text()).toContain('Nano Banana')
      expect(wrapper.text()).not.toContain('Image · Video')
      expect(wrapper.get('h1').text()).toBe('Hi, Token')
      for (const [name, code, tagline, tools, terminal] of [
        ['简体中文', 'zh', '稳定、安全、价格实惠的企业级 AI API。', '适配团队常用的工具', '# 配置 API 地址与密钥'],
        ['日本語', 'ja', '安定性と安全性を備えた、手頃な価格の企業向け AI API。', 'チームが使い慣れたツールと連携', '# API の接続先とキーを設定']
      ]) {
        await switcher.get('button').trigger('click')
        await switcher.findAll('button').find(button => button.text() === name)!.trigger('click')
        await vi.waitFor(() => expect(switcher.get('button').attributes('disabled')).toBeUndefined(), { timeout: 2000 })
        await flushPromises()
        expect(wrapper.get('h1').text()).toBe('Hi, Token')
        expect(wrapper.text()).toContain(tagline)
        expect(wrapper.text()).toContain(tools)
        expect(wrapper.text()).toContain(terminal)
        expect(localStorage.getItem('sub2api_locale')).toBe(code)
        expect(document.documentElement.lang).toBe(code)
      }
    } finally {
      wrapper.unmount()
    }
  })
})
