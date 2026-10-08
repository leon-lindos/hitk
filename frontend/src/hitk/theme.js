// HiTK 墨色主题：在 sub2api 原有的 tailwind 配置上覆盖颜色和装饰，原配置一字不动，方便跟进上游。
// 主色指向 hitk.css 里的变量（深色模式另有一套）；灰阶、accent、dark 换成纯中性灰，和 orbs 的灰阶一致。

const neutral = {
  50: '#fafafa',
  100: '#f5f5f5',
  200: '#e5e5e5',
  300: '#d4d4d4',
  400: '#a3a3a3',
  500: '#737373',
  600: '#525252',
  700: '#404040',
  800: '#262626',
  900: '#171717',
  950: '#0a0a0a'
}

const ink = Object.fromEntries(
  [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((step) => [
    step,
    `rgb(var(--hitk-primary-${step}) / <alpha-value>)`
  ])
)

const softShadow = '0 0 0 1px rgba(0, 0, 0, 0.06), 0 4px 14px rgba(0, 0, 0, 0.12)'

export function applyHitkTheme(config) {
  const ext = config.theme.extend
  ext.colors = { ...ext.colors, primary: ink, accent: neutral, dark: neutral, gray: neutral }
  ext.boxShadow = {
    ...ext.boxShadow,
    glow: softShadow,
    'glow-lg': '0 0 0 1px rgba(0, 0, 0, 0.06), 0 10px 30px rgba(0, 0, 0, 0.16)'
  }
  ext.backgroundImage = {
    ...ext.backgroundImage,
    'gradient-primary': 'linear-gradient(135deg, #2b2b2b 0%, #141414 100%)',
    // 点阵在 hitk.css 里画（要配 background-size）
    'mesh-gradient': 'none'
  }
  ext.keyframes = {
    ...ext.keyframes,
    glow: { '0%': { boxShadow: softShadow }, '100%': { boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.18)' } }
  }
  return config
}
