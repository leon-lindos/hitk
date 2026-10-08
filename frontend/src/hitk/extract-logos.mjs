// Extract the Mono SVG of @lobehub/icons model logos into src/hitk/modelLogos.ts.
// Run from frontend/: node src/hitk/extract-logos.mjs node_modules/@lobehub/icons/es src/hitk/modelLogos.ts
import fs from 'node:fs'
import path from 'node:path'
const [, , esDir, out] = process.argv
// Model-level icons, following @lobehub/icons' own model mapping (features/modelConfig.js): gpt → OpenAI,
// glm-4 → ZAI, doubao / seedream / doubao-seedance → Doubao; Kimi has its own icon.
const icons = ['Claude', 'OpenAI', 'Gemini', 'Grok', 'DeepSeek', 'Qwen', 'ZAI', 'Kimi', 'Minimax', 'Doubao']
const rows = []
for (const v of icons) {
  const src = fs.readFileSync(path.join(esDir, v, 'components', 'Mono.js'), 'utf8')
  const title = (fs.readFileSync(path.join(esDir, v, 'style.js'), 'utf8').match(/TITLE = '([^']+)'/) || [])[1]
  const viewBox = (src.match(/viewBox: "([^"]+)"/) || [])[1]
  // Properties such as clipRule may precede d; Doubao also has fillOpacity.
  const paths = [...src.matchAll(/_jsx\("path", \{([\s\S]*?)\}\)/g)].map((match) => {
    const d = match[1].match(/\bd: "([^"]+)"/)?.[1]
    const opacity = match[1].match(/\bfillOpacity: "([^"]+)"/)?.[1]
    if (!d) throw new Error(`${v}: path data missing`)
    return opacity === undefined ? { d } : { d, opacity: Number(opacity) }
  })
  const others = [...src.matchAll(/_jsx\("(\w+)"/g)].map((m) => m[1]).filter((t) => t !== 'path' && t !== 'title')
  if (!title || !viewBox || !paths.length || others.length) throw new Error(`${v}: unsupported or empty SVG`)
  console.log(v, title, viewBox, paths.length, 'paths', others.length ? 'OTHER:' + others.join(',') : '')
  rows.push({ key: v, title, viewBox, paths })
}
const body = rows.map((r) => `  ${JSON.stringify(r.key)}: {\n    title: ${JSON.stringify(r.title)},\n    viewBox: ${JSON.stringify(r.viewBox)},\n    paths: [\n${r.paths.map((p) => `      { d: ${JSON.stringify(p.d)}${p.opacity !== undefined ? `, opacity: ${p.opacity}` : ''} }`).join(',\n')}\n    ]\n  }`).join(',\n')
fs.writeFileSync(out, `// Model logos (Mono variants) extracted from @lobehub/icons 4.0.2 (MIT, already a frontend dependency).
// Logos and names are trademarks of their owners; shown only to indicate which models are available.
// Regenerate: node src/hitk/extract-logos.mjs node_modules/@lobehub/icons/es src/hitk/modelLogos.ts (from frontend/).
export interface ModelLogo {
  title: string
  viewBox: string
  paths: { d: string; opacity?: number }[]
}

const logos = {
${body}
} satisfies Record<string, ModelLogo>

export type ModelLogoKey = keyof typeof logos
export const modelLogos: Record<ModelLogoKey, ModelLogo> = logos
`)
