/** Defaults for this FyroWorks distribution. Admin site settings take precedence. */
export const BRAND = {
  name: '驭火实验室',
  englishName: 'FyroWorks',
  subtitle: '让模型接入工作，让想法付诸实践。',
  // Keep the source PNGs in frontend/brand-source for editable originals;
  // serve only the sized WebP derivatives from the public static directory.
  logo: '/brand/fyroworks-logo.webp',
  favicon: '/brand/fyroworks-favicon.webp',
  illustration: '/brand/service-tools.webp',
} as const
