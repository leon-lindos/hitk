# HiTK

HiTK，读作「Hi, Token」，域名 hitk.ai。基于 Wei-Shaw/sub2api 的 Token 中转服务。

## 当前状态

2026-10-06：前后端与上游最新版 sub2api 一致（main `b8dece900`，v0.2.13），不做自定义样式；站点名称、Logo 等品牌信息走 sub2api 自带的后台设置。fork 相对上游只多出本文档和 `.gitignore` 的本地忽略规则。

2026-09 曾做过一版自定义品牌样式，已于 2026-10-06 作废，留档在 tag `fyroworks-style-last`（`7eb62db82`），需要回看时从这里取。

## 分支与同步

- origin = leon-lindos/hitk（fork），upstream = Wei-Shaw/sub2api，工作分支 hitk。
- hitk 以上游 main 为第一父提交，跟上游同步：`git fetch upstream && git merge upstream/main`；合并后用 `git diff upstream/main --stat` 核对，只应出现本文档和 `.gitignore`。

## 待办

- [ ] 确定部署目标（服务器，hitk.ai 的 DNS 与 HTTPS），构建并部署。
- [ ] 部署验收：登录、密钥、真实模型请求、流式响应、重启后数据不丢。
- [ ] 后台站点名称设为 HiTK。
- [ ] 讨论账号池、对外用户、计费和模型路由的具体要求。
