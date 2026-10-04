"""Add the missing long-form articles so the new corpus is 400, not a cap of 400 total."""
from __future__ import annotations

import hashlib
import html
import json
import re
import shutil
import subprocess
import sys
from io import BytesIO
from pathlib import Path

from PIL import Image

from articles_data import ARTICLES

SITE = Path(__file__).resolve().parents[4]
ROOT = SITE
SVG2PNG = ROOT / "scripts" / "blog-qa" / "incoming" / "seo-tech" / "_tools" / "svg2png.mjs"
PROXY = "http://127.0.0.1:18081"
DATE = "2026-10-04"
DATE_EN = "October 4, 2026"
DATE_ZH = "2026年10月4日"

LANE_ASSET = {
    "tech": "seo-tech",
    "growth": "seo-growth",
    "i18n": "multilingual",
    "geo": "geo",
}
SKIP_NAME = (
    "logo", "icon", "symbol", "ambox", "edit-clear", "commons-logo", "wikidata",
    "wiktionary", "disambiguation", "nuvola", "crystal", "gnome-", "folder",
    "padlock", "question_book", "semi-protection", "portal-", "speaker_icon",
    "stub", "favicon", "wordmark", "avatar", "sprite", "1x1", "pixel", "badge",
    "button", "flag_of", "coat_of_arms", "locator", "increase2", "decrease2",
    "red_pencil", "ooojs", "octicon", "font_awesome", "edit-copy", "wiki_letter",
    "protection", "cscr-featured", "text-html", "searchtool", "applications-",
)


def curl(url: str, timeout: int = 45) -> bytes:
    cmd = ["curl.exe", "-sL", "--max-time", str(timeout), "-A", "Mozilla/5.0 (compatible; MikaResearch/1.0)", url]
    r = subprocess.run(cmd, capture_output=True)
    if r.returncode != 0 or len(r.stdout) < 400:
        r = subprocess.run(cmd[:3] + ["-x", PROXY] + cmd[3:], capture_output=True)
    return r.stdout or b""


def curl_json(params: dict) -> dict:
    from urllib.parse import urlencode

    url = "https://en.wikipedia.org/w/api.php?" + urlencode(params)
    raw = curl(url)
    try:
        return json.loads(raw.decode("utf-8", "replace"))
    except json.JSONDecodeError:
        return {}


def kebab(text: str) -> str:
    text = text.lower()
    text = re.sub(r"\.[a-z0-9]{2,4}$", "", text)
    text = text.replace("file:", "")
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    return (text[:72] or "source-figure").strip("-")


def ahash(im: Image.Image) -> tuple:
    g = im.convert("L").resize((8, 8))
    pixels = list(g.getdata())
    avg = sum(pixels) / len(pixels)
    return tuple(1 if p > avg else 0 for p in pixels)


def load_existing_hashes() -> tuple[set, set]:
    stems = set()
    hashes = set()
    for p in (SITE / "assets" / "articles").rglob("*.webp"):
        stems.add(p.stem)
        try:
            with Image.open(p) as im:
                hashes.add(ahash(im))
        except Exception:
            continue
    return stems, hashes


def svg_is_content(data: bytes) -> bool:
    text = data[:4000].decode("utf-8", "replace")
    m = re.search(r'viewBox=["\']([0-9.\-\s]+)["\']', text)
    if m:
        parts = m.group(1).split()
        if len(parts) == 4:
            try:
                return float(parts[2]) >= 320 and float(parts[3]) >= 160
            except ValueError:
                return False
    return False


def to_webp(data: bytes):
    head = data[:200].lstrip().lower()
    if head.startswith(b"<svg") or head.startswith(b"<?xml") or b"<svg" in head[:800]:
        if not svg_is_content(data):
            return None
        tmp_svg = Path(__file__).with_name("_tmp.svg")
        tmp_png = Path(__file__).with_name("_tmp.png")
        tmp_svg.write_bytes(data)
        r = subprocess.run(["node", str(SVG2PNG), str(tmp_svg), str(tmp_png)], capture_output=True)
        tmp_svg.unlink(missing_ok=True)
        if r.returncode != 0 or not tmp_png.exists():
            tmp_png.unlink(missing_ok=True)
            return None
        data = tmp_png.read_bytes()
        tmp_png.unlink(missing_ok=True)
    try:
        im = Image.open(BytesIO(data))
        if getattr(im, "is_animated", False):
            im.seek(0)
        im = im.convert("RGB")
    except Exception:
        return None
    w, h = im.size
    if w < 320 or h < 160:
        return None
    if w > 1600:
        nh = max(1, round(h * (1600 / w)))
        im = im.resize((1600, nh), Image.Resampling.LANCZOS)
        w, h = im.size
    digest = ahash(im)
    buf = BytesIO()
    im.save(buf, format="WEBP", quality=72, method=4)
    return buf.getvalue(), w, h, digest  # type: ignore[return-value]


def name_skipped(name: str) -> bool:
    low = name.lower()
    return any(s in low for s in SKIP_NAME)


def wiki_images(title: str, used_files: set, stems: set, hashes: set) -> list[dict]:
    data = curl_json({
        "action": "query", "format": "json", "titles": title,
        "prop": "images", "imlimit": "40",
    })
    pages = list((data.get("query") or {}).get("pages", {}).values())
    if not pages or "missing" in pages[0]:
        return []
    files = []
    for im in pages[0].get("images") or []:
        name = im.get("title") or ""
        if name_skipped(name):
            continue
        if name in used_files:
            continue
        files.append(name)
    found = []
    for i in range(0, len(files), 6):
        batch = files[i:i + 6]
        info = curl_json({
            "action": "query", "format": "json", "titles": "|".join(batch),
            "prop": "imageinfo", "iiprop": "url|size|mime", "iiurlwidth": "1600",
        })
        for p in (info.get("query") or {}).get("pages", {}).values():
            ii = (p.get("imageinfo") or [None])[0]
            if not ii:
                continue
            w, h = ii.get("width") or 0, ii.get("height") or 0
            if w < 320 or h < 160:
                continue
            url = ii.get("thumburl") or ii.get("url")
            if not url:
                continue
            if "thumburl" not in ii and w > 1600:
                url = ii.get("url")
            found.append({
                "file": p.get("title") or "",
                "url": url,
                "mime": ii.get("mime") or "",
            })
        if len(found) >= 4:
            break
    saved = []
    for item in found:
        if item["file"] in used_files:
            continue
        stem = kebab(item["file"])
        if stem in stems:
            continue
        raw = curl(item["url"])
        if len(raw) < 800:
            continue
        converted = to_webp(raw)
        if not converted:
            continue
        blob, w, h, digest = converted
        if digest in hashes:
            continue
        saved.append({"file": item["file"], "stem": stem, "blob": blob, "w": w, "h": h, "digest": digest})
        used_files.add(item["file"])
        stems.add(stem)
        hashes.add(digest)
        if len(saved) >= 2:
            break
    return saved


def html_images(page_url: str, used_files: set, stems: set, hashes: set) -> list[dict]:
    raw = curl(page_url)
    if len(raw) < 800:
        return []
    text = raw.decode("utf-8", "replace")
    srcs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', text, flags=re.I)
    saved = []
    seen = set()
    for src in srcs:
        if src.startswith("data:"):
            continue
        low = src.lower()
        if name_skipped(low):
            continue
        if low.endswith(".svg"):
            continue
        if src.startswith("//"):
            src = "https:" + src
        elif src.startswith("/"):
            origin = re.match(r"https?://[^/]+", page_url)
            if not origin:
                continue
            src = origin.group(0) + src
        elif not src.startswith("http"):
            continue
        if src in seen:
            continue
        seen.add(src)
        stem = kebab(src.split("?")[0].rstrip("/").split("/")[-1])
        if stem in stems or src in used_files:
            continue
        blob_raw = curl(src)
        if len(blob_raw) < 800:
            continue
        converted = to_webp(blob_raw)
        if not converted:
            continue
        blob, w, h, digest = converted
        if digest in hashes:
            continue
        saved.append({"file": stem, "stem": stem, "blob": blob, "w": w, "h": h, "digest": digest})
        used_files.add(src)
        stems.add(stem)
        hashes.add(digest)
        if len(saved) >= 2:
            break
    return saved


BACKUP_WIKI = [
    "Rosetta_Stone", "Multilingualism", "Printing_press", "Newspaper", "Library",
    "Encyclopedia", "Book", "Manuscript", "Scroll", "Typewriter",
    "Globe", "World_map", "Compass", "Clock", "Calendar",
    "Abacus", "Telescope", "Microscope", "Camera", "Radio",
    "Telephone", "Television", "Computer", "Computer_keyboard", "Data_center",
    "Hard_disk_drive", "Barcode", "QR_code", "Traffic_sign", "Passport",
    "Banknote", "Coin", "Blueprint", "Technical_drawing", "Calipers",
    "Ruler", "Thermometer", "Valve", "Pump", "Electric_motor",
    "Gear", "Ball_bearing", "Assembly_line", "Warehouse", "Shipping_container",
    "Forklift", "Conveyor_belt", "Robot", "Factory", "Machine_shop",
    "Laboratory", "Oscilloscope", "Multimeter", "Circuit_breaker", "Transformer",
]


def backup_source(start: int, used_files: set, stems: set, hashes: set) -> tuple[list[dict], dict]:
    order = BACKUP_WIKI[start:] + BACKUP_WIKI[:start]
    for title in order:
        source = {
            "kind": "wiki",
            "title": title,
            "url": "https://en.wikipedia.org/wiki/" + title,
            "label": title.replace("_", " "),
        }
        imgs = wiki_images(title, used_files, stems, hashes)
        if imgs:
            return imgs, source
    return [], {}


def fetch_for_article(article: dict, used_files: set, stems: set, hashes: set, index: int = 0) -> tuple[list[dict], dict]:
    for source in article["sources"]:
        if source["kind"] == "html":
            imgs = html_images(source["url"], used_files, stems, hashes)
        else:
            imgs = wiki_images(source["title"], used_files, stems, hashes)
        if imgs:
            return imgs, source
    return backup_source(index, used_files, stems, hashes)


def esc(text: str) -> str:
    return html.escape(text, quote=True)


def prefix_for(lane: str, lang: str) -> str:
    if lane == "geo":
        return "../../../../" if lang == "zh" else "../../../"
    if lang == "zh":
        return "../../../"
    return "../../"


def page_url(article: dict, lang: str) -> str:
    slug = article["slug"]
    if article["lane"] == "geo":
        path = f"/zh/knowledge/geo/{slug}/" if lang == "zh" else f"/knowledge/geo/{slug}/"
    else:
        path = f"/zh/blog/{slug}/" if lang == "zh" else f"/blog/{slug}/"
    return "https://mikaovo.ai" + path


def path_only(article: dict, lang: str) -> str:
    return page_url(article, lang).replace("https://mikaovo.ai", "")


def img_public_src(article: dict, filename: str, lang: str) -> str:
    lane = article["lane"]
    folder = LANE_ASSET[lane]
    if lane == "growth" or lane == "geo":
        return f"/assets/articles/{folder}/{article['slug']}/{filename}"
    rel = prefix_for(lane, lang)
    return f"{rel}assets/articles/{folder}/{article['slug']}/{filename}"


def absolute_img(article: dict, filename: str) -> str:
    folder = LANE_ASSET[article["lane"]]
    return f"https://mikaovo.ai/assets/articles/{folder}/{article['slug']}/{filename}"


def h1_from(site_path: str) -> str:
    file = SITE / site_path.strip("/") / "index.html"
    if not file.exists():
        return ""
    text = file.read_text(encoding="utf-8", errors="ignore")
    m = re.search(r"<h1[^>]*>(.*?)</h1>", text, flags=re.S)
    if not m:
        return ""
    return re.sub(r"<[^>]+>", "", m.group(1)).strip()


def localize_href(href: str, lang: str) -> str:
    if lang == "en":
        return href
    if href.startswith("/zh/") or href.startswith("/#") or href.startswith("http"):
        if href.startswith("/#"):
            return "/zh/" + href[1:]
        return href
    if href.startswith("/"):
        return "/zh" + href
    return href


def related_items(article: dict, articles: list[dict], lang: str) -> list[tuple[str, str]]:
    lane = article["lane"]
    pools = {
        "tech": [
            "/knowledge/what-is-a-website-seo-audit/",
            "/knowledge/how-to-check-website-crawlability/",
            "/qa/which-status-codes-matter-for-crawling/",
            "/blog/what-seo-health-asks-of-a-live-site/",
            "/knowledge/seo-health-vs-seo-growth/",
        ],
        "growth": [
            "/knowledge/how-to-find-content-gaps/",
            "/knowledge/how-to-map-search-intent/",
            "/qa/what-is-seo-growth/",
            "/blog/what-seo-growth-still-leaves-open/",
            "/blog/near-duplicates-versus-real-coverage/",
        ],
        "i18n": [
            "/knowledge/how-to-check-hreflang/",
            "/knowledge/multilingual-search-visibility/",
            "/qa/how-should-bilingual-pages-share-facts/",
            "/blog/consistent-facts-across-languages/",
            "/qa/why-avoid-an-en-url-prefix/",
        ],
        "geo": [
            "/knowledge/what-is-geo/",
            "/knowledge/how-to-improve-citation-readiness/",
            "/qa/what-is-citation-readiness/",
            "/blog/direct-answers-on-product-pages/",
            "/qa/what-are-the-four-geo-building-blocks/",
        ],
    }
    same = [a for a in articles if a["lane"] == lane]
    idx = next(i for i, a in enumerate(same) if a["slug"] == article["slug"])
    siblings = [same[(idx + 1) % len(same)], same[(idx + 2) % len(same)]]
    items = []
    for href in pools[lane]:
        zh_href = localize_href(href, lang)
        label = h1_from(zh_href if lang == "zh" else href)
        if not label:
            label = href.strip("/").split("/")[-1].replace("-", " ")
        items.append((zh_href if lang == "zh" else href, label))
    for sib in siblings:
        href = path_only(sib, lang)
        label = sib["title_zh"] if lang == "zh" else sib["title_en"]
        items.append((href, label))
    home = "/zh/#framework" if lang == "zh" else "/#framework"
    home_label = "Mika 首页 — 四条轨道" if lang == "zh" else "Mika homepage — four tracks"
    items.append((home, home_label))
    return items


def figures_html(article: dict, images: list[dict], source: dict, lang: str) -> list[str]:
    page = source.get("url") or ""
    label = source.get("label") or page
    blocks = []
    topic = article["topic_zh"] if lang == "zh" else article["topic_en"]
    for i, im in enumerate(images):
        src = img_public_src(article, im["stem"] + ".webp", lang)
        nice = im["file"].replace("File:", "").rsplit(".", 1)[0].replace("_", " ").replace("-", " ")
        if lang == "zh":
            alt = f"来源页面正文中的配图（{nice}），用来说明{topic}。"
            if article["lane"] == "i18n":
                cap = f'图来自来源页面 <a href="{esc(page)}">{esc(page)}</a>。此处只作说明，正文是 Mika 自己的解释。'
            elif article["lane"] == "geo":
                cap = f'来源页面: <a href="{esc(page)}" rel="noopener">{esc(label)}</a>'
            else:
                cap = f"图来自来源页面：{esc(page)}"
        else:
            alt = f"{nice}. Content image from the source page, illustrating {topic}."
            if article["lane"] == "i18n":
                cap = f'Figure published on the source page <a href="{esc(page)}">{esc(page)}</a>. Shown here as an illustration; the article text is Mika’s own explanation.'
            elif article["lane"] == "geo":
                cap = f'Source page: <a href="{esc(page)}" rel="noopener">{esc(label)}</a>'
            elif article["lane"] == "growth":
                cap = f'Source page: <a href="{esc(page)}">{esc(page)}</a>'
            else:
                cap = f"Image from the source page: {esc(page)}"
        loading = "" if i == 0 else ' loading="lazy"'
        img = (
            f'<img src="{esc(src)}" alt="{esc(alt)}" width="{im["w"]}" height="{im["h"]}"{loading} '
            f'style="max-width:100%;height:auto">'
        )
        if article["lane"] == "i18n":
            blocks.append(f'<figure class="i18n-fig">\n  {img}\n  <figcaption>{cap}</figcaption>\n</figure>')
        elif article["lane"] == "growth":
            blocks.append(
                '<figure style="margin:28px 0">\n            '
                + img + '\n            <figcaption style="margin-top:8px;font-size:14px;line-height:1.5">'
                + cap + "</figcaption>\n          </figure>"
            )
        elif article["lane"] == "geo":
            blocks.append(
                '<figure style="margin:20px 0 8px">' + img
                + '<figcaption style="font-family:IBM Plex Mono,ui-monospace,monospace;font-size:12px;line-height:1.5;margin-top:8px">'
                + cap + "</figcaption></figure>"
            )
        else:
            blocks.append(f"<figure>\n            {img}\n            <figcaption>{cap}</figcaption>\n          </figure>")
    return blocks


def json_ld(article: dict, images: list[dict], lang: str) -> str:
    url = page_url(article, lang)
    title = article["title_zh"] if lang == "zh" else article["title_en"]
    desc = article["desc_zh"] if lang == "zh" else article["desc_en"]
    image = absolute_img(article, images[0]["stem"] + ".webp")
    if article["lane"] == "geo":
        if lang == "zh":
            crumbs = [
                ("首页", "https://mikaovo.ai/zh/"),
                ("知识中心", "https://mikaovo.ai/zh/knowledge/"),
                ("GEO", "https://mikaovo.ai/zh/knowledge/geo/"),
                (title, url),
            ]
        else:
            crumbs = [
                ("Home", "https://mikaovo.ai/"),
                ("Knowledge Center", "https://mikaovo.ai/knowledge/"),
                ("GEO", "https://mikaovo.ai/knowledge/geo/"),
                (title, url),
            ]
    else:
        if lang == "zh":
            crumbs = [
                ("首页", "https://mikaovo.ai/zh/"),
                ("博客", "https://mikaovo.ai/zh/blog/"),
                (title, url),
            ]
        else:
            crumbs = [
                ("Home", "https://mikaovo.ai/"),
                ("Blog", "https://mikaovo.ai/blog/"),
                (title, url),
            ]
    faqs = []
    for n in (1, 2, 3):
        q = article[f"q{n}_zh"] if lang == "zh" else article[f"q{n}_en"]
        a = article["short_zh" if n == 1 else "explain_zh" if n == 2 else "limit_zh"] if lang == "zh" else article["short_en" if n == 1 else "explain_en" if n == 2 else "limit_en"]
        faqs.append({
            "@type": "Question",
            "name": q,
            "acceptedAnswer": {"@type": "Answer", "text": a},
        })
    graph = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Article",
                "@id": url + "#article",
                "headline": title,
                "name": title,
                "description": desc,
                "datePublished": DATE,
                "dateModified": DATE,
                "inLanguage": "zh-Hans" if lang == "zh" else "en",
                "image": image,
                "author": {"@type": "Organization", "name": "Mika", "url": "https://mikaovo.ai/"},
                "publisher": {
                    "@type": "Organization",
                    "name": "Mika",
                    "url": "https://mikaovo.ai/",
                    "logo": {"@type": "ImageObject", "url": "https://mikaovo.ai/assets/logo.svg"},
                },
                "mainEntityOfPage": {"@type": "WebPage", "@id": url},
                "isPartOf": {"@type": "WebSite", "name": "Mika", "url": "https://mikaovo.ai/"},
            },
            {
                "@type": "BreadcrumbList",
                "@id": url + "#breadcrumb",
                "itemListElement": [
                    {"@type": "ListItem", "position": i + 1, "name": name, "item": item}
                    for i, (name, item) in enumerate(crumbs)
                ],
            },
            {
                "@type": "FAQPage",
                "@id": url + "#faq",
                "mainEntity": faqs,
            },
        ],
    }
    return json.dumps(graph, ensure_ascii=False, separators=(",", ":"))


def mika_block(article: dict, lang: str) -> str:
    filing = article["filing_zh"] if lang == "zh" else article["filing_en"]
    lane = article["lane"]
    if lang == "zh":
        base = {
            "tech": "Mika Visibility 把这项检查放在 SEO 健康轨道上，和可抓取性、状态码、页面基础放在一起。SEO 增长仍是另一个问题：哪些覆盖还没有写出来。GEO 仍是另一个问题：认真的读者能否在页面上找到可支撑的回答。没有混合总分。",
            "growth": "Mika Visibility 把这项工作放在 SEO 增长轨道上：覆盖、意图深度和市场是否还空着。它不是 SEO 健康分数，也不是 GEO。页面数量不等于增长。没有混合总分。",
            "i18n": "Mika Visibility 要求每种已发布的语言保留同一套公司名、产品名、规格和应用，同时允许该市场的问题有真正的深度。英语在站点根目录，中文在 /zh/，不要增加 /en/ 前缀。hreflang 使用 en、zh-Hans，以及指向英文 URL 的 x-default。健康分数不会自动变成增长分数。",
            "geo": "Mika Visibility 里的 GEO 是生成式引擎优化，不是地理定位。四个构件是实体、直接回答、证据和一致的上下文。引用就绪度是页面可以被更少歧义地转述的质量，不是任何回答产品会引用它的承诺。",
        }[lane]
    else:
        base = {
            "tech": "Mika Visibility files this on the SEO Health track, with crawlability, status codes, and page basics. SEO Growth remains a separate question about coverage that is still unwritten. GEO remains a separate question about whether a careful reader can find a supportable answer. There is no blended overall score.",
            "growth": "Mika Visibility files this on the SEO Growth track: coverage, intent depth, and markets that are still open. It is not an SEO Health score and it is not GEO. Page count is not growth. There is no blended overall score.",
            "i18n": "Mika Visibility keeps one set of company, product, specification, and application facts in every language you publish, while the market’s own questions need real depth. English stays at the root. Chinese stays under /zh/. Do not add an /en/ prefix. Hreflang uses en, zh-Hans, and x-default pointing at the English URL. A health finding never becomes a growth score.",
            "geo": "In Mika Visibility, GEO means generative engine optimization, not geographic targeting. The four building blocks are entities, direct answers, evidence, and consistent context. Citation readiness means a careful reader could quote a statement with less ambiguity. It is a quality of the page, not a promise that any answer product will cite it.",
        }[lane]
    return f"<p>{esc(filing)} {esc(base)}</p>"


def checks_html(article: dict, lang: str) -> str:
    items = article["checks_zh"] if lang == "zh" else article["checks_en"]
    lis = "\n".join(f"            <li>{esc(item)}</li>" for item in items)
    return f"          <ul>\n{lis}\n          </ul>"


def faq_html(article: dict, lang: str) -> str:
    chunks = []
    answers = {
        1: article["short_zh"] if lang == "zh" else article["short_en"],
        2: article["explain_zh"] if lang == "zh" else article["explain_en"],
        3: article["limit_zh"] if lang == "zh" else article["limit_en"],
    }
    for n in (1, 2, 3):
        q = article[f"q{n}_zh"] if lang == "zh" else article[f"q{n}_en"]
        chunks.append(
            "          <details>\n"
            f"            <summary>{esc(q)}</summary>\n"
            f"            <p>{esc(answers[n])}</p>\n"
            "          </details>"
        )
    title = "常见问题" if lang == "zh" else "FAQ"
    return (
        '        <section class="kc-faq" id="faq" aria-labelledby="faq-title">\n'
        f'          <h2 id="faq-title">{title}</h2>\n'
        + "\n".join(chunks)
        + "\n        </section>"
    )


def related_html(article: dict, articles: list[dict], lang: str) -> str:
    title = "相关指南" if lang == "zh" else "Related guides"
    lis = []
    for href, label in related_items(article, articles, lang):
        lis.append(f'            <li><a href="{esc(href)}">{esc(label)}</a></li>')
    return (
        '        <section class="kc-related" aria-labelledby="related-title">\n'
        f'          <h2 id="related-title">{title}</h2>\n          <ul>\n'
        + "\n".join(lis)
        + "\n          </ul>\n        </section>"
    )


def sources_html(article: dict, source: dict, lang: str) -> str:
    page = source.get("url") or ""
    label = source.get("label") or page
    title = "来源" if lang == "zh" else "Sources"
    if lang == "zh":
        note = "背景参考。本页正文是原创说明，不复述该页的段落。配图来自该页，并在图注中标明。"
        home = f'<li><a href="/zh/#framework">Mika Visibility 首页</a> — 四条轨道的产品说明。首页示例数字只是界面示意，不是结果。</li>'
    else:
        note = "Background reference. The prose on this page is original and does not reproduce that article’s paragraphs. The figure comes from that page and is credited in the caption."
        home = '<li><a href="/#framework">Mika Visibility homepage</a> — Product framing for the four tracks. Sample interface counts on the homepage are illustrative, not a case study.</li>'
    return (
        '        <aside class="kc-sources" aria-labelledby="sources-title">\n'
        f'          <h2 id="sources-title">{title}</h2>\n          <ol>\n'
        f'            <li><a href="{esc(page)}">{esc(label)}</a> — {note}</li>\n'
        f"            {home}\n"
        "          </ol>\n        </aside>"
    )


def cta_html(lang: str) -> str:
    if lang == "zh":
        return (
            '        <section class="kc-cta" aria-labelledby="cta-title">\n'
            '          <h2 id="cta-title">下一步</h2>\n'
            "          <p>做一次结构化的 SEO 与 GEO 审计，看健康发现、增长缺口，以及可以执行的蓝图。</p>\n"
            '          <p><a href="/zh/#cta">从 Mika 开始</a></p>\n'
            "          <p>更清楚的实体、回答、证据和上下文，让页面更容易被理解和转述。任何回答产品中的结果都不保证。</p>\n"
            '          <div class="contact-cards" data-contact-cards></div>\n'
            "        </section>"
        )
    return (
        '        <section class="kc-cta" aria-labelledby="cta-title">\n'
        '          <h2 id="cta-title">Next step</h2>\n'
        "          <p>Run a structured SEO + GEO audit to see health findings, growth gaps, and a blueprint you can act on.</p>\n"
        '          <p><a href="/#cta">Start on Mika</a></p>\n'
        "          <p>Clearer entities, answers, evidence, and context make pages easier to understand and reference. Results in any answer product are not guaranteed.</p>\n"
        '          <div class="contact-cards" data-contact-cards></div>\n'
        "        </section>"
    )


def body_sections(article: dict, articles: list[dict], images_html: list[str], lang: str) -> str:
    lane = article["lane"]
    short = esc(article["short_zh"] if lang == "zh" else article["short_en"])
    explain = esc(article["explain_zh"] if lang == "zh" else article["explain_en"])
    how = esc(article["how_zh"] if lang == "zh" else article["how_en"])
    example = esc(article["example_zh"] if lang == "zh" else article["example_en"])
    limit = esc(article["limit_zh"] if lang == "zh" else article["limit_en"])
    fig1 = images_html[0] if images_html else ""
    fig2 = images_html[1] if len(images_html) > 1 else ""
    checks = checks_html(article, lang)
    mika = mika_block(article, lang)
    if lang == "zh":
        labels = {
            "short": "短答", "def": "定义", "how": "页面上怎么出现", "checks": "要检查什么",
            "example": "一个结构示例", "limits": "它不声称什么", "mika": "Mika Visibility 把它归到哪里",
            "why": "为什么重要", "depth": "内容深度", "discovery": "未回答的主题如何被找到",
            "fields": "哪些字段必须说同一件事", "topic": "页面上的问题", "signals": "随页面一起走的信号",
            "direct": "直接回答",
        }
    else:
        labels = {
            "short": "Short answer", "def": "Definition", "how": "What belongs on the page",
            "checks": "What to check", "example": "A practical example", "limits": "What this does not claim",
            "mika": "Where Mika Visibility files this", "why": "Why it matters", "depth": "Content depth",
            "discovery": "How an unanswered topic gets found", "fields": "Fields that must say the same thing",
            "topic": "The issue on the page", "signals": "Signals that travel with the page",
            "direct": "Direct answer",
        }

    def sec(sid, label, inner):
        return f'        <section id="{sid}">\n          <h2>{label}</h2>\n{inner}\n        </section>'

    if lane == "tech":
        parts = [
            sec("short-answer", labels["short"], f"          <p>{short}</p>\n          {fig1}"),
            sec("definition", labels["def"], f"          <p>{explain}</p>"),
            sec("how", labels["how"], f"          <p>{how}</p>"),
            sec("checks", labels["checks"], checks),
            sec("example", labels["example"], f"          <p>{example}</p>\n          {fig2}"),
            sec("limits", labels["limits"], f"          <p>{limit}</p>"),
            sec("mika", labels["mika"], "          " + mika),
        ]
    elif lane == "growth":
        parts = [
            sec("direct-answer", labels["direct"], f"          <p>{short}</p>\n          {fig1}"),
            sec("why-it-matters", labels["why"], f"          <p>{explain}</p>"),
            sec("what-to-check", labels["checks"], f"          <p>{how}</p>\n{checks}"),
            sec("example", labels["example"], f"          <p>{example}</p>\n          {fig2}"),
            sec("depth", labels["depth"], f"          <p>{esc(article['depth_zh'] if lang == 'zh' else article['depth_en'])}</p>"),
            sec("discovery", labels["discovery"], f"          <p>{esc(article['discover_zh'] if lang == 'zh' else article['discover_en'])}</p>\n          {mika}"),
            sec("does-not-claim", labels["limits"], f"          <p>{limit}</p>"),
        ]
    elif lane == "i18n":
        parts = [
            sec("definition", labels["def"], f"          <p>{explain}</p>"),
            sec("short-answer", labels["short"], f"          <p>{short}</p>\n          {fig1}"),
            sec("fields", labels["fields"], f"          <p>{how}</p>"),
            sec("topic", labels["topic"], f"          <p>{esc(article['depth_zh'] if lang == 'zh' else article['depth_en'])}</p>"),
            sec("signals", labels["signals"], f"          <p>{esc(article['discover_zh'] if lang == 'zh' else article['discover_en'])}</p>\n          {mika}"),
            sec("what-to-check", labels["checks"], checks),
            sec("does-not-claim", labels["limits"], f"          <p>{limit}</p>"),
            sec("example", labels["example"], f"          <p>{example}</p>\n          {fig2}"),
        ]
    else:
        parts = [
            sec("definition", labels["def"], f"          <p>{explain}</p>\n          {fig1}"),
            sec("short-answer", labels["short"], f"          <p>{short}</p>"),
            sec("explanation", labels["how"], f"          <p>{how}</p>\n          <p>{esc(article['depth_zh'] if lang == 'zh' else article['depth_en'])}</p>\n          {mika}"),
            sec("checks", labels["checks"], checks),
            sec("example", labels["example"], f"          <p>{example}</p>\n          {fig2}"),
            sec("limits", labels["limits"], f"          <p>{limit}</p>"),
        ]
    parts.append(faq_html(article, lang))
    parts.append(related_html(article, articles, lang))
    parts.append(sources_html(article, article["_source"], lang))
    parts.append(cta_html(lang))
    return "\n".join(parts)


def toc(article: dict, lang: str) -> str:
    lane = article["lane"]
    if lang == "zh":
        mapping = {
            "tech": [("short-answer", "短答"), ("definition", "定义"), ("how", "页面上怎么出现"), ("checks", "要检查什么"), ("example", "一个结构示例"), ("limits", "它不声称什么"), ("mika", "Mika Visibility 把它归到哪里"), ("faq", "常见问题")],
            "growth": [("direct-answer", "直接回答"), ("why-it-matters", "为什么重要"), ("what-to-check", "要检查什么"), ("example", "一个结构示例"), ("depth", "内容深度"), ("discovery", "未回答的主题如何被找到"), ("does-not-claim", "它不声称什么"), ("faq", "常见问题")],
            "i18n": [("definition", "定义"), ("short-answer", "短答"), ("fields", "哪些字段必须说同一件事"), ("topic", "页面上的问题"), ("signals", "随页面一起走的信号"), ("what-to-check", "要检查什么"), ("does-not-claim", "它不声称什么"), ("example", "一个结构示例"), ("faq", "常见问题")],
            "geo": [("definition", "定义"), ("short-answer", "短答"), ("explanation", "页面上怎么出现"), ("checks", "要检查什么"), ("example", "一个结构示例"), ("limits", "它不声称什么"), ("faq", "常见问题")],
        }
        aside_label, aside_p = "本页目录", "本页目录"
    else:
        mapping = {
            "tech": [("short-answer", "Short answer"), ("definition", "Definition"), ("how", "What belongs on the page"), ("checks", "What to check"), ("example", "A practical example"), ("limits", "What this does not claim"), ("mika", "Where Mika Visibility files this"), ("faq", "FAQ")],
            "growth": [("direct-answer", "Direct answer"), ("why-it-matters", "Why it matters"), ("what-to-check", "What to check"), ("example", "A practical example"), ("depth", "Content depth"), ("discovery", "How an unanswered topic gets found"), ("does-not-claim", "What this does not claim"), ("faq", "FAQ")],
            "i18n": [("definition", "Definition"), ("short-answer", "Short answer"), ("fields", "Fields that must say the same thing"), ("topic", "The issue on the page"), ("signals", "Signals that travel with the page"), ("what-to-check", "What to check"), ("does-not-claim", "What this does not claim"), ("example", "A practical example"), ("faq", "FAQ")],
            "geo": [("definition", "Definition"), ("short-answer", "Short answer"), ("explanation", "How this shows up on a website"), ("checks", "What to check"), ("example", "A practical example"), ("limits", "What this does not claim"), ("faq", "FAQ")],
        }
        aside_label, aside_p = "On this page", "On this page"
    lis = "\n".join(f'            <li><a href="#{sid}">{label}</a></li>' for sid, label in mapping[lane])
    return (
        f'      <aside class="kc-toc" aria-label="{aside_label}">\n        <p>{aside_p}</p>\n        <nav>\n          <ol>\n'
        + lis + "\n          </ol>\n        </nav>\n      </aside>"
    )


def render_page(article: dict, articles: list[dict], images: list[dict], lang: str) -> str:
    lane = article["lane"]
    pre = prefix_for(lane, lang)
    url = page_url(article, lang)
    en_url = page_url(article, "en")
    zh_url = page_url(article, "zh")
    title = article["title_zh"] if lang == "zh" else article["title_en"]
    desc = article["desc_zh"] if lang == "zh" else article["desc_en"]
    if lane == "geo":
        suffix = " | Mika 知识中心" if lang == "zh" else " | Mika Knowledge Center"
    else:
        suffix = " | Mika 博客" if lang == "zh" else " | Mika Blog"
    full_title = title + suffix
    og_image = absolute_img(article, images[0]["stem"] + ".webp")
    if lang == "zh":
        skip, home, know, blog, qa = "跳到正文", "/zh/", "/zh/knowledge/", "/zh/blog/", "/zh/qa/"
        home_l, know_l, blog_l, qa_l = "首页", "知识中心" if lane == "geo" else "知识中心", "博客", "问答"
        nav_label = "主导航"
        contact = "联系"
        meta = article.get("tag_zh", "技术")
        if lane == "geo":
            meta_html = f'<p class="kc-meta"><a href="/zh/knowledge/geo/">GEO</a> · <time datetime="{DATE}">{DATE_ZH}</time></p>'
        else:
            meta_html = f'<p class="kc-meta"><span>{esc(meta)}</span> · <time datetime="{DATE}">{DATE_ZH}</time></p>'
        brand_href = "/zh/"
        footer_links = (
            f'<p><a href="/zh/">Mika Visibility</a> · <a href="{know}">知识中心</a> · '
            + (f'<a href="/zh/knowledge/geo/">GEO</a>' if lane == "geo" else f'<a href="{blog}">博客</a> · <a href="{qa}">问答</a>')
            + "</p>"
        )
        og_locale, og_alt = "zh_CN", "en_US"
        lang_attr = "zh-Hans"
    else:
        skip, home, know, blog, qa = "Skip to content", "/", "/knowledge/", "/blog/", "/qa/"
        home_l = "Home"
        know_l = "Knowledge Center" if lane == "geo" else "Knowledge"
        blog_l, qa_l = "Blog", "Q&A"
        nav_label = "Primary"
        contact = "Contact"
        meta = article.get("tag_en", "Technical")
        if lane == "geo":
            meta_html = f'<p class="kc-meta"><a href="/knowledge/geo/">GEO</a> · <time datetime="{DATE}">{DATE_EN}</time></p>'
        else:
            meta_html = f'<p class="kc-meta"><span>{esc(meta)}</span> · <time datetime="{DATE}">{DATE_EN}</time></p>'
        brand_href = "/"
        footer_links = (
            f'<p><a href="/">Mika Visibility</a> · <a href="{know}">{know_l if lane != "geo" else "Knowledge Center"}</a> · '
            + ('<a href="/knowledge/geo/">GEO</a>' if lane == "geo" else f'<a href="{blog}">Blog</a> · <a href="{qa}">Q&A</a>')
            + "</p>"
        )
        og_locale, og_alt = "en_US", "zh_CN"
        lang_attr = "en"
    en_current = ' aria-current="page"' if lang == "en" else ""
    zh_current = ' aria-current="page"' if lang == "zh" else ""
    if lane == "geo":
        nav = (
            f'        <a href="{home}">{home_l}</a>\n'
            f'        <a href="{know}">{know_l}</a>\n'
            f'        <div class="kc-lang" aria-label="Language">\n'
            f'          <a href="{path_only(article, "en")}"{en_current}>EN</a>\n'
            f'          <a href="{path_only(article, "zh")}"{zh_current}>中文</a>\n'
            f"        </div>\n"
        )
    else:
        nav = (
            f'        <a href="{home}">{home_l}</a>\n'
            f'        <a href="{know}">{know_l}</a>\n'
            f'        <a href="{blog}">{blog_l}</a>\n'
            f'        <a href="{qa}">{qa_l}</a>\n'
            f'        <div class="kc-lang" aria-label="Language">\n'
            f'          <a href="{path_only(article, "en")}"{en_current}>EN</a>\n'
            f'          <a href="{path_only(article, "zh")}"{zh_current}>中文</a>\n'
            f"        </div>\n"
        )
    figs = figures_html(article, images, article["_source"], lang)
    note = "仅供教育。Mika 不保证搜索排名或 AI 回答引用。" if lang == "zh" else "Educational material only. Mika does not guarantee search rankings or AI answer citations."
    lead = article["short_zh"] if lang == "zh" else article["short_en"]
    return f"""<!DOCTYPE html>
<html lang="{lang_attr}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{esc(full_title)}</title>
  <meta name="description" content="{esc(desc)}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="{url}">
  <link rel="alternate" hreflang="en" href="{en_url}">
  <link rel="alternate" hreflang="zh-Hans" href="{zh_url}">
  <link rel="alternate" hreflang="x-default" href="{en_url}">
  <link rel="sitemap" type="application/xml" title="Sitemap" href="https://mikaovo.ai/sitemap.xml">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="{og_locale}">
  <meta property="og:locale:alternate" content="{og_alt}">
  <meta property="og:site_name" content="Mika">
  <meta property="og:title" content="{esc(full_title)}">
  <meta property="og:description" content="{esc(desc)}">
  <meta property="og:url" content="{url}">
  <meta property="og:image" content="{og_image}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{esc(full_title)}">
  <meta name="twitter:description" content="{esc(desc)}">
  <meta name="theme-color" content="#F5F7FB">
  <link rel="icon" href="{pre}assets/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="{pre}styles.css">
  <link rel="stylesheet" href="{pre}src/knowledge/center.css">
  <script type="application/ld+json">
{json_ld(article, images, lang)}
  </script>
</head>
<body class="kc-page">
  <a class="kc-skip" href="#main">{skip}</a>
  <header class="kc-header">
    <div class="kc-wrap kc-nav">
      <a class="kc-brand" href="{brand_href}" aria-label="Mika Visibility">
        <img src="{pre}assets/logo.svg" alt="Mika Visibility" width="22" height="22">
        <span>Mika <span>Visibility</span></span>
      </a>
      <nav class="kc-nav-links" aria-label="{nav_label}">
{nav}        <div class="kc-nav-contact">
          <button type="button" class="kc-nav-contact-btn" data-contact-open="header" aria-expanded="false" aria-haspopup="dialog" aria-controls="contact-popover-nav">{contact}</button>
          <div id="contact-popover-nav" class="contact-popover contact-popover-nav" hidden></div>
        </div>
      </nav>
    </div>
  </header>
  <main id="main">
    <header class="kc-hero">
      <div class="kc-wrap">
        {meta_html}
        <h1>{esc(title)}</h1>
        <p class="kc-hero-lead">{esc(lead)}</p>
        <p class="kc-hero-note">{note}</p>
      </div>
    </header>
    <div class="kc-wrap kc-layout">
{toc(article, lang)}
      <article class="kc-body">
{body_sections(article, articles, figs, lang)}
      </article>
    </div>
  </main>
  <footer class="kc-footer">
    <div class="kc-wrap">
      {footer_links}
      <div data-contact-footer></div>
    </div>
  </footer>
  <div class="contact-dock">
    <div id="contact-popover-dock" class="contact-popover contact-popover-dock" hidden></div>
    <button type="button" class="contact-dock-btn" data-contact-open="dock" aria-expanded="false" aria-haspopup="dialog" aria-controls="contact-popover-dock">{contact}</button>
  </div>
  <div id="contact-sheet" class="contact-sheet" hidden role="dialog" aria-modal="true" aria-labelledby="contact-sheet-title">
    <div class="contact-sheet-card"></div>
  </div>
  <div id="contact-live" class="kc-sr" aria-live="polite"></div>
  <script src="{pre}contact-config.js"></script>
  <script src="{pre}contact.js"></script>
</body>
</html>
"""


def write_pages(article: dict, articles: list[dict], images: list[dict]) -> None:
    slug = article["slug"]
    lane = article["lane"]
    folder = LANE_ASSET[lane]
    dest = SITE / "assets" / "articles" / folder / slug
    dest.mkdir(parents=True, exist_ok=True)
    for im in images:
        (dest / f"{im['stem']}.webp").write_bytes(im["blob"])
    if lane == "geo":
        en_dir = SITE / "knowledge" / "geo" / slug
        zh_dir = SITE / "zh" / "knowledge" / "geo" / slug
    else:
        en_dir = SITE / "blog" / slug
        zh_dir = SITE / "zh" / "blog" / slug
    en_dir.mkdir(parents=True, exist_ok=True)
    zh_dir.mkdir(parents=True, exist_ok=True)
    (en_dir / "index.html").write_text(render_page(article, articles, images, "en"), encoding="utf-8")
    (zh_dir / "index.html").write_text(render_page(article, articles, images, "zh"), encoding="utf-8")


def sitemap_block(article: dict) -> str:
    en = page_url(article, "en")
    zh = page_url(article, "zh")
    blocks = []
    for loc in (en, zh):
        blocks.append(
            "  <url>\n"
            f"    <loc>{loc}</loc>\n"
            f"    <lastmod>{DATE}</lastmod>\n"
            "    <changefreq>weekly</changefreq>\n"
            "    <priority>0.6</priority>\n"
            f'    <xhtml:link rel="alternate" hreflang="en" href="{en}" />\n'
            f'    <xhtml:link rel="alternate" hreflang="zh-Hans" href="{zh}" />\n'
            f'    <xhtml:link rel="alternate" hreflang="x-default" href="{en}" />\n'
            "  </url>"
        )
    return "\n".join(blocks)


def card_blog(article: dict, lang: str) -> str:
    href = path_only(article, lang)
    if lang == "zh":
        tag = article.get("tag_zh", "技术")
        title = article["title_zh"]
        blurb = article["blurb_zh"]
        link = "阅读 →"
    else:
        tag = article.get("tag_en", "Technical")
        title = article["title_en"]
        blurb = article["blurb_en"]
        link = "Read →"
    return (
        f'          <a class="kc-card" href="{esc(href)}">\n'
        f'            <div class="kc-card-meta"><span class="kc-tag">{esc(tag)}</span></div>\n'
        f'            <h3 class="kc-card-title">{esc(title)}</h3>\n'
        f'            <p class="kc-card-blurb">{esc(blurb)}</p>\n'
        f'            <span class="kc-card-link">{link}</span>\n'
        "          </a>\n"
    )


def card_geo(article: dict, lang: str) -> str:
    href = path_only(article, lang)
    title = article["title_zh"] if lang == "zh" else article["title_en"]
    blurb = article["blurb_zh"] if lang == "zh" else article["blurb_en"]
    link = "阅读指南 →" if lang == "zh" else "Read guide →"
    return (
        f'          <a class="kc-card" href="{esc(href)}">\n'
        f'            <h3 class="kc-card-title">{esc(title)}</h3>\n'
        f'            <p class="kc-card-blurb">{esc(blurb)}</p>\n'
        f'            <span class="kc-card-link">{link}</span>\n'
        "          </a>\n"
    )


def insert_before(text: str, marker: str, chunk: str) -> str:
    idx = text.rfind(marker)
    if idx < 0:
        raise SystemExit(f"marker not found: {marker}")
    return text[:idx] + chunk + text[idx:]


def update_itemlist_line(html: str, new_items: list[tuple[str, str]]) -> str:
    start = html.find('<script type="application/ld+json">')
    end = html.find("</script>", start)
    raw = html[start + len('<script type="application/ld+json">'):end].strip()
    data = json.loads(raw)
    elements = data["mainEntity"]["itemListElement"]
    pos = elements[-1]["position"]
    for name, url in new_items:
        pos += 1
        elements.append({"@type": "ListItem", "position": pos, "name": name, "url": url})
    dumped = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    return html[:start] + '<script type="application/ld+json">\n' + dumped + "\n  </script>" + html[end + len("</script>"):]


def update_geo_itemlist(html: str, new_items: list[tuple[str, str]]) -> str:
    marker = "      ]\n    }\n  }\n  </script>"
    idx = html.find(marker)
    if idx < 0:
        # pretty printed variant
        marker = "      ]\r\n    }\r\n  }\r\n  </script>"
        idx = html.find(marker)
    if idx < 0:
        raise SystemExit("geo itemlist close not found")
    pos_matches = list(re.finditer(r'"position":(\d+)', html[:idx]))
    pos = int(pos_matches[-1].group(1)) if pos_matches else 0
    lines = []
    for n, (name, url) in enumerate(new_items):
        pos += 1
        comma = "," if n < len(new_items) - 1 else ""
        lines.append(
            '    {"@type":"ListItem","position":%d,"name":%s,"url":%s}%s'
            % (pos, json.dumps(name, ensure_ascii=False), json.dumps(url, ensure_ascii=False), comma)
        )
    # The previous last item may lack a trailing comma. Ensure comma before new lines.
    head = html[:idx].rstrip()
    if head.endswith("}"):
        head = head + ","
    return head + "\n" + "\n".join(lines) + "\n" + html[idx:]


def integrate(done: list[dict]) -> dict:
    blog = [a for a in done if a["lane"] != "geo"]
    geo = [a for a in done if a["lane"] == "geo"]
    en_blog = SITE / "blog" / "index.html"
    zh_blog = SITE / "zh" / "blog" / "index.html"
    en_geo = SITE / "knowledge" / "geo" / "index.html"
    zh_geo = SITE / "zh" / "knowledge" / "geo" / "index.html"
    blog_marker = "        </div>\n      </div>\n    </section>\n  </main>"
    en_cards = "".join(card_blog(a, "en") for a in blog)
    zh_cards = "".join(card_blog(a, "zh") for a in blog)
    en_html = insert_before(en_blog.read_text(encoding="utf-8"), blog_marker, en_cards)
    zh_html = insert_before(zh_blog.read_text(encoding="utf-8"), blog_marker, zh_cards)
    en_items = [(a["title_en"], page_url(a, "en")) for a in blog]
    zh_items = [(a["title_zh"], page_url(a, "zh")) for a in blog]
    en_html = update_itemlist_line(en_html, en_items)
    zh_html = update_itemlist_line(zh_html, zh_items)
    en_count = en_html.count('<a class="kc-card"')
    zh_count = zh_html.count('<a class="kc-card"')
    en_html = re.sub(r'(<p class="kc-section-lead">)\d+(</p>)', rf"\g<1>{en_count}\2", en_html, count=1)
    zh_html = re.sub(r'(<p class="kc-section-lead">)\d+(</p>)', rf"\g<1>{zh_count}\2", zh_html, count=1)
    en_blog.write_text(en_html, encoding="utf-8")
    zh_blog.write_text(zh_html, encoding="utf-8")

    geo_marker = "          <!-- geo-lane-entries-end -->"
    en_geo_html = insert_before(en_geo.read_text(encoding="utf-8"), geo_marker, "".join(card_geo(a, "en") for a in geo))
    zh_geo_html = insert_before(zh_geo.read_text(encoding="utf-8"), geo_marker, "".join(card_geo(a, "zh") for a in geo))
    en_geo_html = update_geo_itemlist(en_geo_html, [(a["title_en"], page_url(a, "en")) for a in geo])
    zh_geo_html = update_geo_itemlist(zh_geo_html, [(a["title_zh"], page_url(a, "zh")) for a in geo])
    en_geo_html = en_geo_html.replace("95 guides", f"{95 + len(geo)} guides", 1)
    zh_geo_html = zh_geo_html.replace("95 篇", f"{95 + len(geo)} 篇", 1)
    en_geo.write_text(en_geo_html, encoding="utf-8")
    zh_geo.write_text(zh_geo_html, encoding="utf-8")

    sm_path = SITE / "sitemap.xml"
    sm = sm_path.read_text(encoding="utf-8")
    addition = "\n".join(sitemap_block(a) for a in done)
    if "</urlset>" not in sm:
        raise SystemExit("sitemap close missing")
    sm = sm.replace("</urlset>", addition + "\n</urlset>")
    sm_path.write_text(sm, encoding="utf-8")
    return {"blog_cards_en": en_count, "blog_cards_zh": zh_count, "geo_added": len(geo), "sitemap_urls": len(done) * 2}


def validate(article: dict, lang: str) -> None:
    path = SITE / path_only(article, lang).strip("/") / "index.html"
    text = path.read_text(encoding="utf-8")
    for key in ("short", "explain", "limit"):
        field = f"{key}_{'zh' if lang == 'zh' else 'en'}"
        needle = html.escape(article[field], quote=True)
        if needle not in text and article[field] not in text:
            raise SystemExit(f"FAQ answer missing from body: {article['slug']} {field}")
    if "assets/articles/" not in text:
        raise SystemExit(f"missing asset ref {article['slug']} {lang}")
    if '"@type":"FAQPage"' not in text and '"@type": "FAQPage"' not in text:
        raise SystemExit(f"missing FAQPage {article['slug']}")
    if "BreadcrumbList" not in text or '"@type":"Article"' not in text and '"@type": "Article"' not in text:
        raise SystemExit(f"missing schema {article['slug']}")


def main() -> None:
    if len(ARTICLES) != 54:
        raise SystemExit(f"expected 54 articles, got {len(ARTICLES)}")
    slugs = [a["slug"] for a in ARTICLES]
    if len(set(slugs)) != len(slugs):
        raise SystemExit("duplicate slug")
    for article in ARTICLES:
        dest = SITE / "assets" / "articles" / LANE_ASSET[article["lane"]] / article["slug"]
        if dest.exists():
            shutil.rmtree(dest)
    print("hashing existing images...", flush=True)
    stems, hashes = load_existing_hashes()
    used_files: set[str] = set()
    done = []
    log = []
    for i, article in enumerate(ARTICLES, 1):
        print(f"[{i}/54] {article['slug']}", flush=True)
        images, source = fetch_for_article(article, used_files, stems, hashes, i - 1)
        if not images:
            raise SystemExit(f"no image for {article['slug']}")
        article["_source"] = source
        write_pages(article, ARTICLES, images)
        validate(article, "en")
        validate(article, "zh")
        done.append(article)
        log.append({
            "slug": article["slug"],
            "source": source.get("url"),
            "images": [im["stem"] + ".webp" for im in images],
        })
    stats = integrate(done)
    report = {"added": len(done), "log": log, "stats": stats}
    out = Path(__file__).with_name("report.json")
    out.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"added": len(done), **stats}, ensure_ascii=False), flush=True)


if __name__ == "__main__":
    main()
