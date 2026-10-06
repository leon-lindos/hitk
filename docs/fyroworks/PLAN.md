# 驭火 Token 中转站

## 当前范围

2026-09-18，Leon 确认以 Wei-Shaw/sub2api 为上游，在 leon-lindos/sub2api fork 上开发，工作目录为 hitk-ai。账号池、用户计费、模型路由作为后续阶段。Oracle 机器尚未配置，服务器初始化与部署列入待办。

2026-10-06，Leon 裁定抛弃此前全部前端样式改造（驭火品牌素材、纸面朱墨皮肤、首页与登录页改版），前后端整体回到上游最新版 sub2api（main `b8dece900`，v0.2.13）。fork 只多出本文档和 `.gitignore` 的本地忽略规则；站点名称、Logo 等品牌信息走 sub2api 自带的后台设置。

## 分支与同步

- origin = leon-lindos/sub2api，upstream = Wei-Shaw/sub2api，工作分支 fyroworks-brand。
- 2026-10-06 起 fyroworks-brand 以上游 main 为第一父提交，旧样式分支以 `-s ours` 合入（只保留祖先关系，不带任何内容），因此推送是快进。
- 跟上游同步：`git fetch upstream && git merge upstream/main`；合并后用 `git diff upstream/main --stat` 核对，只应出现本文档和 `.gitignore`。
- 样式改造的最后一版留档在 tag `fyroworks-style-last`（`7eb62db82`），需要回看时从这里取。

## 待办

- [x] 完成本地源码基线及 origin / upstream 关联。
- [x] ~~完成品牌素材、首页、认证页和公共界面样式~~（2026-09-19 完成，2026-10-06 作废，见上）。
- [x] 回到上游最新版 sub2api v0.2.13（2026-10-06）。
- [ ] Oracle：机器已清空，需重新提供目标 IP 和 SSH 用户名。私钥原在 `oracle-jp-secret/ssh-key-2026-09-18.key`（已 gitignore）；2026-10-06 核对时当前 hitk-ai 工作区里没有这个目录，需要找回或重新生成。
- [ ] Oracle：准备容器、数据库、缓存、持久化目录与备份。
- [ ] Oracle：确认域名、DNS 和 HTTPS，构建并部署本 fork。
- [ ] Oracle：完成登录、密钥、真实模型请求、流式响应与重启持久化验收。
- [ ] 下一阶段：讨论账号池、对外用户、计费和模型路由的具体要求。
