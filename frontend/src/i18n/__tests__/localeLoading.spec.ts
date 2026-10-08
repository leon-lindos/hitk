import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

const showError = vi.hoisted(() => vi.fn())
vi.mock('@/router', () => ({
  default: { currentRoute: { value: { name: 'Login', params: {}, meta: { titleKey: 'home.login' } } } }
}))
vi.mock('@/stores/app', () => ({
  useAppStore: () => ({ siteName: 'Hi, Token', cachedPublicSettings: null, showError })
}))
vi.mock('@/stores/auth', () => ({ useAuthStore: () => ({ isAdmin: false }) }))
vi.mock('@/stores/adminSettings', () => ({ useAdminSettingsStore: () => ({ customMenuItems: [] }) }))

function deferred() {
  let resolve!: () => void
  let reject!: (error: Error) => void
  const promise = new Promise<void>((yes, no) => { resolve = yes; reject = no })
  return { promise, resolve, reject }
}

beforeEach(() => {
  vi.resetModules()
  vi.clearAllMocks()
  vi.stubGlobal('__INTLIFY_JIT_COMPILATION__', true)
  localStorage.clear()
  localStorage.setItem('sub2api_locale', 'en')
  vi.doMock('../locales/en', () => ({ default: { common: { loading: 'Loading...' }, home: { login: 'Login' } } }))
  vi.doMock('../locales/ja', () => ({ default: { common: { loading: '読み込み中...' }, home: { login: 'ログイン' } } }))
})

afterEach(() => {
  vi.useRealTimers()
  vi.doUnmock('../locales/en')
  vi.doUnmock('../locales/ja')
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  localStorage.clear()
  document.documentElement.lang = 'en'
  document.body.innerHTML = ''
})

describe('language loading', () => {
  it('shares prefetch with an overlapping load without changing the active language', async () => {
    const gate = deferred()
    vi.doMock('../locales/ja', async () => { await gate.promise; return { default: { home: { login: 'ログイン' } } } })
    const { i18n, initI18n, prefetchLocale, loadLocaleMessages, getLocale, isLocaleLoading } = await import('../index')
    await initI18n()
    const register = vi.spyOn(i18n.global, 'setLocaleMessage')
    prefetchLocale('ja')
    const pending = loadLocaleMessages('ja')
    expect(isLocaleLoading.value).toBe(false)
    gate.resolve()
    await pending
    expect(register).toHaveBeenCalledTimes(1)
    expect(getLocale()).toBe('en')
    expect(localStorage.getItem('sub2api_locale')).toBe('en')
    expect(document.documentElement.lang).toBe('en')
  })

  it('briefly shows the overlay even for a prefetched language and keeps old text beneath the fade-in', async () => {
    const { initI18n, loadLocaleMessages, setLocale, isLocaleLoading, isLocaleSwitching, getLocale } = await import('../index')
    await initI18n()
    await loadLocaleMessages('ja')
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
    vi.useFakeTimers()
    const pending = setLocale('ja')
    expect(isLocaleLoading.value).toBe(true)
    expect(isLocaleSwitching.value).toBe(true)
    await flushPromises()
    await vi.advanceTimersByTimeAsync(999)
    expect(getLocale()).toBe('en')
    expect(document.documentElement.lang).toBe('en')
    expect(isLocaleLoading.value).toBe(true)
    await vi.advanceTimersByTimeAsync(1)
    await pending
    expect(getLocale()).toBe('ja')
    expect(document.title).toBe('ログイン - Hi, Token')
    expect(isLocaleLoading.value).toBe(false)
    expect(isLocaleSwitching.value).toBe(false)
  })

  it('keeps the old language while loading and blocks overlapping switches', async () => {
    const gate = deferred()
    vi.doMock('../locales/ja', async () => { await gate.promise; return { default: { home: { login: 'ログイン' } } } })
    const { initI18n, setLocale, isLocaleLoading, isLocaleSwitching, getLocale } = await import('../index')
    await initI18n()
    const pending = setLocale('ja')
    expect(isLocaleLoading.value).toBe(true)
    await setLocale('zh')
    expect(getLocale()).toBe('en')
    expect(localStorage.getItem('sub2api_locale')).toBe('en')
    expect(document.documentElement.lang).toBe('en')
    gate.resolve()
    await pending
    expect(getLocale()).toBe('ja')
    expect(isLocaleLoading.value).toBe(false)
    expect(isLocaleSwitching.value).toBe(false)
  })

  it('clears loading on failure, preserves the preference and allows switching after the loader recovers', async () => {
    vi.doMock('../locales/ja', () => { throw new Error('Offline') })
    const { initI18n, setLocale, isLocaleLoading, isLocaleSwitching, getLocale } = await import('../index')
    await initI18n()
    await expect(setLocale('ja')).rejects.toThrow()
    expect(isLocaleLoading.value).toBe(false)
    expect(isLocaleSwitching.value).toBe(false)
    expect(getLocale()).toBe('en')
    expect(document.documentElement.lang).toBe('en')
    expect(localStorage.getItem('sub2api_locale')).toBe('en')
    vi.doMock('../locales/ja', () => ({ default: { home: { login: 'ログイン' } } }))
    await setLocale('ja')
    expect(getLocale()).toBe('ja')
  })

  it('shows the orb during loading, blocks background focus and restores it after rendering', async () => {
    const gate = deferred()
    vi.doMock('../locales/ja', async () => { await gate.promise; return { default: { common: { loading: '読み込み中...' }, home: { login: 'ログイン' } } } })
    const { i18n, initI18n, setLocale } = await import('../index')
    const { default: Overlay } = await import('@/hitk/LocaleLoadingOverlay.vue')
    await initI18n()
    const page = document.createElement('div')
    page.id = 'app'
    const button = document.createElement('button')
    page.appendChild(button)
    document.body.appendChild(page)
    button.focus()
    const wrapper = mount(Overlay, {
      attachTo: page,
      global: { plugins: [i18n], stubs: { transition: false, ThinkingOrb: true } }
    })
    try {
      const pending = setLocale('ja')
      await vi.waitFor(() => expect(document.querySelector('[role="status"]')).not.toBeNull())
      expect(page.hasAttribute('inert')).toBe(true)
      const orb = document.querySelector('thinking-orb-stub')!
      expect(orb.getAttribute('state')).toBe('working')
      expect(orb.getAttribute('theme')).toBe('light')
      gate.resolve()
      await pending
      await vi.waitFor(() => expect(document.querySelector('[role="status"]')).toBeNull())
      expect(page.hasAttribute('inert')).toBe(false)
      expect(document.activeElement).toBe(button)
      expect(document.documentElement.lang).toBe('ja')
    } finally {
      gate.resolve()
      wrapper.unmount()
    }
  })

  it('closes the menu immediately and reports a failed switch in the current language', async () => {
    const gate = deferred()
    const load = vi.fn(async () => { await gate.promise; throw new Error('Offline') })
    vi.doMock('../locales/ja', load)
    const { i18n, initI18n, getLocale, isLocaleSwitching } = await import('../index')
    const { default: Switcher } = await import('@/components/common/LocaleSwitcher.vue')
    await initI18n()
    const wrapper = mount(Switcher, { global: { plugins: [i18n] } })
    try {
      await wrapper.get('button').trigger('click')
      await wrapper.findAll('button').find(button => button.text() === '日本語')!.trigger('click')
      expect(wrapper.get('button').attributes('aria-expanded')).toBe('false')
      expect(wrapper.get('button').attributes('disabled')).toBeDefined()
      await vi.waitFor(() => expect(load).toHaveBeenCalled())
      gate.resolve()
      await vi.waitFor(() => expect(showError).toHaveBeenCalledWith('Could not load the language. Please refresh and try again.'), { timeout: 2000 })
      await flushPromises()
      expect(isLocaleSwitching.value).toBe(false)
      expect(getLocale()).toBe('en')
      expect(wrapper.get('button').attributes('disabled')).toBeUndefined()
    } finally {
      gate.resolve()
      wrapper.unmount()
    }
  })
})
