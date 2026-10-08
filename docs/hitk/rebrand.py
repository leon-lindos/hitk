#!/usr/bin/env python3
"""把站内所有展示用的「Sub2API」换成「Hi, Token」。可重复运行，合并上游后再跑一遍即可。

用法（仓库根目录）：python3 docs/hitk/rebrand.py [--check]
  --check  只列出还剩多少处，不改文件（有剩余时退出码 1）

规则：
- Go：只换字符串字面量里的，注释、字段名、JSON 键、请求头（X-Sub2API-…）不动。
- 前端（src 下的 ts/vue/js 和 index.html）：换非注释行里单独出现的 Sub2API。
- 跳过：合规承诺那句话（后端逐字核对，且对应上游的法律文件 docs/legal）、src/hitk/vendor。
- 小写 sub2api（模块路径、镜像、服务名）、数据库迁移、LICENSE / README / 部署脚本都不在范围内。
"""
import re
import sys
from pathlib import Path

OLD, NEW = 'Sub2API', 'Hi, Token'
ROOT = Path(__file__).resolve().parents[2]
WORD = re.compile(r'(?<![A-Za-z0-9_-])Sub2API(?![A-Za-z0-9_-])')
KEEP_LINES = ('合规承诺', 'Compliance Commitment')
SKIP_DIRS = ('frontend/src/hitk/vendor/', 'frontend/node_modules/')
GO_TOKENS = re.compile(r'//[^\n]*|/\*[\s\S]*?\*/|"(?:[^"\\\n]|\\.)*"|`[^`]*`|\'(?:[^\'\\\n]|\\.)*\'')
FE_COMMENT = re.compile(r'^\s*(//|/\*|\*|<!--)')


def keep(text):
    return any(k in text for k in KEEP_LINES)


def rebrand_go(src):
    def repl(m):
        tok = m.group(0)
        if tok.startswith(('//', '/*')) or keep(tok):
            return tok
        return WORD.sub(NEW, tok)
    return GO_TOKENS.sub(repl, src)


def rebrand_frontend(src):
    return ''.join(
        line if FE_COMMENT.match(line) or keep(line) else WORD.sub(NEW, line)
        for line in src.splitlines(keepends=True)
    )


def targets():
    for p in sorted((ROOT / 'backend').rglob('*.go')):
        yield p, rebrand_go
    for pattern in ('*.ts', '*.vue', '*.js', '*.mjs'):
        for p in sorted((ROOT / 'frontend/src').rglob(pattern)):
            yield p, rebrand_frontend
    yield ROOT / 'frontend/index.html', rebrand_frontend


def main():
    check = '--check' in sys.argv
    total = 0
    for path, fn in targets():
        rel = path.relative_to(ROOT).as_posix()
        if any(rel.startswith(d) for d in SKIP_DIRS):
            continue
        src = path.read_text(encoding='utf-8')
        if OLD not in src:
            continue
        out = fn(src)
        n = src.count(OLD) - out.count(OLD)
        if n:
            total += n
            print(f'{n:4d}  {rel}')
            if not check:
                path.write_text(out, encoding='utf-8')
    print(f'{"剩余" if check else "已替换"} {total} 处')
    return 1 if check and total else 0


if __name__ == '__main__':
    sys.exit(main())
