#!/usr/bin/env python3
"""Regenerate Traditional Chinese UI copy from upstream messages (requires ICU uconv).

Run after merging upstream: python3 docs/hitk/generate-zh-tw.py
Use --check to detect stale output. No runtime conversion or extra browser dependency.
Hi, Token landing copy is authored separately in src/hitk/locale-messages.ts.
"""

import argparse
import json
from pathlib import Path
import re
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[2]
FRONTEND = ROOT / "frontend"

# Prefer familiar Traditional Chinese UI terminology to literal character conversion.
TERMS = {
    "一次性密码": "一次性密碼",
    "密码": "密碼",
    "密钥": "金鑰",
    "秘钥": "金鑰",
    "账号": "帳號",
    "账户": "帳戶",
    "账": "帳",
    "注册": "註冊",
    "充值": "儲值",
    "批量": "批次",
    "阈值": "臨界值",
    "全局": "全域",
    "回调": "回呼",
    "审计": "稽核",
    "实时": "即時",
    "超时": "逾時",
    "重置": "重設",
    "运营": "營運",
    "在线": "線上",
    "离线": "離線",
    "登录": "登入",
    "登出": "登出",
    "退出登录": "登出",
    "注销": "註銷",
    "用户": "使用者",
    "默认": "預設",
    "设置": "設定",
    "配置": "設定",
    "服务器": "伺服器",
    "客户端": "用戶端",
    "数据库": "資料庫",
    "数据": "資料",
    "信息": "資訊",
    "软件": "軟體",
    "硬件": "硬體",
    "网络": "網路",
    "代码": "程式碼",
    "程序": "程式",
    "线程": "執行緒",
    "进程": "處理程序",
    "队列": "佇列",
    "并发": "並行",
    "缓存": "快取",
    "加载": "載入",
    "保存": "儲存",
    "存储": "儲存",
    "内存": "記憶體",
    "磁盘": "磁碟",
    "文件夹": "資料夾",
    "文件": "檔案",
    "文档": "文件",
    "图片": "圖片",
    "视频": "影片",
    "音频": "音訊",
    "字节": "位元組",
    "字符串": "字串",
    "变量": "變數",
    "对象": "物件",
    "数组": "陣列",
    "接口": "介面",
    "导入": "匯入",
    "导出": "匯出",
    "导览": "導覽",
    "粘贴": "貼上",
    "剪贴板": "剪貼簿",
    "链接": "連結",
    "连接": "連線",
    "搜索": "搜尋",
    "刷新": "重新整理",
    "重试": "重試",
    "创建": "建立",
    "添加": "新增",
    "删除": "刪除",
    "编辑": "編輯",
    "启用": "啟用",
    "开启": "開啟",
    "禁用": "停用",
    "激活": "啟用",
    "关闭": "關閉",
    "发送": "傳送",
    "提交": "送出",
    "邮箱": "電子郵件",
    "邮件": "郵件",
    "通知": "通知",
    "反馈": "回饋",
    "响应": "回應",
    "联系": "聯絡",
    "支持": "支援",
    "失败": "失敗",
    "成功": "成功",
    "分钟": "分鐘",
    "小时": "小時",
    "周": "週",
    "范围": "範圍",
    "质量": "品質",
    "屏幕": "螢幕",
    "鼠标": "滑鼠",
    "光标": "游標",
    "图标": "圖示",
    "组件": "元件",
    "插件": "外掛",
    "扩展": "擴充",
    "调度": "排程",
    "监控": "監控",
    "网关": "閘道",
    "仪表盘": "儀表板",
    "控制台": "控制台",
    "教程": "教學",
    "验证": "驗證",
    "校验": "驗證",
    "自动": "自動",
    "手动": "手動",
}

# Only these upstream components still keep bilingual UI strings outside i18n.
INLINE_FILES = [
    "src/views/admin/SettingsView.vue",
    "src/views/admin/settings/EmailTemplateEditor.vue",
    "src/components/auth/WechatOAuthSection.vue",
]

READ_MESSAGES = r"""
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { parse } = require('vue/compiler-sfc');
function readModule(filename) {
  let resolved = path.resolve(filename);
  if (!fs.existsSync(resolved + '.ts')) resolved = path.join(resolved, 'index');
  const source = fs.readFileSync(resolved + '.ts', 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const exports = {};
  new Function('exports', 'require', js)(exports, (id) => readModule(
    id.startsWith('@/') ? path.resolve('src', id.slice(2)) : path.resolve(path.dirname(resolved), id)
  ));
  return exports;
}
const inline = new Set();
for (const filename of JSON.parse(process.argv[1])) {
  const source = fs.readFileSync(filename, 'utf8');
  const { descriptor } = parse(source);
  const expressions = [...(descriptor.template?.content || '').matchAll(
    /\blocalText\(\s*(['"])((?:\\.|(?!\1)[\s\S])*)\1/g
  )].map(match => match[1] + match[2] + match[1]);
  const ast = ts.createSourceFile('inline.ts',
    (descriptor.scriptSetup?.content || '') + '\n' + expressions.join(';\n'), ts.ScriptTarget.Latest);
  function visit(node) {
    if (ts.isStringLiteral(node) && /[\u3400-\u9fff]/.test(node.text) && !node.text.startsWith('https://')) {
      inline.add(node.text);
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
}
const messages = readModule('src/i18n/locales/zh').default;
// Keep the authored Traditional Chinese landing copy independent of Simplified Chinese.
messages.hitk = readModule('src/hitk/locale-messages').zhTW.hitk;
process.stdout.write(JSON.stringify({ messages, inline: [...inline].sort() }));
"""


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    uconv = shutil.which("uconv")
    if not uconv:
        for candidate in ("/opt/homebrew/opt/icu4c/bin/uconv", "/usr/local/opt/icu4c/bin/uconv"):
            if Path(candidate).is_file():
                uconv = candidate
                break
    if not uconv:
        raise SystemExit("ICU uconv is required to regenerate translations.")

    source = json.loads(subprocess.check_output(
        ["node", "-e", READ_MESSAGES, json.dumps(INLINE_FILES)], cwd=FRONTEND, text=True
    ))
    values = set(source["inline"])

    def collect(node):
        if isinstance(node, str):
            values.add(node)
        elif isinstance(node, dict):
            for value in node.values():
                collect(value)

    collect(source["messages"])
    originals = sorted(values)
    # Replace longest phrases first, in one pass, so replacement output isn't rewritten.
    pattern = re.compile("|".join(re.escape(term) for term in sorted(TERMS, key=len, reverse=True)))
    localized = [pattern.sub(lambda m: TERMS[m.group()], value) for value in originals]
    converted = json.loads(subprocess.check_output(
        [uconv, "-x", "Hans-Hant"], input=json.dumps(localized, ensure_ascii=False), text=True
    ))
    translations = dict(zip(originals, converted))

    def translate(node):
        if isinstance(node, str):
            return translations[node]
        return {key: translate(value) for key, value in node.items()}

    header = "// Generated by docs/hitk/generate-zh-tw.py; update the source or generator, then regenerate.\n"
    outputs = {
        "src/i18n/locales/zh-TW.ts": header + "export default " + json.dumps(translate(source["messages"]), ensure_ascii=False, indent=2) + "\n",
        "src/hitk/inline-zh-TW.ts": header + "const messages: Record<string, string> = " + json.dumps(
            {value: translations[value] for value in source["inline"]}, ensure_ascii=False, indent=2
        ) + "\n\nexport function traditionalInline(text: string): string {\n  return messages[text] ?? text\n}\n",
    }
    stale = []
    for relative, content in outputs.items():
        target = FRONTEND / relative
        if args.check:
            if not target.exists() or target.read_text() != content:
                stale.append(relative)
        else:
            target.write_text(content)
            print(f"Updated {relative}")
    if stale:
        raise SystemExit("Regenerate Traditional Chinese: " + ", ".join(stale))


if __name__ == "__main__":
    main()
