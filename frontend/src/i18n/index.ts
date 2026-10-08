import { createI18n } from 'vue-i18n'
import { nextTick, readonly, ref } from 'vue'

type LocaleCode = 'en' | 'zh' | 'zh-TW' | 'ja'

type LocaleMessages = Record<string, any>

const LOCALE_KEY = 'sub2api_locale'
const DEFAULT_LOCALE: LocaleCode = 'en'

const localeLoaders: Record<LocaleCode, () => Promise<{ default: LocaleMessages }>> = {
  en: () => import('./locales/en'),
  zh: () => import('./locales/zh'),
  'zh-TW': () => import('./locales/zh-TW'),
  ja: () => import('./locales/ja')
}

function isLocaleCode(value: string): value is LocaleCode {
  return value === 'en' || value === 'zh' || value === 'zh-TW' || value === 'ja'
}

function getDefaultLocale(): LocaleCode {
  try {
    const saved = localStorage.getItem(LOCALE_KEY)
    if (saved && isLocaleCode(saved)) return saved
  } catch {
    // Language selection still works when browser storage is unavailable.
  }

  const browserLang = navigator.language.toLowerCase()
  if (browserLang === 'ja' || browserLang.startsWith('ja-')) return 'ja'
  const subtags = browserLang.split('-')
  if (subtags[0] === 'zh') {
    // An explicit script takes precedence over the region (e.g. zh-Hans-HK).
    if (subtags.includes('hans')) return 'zh'
    if (subtags.includes('hant') || subtags.some(tag => ['tw', 'hk', 'mo'].includes(tag))) return 'zh-TW'
    return 'zh'
  }
  if (browserLang === 'yue' || browserLang.startsWith('yue-')) {
    return 'zh-TW'
  }

  return DEFAULT_LOCALE
}

export const i18n = createI18n({
  legacy: false,
  locale: getDefaultLocale(),
  fallbackLocale: DEFAULT_LOCALE,
  messages: {},
  // 禁用 HTML 消息警告 - 引导步骤使用富文本内容（driver.js 支持 HTML）
  // 这些内容是内部定义的，不存在 XSS 风险
  warnHtmlMessage: false
})

const loadedLocales = new Set<LocaleCode>()
const pendingLocales = new Map<LocaleCode, Promise<void>>()
const switching = ref(false)
const loading = ref(false)
// Keep every switch visible for at least a second, including the 100ms fade-in.
const LOCALE_LOADING_MIN_MS = 1000

export const isLocaleSwitching = readonly(switching)
export const isLocaleLoading = readonly(loading)

export async function loadLocaleMessages(locale: LocaleCode): Promise<void> {
  if (loadedLocales.has(locale)) {
    return
  }

  // Hover/focus prefetch and a subsequent click share the same request.
  let pending = pendingLocales.get(locale)
  if (!pending) {
    pending = localeLoaders[locale]().then((module) => {
      i18n.global.setLocaleMessage(locale, module.default)
      loadedLocales.add(locale)
    }).finally(() => {
      pendingLocales.delete(locale)
    })
    pendingLocales.set(locale, pending)
  }
  await pending
}

export function prefetchLocale(locale: string): void {
  if (isLocaleCode(locale)) {
    // A failed speculative request must not change the page or show an error.
    void loadLocaleMessages(locale).catch(() => {})
  }
}

async function paintLocaleLoading(): Promise<void> {
  await nextTick()
  if (document.hidden) return
  // Let the white screen and orb begin fading in before loading the module.
  await new Promise<void>((resolve) => {
    let frame = 0
    const finish = () => {
      clearTimeout(timeout)
      cancelAnimationFrame(frame)
      resolve()
    }
    // Background tabs can stop animation frames between the two callbacks.
    const timeout = setTimeout(finish, 100)
    frame = requestAnimationFrame(() => { frame = requestAnimationFrame(finish) })
  })
}

export async function initI18n(): Promise<void> {
  const current = getLocale()
  await loadLocaleMessages(current)
  document.documentElement.setAttribute('lang', current)
}

export async function setLocale(locale: string): Promise<void> {
  if (!isLocaleCode(locale) || locale === getLocale() || switching.value) {
    return
  }

  switching.value = true
  loading.value = true
  let minimumTransition = Promise.resolve()
  try {
    await paintLocaleLoading()
    minimumTransition = new Promise<void>((resolve) => setTimeout(resolve, LOCALE_LOADING_MIN_MS))

    // Prepare everything before committing the new language; failures leave the
    // current messages, preference and document language intact.
    const [, { resolveRouteDocumentTitle }, { default: router }, { useAppStore }, { useAuthStore }, { useAdminSettingsStore }] = await Promise.all([
      loadLocaleMessages(locale),
      import('@/router/title'),
      import('@/router'),
      import('@/stores/app'),
      import('@/stores/auth'),
      import('@/stores/adminSettings')
    ])
    // Cached languages get the same short transition. Commit only once the
    // overlay is fully opaque, so changing text cannot show through the fade.
    await minimumTransition
    i18n.global.locale.value = locale
    try {
      localStorage.setItem(LOCALE_KEY, locale)
    } catch {
      // Keep the current session usable even when preferences cannot be saved.
    }
    document.documentElement.setAttribute('lang', locale)

    const route = router.currentRoute.value
    const appStore = useAppStore()
    const authStore = useAuthStore()
    const adminSettingsStore = useAdminSettingsStore()
    const customMenuItems = [
      ...(appStore.cachedPublicSettings?.custom_menu_items ?? []),
      ...(authStore.isAdmin ? adminSettingsStore.customMenuItems : []),
    ]
    document.title = resolveRouteDocumentTitle(route, appStore.siteName, customMenuItems)
    // Keep the overlay until Vue has rendered the translated page beneath it.
    await nextTick()
  } finally {
    // A quick load failure should also finish its entrance before fading out.
    await minimumTransition
    loading.value = false
    switching.value = false
  }
}

export function getLocale(): LocaleCode {
  const current = i18n.global.locale.value
  return isLocaleCode(current) ? current : DEFAULT_LOCALE
}

export const availableLocales = [
  { code: 'en', name: 'English', shortName: 'EN', loadError: 'Could not load the language. Please refresh and try again.' },
  { code: 'zh', name: '简体中文', shortName: '简中', loadError: '语言加载失败，请刷新页面后重试。' },
  { code: 'zh-TW', name: '繁體中文', shortName: '繁中', loadError: '語言載入失敗，請重新整理頁面後再試。' },
  { code: 'ja', name: '日本語', shortName: '日本語', loadError: '言語を読み込めませんでした。ページを再読み込みしてお試しください。' }
] as const

export default i18n
