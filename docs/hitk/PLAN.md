# Hi, Token

产品名 Hi, Token（不用中文名），域名 hitk.ai。基于 Wei-Shaw/sub2api。只面向企业，两项独立服务（2026-10-07 Leon 说明），首页围绕企业采购关心的稳定、安全、实惠与透明表达，以联系销售为主、老客户登录为辅：

- Token API（企业级模型接入）：主打稳定路由、安全访问、原生接口与支持线路的透传、实惠透明的计费，首页不强调「由我们托管」。提供的模型（首页「Available models」模型 logo 墙）：Claude、GPT、Gemini、Grok、DeepSeek、Qwen、GLM、Kimi、MiniMax、Nano Banana、Jev，以及图像 Seedream、视频 Seedance。
- TokenOS（企业私有 API 平台，原名 HiTKOS）：为企业客户私有化部署一套 API 管理平台，主打安全、预算、多源接入。和 Token API 是完全独立的两项服务。2026-10-08 按 Leon 要求全部统一为 **TokenOS**：首屏标题、顶部切换、浏览器页签标题（`hitk.privatePlatform`，显示为「TokenOS - Hi, Token」）、路由兜底标题、联系邮件主题「TokenOS private API platform」，以及标题样式类名 `tokenos-title`。仓库里的 HiTKOS 只剩交接文档中的历史记录。

全站支持 **English / 简体中文 / 繁體中文 / 日本語**（2026-10-07 更新），所有语言的站名都是 **Hi, Token**。首页、登录页、模型广场和控制台显示语言切换。优先采用保存的选择；首次访问时 `zh-CN` / `zh-SG` / `zh-Hans` 采用简体 `zh`，`zh-TW` / `zh-HK` / `zh-MO` / `zh-Hant` 以及粤语 `yue` 采用繁体 `zh-TW`，`ja` / `ja-JP` 采用日文 `ja`，其他语言采用英文。语言标签指定 Hans/Hant 时，文字体系优先于地区；上游保存的 `zh` 偏好保持为简体中文。`index.html` 初始 lang 仍为 en，初始化与切换时同步更新 lang 和页签标题。

## 当前状态

**最新交接：[2026-10-07-handoff.md](2026-10-07-handoff.md)（下一轮从这里开工）。**

2026-10-06：以上游最新版 sub2api 为底（main `b8dece900`，v0.2.13），站点名称、自定义 Logo 等品牌信息走 sub2api 自带的后台设置。

同日加了一层 thinking orbs 风格（见下节）：墨色单色、点阵底纹，connecting 球做品牌、working 球做加载态。

首页（默认模式）现在拆成两个独立公开页面，共用 `src/hitk/HitkLanding.vue` 的品牌与导航：

- `/home`（根路径 `/` 继续跳转到这里）：Token API 首页。保留 Hi, Token 和「稳定、安全、价格实惠的企业级 AI API。」；标题右上角放置单一折扣价签：简繁中文 **3 折起**、英文 **Up to 70% off**、日文 **最大70%OFF**，保留「起／Up to／最大」的范围限定。价签采用灰阶渐变、细描边、轻阴影与静态小角度倾斜，移动端内收。三句卖点轮播及对应暂停按钮已移除。详情增加智商监测说明：实时监测源头大模型的智力表现，识别官方模型能力下降并及时预警。详情和 Contact sales / Customer log in 保留，右侧为 Hi, Token / CLI / CC Switch / Magpie 接入示意，下面是 12 项模型 logo 墙和模型广场入口。
- `/private-platform`：TokenOS 首页，首屏标题为 **TokenOS**（2026-10-08 由 Hi, TKOS 改名），上方用“企业私有 API 平台”说明用途。OS 两个字采用固定金属字面与 5.6 秒匀速掠过的反光，不再使用 glitch、错位或闪烁；减少动态效果时静止，强制高对比度模式显示纯色文字。页面依次为：首屏、部署说明与 Security / Budgets / Multi-source access 三项能力、特性展示（`src/hitk/HitkPlatformFeatures.vue`）、收尾的 Contact sales；不显示 Token API 的接入和模型区。文案采用客观的第三方陈述，以“企业”“私有环境”“团队”为主体，不使用“您”“我们”等对话措辞，四种语言同步。
- TokenOS 特性展示（2026-10-08 新增，文案在 `locale-messages.ts` 的 `hitk.os`）分三段：
  - **部署架构示意**：虚线框表示企业私有环境，框内是团队与应用（Claude Code / Codex / Gemini CLI / 业务系统）和 TokenOS（统一 API 端点，密钥与访问控制、账号池调度与故障切换、额度与计量、审计与监控四层，数据存放在企业自有的 PostgreSQL 与 Redis）；框外是模型供应商（Anthropic / OpenAI / Google / xAI，另注 DeepSeek、Kimi、GLM、MiniMax）。连线上的小点表示请求流向，窄屏改为纵向；减少动态效果时静止，强制高对比度时只留实线。图下注明请求内容会发往所选供应商。
  - **六组能力**，每组三条：统一接入、调度与故障切换、密钥与权限、预算与计量、安全与审计、运维监控。手机 1 列、平板 2 列、桌面 3 列。
  - **四步上线**：部署平台、接入模型来源、分配密钥与额度、运营与监控。手机 1 列、平板 2 列、桌面 4 列。
  - 联系销售从概览面板移到页面末尾的收尾区，邮件主题不变。平板及以上宽度的段落标题只在标点处换行，避免把“安全”“セキュリティ”拆开。
- 顶部使用双选项胶囊导航，桌面居中，窄屏放到第二行；选中背景通过 `HitkSlidingIndicator.vue` 平滑移动，工具接入页签共用该实现，适配窄屏两行布局。两页都支持直接打开、刷新和浏览器前进后退，内容切换有 140ms 淡出与淡入，减少动画偏好下关闭。移除原来首屏并排的两张入口卡。
- `HomeView.vue` 通过 `service` prop 选择页面，继续提供站点设置、登录状态与主题逻辑。后台配置的 HTML / iframe 首页和精简模式仍仅作用于 `/home`；私有平台展示独立。路由沿用已有公开页访问规则。
- 模型 logo 墙：Claude / GPT / Gemini / Grok / DeepSeek / Qwen / GLM / Kimi / MiniMax / Nano Banana / Jev / Seedream · Seedance（合成一格，仅展示名称和厂家）。单色 logo 取自 @lobehub/icons，按其模型对应规则选择（GPT 用 OpenAI、GLM 用 Z.ai、Seedream/Seedance 用 Doubao）；`src/hitk/modelLogos.ts` 由 `src/hitk/extract-logos.mjs` 生成。所有联系入口仍发往 contact@hitk.ai。 Nano Banana 独立使用 LobeHub 提供的香蕉形单色标识；按 Leon 最新要求去掉 Doubao 后共 12 项，采用居中折行，桌面 6×2，平板每行 3 项，手机每行 2 项。最后一行居中，不增加第三行小字。

模型项通过 `HitkModelCard.vue` 提供装饰性悬停效果，不再展开信息浮层。精细鼠标下 Logo 轻微放大，随指针横移最多 3.5px、纵移最多 2.5px、倾斜最多 4°，背景高光跟随指针；移出后平滑复位。名称与厂家保持两行且位置固定，触摸不会弹出内容，不增加无功能的按钮或键盘停靠点；减少动态效果时关闭位移和过渡。

2026-10-07 Token API 文案改为「稳定、安全、价格实惠的企业级 AI API」，四种语言同步。详情区标签为「Token API · 企业级模型接入」（原入口卡已删除）；详情共五项：稳定路由、安全访问、原生接口与支持线路的透传、智商监测、实惠价格和逐笔账单。工具兼容标题位于接入页签上方。后续首屏推广文案收敛为标题右上角的多语言折扣价签，详情保留智商监测说明；本次只改展示，没有修改计费规则、时延策略或实现新的监测后台。不宣称具体 SLA 数字或所有线路均官方直连。**「零注入」是待落实的产品要求，尚未写成首页承诺**：Claude OAuth 对部分非 Claude Code 请求可改写 system（默认开启）；OpenAI Codex 路径可补默认 instructions。要承诺零注入，应限定符合要求的线路，并验证不新增或改写客户提示词、静默工具注入及失败回退行为；仅打开现有透传开关不足以证明所有请求均原样转发。

**TokenOS 能力表述边界**（2026-10-08 按代码核对）：特性展示只写平台已有的能力。以下内容不能写进首页：
- SAML、LDAP、SCIM 单点登录。现有第三方登录是 GitHub、Google、微信、钉钉、LinuxDO 和一个通用 OIDC。
- 团队、部门或成本中心。平台只有分组和用户，角色只有管理员与普通用户。
- 上游账号凭据加密存储。凭据以明文 JSONB 存放，只在接口返回时隐藏；AES-256-GCM 只用于 TOTP 密钥、备份用 S3 密钥、审计模型令牌、渠道监控密钥、插件配置等少数字段。
- 完整记录或回放提示词与回复。提示词审计只检测输入，保留哈希与脱敏摘要，需要企业自建 Qwen3Guard 类模型。
- 按密钥限定模型、RPM 或并发。模型范围只能通过分组白名单或渠道限定。
- Webhook、Slack、飞书或钉钉告警。告警目前只发邮件。
- Prometheus、Helm、Kubernetes、Azure OpenAI、Grok 以外的视频与语音、通用插件平台、合规认证。
- TokenOS 自己的官方镜像或一键在线更新。`deploy/docker-compose.yml` 拉取上游 `weishaw/sub2api` 镜像，在线更新也指向上游发布。
- “完全离线”或“数据不出环境”。价格表与更新检查默认访问 GitHub，内容审核选 OpenAI 引擎时会调用 OpenAI。

同日继续调整第二屏接入展示：Token API 右侧由单一终端改为 `HitkIntegrations.vue` 的 **CLI / CC Switch / Magpie** 三个可点击页签（后扩为四个页签，见下文）。CLI 用 `HitkTerminal.vue` 展示 Claude Code 的环境变量配置与调用示例；CC Switch 展示供应商名称、API 地址与遮蔽的示例密钥；Magpie 展示 Hi, Token 供应商和三个开发工具的模型分配。标题上方保留工具兼容定位，下面按所选页签显示接入说明。页面明确标为接入示意，不运行命令、不导入真实密钥，也不请求外部客户端。界面参考 [CC Switch 官方添加供应商界面](https://github.com/farion1231/cc-switch/blob/main/assets/screenshots/add-en.png) 与 [Magpie 官方供应商及工具面板](https://usemagpie.ai/)，用本地 HTML/CSS 绘制，未引入远程截图。叠放网格按最高面板预留空间，切换时保持高度；支持鼠标、触摸、方向键、Home/End、深色模式及减少动画设置。

2026-10-07 首页模型区补充 MiniMax 和 Jev，保留已有 Gemini。MiniMax 使用现有图标库的单色标识，Jev 使用 TypeSafe AI 官网标识 `src/hitk/jev-logo.svg`。12 项模型使用等宽网格：手机 2 列、平板 3 列、宽屏桌面 6×2；Seedream · Seedance 不跨列，各项只有模型名和厂家两行文字。

模型墙曾先后试过 Mistral、Llama（Meta）和 Doubao（ByteDance），均已移除，现为上文列出的 12 项；Doubao 标识仍用于 Seedream · Seedance 一格。本轮仅调整模型墙，没有新增上游接入配置。

接入区进一步扩为 **Hi, Token / CLI / CC Switch / Magpie** 四个页签，默认展示 Hi, Token。`HitkPlatformPreview.vue` 用示例数据展示 API 地址、密钥、模型与用量概览，搭配 100px organic working orb；页签与窗口标题使用 connecting orb。平台 orb 在切走页签时暂停，并遵守减少动画偏好。CC Switch / Magpie 的页签与窗口标题改为各自官方 SVG 标识，本地存为 `cc-switch-logo.svg` / `magpie-logo.svg`；原始文件保持不变，Magpie 在深色模式下用 CSS 反色。来源、SHA-256 与 MIT 许可见 `THIRD_PARTY_NOTICES.md`。宽屏四个页签一行，窄屏两行；各面板继续使用同一高度。

2026-09 曾做过一版自定义品牌样式，已于 2026-10-06 作废，留档在 tag `fyroworks-style-last`（`7eb62db82`），需要回看时从这里取。

## thinking orbs 风格

素材：thinking-orbs 0.3.2 的绘制引擎（MIT，Jakub Antalik），来自本地 thinking-orbs-vue 移植，原样拷入 `frontend/src/hitk/vendor/`，许可与校验值见 `frontend/src/hitk/THIRD_PARTY_NOTICES.md`。根目录 `.gitignore` 为 Go 依赖写了 `vendor/`，会连带忽略这个目录，所以加了 `!frontend/src/hitk/vendor/` 例外（2026-10-08 首次提交时发现）。

- connecting（节点连线）= 品牌：侧栏 / 登录页 / 首页的 Logo（未设自定义 Logo 时）、首页首屏大球、登录卡片后的大球、空状态、TokenOS 架构示意里的 36px 核心标识。两个产品首页保留首屏背景球。
- working（粒子绕轨）也用在私有 API 平台页背景的大球，启用 organic 变化。
- working（粒子绕轨）= 加载：`LoadingSpinner` 整体换成 working 球（208 处零散的 `animate-spin` 小图标未动）。
- 语言切换的 144px working 球启用 `organic`：每颗粒子独立的尺寸、速度、方向与倾角，叠加平滑变速和椭圆轨道漂移。实现放在 `src/hitk/organic-orbits.ts`，保留第三方引擎原文件；Hi, Token 接入示意和私有平台背景也使用此变体。
- 主色：墨色单色，按钮与深色区域使用细微灰阶渐变；暗黑模式的主按钮使用白到浅灰渐变。主色走 CSS 变量，深色模式另一套（500–700 用中灰，未写 dark: 的主色文字和按钮都看得清）；灰阶、accent、dark 换成纯中性灰；深色模式主按钮白底墨字。
- 同色背景上的次级按钮使用独立的白灰／较亮石墨灰渐变、常驻描边和短阴影；选中滑块共用此配色，不依赖悬停才显出边界。
- 通用交互在 `hitk.css` 中统一：160ms 颜色、阴影与亮度变化，主操作按钮在精细指针悬停时上移 1px；禁用按钮没有悬停反馈，键盘焦点保留。导航、语言菜单、工具页签、模型标识和功能卡片也提供轻微反馈。减少动态效果时取消位移与过渡，不改全白语言加载遮罩。
- 全站界面文字默认不可选择（含 Safari 的 `-webkit-user-select`），输入框、文本框与可编辑区域保留文字选择；现有复制按钮照常工作。
- 底纹：控制台背景（AppLayout 的 `bg-mesh-gradient`）和公开页背景换成 22px 点阵。
- 静态 `public/logo.svg`（favicon 和其他用到默认 Logo 的页面）是 connecting 的一帧，用 `node src/hitk/gen-logo.mjs public/logo.svg 1.2 1.5 2.2` 生成。

HiTK 自己的文件都在 `frontend/src/hitk/`（站名替换见下文「站名」一节，不在这张表里）。改动的上游文件（合并上游有冲突时对照这张表）：

| 文件 | 改动 |
| --- | --- |
| `frontend/tailwind.config.js` | 原配置不动，`export default` 套一层 `applyHitkTheme` |
| `frontend/src/main.ts` | 仅引入 `./hitk/hitk.css`（另有一处站名替换） |
| `frontend/src/App.vue` | 挂载全局 `LocaleLoadingOverlay`，等待语言包时显示白底 working orb |
| `frontend/index.html` | `lang="en"` |
| `frontend/src/i18n/index.ts` | 四种语言按需加载与预加载（同一语言共用一个 Promise）、浏览器语言识别（含粤语 `yue`）、本地存储异常兜底、切换至少 1000ms 的遮罩状态；语言列表去掉国旗，增加简称与加载失败提示。合并上游时冲突风险最高 |
| `frontend/src/i18n/locales/en/index.ts`、`zh/index.ts` | 合并 `locale-messages.ts` 的 HiTK 首页文案 |
| `frontend/src/components/common/LocaleSwitcher.vue` | 按钮固定显示 EN / 简中 / 繁中 / 日本語，菜单显示全名，去掉国旗；Esc 关闭菜单；悬停和聚焦选项时预加载，切换失败显示提示 |
| `frontend/src/components/modelPlaza/PlazaNavBar.vue` | 登录按钮前增加语言切换 |
| `frontend/src/components/auth/WechatOAuthSection.vue`、`views/admin/SettingsView.vue`、`views/admin/settings/EmailTemplateEditor.vue` | 组件内写死的中文提示改走 `traditionalInline` / `japaneseInline` |
| `frontend/src/components/admin/AdminComplianceDialog.vue`、`stores/adminCompliance.ts`、`views/public/LegalDocumentView.vue` | 判断中文由 `=== 'zh'` 改为 `startsWith('zh')`，繁体也显示中文合规文本 |
| `frontend/src/components/common/DateRangePicker.vue`、`views/KeyUsageView.vue` | 日期格式跟随当前语言（英文不再固定 en-US）；KeyUsage 的日／月标签覆盖日文，周的缩写取 `hitk.weekAbbr` |
| `frontend/src/components/common/LoadingSpinner.vue` | 内部换成 working 球，props 不变 |
| `frontend/src/components/common/EmptyState.vue` | 默认图标换成 connecting 球 |
| `frontend/src/components/layout/AppSidebar.vue` | Logo 的 `<img>` 换成 `HitkLogo` |
| `frontend/src/components/layout/AuthLayout.vue` | 背景装饰换成 `HitkBackdrop`，Logo 换成 `HitkLogo`；增加语言切换，默认副标题和版权文案随语言切换 |
| `frontend/src/views/HomeView.vue` | 用 `<HitkLanding>` 展示两个产品首页，`service` prop 区分页面；数据和登录逻辑仍经 props 传入，自定义／精简首页仅作用于默认首页 |
| `frontend/src/router/index.ts` | 新增公开的 `/private-platform` 路由，复用 HomeView 并传入服务类型；`/home` 标题改为 Token API，私有平台标题取 `hitk.privatePlatform` |
| `frontend/src/views/__tests__/HomeView.compact.spec.ts` | 默认首页断言改为找 `hitk-landing` |
| `frontend/src/i18n/__tests__/localeKeyCompleteness.spec.ts`、`localesMessageCompile.spec.ts` | 覆盖范围扩到 zh-TW 与 ja |
| `frontend/public/logo.svg` | 换成 connecting 静态帧 |
| `frontend/.eslintignore` | 忽略 `src/hitk/vendor/`（原样拷入的引擎，lint 自动修复会破坏校验值） |

新增在 `src/hitk/` 之外的文件：生成的 `src/i18n/locales/zh-TW.ts`、`ja.ts`，以及测试 `src/i18n/__tests__/traditionalChinese.spec.ts`、`localeLoading.spec.ts`。

测试分工：
- `src/hitk/hitk.spec.ts` 守着 LoadingSpinner / EmptyState 两处接入点，另测 HitkLogo 的自定义 Logo 回退和 ThinkingOrb 尺寸。AppSidebar / AuthLayout 里的 Logo 替换没有测试守护，合并上游后要人工看一眼。
- `src/hitk/tokenos.spec.ts` 检查 TokenOS 首屏与顶部切换的名称、架构示意、六组能力各三条、四个步骤、联系入口，以及简繁日三种语言的切换。
- `src/i18n/__tests__/traditionalChinese.spec.ts` 检查四种语言的偏好、切换、Token API 首页、站名和插值参数，并要求生成的繁体首页文案与 `locale-messages.ts` 完全一致（繁体手写文案要先符合生成器的用语表，例如写「儲存」而非「保存」）。
- `src/i18n/__tests__/localeLoading.spec.ts` 覆盖语言包加载合并、缓存切换、并发防护、失败恢复、遮罩和焦点。i18n 完整性与消息编译测试覆盖四种语言包。

上游以后改首页默认模式的内容不会再体现在 HiTK 首页上（落地页是自己的），合并有冲突时保留 `<HitkLanding>`。

## 多语言维护

- 切换机制：每种语言首次按需加载，悬停或聚焦选项时预加载，重叠请求共用同一个 Promise。每次实际切换语言都显示全屏纯白底加 144px working orb，包括已缓存的语言。遮罩用 100ms 淡入，开始绘制后至少保留 1000ms（包含淡入），目标语言就绪后在白底下更新文案，再用 100ms 淡出；缓存命中时整个过渡约 1.1 秒，慢网络则等加载完成。遮罩期间阻止操作背景页面，结束后恢复键盘焦点；失败时保留原语言并提示刷新重试。深色模式仍用纯白遮罩，减少动态效果偏好下 orb 静止且不渐变。
- 首页和终端演示的品牌文案：`frontend/src/hitk/locale-messages.ts`，手写英文、简体中文、繁体中文与日文；简体与繁体首页文案独立维护。
- 通用界面与后台语言包：`frontend/src/i18n/locales/zh-TW.ts`，按需加载；从上游简体文案生成，使用 ICU 简繁转换加繁体界面用语表（登入、設定、帳號、金鑰、儲存等）。
- 上游仍写在组件内的少量双语文案：`frontend/src/hitk/inline-zh-TW.ts`，用于设置页、邮件模板编辑器和微信登录提示。
- 合并上游或修改文案后，运行 `python3 docs/hitk/generate-zh-tw.py`，并用 `--check` 检查生成结果是否最新。生成工具需要前端现有依赖和 ICU 的 `uconv`，浏览器不增加转换依赖。术语修正在脚本里维护，首页文案在 `locale-messages.ts` 维护，不直接改生成文件。
- 日文语言包：`frontend/src/i18n/locales/ja.ts`，覆盖与英文一致的全部键并按需加载。公共操作、导航、登录等校订文案在 `frontend/src/hitk/japanese-overrides.ts`；页面内少量双语文案对应 `frontend/src/hitk/inline-ja.ts`。
- 日文初稿通过 `python3 docs/hitk/translate-ja.py --translate` 生成，只有这条开发命令会联网翻译公开界面文案；浏览器和构建过程不调用翻译服务。变量、品牌、链接、HTML、API 路径和模型 ID 在翻译时受保护。`--check` 离线检查源文案与校订内容是否更新；生成缓存位于 `/private/tmp/hitk-ja-translations.json`。新增或调整日文用语优先写入校订文件后重新生成，避免覆盖校订结果。
- 只改 `locale-messages.ts` 时，日文首页文案是手写的，`--translate` 在缓存完整时会显示「Translating 0 unique messages」，不发翻译请求。缓存位于临时目录，重启后可能丢失；丢失时这条命令会把约 8500 条界面文案重新送去翻译，运行前先确认缓存文件还在。运行 Python 脚本时加 `-B`，避免在 `docs/hitk/` 下生成 `__pycache__` 目录。
- 上游部署合规承诺及逐字校验的确认句保留原文；管理员设置的自定义内容、邮件模板和第三方支付／验证码界面按各自的配置显示。

## 站名：Sub2API → Hi, Token

2026-10-07 起，站内所有展示用的「Sub2API」换成「Hi, Token」：默认站名和各处兜底、页面标题、欢迎引导、安装向导、邮件、两步验证发行方、通行密钥显示名、支付商品名、生成给用户的 CLI 配置、多语言文案等。用 `python3 docs/hitk/rebrand.py` 批量替换（可重复运行；`--check` 只查剩余）。**每次合并上游后跑一遍**，把上游新加的 Sub2API 一并换掉；合并时在含 Sub2API 的行上冲突，取上游版本后重跑脚本即可。

保留不换：
- 合规承诺那句话（前端 `stores/adminCompliance.ts`、后端 `service/admin_compliance.go`）：后端逐字核对，且对应上游法律文件 `docs/legal`。
- Go 字段名、插件清单 JSON 键、请求头 `X-Sub2API-Grok-Client-Tool-Cache`（客户端和插件按它对接）、`Sub2API-Updater` 这类带连字符的标识。
- 小写 `sub2api`（模块路径、镜像名、服务名、配置目录）、代码注释、数据库迁移（有 checksum）、LICENSE / CLA / README / 部署脚本。

## 分支与同步

- origin = leon-lindos/hitk（fork），upstream = Wei-Shaw/sub2api，工作分支 hitk。
- hitk 以上游 main 为第一父提交，跟上游同步：`git fetch upstream && git merge upstream/main`；合并后用 `git diff upstream/main --stat` 核对，只应出现 `docs/hitk/`、`.gitignore`、`frontend/src/hitk/`、上表的文件、上表下方列出的新增文件和站名替换涉及的文件。
- 前端依赖用 pnpm 9（和上游 CI、Dockerfile 一致）：`corepack pnpm@9 install --frozen-lockfile`；本机 pnpm 11 不读 package.json 的 overrides，会和锁文件对不上。
- 前端单测有 3 个上游自带的失败（`src/api/__tests__/settings.authSourceDefaults.spec.ts`，期望 5 个平台、代码里是 6 个），与 HiTK 改动无关。

## 本地完整预览（Mac mini）

2026-10-07 搭好，用 Homebrew 装的 PostgreSQL 18 和 Redis 8（与上游 docker-compose 的 postgres:18 / redis:8 一致），**不开机自启**，要预览时手动起：

```bash
# 数据库与缓存（都只监听本机）
LC_ALL=en_US.UTF-8 /opt/homebrew/opt/postgresql@18/bin/pg_ctl -D /opt/homebrew/var/postgresql@18 -l /opt/homebrew/var/log/postgresql@18.log start
/opt/homebrew/opt/redis/bin/redis-server /opt/homebrew/etc/redis.conf --daemonize yes

# 后端（数据目录 backend/data/，已被 .gitignore 忽略；只监听 127.0.0.1:8080）
cd backend && DATA_DIR=$PWD/data SERVER_HOST=127.0.0.1 SERVER_PORT=8080 go run ./cmd/server

# 前端（局域网可访问 http://192.168.3.90:5230/，/api /v1 /setup 由 Vite 转给 8080）
cd frontend && npx vite --host 0.0.0.0 --port 5230 --strictPort

# 停
/opt/homebrew/opt/postgresql@18/bin/pg_ctl -D /opt/homebrew/var/postgresql@18 stop
/opt/homebrew/opt/redis/bin/redis-cli shutdown
```

- 数据库用户 / 库：`sub2api` / `sub2api`（密码 `sub2api`，仅本机开发用；Homebrew 的 initdb 对本机连接是 trust 认证）。
- 第一次启动进安装向导（网页），装完写 `backend/data/config.yaml`。macOS 上后端不会自己重启（`sysutil.RestartService` 只在 Linux 退出），装完要手动重启一次后端才进入正常模式。
- 只看界面不需要上游模型账号；要真实请求得在后台加至少一个上游账号。
- 2026-10-07 发现：在 Claude Code 的沙箱里跑的 Go 程序，遇到空指针不会 panic，而是原地空转（最小复现程序也卡住；沙箱外是否正常待 Leon 在自己终端验证）。后果：后端 `internal/handler`、`internal/handler/admin` 两个包的单测会卡到超时；沙箱里起的预览后端万一遇到空指针也会卡住而不是返回 500。后端单测和长期跑的预览后端，最好在自己的终端里跑。

## 待办

- [ ] 确认 contact@hitk.ai 能正常收信。
- [ ] 只做企业客户的话，部署后在后台关掉公开注册（首页已不再引导自助注册）。
- [ ] 部署后按需设置自定义站点副标题；未设置或仍为上游默认值时，登录页使用随语言切换的企业服务口号。
- [ ] 在控制台核对风格：侧栏 Logo、选中态、表格页加载态与空状态、深色模式（10-07 本地完整预览已装好，待登录核对）。
- [ ] 确定部署目标（服务器，hitk.ai 的 DNS 与 HTTPS），构建并部署。
- [ ] 部署验收：登录、密钥、真实模型请求、流式响应、重启后数据不丢。
- [ ] 讨论账号池、对外用户、计费和模型路由的具体要求。
- [ ] 核对 TokenOS 概览三张卡的旧文案：「预算」写了团队级配额，但平台只有分组和用户；「安全」写了 API 密钥与日志保留在私有环境，需满足上文「能力表述边界」最后一条的前提。
- [ ] `locale-messages.ts` 里 `tokenCategory`、`tokenSummary`、`toolsDescription`、`imageVideo`、`platformEyebrow` 五个键已无引用，可删除后重新生成语言包。
- [ ] 如果对外提供 TokenOS 部署，先把部署文件的镜像和在线更新源改为自己的仓库，否则会装上或升级到上游版本。
