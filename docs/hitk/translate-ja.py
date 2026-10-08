#!/usr/bin/env python3
"""Seed Japanese UI translations and apply the reviewed copy in japanese-overrides.ts.

Only --translate sends public UI messages to Google Translate; no application data,
configuration, or credentials are read. The browser uses the resulting static files.
--check is offline and detects changed source messages or reviewed overrides.
Requires the frontend's existing TypeScript dependency. No extra packages or folders.
"""

import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
import hashlib
import json
from pathlib import Path
import re
import runpy
import subprocess
import time
import urllib.parse
import urllib.request

ROOT = Path(__file__).resolve().parents[2]
FRONTEND = ROOT / "frontend"
CACHE = Path("/private/tmp/hitk-ja-translations.json")
LOCALE = FRONTEND / "src/i18n/locales/ja.ts"
INLINE = FRONTEND / "src/hitk/inline-ja.ts"
ENDPOINT = "https://translate.googleapis.com/translate_a/single"

# Protect interpolation syntax, markup, URLs, code, and product names before translation.
PROTECTED = re.compile(
    r"\{[^{}]*\}|<[^>]+>|https?://[^\s<>]+|`[^`]+`|\s*\|\s*|"
    r"Hi, Token|hitk\.ai|CC Switch|Claude Code|Gemini CLI|Moonshot AI|"
    r"\b(?:OpenAI|Anthropic|Claude|Codex|Gemini|Grok|DeepSeek|Qwen|Kimi|GLM|Z\.ai|"
    r"Seedream|Seedance|Magpie|GitHub|Google|DingTalk|WeChat|OAuth|OAuth2|TOTP|"
    r"WebAuthn|PostgreSQL|Redis|Docker|Stripe|Airwallex|LinuxDo|Sub2API|JSON|JSONL|"
    r"YAML|Markdown|HTML|CSS|JavaScript|TypeScript|OpenCode|Responses|Chat Completions|"
    r"WebSocket|SSE|HTTP|HTTPS|API|SDK|CLI|URL|URI|ID|UUID|RPM|TPM)\b|"
    r"\b[A-Z][A-Z0-9]+(?:_[A-Z0-9]+)+\b|@[.:][\w.]+|"
    r"\b(?:claude|gpt|gemini|deepseek|qwen|grok|glm|o[134])[-_.][A-Za-z0-9*_.-]+|"
    r"(?<!\w)/(?:v\d|api|admin|auth|oauth|setup|responses|messages|chat|completions|images|models)(?:/[A-Za-z0-9_.:{}*?&=-]+)*|"
    r"\b[A-Za-z0-9_-]+\.(?:json|jsonl|toml|yaml|yml|csv|md|txt|pem|crt|html|ts|js|go)\b|"
    r"\b(?:X-[A-Za-z-]+|Content-Type|User-Agent|Accept-Language|Authorization)\b|"
    r"openid email profile|\b[a-z][a-z0-9_]*:[a-z][a-z0-9_:]*\b|"
    r"\b[a-z][a-z0-9]*(?:_[a-z0-9]+)+\b|--[a-z][a-z0-9-]*|"
    r'"[A-Za-z0-9_/.*:-]+"'
)


def read_source():
    generator = runpy.run_path(str(ROOT / "docs/hitk/generate-zh-tw.py"))
    script = generator["READ_MESSAGES"].replace(
        "process.stdout.write(JSON.stringify({ messages, inline: [...inline].sort() }));",
        """process.stdout.write(JSON.stringify({
          messages: readModule('src/i18n/locales/en').default,
          authored: readModule('src/hitk/locale-messages').ja,
          overrides: readModule('src/hitk/japanese-overrides').default,
          inline: [...inline].sort()
        }));""",
    )
    return json.loads(subprocess.check_output(
        ["node", "-e", script, json.dumps(generator["INLINE_FILES"])], cwd=FRONTEND, text=True
    ))


def flatten(node, prefix=""):
    result = {}
    for key, value in node.items():
        path = f"{prefix}.{key}" if prefix else key
        if isinstance(value, dict):
            result.update(flatten(value, path))
        else:
            result[path] = value
    return result


def unflatten(messages):
    result = {}
    for path, value in messages.items():
        cursor = result
        *parents, key = path.split(".")
        for parent in parents:
            cursor = cursor.setdefault(parent, {})
        cursor[key] = value
    return result


def translate_batch(items, language):
    masked = []
    tokens = []
    for source in items:
        protected = []

        def mask(match):
            protected.append(match.group())
            return f"ZXQ{len(protected) - 1:04d}XZ"

        masked.append(PROTECTED.sub(mask, source))
        tokens.append(protected)
    text = "\n".join(f"ZXROW{i:04d}XZ\n{value}" for i, value in enumerate(masked))
    query = urllib.parse.urlencode({"client": "gtx", "sl": language, "tl": "ja", "dt": "t", "q": text})
    request = urllib.request.Request(f"{ENDPOINT}?{query}", headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(request, timeout=30) as response:
        payload = json.load(response)
    translated = "".join(segment[0] or "" for segment in payload[0])
    rows = re.split(r"ZXROW\s*(\d{4})\s*XZ", translated, flags=re.I)
    if len(rows) != len(items) * 2 + 1:
        raise ValueError("Translation changed the message boundaries")
    result = []
    for i in range(len(items)):
        if int(rows[2 * i + 1]) != i:
            raise ValueError("Translation reordered messages")
        value = rows[2 * i + 2].strip()
        expected = tokens[i]
        # Google occasionally adds a leading zero or changes X to Z in adjacent markers.
        # Validate every numeric identity before restoring any protected text.
        marker = r"Z[XZ]Q\s*(\d{1,6})\s*XZ"
        found = re.findall(marker, value, flags=re.I)
        if sorted(map(int, found)) != list(range(len(expected))):
            raise ValueError(f"Translation changed protected content: expected {len(expected)}, found {found}; text: {value[:240]}")
        value = re.sub(marker, lambda m: expected[int(m[1])], value, flags=re.I)
        if re.search(r"Z[XZ](?:Q|ROW)", value):
            raise ValueError("Unresolved translation markers")
        result.append(value)
    return result


def translate_with_retry(items, language):
    # Translate text nodes independently to preserve rich onboarding markup exactly.
    rich = [i for i, value in enumerate(items) if re.search(r"<[^>]+>", value)]
    if rich:
        result = list(items)
        plain = [i for i in range(len(items)) if i not in rich]
        if plain:
            for i, value in zip(plain, translate_with_retry([items[i] for i in plain], language)):
                result[i] = value
        for index in rich:
            parts = re.split(r"(<[^>]+>)", items[index])
            nodes = [i for i in range(0, len(parts), 2) if re.search(r"[A-Za-z\u3400-\u9fff]", parts[i].strip())]
            if nodes:
                translated = translate_with_retry([parts[i].strip() for i in nodes], language)
                for i, value in zip(nodes, translated):
                    leading = parts[i][:len(parts[i]) - len(parts[i].lstrip())]
                    trailing = parts[i][len(parts[i].rstrip()):]
                    parts[i] = leading + value + trailing
            result[index] = "".join(parts)
        return result
    for attempt in range(4):
        try:
            return translate_batch(items, language)
        except Exception as error:
            print(f"Retry {attempt + 1}/4 for {len(items)} messages: {type(error).__name__}: {error}", flush=True)
            if isinstance(error, ValueError) and len(items) > 1:
                break
            if attempt < 3:
                time.sleep(1 + attempt * 2)
    if len(items) > 1:
        mid = len(items) // 2
        return translate_with_retry(items[:mid], language) + translate_with_retry(items[mid:], language)
    raise RuntimeError(f"Could not safely translate: {items[0][:100]}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--translate", action="store_true")
    mode.add_argument("--check", action="store_true")
    mode.add_argument("--probe", action="store_true")
    args = parser.parse_args()
    if args.probe:
        samples = ["Save", "Welcome to Hi, Token", "Delete {count} users?", "<strong>Security</strong>: connect to https://hitk.ai"]
        print(json.dumps(translate_batch(samples, "en"), ensure_ascii=False))
        source = read_source()
        values = sorted(set(flatten(source["messages"]).values()))
        cached = json.loads(CACHE.read_text()) if CACHE.exists() else {}
        batch, size = [], 0
        for value in values:
            if "en\0" + value in cached:
                continue
            if not re.search(r"[A-Za-z]", PROTECTED.sub("", value)):
                continue
            if size + len(value.encode()) + 100 > 3800:
                break
            batch.append(value)
            size += len(value.encode()) + 100
        print(f"Probing a real batch of {len(batch)} messages", flush=True)
        print(json.dumps(translate_batch(batch, "en")[:3], ensure_ascii=False))
        return

    source = read_source()
    source_hash = hashlib.sha256((json.dumps(source, ensure_ascii=False, sort_keys=True) + PROTECTED.pattern).encode()).hexdigest()
    stamp = f"// Source SHA256: {source_hash}\n"
    if args.check:
        for target in (LOCALE, INLINE):
            if not target.exists() or stamp not in target.read_text():
                raise SystemExit(f"Japanese messages need updating: {target.relative_to(ROOT)}")
        print("Japanese translations match their sources and reviewed overrides.")
        return

    flat = flatten(source["messages"])
    reviewed = {**source["overrides"], **flatten(source["authored"])}
    unknown = reviewed.keys() - flat.keys()
    if unknown:
        raise SystemExit(f"Unknown reviewed keys: {sorted(unknown)}")
    cache = json.loads(CACHE.read_text()) if CACHE.exists() else {}
    jobs = []
    for language, values in (
        ("en", sorted({value for key, value in flat.items() if key not in reviewed})),
        ("zh-CN", source["inline"]),
    ):
        batch, size = [], 0
        for value in values:
            cache_key = language + "\0" + value
            if cache_key in cache:
                # Invalidate old seed entries if a newly protected identifier was translated.
                if all(cache[cache_key].count(token) == value.count(token) for token in set(PROTECTED.findall(value))):
                    continue
                del cache[cache_key]
            # Keep symbols, model IDs and protocol identifiers verbatim.
            remainder = PROTECTED.sub("", value)
            if not re.search(r"[A-Za-z\u3400-\u9fff]", remainder):
                cache[cache_key] = value
                continue
            estimated = len(value.encode()) + 100
            if batch and size + estimated > 3800:
                jobs.append((language, batch))
                batch, size = [], 0
            batch.append(value)
            size += estimated
        if batch:
            jobs.append((language, batch))
    print(f"Translating {sum(len(items) for _, items in jobs)} unique messages in {len(jobs)} batches", flush=True)
    failures = []
    with ThreadPoolExecutor(max_workers=3) as executor:
        pending = {executor.submit(translate_with_retry, items, language): (language, items) for language, items in jobs}
        for completed, future in enumerate(as_completed(pending), 1):
            language, items = pending[future]
            try:
                translated_items = future.result()
            except Exception as error:
                failures.append(str(error))
                print(f"Batch needs review: {error}", flush=True)
                continue
            for original, translated in zip(items, translated_items):
                cache[language + "\0" + original] = translated
            CACHE.write_text(json.dumps(cache, ensure_ascii=False, indent=2))
            if completed % 10 == 0 or completed == len(jobs):
                print(f"Completed {completed}/{len(jobs)} batches", flush=True)

    if failures:
        raise SystemExit("Review failed batches, then resume from the local cache:\n" + "\n".join(failures))

    result = {key: reviewed.get(key, cache.get("en\0" + value)) for key, value in flat.items()}
    if any(not isinstance(value, str) or not value for value in result.values()):
        raise SystemExit("Incomplete Japanese translation")
    header = "// Japanese UI copy: translation seed plus reviewed overrides. See docs/hitk/translate-ja.py.\n" + stamp
    LOCALE.write_text(header + "export default " + json.dumps(unflatten(result), ensure_ascii=False, indent=2) + "\n")
    inline = {value: cache["zh-CN\0" + value] for value in source["inline"]}
    INLINE.write_text(header + "const messages: Record<string, string> = " + json.dumps(inline, ensure_ascii=False, indent=2)
                      + "\n\nexport function japaneseInline(text: string): string {\n  return messages[text] ?? text\n}\n")
    print(f"Wrote {len(result)} Japanese messages and {len(inline)} inline messages.")


if __name__ == "__main__":
    main()
