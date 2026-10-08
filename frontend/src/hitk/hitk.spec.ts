// Guards the HiTK touch points inside upstream components, so an upstream merge that overwrites them shows up here.
import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import HitkLogo from './HitkLogo.vue'
import ThinkingOrb from './ThinkingOrb.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return { ...actual, useI18n: () => ({ t: (key: string) => key }) }
})

describe('HiTK thinking orbs', () => {
  it('LoadingSpinner draws a working orb and keeps the loading status', () => {
    const wrapper = mount(LoadingSpinner, { props: { size: 'lg', color: 'white' } })
    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.text()).toContain('common.loading')
    const orb = wrapper.findComponent(ThinkingOrb)
    expect(orb.props()).toMatchObject({ state: 'working', size: 48, theme: 'dark' })
    expect(orb.find('canvas').attributes('aria-hidden')).toBe('true')
  })

  it('EmptyState falls back to a connecting orb when no icon is given', () => {
    const wrapper = mount(EmptyState, { props: { title: 'Empty' }, global: { stubs: { RouterLink: true } } })
    expect(wrapper.findComponent(ThinkingOrb).props('state')).toBe('connecting')
  })

  it('HitkLogo prefers the custom logo and otherwise shows the orb', () => {
    const custom = mount(HitkLogo, { props: { src: '/custom.png' } })
    expect(custom.find('img').attributes('src')).toBe('/custom.png')
    expect(custom.findComponent(ThinkingOrb).exists()).toBe(false)

    const fallback = mount(HitkLogo, { props: { orbSize: 52 } })
    expect(fallback.find('img').exists()).toBe(false)
    expect(fallback.findComponent(ThinkingOrb).props()).toMatchObject({ state: 'connecting', size: 52 })
  })

  it('ThinkingOrb sizes its canvas to any pixel size', () => {
    const wrapper = mount(ThinkingOrb, { props: { state: 'connecting', size: 500, label: 'Network' } })
    const canvas = wrapper.find('canvas')
    expect(canvas.attributes('style')).toContain('width: 500px')
    expect(canvas.attributes('role')).toBe('img')
    expect(canvas.attributes('aria-label')).toBe('Network')
  })
})
