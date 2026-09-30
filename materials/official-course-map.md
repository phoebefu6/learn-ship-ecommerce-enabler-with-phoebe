# learn-ship-ecommerce-enabler-with-phoebe - source map

Internal build document. Not linked from any audience-facing page.

Bucket `ship`, difficulty 3, audience both, two tracks: Leader 6 (a1-a6, no code) + Analyst 8
(b1-b8, Python and SQL), 14 sessions of 45 minutes. Bench in b8. Built 2026-09-29.
Flips the planned hub card `learn-ship-ecommerce-enabler-with-phoebe` (title on the card becomes
"Ship It: Social Commerce Enablers").

---

## Privacy rule (hard, Phoebe's decision)

The course is public and every company in it is fictional.

- The enabler is **Serai Commerce**: a fictional Southeast Asian social-commerce enabler that runs
  brands' stores, content, livestreams and ads across marketplaces, for a service fee plus a
  GMV-linked share.
- The livestream story is **Pasar Live**: a new live channel on a fictional regional marketplace.
  Its results, including the **3x conversion lift**, are **constructed** and labelled so on every
  page that shows them.
- Real marketplaces (Shopee, Lazada, TikTok Shop) are named ONLY for the public facts in the tier
  table below, each read in this build.
- No internal numbers from any real company. No real employer names. No links to or citations of
  Phoebe's private working files. No copied brand colours.

---

## Serai Commerce, the constructed company (every figure invented, labelled on the pages)

- Runs **48 brand stores** on three marketplaces (Platform A, B, C on the bench; the leader pages
  may say "three marketplaces") across **four markets**, **220 staff**.
- Three fee lines: a **monthly retainer of $6,000 per brand** (the service fee), a **2 percent
  GMV-linked share**, and, through its creator network (the MCN arm), **15 percent of the creator
  commissions** it brokers.
- GMV run for brands: **$45,000,000 a quarter**. Retainers: 48 x $6,000 x 3 = **$864,000 a quarter**.
  GMV share: 2% x $45M = **$900,000 a quarter**.
- One $100 order, constructed split used in a1: about $10 to the marketplace in fees, $2 GMV share
  to Serai, an $8 creator commission of which Serai's network keeps $1.20, and the remaining $80 to
  the brand, before the brand's cost of goods.
- Hour sinks (match the bench use cases): content 40 people, customer service 24, ad ops 12, store
  ops 16, affiliate and creator team 6, live team 8, commercial and SKU analysts 10, planning 5.

## The seven data domains (b1, a5), this course's own grouping

1. Buyers and service (masked buyer, chat threads, reviews) - partial / gated
2. Brands and stores (contracts, fee terms, store health) - owned
3. Catalogue and listings (master SKU, platform listing ids, content per listing) - owned
4. Orders, fees and settlement (orders, returns, platform fees, payouts) - full via API
5. Ads and traffic (spend, creatives, rejections; platform discovery funnel mostly closed) - full / partial
6. Content and live streams (asset archive, stream recordings, per-minute events) - owned / partial
7. Creators and affiliates (creator ids, attributed and settled GMV, commissions) - partial

Obtainability words (this course's scale): owned, full via API, partial, gated (behind a
permission you can ask for), closed. Two dependency chains carry most of the value:
orders -> SKU view -> regional read, and content -> tagged archive -> creator yield.

---

## Pasar Live, the constructed live channel (a3, b4, b5; every number constructed)

- "Pasar" is a fictional regional marketplace; Pasar Live is its new live channel. Serai ran
  streams on it for 12 brands in the channel's first two quarters.
- Two host types: **platform hosts** (the marketplace's own creator roster: charisma, reach) and
  **brand hosts** (a brand's own staff or merchant creators: product knowledge, trust).
- Before: every stream was judged on **GMV only**, which cannot tell a good host from a big room.
- After: four stages and a North Star (Pasar Live's own naming; the live commerce course teaches
  the platform's Enter / Stay / Click / Buy version):
  - **Stop** = room entries / live card impressions (did the cover pull people in)
  - **Hold** = completers / entries (a completer stays past the 10-minute mark; constructed rule)
  - **Love** = replays / entries (came back or watched the replay)
  - **Buy** = product card clicks / card impressions, and orders / clicks
  - **North Star** = orders / room entries (conversion)
- **Eight teams, one minute-grain table:** tech (tracking), data engineering (one clock, one
  minute table), analysts (the KPI system and funnel), live ops (notes that become labels on the
  minute), traffic ops (promos and pushes), commercial (assortment), brand teams (room set-up, SKU
  count), hosts (a per-host scorecard and coaching plan).
- **Per-minute events (b4):** room entry, product card impression, product click, add to cart,
  order; keyed by stream_id + minute + sku; one clock (UTC, stream start = minute 0).
- **The loop:** score every stream, coach against the minute where the host lost the room, go
  live, measure, repeat.
- **Result, constructed:** conversion (orders per room entry) rose from 0.8 percent to 2.4 percent
  over two quarters of coaching, **the 3x lift**. Labelled constructed wherever shown. Proving a
  lift like this properly (difference-in-differences against untrained hosts) belongs to the live
  commerce course, a6 and b8.

### The eight-stream table (b5 canon, computed with pandas 2026-09-29)

| stream | host | impressions | entries | completers | replays | card impr | clicks | add to cart | orders |
|---|---|---|---|---|---|---|---|---|---|
| S1 | platform | 120,000 | 9,600 | 1,150 | 290 | 8,200 | 410 | 150 | 62 |
| S2 | platform | 98,000 | 8,330 | 1,080 | 250 | 7,100 | 390 | 140 | 58 |
| S3 | platform | 135,000 | 11,880 | 1,310 | 300 | 10,100 | 480 | 170 | 71 |
| S4 | platform | 110,000 | 9,020 | 990 | 260 | 7,600 | 370 | 128 | 54 |
| S5 | brand | 40,000 | 1,600 | 520 | 140 | 1,500 | 190 | 88 | 44 |
| S6 | brand | 36,000 | 1,400 | 480 | 120 | 1,300 | 170 | 80 | 41 |
| S7 | brand | 52,000 | 2,130 | 700 | 190 | 2,000 | 260 | 118 | 60 |
| S8 | brand | 45,000 | 1,760 | 590 | 150 | 1,650 | 205 | 96 | 47 |

Pooled by host type (ratio of sums):

| host | Stop | Hold | Love | click rate | click to order | North Star |
|---|---|---|---|---|---|---|
| platform | 8.39% | 11.67% | 2.83% | 5.00% | 14.85% | **0.63%** |
| brand | 3.98% | 33.24% | 8.71% | 12.79% | 23.27% | **2.79%** |

- Orders: platform hosts **245**, brand hosts **192**. On GMV only, platform hosts look better;
  on the North Star, brand hosts convert **4.4x** better (2.79 / 0.63).
- The denominator trap: pooled conversion of all eight streams = 437 / 45,720 = **0.96%**; the
  mean of the eight per-stream conversion rates = **1.71%**. Ratio of sums weights by room size;
  mean of ratios weights every stream equally. Say which, every time.
- Per-stream conversion: S1 0.65%, S2 0.70%, S3 0.60%, S4 0.60%, S5 2.75%, S6 2.93%, S7 2.82%,
  S8 2.67%.

## Creators, constructed (b6, a5)

Six creators, one quarter, commission 8 percent of ATTRIBUTED GMV (constructed):

| creator | followers | attributed GMV | settled GMV | not settled |
|---|---|---|---|---|
| C1 | 2,100,000 | $42,000 | $29,400 | 30% |
| C2 | 180,000 | $18,500 | $16,650 | 10% |
| C3 | 650,000 | $25,000 | $21,250 | 15% |
| C4 | 45,000 | $9,800 | $9,212 | 6% |
| C5 | 1,400,000 | $31,000 | $19,840 | 36% |
| C6 | 90,000 | $12,400 | $11,160 | 10% |

Ranked by attributed: C1, C5, C3, C2, C6, C4. By settled: C1, C3, C5, C2, C6, C4 (C5 drops from
2nd to 3rd). Settled per 1,000 followers: C4 $204.7, C6 $124.0, C2 $92.5, C3 $32.7, C5 $14.2,
C1 $14.0 (the order inverts). Commission on attributed paid for C5: $2,480; on settled it would
be $1,587.20. Any page quoting these must re-run the arithmetic and label it constructed.

## GMV, take rate and active brands, constructed variants (a6, b7)

One Serai quarter, constructed:
- GMV placed, including shipping: **$48,600,000**; placed, excluding shipping: **$45,000,000**
  (the bench's figure); settled, net of cancellations and returns, excluding shipping:
  **$39,200,000**.
- Take rate on the three: (retainers $864,000 + GMV share $900,000) / GMV = **3.63%** on
  $48.6M, **3.92%** on $45.0M, **4.50%** on $39.2M. Without retainers, $900,000 / $45.0M = **2.00%**.
- Active brands: **48** under contract; **44** with at least one order in the quarter; **41** with at
  least $10,000 of settled GMV in the quarter.
The spread is the lesson: the same quarter supports a take rate from 2.00 to 4.50 percent and an
active-brand count from 41 to 48, all "true".

---

## Analyst build-along canon on the FULL Olist file (b2, b7), computed 2026-09-30

Seeded split of all 96,478 delivered orders (numpy default_rng(20260929), p = .45/.35/.20):
**A 43,750 · B 33,360 · C 19,368** orders; 110,197 delivered lines (A 49,977, B 38,204, C 22,016).
Constructed export column names: A `ordersn, item_id, shop_id, item_price, shipping_fee, buyer_zip,
buyer_city`; B `order_number, sku_id, seller_code, paid_price, shipping_amount` (no address);
C `order_no, listing_id, shop_code, sale_price, shipping_fee`. Conformed schema:
`platform, platform_order_id, platform_listing_id, platform_shop_id, item_price, shipping,
buyer_zip, buyer_city`; after conforming, 110,197 lines, `buyer_zip` present on **45.35 percent**
(A only). Mapping tables: shop mapping **6,911 rows -> 2,970 stores** (1,665 stores sell on all
three platforms, 611 on two, 694 on one); SKU mapping **47,148 rows -> 32,216 SKUs** (4,176 on all
three, 6,580 on two, 21,460 on one). Zero unmapped after the join (the full file has no gaps; the
bench's 219 unmapped lines are constructed). GMV of delivered lines **R$ 15,419,773.75 with
shipping, R$ 13,221,498.11 without** (shipping is 14.26 percent); by platform (excl. shipping)
A 6,050,000.43 · B 4,528,552.65 · C 2,642,945.03.

GMV variants for one real quarter, Q2 2018 (April to June), order lines by purchase date:
- all statuses, items only: **R$ 2,858,289.74** (19,947 orders); with shipping **R$ 3,332,156.97**
- delivered only: **R$ 2,807,156.64**; with shipping **R$ 3,273,631.74** (19,646 orders)
- cancelled or unavailable: R$ 8,559.48 (50 orders)
- payments table, same orders: **R$ 3,332,386.55** (differs from items + shipping by R$ 229.58)
- statuses in the quarter: delivered 19,646 · shipped 196 · canceled 50 · invoiced 41 · processing 14
Active sellers, same quarter, three definitions: **1,680** with any order · **1,653** with a
delivered order · **552** with at least R$ 1,000 of delivered items. 3,095 sellers in the file.

---

## Seams (checked by grep before any page was written)

| Topic | Owner | What this course does |
|---|---|---|
| The five categories, four-way verdict, data gate, "the revenue model decides" | `learn-ship-playbook-with-phoebe` s1, s2, s4, s5 | Links to the session, applies it to an enabler. Never re-teaches the frame |
| The live funnel stages, the minute table mechanics, every livestream data science method (CV, speech tagging, survival, change-point, fixed effects, LightGBM + SHAP, clustering, diff-in-diff) | `learn-live-commerce-analytics-with-phoebe` (a1 "Four stages, four questions", b1 "The stream as data", a6/b8 proof) | a3/b4/b5 take the OPERATOR side: who owns which event, the spec as a cross-team contract, scoring streams across many brands and two host types. One-line link for every method |
| Cohorts and retention | `learn-customer-retention-with-phoebe` | link |
| RFM | `learn-rfm-modeling-with-phoebe` | link |
| Entity matching at scale (Fellegi-Sunter, blocking) | `learn-entity-resolution-with-phoebe` | linked from the identity gate (a4, b3). This course only asks whether a key exists |
| Metric trees | `learn-metric-decomposition-with-phoebe` | link |
| Ecommerce metric definitions (GMV equation, dictionary, governance) | `learn-ecommerce-metrics-with-phoebe` a1, a2, a6, b8 | link, then the enabler twist: whose GMV, placed vs settled, the fee on top |
| Five-year diagnosis of one platform | `learn-ship-platform-diagnosis-with-phoebe` | sibling, cross-linked from index |

Title collisions checked against every `learn-*/courses/*.html` h1 before locking: avoided
"Metrics, and the event spec", "Registry and what's next", "The data estate of a club",
"The revenue model decides" (playbook s5).

---

## Sessions

### Leader track (no code)

| # | File | Title | Signature idea |
|---|---|---|---|
| a1 | a1-what-an-enabler-sells.html | What an enabler actually sells | Three fee lines (retainer, GMV share, creator cut), who pays for what; an enabler sells hours and knowing, not goods |
| a2 | a2-hours-removed.html | Margin comes from hours removed | On a service-fee model the margin is in hours removed; pricing optimisation mostly pays the brand. Applies playbook s5 |
| a3 | a3-a-channel-nobody-knew.html | A channel nobody knew how to sell on | Pasar Live (constructed): GMV only -> Stop, Hold, Love, Buy + North Star; eight teams, one table; platform vs merchant hosts |
| a4 | a4-what-the-platforms-let-you-bank.html | What the platforms let you bank | Masked buyers; customer grain impossible, store/SKU grain holds; feasibility, not law |
| a5 | a5-three-products-one-estate.html | Three products from one estate | Internal OS, brand intelligence, the knowing packaged for non-competing buyers first; each pays for the next |
| a6 | a6-metric-registry-before-ipo.html | The metric registry before the IPO | GMV, take rate, active brands defined once, with lineage; the 2020 SEC KPI guidance as the public reader's checklist |

### Analyst track (Python, SQL)

| # | File | Title | Signature idea |
|---|---|---|---|
| b1 | b1-seven-domains.html | Seven domains, one enabler estate | Seven data domains, obtainability per domain, the two dependency chains |
| b2 | b2-three-exports-one-schema.html | Three marketplace exports, one schema | Conform three exports to one order schema; platform id -> master id mapping tables |
| b3 | b3-the-identity-gate.html | The identity gate | Join keys under masking; pair scoring; why customer grain collapses; link to entity resolution |
| b4 | b4-per-minute-events.html | Per-minute events for a live channel | The event spec (entry, product card impression, click, add to cart, order per minute) as a contract with owners |
| b5 | b5-stop-hold-love-buy.html | Stop, Hold, Love, Buy as code | Stage metrics as code across many brands; denominators; host-type comparison |
| b6 | b6-content-to-creator-yield.html | Content to creator yield | Content -> tagged archive -> creator yield chain; settled not attributed GMV |
| b7 | b7-registry-as-code.html | The metric registry as code | YAML registry, lineage, version; tests that fail when a definition drifts |
| b8 | b8-the-enabler-bench.html | The enabler bench | Identity ladder on real Olist rows + roadmap sequencer |

---

## Verified facts, by tier

Tier A = primary source read in this build. Reported = a public secondary source read in this
build that describes a primary we could not open (platform seller centres are login-gated or
JavaScript-rendered). Nothing below "reported" is stated on a page.

### Platform buyer masking (a4, b2, b3, b8) - all REPORTED

| Platform | What is reported | Source read | Tier |
|---|---|---|---|
| Shopee | Buyer names and phone numbers removed from orders; the address is NOT masked "so that the seller can still use it for order matching"; applies "to all sellers, regardless of them using Seller Centre, Shopee App or any third party software vendors". Shopee's stated reason quoted as "part of strengthening our data security" | Easy Shopee & Lazada help article "Why are details from Shopee orders masked", dated 17 Oct 2022 (shopee-channel.helpscoutdocs.com/article/194) | reported |
| Lazada | Seller Center order details, CSV/Excel exports and printed receipts mask buyer name, address and phone from **12 January 2026**; Delivered-by-Seller orders keep full details. Open Platform API masks buyer name, phone and address in order data from **1 July 2026**; DBS merchants can apply for an unmasking exemption. Lazada's own notice is titled "Important - Encryption of Buyer Information for Orders" (search index date 2026-05-28); the page is JavaScript-rendered and was not read | BigSeller blog "Lazada privacy update 2026" (article 4218); Zetpy notice 26 Jun 2026 | reported |
| TikTok Shop | Recipient name and phone are "desensitized if platform logistics used"; it is desensitisation, not encryption, with no decrypt call; district info unavailable while UNPAID/ON_HOLD. Partner docs are login-gated | openlinker-project GitHub issue 2882, an integration research note | reported |

**How the pages use this:** "all three marketplaces mask the buyer's name and phone on orders
they fulfil, and each keeps a different amount of the address; seller-delivered orders are the
exception". Dates quoted with "reported". No page quotes platform contract clauses. The masking
in the bench is **constructed**, modelled on these patterns, and says so on the widget.

**Re-verify before delivery:** masking rules are changing month to month (Lazada twice in 2026).

### GMV has more than one definition (a1, a6, b7) - Tier A

Sea Limited, Annual Report (Form 20-F) for fiscal 2019, definitions section, read from the PDF:
- "gross merchandise value" or "GMV" "refers to the value of orders of products and services on
  our Shopee marketplace. Our calculation of GMV for our e-commerce platform **includes shipping
  and other charges**".
- "orders" means each confirmed order "**regardless of whether the transaction is settled or if
  the item is returned**".

Use: a listed marketplace's headline GMV counts shipping and unsettled or returned orders. An
enabler's GMV (placed? settled? net of returns? with shipping?) is a choice, and it must be
written down once. No page claims anything about Sea's later filings.

### What a reader of a listing document asks of an operating metric (a6, b7) - Tier A

SEC, "Commission Guidance on Management's Discussion and Analysis of Financial Condition and
Results of Operations", Release Nos. 33-10751; 34-88094; FR-87, effective 25 February 2020, read
from the PDF. The Commission "would generally expect" alongside a key metric:
- "A clear definition of the metric and how it is calculated";
- "A statement indicating the reasons why the metric provides useful information to investors";
- "A statement indicating how management uses the metric in managing or monitoring the performance
  of the business."
If the calculation method changes, consider disclosing the differences, the reasons, and the
effects on amounts previously reported. It also reminds companies of disclosure controls and
procedures over such metrics. Its example metrics include GMV-adjacent operating numbers (active
customers, total customers, average revenue per user, traffic growth).

**How the pages use it:** as a public example (US) of the three questions any serious reader asks of
GMV, take rate and active brands. Framed as a checklist for the registry, NOT as legal teaching
(Phoebe: "legal is not my strength, dont emphasize"). No page states what Singapore or any other
exchange requires.

### Olist (b2, b3, b8) - Tier A

Kaggle dataset metadata read via the public API: title "Brazilian E-Commerce Public Dataset by
Olist", licence **CC BY-NC-SA 4.0**, "100k orders from 2016 to 2018 made at multiple marketplaces
in Brazil", "real commercial data, it has been anonymised". Context: Olist "connects small
businesses from all over Brazil to channels without hassle and with a single contract" - itself a
marketplace-enabler model, which a1 uses as the real-world anchor. Counts recomputed in this build:
96,478 delivered orders, 93,358 customers (customer_unique_id), 2,801 repeat buyers, 90,557
one-time buyers (3.0 percent repeat), 110,197 delivered order lines, 2,970 sellers, 32,216 products.

### Seams re-read in this build

- Playbook s5: "The rule is one line. Which use cases pay depends on how the business makes its
  money" and the rule is the playbook's own heuristic, uncited. a2 inherits that status.
- Live commerce a1 teaches the four stages as TikTok Shop's LIVE Diagnosis reads them (Enter,
  Stay, Click, Buy). a3/b5 use Stop, Hold, Love, Buy as Pasar Live's own (constructed) naming and
  say the live-commerce course teaches the platform's version.

---

## The bench (assets/enabler-live.js + enabler-sample.js, 294 KB)

Reference: `materials/build-enabler-bench.py`. Node self-check (`L.selfCheck`) printed the SAME
numbers to four decimals on every row below, 2026-09-29.

**Sample:** seed 20260929. 250 of the 2,801 repeat customers plus 8,083 one-time customers (the
real 2,801 : 90,557 ratio), so 8,333 customers, **8,614 orders, 9,843 lines, 1,527 stores, 5,978
SKUs**. Orders per export 3,935 / 2,912 / 1,767 (A / B / C). 265 seller-shipped C orders carry
the raw phone and address. 219 lines sit on listings missing from Serai's SKU table. 63 distinct
masked names. 339 true same-customer order pairs.

**Constructed:** the 45/35/20 split; names from 40 first and 30 last names with 1/rank weights;
last two phone digits uniform; masking (name "F***l" and last two digits everywhere; A keeps zip +
city; B keeps neither; C keeps phone and address only when seller-shipped); unmapped listing
probability 1 / 1 / 6 percent.

### Canon, panel 1 (true match rate = TP / (P + T - TP))

Customer grain (orders, T = 339 true pairs):

| Key | Rate | Real links found | Predicted pairs | Correct |
|---|---|---|---|---|
| masked name | 0.0001 | 100% | 2,371,086 | 339 |
| masked phone | 0.0009 | 100% | 371,023 | 339 |
| hashed phone | 0.0000 | 0% | 0 | 0 |
| city + zip | 0.0366 | 19.2% | 1,502 | 65 |
| order id | 0.0000 | 0% | 0 | 0 |
| store id | 0.0007 | 29.2% | 139,297 | 99 |
| SKU | 0.0033 | 11.2% | 11,237 | 38 |
| masked name + masked phone | 0.0142 | 100% | 23,928 | 339 |
| masked name + masked phone + city + zip | 0.1917 | 19.2% | 65 | 65 (precision 100%) |
| **BEST: masked name + masked phone + store id** | **0.2329** | **29.2%** | 185 | 99 (precision 53.5%) |

Store grain (lines, T = 186,387): store id **1.0000**; SKU 0.0846; best = store id 1.0000.
SKU grain (lines, T = 17,474): SKU **0.9748** (17,033 of 17,474); store + SKU 0.9080; store id
0.0865 (recall 92.9%); best = SKU 0.9748.

**Break (shuffle the hidden ids, seed 7):** best customer 0.0000, best store 0.0037, best SKU
0.0004. Every grain near zero: the bench measures matching.

**Findings the pages may state:**
1. No key combination gets customer grain past 0.23. A key that finds every real link (masked
   phone) also makes 371,023 false ones; a key that is never wrong (name + phone + zip) finds 19
   percent, only where the export kept the address.
2. The hashed phone links nothing: 265 orders carried a raw phone and no two of them were the same
   person. A hash needs the raw value.
3. Store grain holds exactly (1.0000) and SKU grain holds at 0.9748, because the keys are Serai's
   own. The 2.5 percent gap is 219 lines on listings missing from the mapping table: owning the key
   means maintaining it.
4. Order id links nothing at any grain above order, as it should.
5. Honest limit: with 8,614 orders, fragment matches look better than they would at Serai's scale;
   false pairs grow with the square of the row count, true pairs with the count.

### Canon, panel 2 (all constructed, default assumptions)

Assumptions: $18 loaded hour; $45,000,000 GMV per quarter; 2% GMV-linked fee; $9,000 build squad
week; 13-week quarters; 8 quarters; gate 0.90. Per live week to Serai: content $6,960.00, CS
$4,524.80, ad ops $1,744.00, store ops $1,960.00, creator $5,229.38, stream $4,036.92, SKU view
$6,649.23, forecast $2,055.38 (+ $13,846.15 brand GMV), pricing **$992.62 (+ $69,230.77 brand
GMV)**, single customer view $4,362.46 (blocked).

| Preset | Net to Serai, 8 q | Payback | Brand GMV added | Hours removed | Blocked |
|---|---|---|---|---|---|
| Hours removed first | $1,372,287 | quarter 4 | $1,855,385 | 91,042 | 1 (SCV) |
| Brand intelligence first | $1,415,738 | quarter 3 | $2,298,462 | 62,813 | 1 |
| Single customer view first | $613,747 | quarter 6 | $5,178,462 | 46,324 | 1 |
| **ANTI: Pricing optimisation first** | **$860,315** | **quarter 6** | **$7,310,769** | 58,875 | 1 |

Cumulative, hours first: -96,120, -82,954, -14,259, 137,022, 384,483, 688,282, 1,009,307, 1,372,287.
Cumulative, pricing first: -117,000, -222,089, -266,218, -201,474, -30,900, 194,576, 497,335, 860,315.
Broken identity (break on), hours first: -$510,867, never pays back, 9 of 10 blocked (only CS,
which needs no join, survives).

**Findings the pages may state:**
1. Pricing first adds the most GMV ($7.3M, 3.9x hours-first) and returns $511,972 less to Serai,
   paying back two quarters later. It pays the brand.
2. Hours first and brand intelligence first land within 3.2 percent ($43,451) of each other. The
   gap is made of stipulated attach revenue, so **no page ranks one over the other on the bench**.
   The argument for hours first is certainty: it needs nobody's permission and no buyer.
3. Starting with the single customer view spends 16 weeks on something the identity gate blocks.
4. **The crossover, which a2 and b8 teach instead of hiding:** set Serai's GMV share to 0.06 and
   the pricing uplift to 0.06, and pricing first prints $1,900,438 against $1,612,656 for hours
   first. At 0.10 share, pricing first wins from uplift 0.04 ($2,068,254 vs $1,659,180). The
   anti-lever is an anti-lever for a service-fee enabler; for a business paid mostly on GMV
   share, it is not. That is the playbook's rule, visible in one input.

---

## Honest limits, stated on the pages that quote figures

- Serai Commerce, Pasar Live and every figure in the assumptions block are invented.
- The 3x conversion lift in the Pasar Live story is constructed.
- The bench's split and masking are constructed; the orders and who placed them are real.
- No figure is a claim about any real enabler's fees, margins or headcount.
- No page states a platform's contract terms or any exchange's listing rules.

## Not covered (honest list)

- Contract and data-protection law of any market (feasibility only, by design).
- Probabilistic record linkage methods (learn-entity-resolution).
- Livestream data science methods (learn-live-commerce-analytics).
- Fulfilment and logistics operations, warehouse management.
- Pricing of Serai's own services (fee levels are illustrative, never benchmarked).
- Any market-size statistic for Southeast Asian e-commerce: none was read at source in this build.

## Citation appendix (exact forms the pages use)

- Sea Limited, Annual Report on Form 20-F for the fiscal year 2019, "Conventions" definitions.
- U.S. Securities and Exchange Commission, "Commission Guidance on Management's Discussion and
  Analysis of Financial Condition and Results of Operations", Release No. 33-10751, February 2020.
- Olist, "Brazilian E-Commerce Public Dataset by Olist", Kaggle, CC BY-NC-SA 4.0.
- Reported: Easy Shopee & Lazada help centre, "Why are details from Shopee orders masked", 2022.
- Reported: BigSeller, "Lazada privacy update 2026"; Zetpy, "Lazada Open Platform to mask buyer
  data starting July 1, 2026", June 2026.
- Reported: openlinker-project, "Integration research - TikTok Shop Open API", GitHub issue 2882.

## Build record

Built 2026-09-29 to 2026-09-30. Hand-authored: a1, b1, b8, index.html, the bench engine and the
Python reference. Agents wrote a2 to a6 and b2 to b6. b7 was assembled on the main thread from a
killed agent's draft; its code was re-run and printed byte-identical output.

| Check | Result |
|---|---|
| Python reference against the node engine | every ladder row, every preset, the broken state: identical to four decimals |
| Bench driven headlessly through its whole ladder | every rung, the break button, four presets, both crossovers, reset and a custom move: all match this map |
| gate.sh | 14 pages, 55 figures, 0 defects; LAYOUT 30 page-widths (14 pages + index at 1280 and 390) |
| pre-publish.py | only OGCOVER (the social card is generated after hub registration) |
| Quiz, journey, passport | 3/3 correct and stamped on all 14 pages; 6 and 8 journey dots; 53 mindmap nodes |
| White figure text | every white label sits on a fill with 4.5:1 or better; the checker was tested on a planted bad label |
| Painted contrast of page chrome | 30 selectors, lowest 4.82 (audience chip); eyebrow raised from 4.39 to 5.11 |
| Privacy grep (the real names) | zero hits across the repo |
