# Gemini prompts — Mika Visibility homepage

Use these when generating stills for each homepage section. Do **not** ask Gemini to invent the whole homepage in one shot. Generate **one section at a time**, then optionally composite.

All numbers, URLs, and dashboards on the live page are **illustrative / sample**. Do not add fake customer logos, funding badges, or “trusted by” rows.

---

## Master prompt (paste before every section prompt)

```text
Design a single website section for Mika Visibility, a Search & AI Visibility Infrastructure product (not a generic AI SEO landing page).

Brand: Mika Visibility. Mark is a 2×2 flat matrix: SEO Health (blue), SEO Growth (deep blue), GEO Health (purple), GEO Growth (deep purple).

Visual system — mandatory:
- Premium, flat, technical, intelligent, structured, data-driven, calm
- Large white / off-white field (#FFFFFF, #F6F7F9)
- Near-black text (#0B1220)
- SEO blue (#2F6BFF) only for CTA, SEO, charts, status, key numbers
- GEO purple (#6E56CF) only for GEO, AI answers, citation, evidence
- 2D only. Hairline frames + solid fills. Strict 8px grid. No floating widgets
- Typography: refined grotesque (Instrument Sans / similar). Tight headings, readable body. No Orbitron, no neon display fonts

Forbidden:
- 3D, glassmorphism, frosted blur, heavy gradients, neon, cyberpunk
- Floating robots, AI orbs, spheres, isometric cities
- Giant glowing “AI” word
- 3D dashboards, skeuomorphic gauges
- Ordinary SaaS 3-card feature row as the hero
- Making a single score the hero of the story
- Imitating Linear / Stripe / Vercel layout literally

Graphic language:
- SEO = blue columns, rank grids, technical audit lines
- GEO = purple answer blocks, citation marks, entity relations
- Health = status dots, completeness bars, diagnostic checklists
- Growth = gaps, unoccupied cells, hatched missing regions, opportunity layers

Product truth to keep visible:
- SEO = Search Visibility; GEO = AI Visibility
- Health = present condition; Growth = what is still missing
- Health high ≠ Growth high
- Growth is coverage, depth, intent, demand, opportunity — never page count
- Deep audit, not a single score
- Scan → Diagnose → Blueprint (execute: false; does not auto-edit the site)
- Loop ends on Re-audit, not Done
- GEO does not predict ChatGPT / Gemini / AI Overviews ranking

Output: one flat UI section, 1440×900 or 1600×1000, white/light gray, pixel-aligned, no mock device chrome unless asked.
```

---

## 01 — Nav

```text
[Use master prompt]

Section: sticky top nav, 64px tall, white, hairline bottom border.
Left: 2×2 matrix mark + “Mika Visibility”.
Center/right: text links Product, How it works, SEO, GEO, Workflow in muted gray.
Far right: solid blue rectangle button “Start a structured audit”.
No hamburger on desktop. No gradient bar. No shadow.
```

## 02 — Hero / Visibility Control Center

```text
[Use master prompt]

Section: split layout. Left copy, right product interface.

Left:
H1: “One Visibility Engine for Search and AI.”
Sub: “Measure SEO Health. Build SEO Growth. Improve GEO Health. Expand AI Visibility.”
Quiet auxiliary line: “Make Your Website Visible in Search and AI.”
Two buttons: solid blue “Start a structured audit”; outlined “See how Blueprint works”.

Right: Visibility Control Center — a flat product window (title bar + content), NOT a screenshot of a random analytics dashboard.
Dominant object: a very large 2×2 Visibility Matrix (brand symbol):
- top-left SEO Health (blue)
- top-right SEO Growth (deep blue)
- bottom-left GEO Health (purple)
- bottom-right GEO Growth (deep purple)
Each cell: label, short job-to-be-done sentence, a result number as UI (not the story).
Beside the matrix, STRICT GRID of four small widgets (not floating): Scan progress, Citation status, Blueprint task count with “execute: false”, Health vs Growth comparison bars.
Sample caption in the window chrome.
```

## 03 — Two visibility problems

```text
[Use master prompt]

Section title: “There are two different visibility problems.”
Left card: Search Visibility, blue top rule, chips for crawl, index, architecture, on-page, internal links, hreflang, JSON-LD.
Right card: AI Visibility, purple top rule, chips for entity, answerability, evidence, citation, answer surface, cross-language.
Center: flat geometric data-flow (orthogonal/bezier hairlines, square nodes, two moving dots). No arrows-in-circles, no 3D pipes.
```

## 04 — Four dimensions system

```text
[Use master prompt]

Title: “One website. Four dimensions of visibility.”
Four large panels sharing one outer frame, divided by 1px lines, with small square connectors at the cross — a SYSTEM diagram, not four SaaS feature cards.
SEO Health (blue): present-tense crawl/index/architecture checklist.
SEO Growth (deep blue): missing coverage/intent/depth/demand bars and hatched gaps.
GEO Health (purple): who/what/where extractability, evidence, citation readiness.
GEO Growth (deep purple): unanswered queries, unused answer surface, citation opportunity.
```

## 05 — Deep Audit

```text
[Use master prompt]

Title: “Deep Audit, Not a Single Score.”
Left: layered inspection of URL → Page → Structure → Entity → Evidence as labeled rows of monospace nodes. Some nodes “active” (blue stroke), some “warn” (amber stroke).
Right: dark technical log (not neon terminal): phase names such as checking_indexability, building_topic_map, mapping_entities, generating_blueprint. Mix of ok / warn lines.
Absolutely no single circular score dominating the composition.
```

## 06 — Scan → Diagnose → Blueprint

```text
[Use master prompt]

Title: “Don’t just find problems. Build the next action.”
One horizontal PIPELINE frame (three connected panes, not three isolated cards):
1 Scan — task list, coverage.
2 Diagnose — issue groups with rule ids (unexpected_noindex, mass_orphan, near_duplicate, topic_mismatch) and severity ticks.
3 Blueprint — P0/P1 tasks with types (technical, expand_page, ADD_EVIDENCE) and a banner “execute: false · does not auto-edit”.
Hairline joins between panes. Flat. No conveyor-belt 3D.
```

## 07 — SEO Growth vs Health

```text
[Use master prompt]

Title: “A healthy website is not necessarily a growing website.”
Subtitle: “Technical health tells you where you are. Growth analysis tells you what is missing.”
Split panel: left Health (complete checklist, stable bars); right Growth (five hatched/unoccupied cells labeled coverage, depth, intent, demand, opportunity).
Quote bar: “Growth is measured by coverage, depth, intent, demand and opportunity — not by how many pages you already have.”
Do NOT show “pages = 390 therefore growth is high”. Do NOT use a single combined KPI.
```

## 08 — GEO Answer Surface

```text
[Use master prompt]

Title: “Search ranks pages. AI answers questions.”
Left: 2D Answer Surface grid (rows: Brand / Product / Use; columns: Who / What / Where / Why). Occupied cells solid pale purple; missing cells hatched. No spider web.
Right: an extractable definition sentence with a small “cite” mark, plus four metrics: Entity clarity, Evidence coverage, Citation readiness, Answer surface.
Caption: GEO does not predict AI Overviews ranking.
```

## 09 — Evidence Graph

```text
[Use master prompt]

Title: “Make your claims understandable, supportable, and referenceable.”
Three columns only: Claim → Evidence → Citation. Straight connectors. No network graph, no force-layout nodes.
Show one KNOWN spec claim, one KNOWN manufacturer claim, and one UNKNOWN slogan marked “do not invent”.
Pills: KNOWN / UNKNOWN / FORBIDDEN. Purple used only here.
```

## 10 — Multilingual

```text
[Use master prompt]

Title: “One brand. Consistent across every language.”
Left vertical language tabs: EN, ZH, PT, AR, RU with URL prefixes.
Right: consistency checks — hreflang reciprocal pass, legal name aligned, AR application intent watch, definition sentence missing in PT/RU.
This is SEO architecture + GEO entity consistency, not a flags collage. No country globes.
```

## 11 — Workflow + loop

```text
[Use master prompt]

Title: “From audit to continuous growth.”
Five flat step cards: Audit, Diagnose, Blueprint, Act, Re-audit. The fifth card is blue-tinted and is clearly NOT “Done”.
Below: a large 2D geometric loop (rounded rectangle path, dashed stroke, five labeled stations). Flat. No 3D torus, no circular infographic with icons in perspective.
```

## 12 — Final CTA

```text
[Use master prompt]

Left: two-line headline
“Know where your website stands.”
“Know where it can go next.”
Body: “Run a structured SEO + GEO audit and turn findings into a growth blueprint.”
Buttons: “Start audit” (blue), “View sample blueprint” (outline).
Right: compact 2×2 matrix snapshot (the four dimensions). No rocket, no confetti, no “Start your AI SEO journey”.
```

## 13 — Footer

```text
[Use master prompt]

Quiet footer: mark + Mika Visibility, one-line positioning, Product anchors, GitHub, Privacy. Hairline top border. No newsletter blob, no social icon row, no award badges.
```

## Suggested generation order

1. Hero matrix (brand symbol)  
2. Four-dimension system  
3. Scan → Diagnose → Blueprint pipeline  
4. Deep audit log  
5. Answer Surface  
6. Evidence graph  
7. Continuous loop  
8. Remaining sections  

If a render looks like a typical SaaS landing page (left headline + right 3D dashboard + three feature cards), discard it and rerun with the master prompt plus “no dashboard screenshot, no 3D, no feature cards”.
