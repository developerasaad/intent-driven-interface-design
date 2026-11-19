#!/usr/bin/env python3
"""Dependency-free structural validation for this Agent Skill.

This does not test UI quality or runtime model behavior.
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / "SKILL.md"


def fail(message: str) -> None:
    print(f"FAIL: {message}", file=sys.stderr)
    raise SystemExit(1)


def main() -> None:
    text = SKILL.read_text(encoding="utf-8")
    match = re.match(r"\A---\n(.*?)\n---\n", text, re.S)
    if not match:
        fail("SKILL.md must start with YAML frontmatter")
    frontmatter, body = match.group(1), text[match.end():]
    values = {}
    for line in frontmatter.splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        if ":" not in line:
            fail(f"invalid frontmatter line: {line}")
        key, value = line.split(":", 1)
        values[key.strip()] = value.strip().strip("\"'")

    name = values.get("name", "")
    description = values.get("description", "")
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", name) or len(name) > 64:
        fail("invalid skill name")
    if name != ROOT.name:
        fail("skill name must match directory name")
    if not (1 <= len(description) <= 1024):
        fail("description must have 1–1024 characters")
    if not body.strip():
        fail("SKILL.md body missing")
    if len(text.splitlines()) >= 500:
        fail("SKILL.md should be shorter than 500 lines")

    references = re.findall(r"\]\((references/[^)]+|evals/[^)]+)\)", body)
    for relative in references:
        if not (ROOT / relative).is_file():
            fail(f"broken reference: {relative}")

    cases = json.loads((ROOT / "evals/cases.json").read_text(encoding="utf-8"))
    if not isinstance(cases, list) or len(cases) < 3:
        fail("expected at least 3 evaluation cases")
    ids = set()
    for case in cases:
        if not all(k in case for k in ("id", "should_trigger", "prompt", "focus")):
            fail("evaluation case missing keys")
        if not isinstance(case["should_trigger"], bool):
            fail(f"invalid should_trigger in {case['id']}")
        if case["id"] in ids:
            fail(f"duplicate case ID: {case['id']}")
        ids.add(case["id"])
    if not any(c["should_trigger"] for c in cases) or not any(not c["should_trigger"] for c in cases):
        fail("need positive and negative trigger cases")

    print(f"PASS: {name}; SKILL.md {len(text.splitlines())} lines; "
          f"{len(references)} internal references; {len(cases)} evaluation cases")
    print("NOTE: This validates structure, not model behavior or visual quality.")


if __name__ == "__main__":
    main()
