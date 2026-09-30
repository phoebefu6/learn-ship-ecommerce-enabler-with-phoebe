# Agent brief - shared by every fan-out page of learn-ship-ecommerce-enabler-with-phoebe

Filled from `course-builder/references/agent-brief.template.md` on 2026-09-29. Internal build
document: never link it from an audience page.

You are writing ONE static HTML session page. No servers, no npm. **If your target file already
exists on disk, do not write it; report that and stop.** Write the file, return its path and one
line of coverage. No HTML in your reply.

## Read first, in this order

1. The template page for YOUR track. Copy its structure, classes, SVG grammar and quiz markup
   EXACTLY, including how many options each question has (FOUR, A to D):
   - Leader: `/Users/phoebe.fu/Documents/Claude_Work/github_repo/learn-ship-ecommerce-enabler-with-phoebe/courses/a1-what-an-enabler-sells.html`
   - Analyst: `/Users/phoebe.fu/Documents/Claude_Work/github_repo/learn-ship-ecommerce-enabler-with-phoebe/courses/b1-seven-domains.html`
2. The source map: every verified number, its evidence tier, per-session coverage, the seams, and
   the constructed canon for Serai, Pasar Live, creators and GMV variants. Use ONLY its numbers;
   never invent a statistic; if a fact is missing, teach the uncertainty.
   `/Users/phoebe.fu/Documents/Claude_Work/github_repo/learn-ship-ecommerce-enabler-with-phoebe/materials/official-course-map.md`
3. The stylesheet `:root` block for the palette tokens (first 30 lines only):
   `/Users/phoebe.fu/Documents/Claude_Work/github_repo/learn-ship-ecommerce-enabler-with-phoebe/assets/style.css`
4. For numbers from the bench: `/Users/phoebe.fu/Documents/Claude_Work/github_repo/learn-ship-ecommerce-enabler-with-phoebe/courses/b8-the-enabler-bench.html` (the bench page; quote only numbers it or the map prints).

## Page skeleton (keep every component)

toolbar (crumb EXACTLY "learn-ship-ecommerce-enabler-with-phoebe / Leader session N of 6" or
"... / Analyst session N of 8", the repo name linked to ../index.html, #toggle-all, #zoom-toggle)
· masthead (eyebrow "Ship It: Social Commerce Enablers · Leader session N of 6" (or Analyst ... of
8), h1 with one `<span class="accent">`, .sub, .chip-row with the level chip (🟢 Foundational /
🟡 Core / 🟠 Advanced as given in your outline) then two .chip.audience then .chip.time "45 min",
.agenda a1-a4 with flex weights) · main.wrap · section#intro (Part 0: kicker, .lede, .legend pills
exactly as the template, .callout.win "★ What you walk out with tonight.") · 3 Parts, each
`section.section#part-N` with section-kicker (klabel "Part N · covers ...", h2, `.tag.concept "N
min live"`), a `.lede`, ONE figure, `details.card` accordions (summary: `.mode.live` or
`.mode.self`, title, `.mini`, `.caret ▶`), at least one `.callout.example` with `span.ex-pill`
"Real world" on the page · section#demo-1 Build-along (kicker `.tag.demo "★ 20 min · everyone
builds"` for Leader, `"★ 22 min · everyone builds"` for Analyst, .lede, ONE figure, `.steps >
.step`, each with a `<p>` and, where there is code or a template, a `.prompt-box.good` with a
`span.label` BELOW the p) · section#exercise Homework (ol, 4 items) · section#quiz (the line "Clear
all three and Leader session N gets stamped in your passport." then 3 x `.quiz-q
data-answer="0-based"`, `p.qtext` numbered "1 · ...", FOUR `button.qopt` "A · ..." to "D · ...",
`p.qwhy`; one `p.quiz-score` after the last; vary the correct letter) · section#official, h2
EXACTLY "What this session teaches, and where it came from", `.covered > .covered-row` (pill solid
✓ / light ◐ + name + note), then the `.mono` line EXACTLY "Every fact on this page, and its
verification tier, is recorded in the course's source map." · section.cheat#cheatsheet (h3
"Leader session N cheat sheet <span>· pin this</span>" or "Analyst session N cheat sheet ...",
.grid-2 of six .cheat-item) · `.callout.next` with `.nx-pill` "Next session" · footer.pagefoot
inside main, as in the template · `<script src="../assets/app.js?v=1"></script>`.

Head: the template's social meta block with this page's own title/description/url (og:image
stays assets/og-cover.png); `<title>Leader session N · Title - learn ship ecommerce enabler with
phoebe</title>`; `<link rel="stylesheet" href="../assets/style.css?v=1">`. Nothing else external.

First `details.card` in the FIRST Part is `open`; no other. Sentence case headings. Warm
practitioner voice, concrete, never dry. Inside prompt-boxes escape `&` `<` `>`. 450 to 650 lines
is guidance about depth, never a target: never collapse whitespace, dissolve a list into a
paragraph, or drop a component to fit.

## Hard rules (a violation is rework)

- NEVER an em dash or en dash, anywhere (prose, code, aria-labels, comments). Hyphen only.
- No meta text: never "this course", "in this course", "the course teaches", "banned here". State
  the professional norm directly with its reason. The two exact estate phrases above are the only
  self-references; "session 5" cross-references are fine.
- Attribution "by Phoebe Fu". Never "built with" a tool.
- Every number comes from the map or the bench page, or is labelled constructed. For constructed
  data print "your numbers will differ", never invented outputs as if run. If you print code
  output on an Analyst page, RUN THE CODE in a scratch directory
  (`/private/tmp/claude-504/-Users-phoebe-fu-claude-works/b89f1505-8bdd-4031-a5ef-fbabc1f9ff42/scratchpad/agents/<your page>/`,
  never the repo) and paste what it printed. Olist CSVs are cached at
  `~/.cache/kagglehub/datasets/olistbr/brazilian-ecommerce/versions/2/`.
- Contested or missing evidence: teach the disagreement; never resolve what the literature has not.
- Citations in the exact form of the map's appendix; anything marked reported is "reported".
- NEVER "lottery" or "lotteries"; say the mechanism. Default to the English word; any Chinese term
  carries its English in brackets.
- Titles, widget ids and class names must not collide with siblings: avoid the h1s "Metrics, and
  the event spec", "Registry and what's next", "The data estate of a club", "The revenue model
  decides". Use only classes that exist in the template pages and style.css; invent none.
- **PRIVACY (hard rule):** the course is public and every company in it is FICTIONAL. The enabler
  is **Serai Commerce**; the live channel is **Pasar Live** on the fictional marketplace **Pasar**.
  Never name the real enabler, the real marketplace group or the real live channel this story is
  drawn from, and never name any real employer. Real marketplaces (Shopee, Lazada, TikTok Shop)
  may be named ONLY for the public, reported masking facts in the map, worded as the map words
  them. The 3x conversion lift is always labelled constructed. No real company's internal numbers.
  No black or lime brand colours.
- **Legal is not the frame:** platform terms and listing rules are a FEASIBILITY / data-gate
  question. Never teach statutes, never quote contract clauses, never say what an exchange
  requires. The SEC 2020 guidance may be cited only as the map words it: a public example of the
  three questions a serious reader asks of a key metric.
- **Seams:** link, never re-teach. Livestream data science methods (computer vision, speech
  tagging, survival, change-point, fixed-effects giveaway confound, LightGBM + SHAP, host
  clustering, diff-in-diff) belong to
  https://phoebefu6.github.io/learn-live-commerce-analytics-with-phoebe/ (one line and a link). The
  playbook spine (five categories, four-way verdict, data gate, revenue model decides) belongs to
  learn-ship-playbook; link its session. Ecommerce metric definitions: link
  learn-ecommerce-metrics, then show the enabler twist. Entity matching methods:
  learn-entity-resolution. Cohorts: learn-customer-retention. RFM: learn-rfm-modeling. Metric
  trees: learn-metric-decomposition.

## Figure grammar (hand-drawn, every figure)

Palette, ONLY these hexes (no invented greys): `#BE3745` (accent) `#8A2330` (deep, for .V values
and dark fills with white text) `#E0685E` (mid) `#F5C6C0` (soft) `#FDF1EF` (accent-50 fill)
`#2B1518` (ink) `#6B5256` (muted) `#E2CDCB` (faint) `#F1E4E2` (hairline) `#0E6F68` (contrast teal,
the ONE thing the figure is about; white text on it) `#0A4D48` (contrast ink, .B text) `#E2F3F0`
(contrast tint) `#FFFBFA` · `#FFFFFF` · universal reds `#991B1B` `#FEF2F2` `#FCA5A5` only for a
wrong-way or closed panel.

- `<figure class="zoomable">` > `<svg viewBox="0 0 880 H" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="the data, not the
  shape">` > `<defs>` + `<style>` + content, then `<figcaption>🔍 Click to zoom - takeaway</figcaption>`.
  Grow H, never W.
- Prefix unique per figure, used for every class and id: `<page><letter>`, e.g. `a2a`, `a2b`,
  `b3c` (so ids `a2aSk`, `a2aHc`, `a2aAr`; classes `.a2aH`, `.a2aL`...). Never reuse a prefix.
- `<defs>` holds three things with the figure prefix P: a wobble filter `id="PSk"`
  (`feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="<int>"` +
  `feDisplacementMap scale="2.4" xChannelSelector="R" yChannelSelector="G"`, `x="-3%" y="-3%"
  width="106%" height="106%"`), a hachure pattern `id="PHc"` (7x7 userSpaceOnUse, rotate(-38), one
  `#BE3745` line, opacity .5), an open arrowhead `id="PAr"` (path `M1 1 L9 5 L1 9`, fill none, ink
  stroke 1.6). ALL shapes sit inside ONE `<g filter="url(#PSk)" fill="none" stroke="#2B1518"
  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">`; rects carry a tiny rotation
  (-4 to 4 degrees for hand-placed items, under 1 for panels). Fills: white, `#FDF1EF`, the
  hachure for "the pile" or "the data", and teal ONLY for the one thing the figure is about. One
  doodle anchor per figure, simple strokes, never a mascot. Text classes: `.PH` 800 12px ink
  heading · `.PL` 600 12px ink label · `.PS` 400 11px muted · `.PB` 800 11px `#0A4D48` · `.PV` 800
  16-20px `#8A2330` value · `.PW` 800 12px white ONLY on a `#8A2330`, `#BE3745` or `#0E6F68` fill
  (NEVER on the hachure or a pale fill: it paints invisible) · `.PA` 700 11px `#BE3745` axis
  caption · `.PN` 400 12px muted note · `.PR` 800 11px `#991B1B` for closed/wrong.
  Hand-stacked items must not overlap as painted rects (the gate flags a pile).
- ALL `<text>` OUTSIDE the filtered group, Inter sans stack, never below 10.5px.
- Fit: max chars ≈ (box width - 20) / 7 at 12px, 6.4px/char at 11px; full-width note under 110
  chars; 40px between neighbouring point labels; bottom note 22px below the last row, H clears it
  by 8px. Arrows and curves must not run through labels. When in doubt, shorten.
- Floor: one figure per Part plus one in the build-along (4 figures). Draw the MECHANISM (money
  flowing, rows being joined, a key colliding, an event firing per minute, a definition feeding a
  report), never a metaphor literally, never decoration.

## Voice and honesty

Every Part gets a real-world story (`.callout.example`) from the map's read-at-source or reported
facts (Sea's GMV definition, the SEC 2020 guidance, Olist's own description, the reported masking)
or a clearly constructed Serai / Pasar Live case that SAYS "constructed" in the text. Honest
limits: Serai, Pasar Live, the creators and every figure in the assumptions block are invented;
no figure is a claim about any real enabler.

## Cross-links (absolute URLs)

- Playbook: https://phoebefu6.github.io/learn-ship-playbook-with-phoebe/ ; data gate
  courses/04-the-data-gate.html ; revenue model courses/05-the-revenue-model-decides.html ; roadmap
  courses/06-the-roadmap-on-one-page.html ; four-way verdict courses/02-the-four-way-verdict.html
- Live commerce: https://phoebefu6.github.io/learn-live-commerce-analytics-with-phoebe/ ; a1
  courses/a1-read-the-room.html (the platform's four stages) ; b1 courses/b1-stream-as-data.html
  (the minute table) ; a6 courses/a6-prove-it-worked.html (proving a lift)
- Ecommerce metrics: https://phoebefu6.github.io/learn-ecommerce-metrics-with-phoebe/ ; a1
  courses/a1-the-gmv-equation.html ; a2 courses/a2-the-metric-dictionary.html ; a6
  courses/a6-metric-governance.html ; b8 courses/b8-metric-spec-sheet.html
- Entity resolution: https://phoebefu6.github.io/learn-entity-resolution-with-phoebe/ ; courses/01-no-shared-key.html ; courses/03-fellegi-sunter.html
- Customer retention: https://phoebefu6.github.io/learn-customer-retention-with-phoebe/
- RFM: https://phoebefu6.github.io/learn-rfm-modeling-with-phoebe/
- Metric decomposition: https://phoebefu6.github.io/learn-metric-decomposition-with-phoebe/
- Hub: https://phoebefu6.github.io/learn-with-phoebe/

## Footer chains and session titles

Footer left: "Leader session N of 6 · learn-ship-ecommerce-enabler-with-phoebe · by Phoebe Fu &nbsp;·&nbsp; 📚 <a href="https://phoebefu6.github.io/learn-with-phoebe/">Learn with Phoebe ↗</a>" (Analyst: "Analyst session N of 8 ...").
Footer right: `<a href="PREV.html">← Prev: Title</a> &nbsp;·&nbsp; <a href="NEXT.html">Next: Title →</a>`.

Leader chain (exact titles, one accent span in the h1):
a1-what-an-enabler-sells.html "What an enabler actually sells" ·
a2-hours-removed.html "Margin comes from hours removed" ·
a3-a-channel-nobody-knew.html "A channel nobody knew how to sell on" ·
a4-what-the-platforms-let-you-bank.html "What the platforms let you bank" ·
a5-three-products-one-estate.html "Three products from one estate" ·
a6-metric-registry-before-ipo.html "The metric registry before the IPO" (last Leader page: right
side "← Prev: ..." and "Next track: Analyst session 1 →" linking b1-seven-domains.html).

Analyst chain:
b1-seven-domains.html "Seven domains, one enabler estate" ·
b2-three-exports-one-schema.html "Three marketplace exports, one schema" ·
b3-the-identity-gate.html "The identity gate" ·
b4-per-minute-events.html "Per-minute events for a live channel" ·
b5-stop-hold-love-buy.html "Stop, Hold, Love, Buy as code" ·
b6-content-to-creator-yield.html "Content to creator yield" ·
b7-registry-as-code.html "The metric registry as code" ·
b8-the-enabler-bench.html "The enabler bench".

## Before you return

Self-check your file: `grep -c '—\|–'` must be 0; `<details` count equals `</details>`;
`<section` equals `</section>`; `<figure` equals `</figure>`; `<text` equals `</text>`; no real
company name outside the map's reported masking facts; every hex inside figures is in the palette list.
