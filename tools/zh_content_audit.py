"""Scan published Chinese HTML for leftover English UI words.

There is no dist/. GitHub Pages serves the repository root, so this
checks zh/index.html and zh/knowledge/.
"""
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
ALLOW = {
    "Mika",
    "SEO",
    "GEO",
    "AI",
    "GitHub",
    "WhatsApp",
    "URL",
    "FAQ",
    "JSON",
    "HTML",
    "CSS",
    "HTTP",
    "HTTPS",
    "OG",
    "noindex",
    "EN",
    "P0",
    "P1",
    "P2",
    "P3",
    "P4",
    "OK",
}

WORD = re.compile(r"\b[A-Za-z][A-Za-z0-9_-]{2,}\b")
TAG = re.compile(r"<script\b[^>]*>.*?</script>|<style\b[^>]*>.*?</style>", re.I | re.S)


def visible_bits(html: str) -> str:
    html = TAG.sub(" ", html)
    texts = re.findall(r">([^<]+)<", html)
    attrs = re.findall(
        r'\b(?:aria-label|alt|title|placeholder)="([^"]*)"',
        html,
    )
    return "\n".join(texts + attrs)


def scan(path: Path) -> list[str]:
    hits = []
    blob = visible_bits(path.read_text(encoding="utf-8"))
    for word in WORD.findall(blob):
        if word in ALLOW:
            continue
        if word.startswith("http"):
            continue
        hits.append(word)
    return sorted(set(hits))


def main() -> int:
    files = [ROOT / "zh" / "index.html"]
    files.extend((ROOT / "zh" / "knowledge").rglob("index.html"))
    failed = False
    for path in files:
        words = scan(path)
        if path.name == "index.html" and path.parent == ROOT / "zh":
            blocked = [w for w in words if w.lower() in {
                "scan", "diagnose", "blueprint", "optimize", "system", "status",
                "health", "growth", "audit", "website", "coverage", "clarity",
                "answerability", "consistency", "evidence", "query", "page",
            }]
            if blocked:
                failed = True
                print(f"{path.relative_to(ROOT)}: {', '.join(blocked)}")
        elif words and path.parent.name == "knowledge" and path.parent.parent == ROOT / "zh":
            # Index page only: flag obvious UI leftovers, not article prose terms.
            blocked = [w for w in words if w in {"READ", "ARTICLE", "SYSTEM", "STATUS", "MENU"}]
            if blocked:
                failed = True
                print(f"{path.relative_to(ROOT)}: {', '.join(blocked)}")
    if failed:
        return 1
    print("zh content audit: homepage UI leftovers clear")
    return 0


if __name__ == "__main__":
    sys.exit(main())
