#!/usr/bin/env python3
"""Build the enabler bench sample and print every number the bench (assets/enabler-live.js) shows.

Internal build script. Not linked from any audience-facing page.

Usage
-----
  python3 materials/build-enabler-bench.py <dir-with-olist-csvs> [--write-sample]

The directory must hold the Kaggle CSVs olist_orders_dataset.csv, olist_customers_dataset.csv and
olist_order_items_dataset.csv (Brazilian E-Commerce Public Dataset by Olist, CC BY-NC-SA 4.0).
No-login route: kagglehub.dataset_download("olistbr/brazilian-ecommerce").

What is REAL: every order, which real customer placed it (customer_unique_id), the customer's
zip prefix and city on that order, the store (seller_id) and SKU (product_id) on every line.
What is CONSTRUCTED, and labelled so on the widget:
  - the split of orders into three marketplace exports (45 / 35 / 20 percent, seeded)
  - the synthetic buyer name and phone behind each real customer (Olist ships neither)
  - each export's masking rule, modelled on the publicly reported patterns (see the course map)
  - which listings are missing from the enabler's own SKU mapping table
  - every figure in the roadmap assumptions block

Sampling: 250 of the 2,801 repeat customers plus one-time customers at the real ratio
(2,801 repeaters to 90,557 one-timers), so the sample keeps Olist's real 3.0 percent repeat rate.
That base rate is what decides how many false merges a weak key produces.

Pair scoring, shared with the engine: rows are grouped by the chosen key fields (a row with any
chosen field missing links to nothing). Predicted pairs P, true pairs T, correct pairs TP.
True match rate = TP / (P + T - TP), the Jaccard index of the two pair sets. It falls when a key
misses real links AND when it invents false ones, and it is near zero when the hidden ids are
shuffled (the break button), which is the proof that it measures matching.

The node check that must agree with this script to the digit:
  cd assets && node -e 'global.window={};require("./enabler-sample.js");
    const L=require("./enabler-live.js");L.selfCheck(window.ENABLER_SAMPLE)'
"""
import itertools
import json
import os
import sys

import numpy as np
import pandas as pd

SEED = 20260929
N_REPEAT = 250
EXPORT_SHARE = [0.45, 0.35, 0.20]
SELLER_SHIPPED_C = 0.15
UNMAPPED = [0.01, 0.01, 0.06]
EXPORTS = ["Platform A", "Platform B", "Platform C"]
KEYS = ["mname", "mphone", "hphone", "loc", "oid", "store", "sku"]
KEY_LABELS = {"mname": "masked name", "mphone": "masked phone", "hphone": "hashed phone",
              "loc": "city + zip", "oid": "order id", "store": "store id", "sku": "SKU"}
GRAINS = ["customer", "store", "sku"]
BREAK_SEED = 7

FIRST = ["Ana", "Maria", "Joao", "Pedro", "Lucas", "Julia", "Mariana", "Gabriel", "Rafael", "Beatriz",
         "Carlos", "Fernanda", "Paulo", "Camila", "Bruno", "Larissa", "Felipe", "Amanda", "Rodrigo",
         "Leticia", "Marcos", "Patricia", "Thiago", "Aline", "Diego", "Renata", "Eduardo", "Vanessa",
         "Gustavo", "Bianca", "Daniel", "Carolina", "Vinicius", "Tatiana", "Leonardo", "Priscila",
         "Ricardo", "Natalia", "Andre", "Isabela"]
LAST = ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima",
        "Gomes", "Costa", "Ribeiro", "Martins", "Carvalho", "Almeida", "Lopes", "Soares", "Fernandes",
        "Vieira", "Barbosa", "Rocha", "Dias", "Nascimento", "Andrade", "Moreira", "Nunes", "Marques",
        "Machado", "Mendes", "Freitas"]

# ---------------------------------------------------------------- roadmap assumptions (constructed)
ASSUMPTIONS = {
    "loadedCostPerHour": 18,        # USD, blended SEA operations cost per hour, fully loaded
    "gmvPerQuarter": 45000000,      # GMV Serai runs for its brands, per quarter
    "seraiGmvShare": 0.02,          # the GMV-linked part of Serai's fee, as a share of GMV
    "buildWeeklyCost": 9000,        # one build squad, per week, while it is building
    "weeksPerQuarter": 13,
    "horizonQuarters": 8,
    "gateThreshold": 0.90,          # true match rate a use case's grain must clear on the identity ladder
}
USE_CASES = [
    # people x hours/week x automatable share = hours removed per week
    {"id": "content", "name": "Content engine", "needs": "sku", "people": 40, "hoursPerWeek": 30,
     "automatable": 0.35, "buildWeeks": 10, "runPerWeek": 600, "attachPerQuarter": 0, "gmvUplift": 0},
    {"id": "cs", "name": "Customer service reply drafts", "needs": "none", "people": 24, "hoursPerWeek": 38,
     "automatable": 0.30, "buildWeeks": 8, "runPerWeek": 400, "attachPerQuarter": 0, "gmvUplift": 0},
    {"id": "adops", "name": "Ad pre-flight and pacing", "needs": "store", "people": 12, "hoursPerWeek": 30,
     "automatable": 0.30, "buildWeeks": 6, "runPerWeek": 200, "attachPerQuarter": 0, "gmvUplift": 0},
    {"id": "storeops", "name": "Store ops copilot", "needs": "store", "people": 16, "hoursPerWeek": 30,
     "automatable": 0.25, "buildWeeks": 8, "runPerWeek": 200, "attachPerQuarter": 0, "gmvUplift": 0},
    {"id": "creator", "name": "Creator yield scorecard", "needs": "sku", "people": 6, "hoursPerWeek": 20,
     "automatable": 0.40, "buildWeeks": 8, "runPerWeek": 250, "attachPerQuarter": 60000, "gmvUplift": 0},
    {"id": "stream", "name": "Live stream scoring", "needs": "sku", "people": 8, "hoursPerWeek": 25,
     "automatable": 0.35, "buildWeeks": 10, "runPerWeek": 300, "attachPerQuarter": 40000, "gmvUplift": 0},
    {"id": "skuview", "name": "Cross-platform SKU view", "needs": "sku", "people": 10, "hoursPerWeek": 20,
     "automatable": 0.30, "buildWeeks": 8, "runPerWeek": 200, "attachPerQuarter": 75000, "gmvUplift": 0},
    {"id": "forecast", "name": "Demand forecast per SKU", "needs": "sku", "people": 5, "hoursPerWeek": 20,
     "automatable": 0.30, "buildWeeks": 12, "runPerWeek": 300, "attachPerQuarter": 20000, "gmvUplift": 0.004},
    {"id": "pricing", "name": "Pricing optimisation", "needs": "sku", "people": 3, "hoursPerWeek": 10,
     "automatable": 0.20, "buildWeeks": 14, "runPerWeek": 500, "attachPerQuarter": 0, "gmvUplift": 0.02},
    {"id": "scv", "name": "Single customer view", "needs": "customer", "people": 4, "hoursPerWeek": 15,
     "automatable": 0.30, "buildWeeks": 16, "runPerWeek": 500, "attachPerQuarter": 50000, "gmvUplift": 0.01},
]
PRESETS = [
    {"id": "hours", "label": "Hours removed first",
     "order": ["content", "cs", "adops", "storeops", "creator", "stream", "skuview", "forecast", "pricing", "scv"]},
    {"id": "intel", "label": "Brand intelligence first",
     "order": ["skuview", "creator", "stream", "forecast", "content", "cs", "adops", "storeops", "pricing", "scv"]},
    {"id": "scv", "label": "Single customer view first",
     "order": ["scv", "pricing", "skuview", "creator", "content", "cs", "adops", "storeops", "stream", "forecast"]},
    {"id": "pricing", "label": "Pricing optimisation first", "anti": True,
     "order": ["pricing", "forecast", "skuview", "content", "cs", "adops", "storeops", "creator", "stream", "scv"]},
]


# ---------------------------------------------------------------- mulberry32, identical to the engine
def mulberry32(seed):
    a = seed & 0xFFFFFFFF

    def imul(x, y):
        return ((x & 0xFFFFFFFF) * (y & 0xFFFFFFFF)) & 0xFFFFFFFF

    def nxt():
        nonlocal a
        a = (a + 0x6D2B79F5) & 0xFFFFFFFF
        t = imul(a ^ (a >> 15), 1 | a)
        t = ((t + imul(t ^ (t >> 7), 61 | t)) & 0xFFFFFFFF) ^ t
        return ((t ^ (t >> 14)) & 0xFFFFFFFF) / 4294967296
    return nxt


def shuffled(arr, seed):
    out = list(arr)
    r = mulberry32(seed)
    for i in range(len(out) - 1, 0, -1):
        j = int(r() * (i + 1))
        out[i], out[j] = out[j], out[i]
    return out


# ---------------------------------------------------------------- build the sample
def build(d):
    o = pd.read_csv(os.path.join(d, "olist_orders_dataset.csv"), parse_dates=["order_purchase_timestamp"])
    c = pd.read_csv(os.path.join(d, "olist_customers_dataset.csv"))
    it = pd.read_csv(os.path.join(d, "olist_order_items_dataset.csv"))
    o = o[o.order_status == "delivered"].merge(c, on="customer_id")
    per = o.groupby("customer_unique_id").order_id.nunique()
    rep = np.sort(per[per > 1].index.values)
    one = np.sort(per[per == 1].index.values)
    n_one = int(round(N_REPEAT * len(one) / len(rep)))
    print(f"olist delivered orders {len(o)}, customers {per.size}, repeaters {len(rep)}, one-timers {len(one)}")

    rng = np.random.default_rng(SEED)
    pick = np.concatenate([rng.choice(rep, N_REPEAT, replace=False), rng.choice(one, n_one, replace=False)])
    pick = sorted(pick.tolist())
    cidx = {u: i for i, u in enumerate(pick)}

    so = o[o.customer_unique_id.isin(cidx)].sort_values(["order_purchase_timestamp", "order_id"]).reset_index(drop=True)
    n_orders = len(so)

    # constructed identities, one per real customer
    fw = np.array([1 / (k + 1) for k in range(len(FIRST))]); fw /= fw.sum()
    lw = np.array([1 / (k + 1) for k in range(len(LAST))]); lw /= lw.sum()
    names = [FIRST[rng.choice(len(FIRST), p=fw)] + " " + LAST[rng.choice(len(LAST), p=lw)] for _ in pick]
    masked = [nm[0] + "***" + nm[-1] for nm in names]
    mlist = sorted(set(masked))
    mname = [mlist.index(m) for m in masked]
    phone2 = rng.integers(0, 100, len(pick)).tolist()

    # constructed exports
    exp = rng.choice(3, n_orders, p=EXPORT_SHARE).tolist()
    shipped = [1 if (e == 2 and rng.random() < SELLER_SHIPPED_C) else 0 for e in exp]

    locs = (so.customer_zip_code_prefix.astype(str).str.zfill(5) + " " + so.customer_city).tolist()
    llist = sorted(set(locs))
    loc = [llist.index(x) for x in locs]

    oidx = {x: i for i, x in enumerate(so.order_id)}
    li = it[it.order_id.isin(oidx)].copy()
    li["o"] = li.order_id.map(oidx)
    li = li.sort_values(["o", "order_item_id"]).reset_index(drop=True)
    stores = sorted(li.seller_id.unique()); sidx = {x: i for i, x in enumerate(stores)}
    skus = sorted(li.product_id.unique()); kidx = {x: i for i, x in enumerate(skus)}
    lo = li.o.tolist(); ls = li.seller_id.map(sidx).tolist(); lk = li.product_id.map(kidx).tolist()

    # constructed mapping gaps, one draw per listing (SKU x export)
    listing_gap = {}
    unm = []
    for o_, k in zip(lo, lk):
        key = (k, exp[o_])
        if key not in listing_gap:
            listing_gap[key] = 1 if rng.random() < UNMAPPED[exp[o_]] else 0
        unm.append(listing_gap[key])

    sample = {
        "seed": SEED, "exports": EXPORTS, "exportShare": EXPORT_SHARE,
        "nCustomers": len(pick), "nRepeat": N_REPEAT, "nOrders": n_orders, "nLines": len(lo),
        "nStores": len(stores), "nSkus": len(skus), "nMasks": len(mlist), "nLocs": len(llist),
        "cust": so.customer_unique_id.map(cidx).tolist(), "exp": exp, "shipped": shipped, "loc": loc,
        "mname": mname, "phone2": phone2,
        "linesPerOrder": lines_per_order(lo, n_orders),
        "lineStore": ls, "lineSku": lk, "lineUnmapped": unm,
        "assumptions": ASSUMPTIONS, "useCases": USE_CASES, "presets": PRESETS, "breakSeed": BREAK_SEED,
    }
    return sample


# ---------------------------------------------------------------- scoring, mirrored in the engine
def lines_per_order(lo, n):
    out = [0] * n
    for o_ in lo:
        out[o_] += 1
    return out


def expand(s):
    """The sample ships lines per order; rebuild the line -> order index exactly as the engine does."""
    if "lineOrder" not in s:
        s["lineOrder"] = [o_ for o_, k in enumerate(s["linesPerOrder"]) for _ in range(k)]
    return s


def rows_for(s, grain):
    """Key fields and truth for every row at a grain. None = the export does not carry it."""
    expand(s)
    n = s["nOrders"]
    first_line = {}
    for i, o_ in enumerate(s["lineOrder"]):
        first_line.setdefault(o_, i)

    def order_fields(o_):
        c_ = s["cust"][o_]; e = s["exp"][o_]; sh = s["shipped"][o_]
        return {"mname": s["mname"][c_], "mphone": s["phone2"][c_],
                "hphone": c_ if sh else None,
                "loc": s["loc"][o_] if (e == 0 or sh) else None,
                "oid": o_}
    rows, truth = [], []
    if grain == "customer":
        for o_ in range(n):
            f = order_fields(o_)
            li = first_line[o_]
            f["store"] = s["lineStore"][li]
            f["sku"] = None if s["lineUnmapped"][li] else s["lineSku"][li]
            rows.append(f); truth.append(s["cust"][o_])
    else:
        for li, o_ in enumerate(s["lineOrder"]):
            f = order_fields(o_)
            f["store"] = s["lineStore"][li]
            f["sku"] = None if s["lineUnmapped"][li] else s["lineSku"][li]
            rows.append(f)
            truth.append(s["lineStore"][li] if grain == "store" else s["lineSku"][li])
    return rows, truth


def c2(n):
    return n * (n - 1) // 2


def score(rows, truth, keys):
    if not keys:
        T = sum(c2(v) for v in pd.Series(truth).value_counts().tolist())
        return {"P": 0, "T": T, "TP": 0, "rate": 0.0, "recall": 0.0, "precision": None}
    pred, both, tr = {}, {}, {}
    for r, t in zip(rows, truth):
        tr[t] = tr.get(t, 0) + 1
        vals = [r[k] for k in keys]
        if any(v is None for v in vals):
            continue
        pk = tuple(vals)
        pred[pk] = pred.get(pk, 0) + 1
        both[(pk, t)] = both.get((pk, t), 0) + 1
    P = sum(c2(v) for v in pred.values())
    T = sum(c2(v) for v in tr.values())
    TP = sum(c2(v) for v in both.values())
    den = P + T - TP
    return {"P": P, "T": T, "TP": TP, "rate": TP / den if den else 0.0,
            "recall": TP / T if T else 0.0, "precision": TP / P if P else None}


def ladder(s, broken=False):
    out = {}
    for g in GRAINS:
        rows, truth = rows_for(s, g)
        if broken:
            truth = shuffled(truth, s["breakSeed"])
        best = None
        per = {}
        for r in range(1, len(KEYS) + 1):
            for combo in itertools.combinations(KEYS, r):
                sc = score(rows, truth, list(combo))
                per[combo] = sc
                if best is None or sc["rate"] > best[1]["rate"] + 1e-12:
                    best = (combo, sc)
        out[g] = {"best": best, "per": per}
    return out


# ---------------------------------------------------------------- roadmap sequencer
def week_value(u, a):
    hours = u["people"] * u["hoursPerWeek"] * u["automatable"]
    serai = (hours * a["loadedCostPerHour"] + u["attachPerQuarter"] / a["weeksPerQuarter"]
             + a["gmvPerQuarter"] / a["weeksPerQuarter"] * u["gmvUplift"] * a["seraiGmvShare"]
             - u["runPerWeek"])
    brand_gmv = a["gmvPerQuarter"] / a["weeksPerQuarter"] * u["gmvUplift"]
    return hours, serai, brand_gmv


def sequence(order, use_cases, a, best_rate):
    by = {u["id"]: u for u in use_cases}
    H = a["weeksPerQuarter"] * a["horizonQuarters"]
    wk = 0
    q_net = [0.0] * a["horizonQuarters"]
    q_gmv = [0.0] * a["horizonQuarters"]
    q_hours = [0.0] * a["horizonQuarters"]
    rows = []
    for uid in order:
        u = by[uid]
        blocked = u["needs"] in best_rate and best_rate[u["needs"]] < a["gateThreshold"]
        start, end = wk, wk + u["buildWeeks"]
        for w in range(start, min(end, H)):
            q_net[w // a["weeksPerQuarter"]] -= a["buildWeeklyCost"]
        wk = end
        hours, serai, gmv = week_value(u, a)
        live = 0
        if not blocked:
            for w in range(end, H):
                q = w // a["weeksPerQuarter"]
                q_net[q] += serai; q_gmv[q] += gmv; q_hours[q] += hours
                live += 1
        rows.append({"id": uid, "start": start, "ship": end, "blocked": blocked, "liveWeeks": live})
    cum, payback = 0.0, None
    cums = []
    for q in range(a["horizonQuarters"]):
        cum += q_net[q]; cums.append(cum)
        if payback is None and cum >= 0 and q > 0:
            payback = q + 1
    return {"rows": rows, "qNet": q_net, "cum": cums, "net": cum, "payback": payback,
            "brandGmv": sum(q_gmv), "hours": sum(q_hours)}


# ---------------------------------------------------------------- report
def report(s):
    print(f"\nsample: customers {s['nCustomers']} (repeat {s['nRepeat']}), orders {s['nOrders']}, "
          f"lines {s['nLines']}, stores {s['nStores']}, SKUs {s['nSkus']}, masked names {s['nMasks']}, locations {s['nLocs']}")
    print("orders per export", [s["exp"].count(i) for i in range(3)], "seller-shipped C", sum(s["shipped"]),
          "unmapped lines", sum(s["lineUnmapped"]))
    L = ladder(s)
    B = ladder(s, broken=True)
    for g in GRAINS:
        print(f"\n== grain {g}")
        for k in KEYS:
            sc = L[g]["per"][(k,)]
            print(f"  {KEY_LABELS[k]:<14} rate {sc['rate']:.4f}  recall {sc['recall']:.4f}  P {sc['P']}  T {sc['T']}  TP {sc['TP']}")
        for combo in [("mname", "mphone"), ("mname", "mphone", "loc"), ("hphone",), ("store", "sku")]:
            sc = L[g]["per"][combo]
            print(f"  {'+'.join(combo):<22} rate {sc['rate']:.4f} recall {sc['recall']:.4f} P {sc['P']} TP {sc['TP']}")
        bc, bs = L[g]["best"]
        print(f"  BEST {'+'.join(bc)} rate {bs['rate']:.4f} recall {bs['recall']:.4f} precision {bs['precision']}")
        bb = B[g]["best"]
        print(f"  BROKEN best {'+'.join(bb[0])} rate {bb[1]['rate']:.4f}")
    best_rate = {g: L[g]["best"][1]["rate"] for g in GRAINS}
    a = s["assumptions"]
    print("\n== use cases, per live week")
    for u in s["useCases"]:
        h, v, gm = week_value(u, a)
        print(f"  {u['id']:<9} hours {h:.1f}  serai {v:.2f}  brandGMV {gm:.2f}  needs {u['needs']}")
    print("\n== presets")
    for p in s["presets"]:
        r = sequence(p["order"], s["useCases"], a, best_rate)
        print(f"  {p['id']:<8} net {r['net']:.0f}  payback {r['payback']}  brandGMV {r['brandGmv']:.0f}  "
              f"hours {r['hours']:.0f}  blocked {[x['id'] for x in r['rows'] if x['blocked']]}")
        print("           cum", [round(x) for x in r["cum"]])
    broken_rate = {g: B[g]["best"][1]["rate"] for g in GRAINS}
    r = sequence(s["presets"][0]["order"], s["useCases"], a, broken_rate)
    print(f"  hours-first with broken identity: net {r['net']:.0f} blocked {sum(x['blocked'] for x in r['rows'])}")


def write_sample(s, out):
    body = json.dumps({k: v for k, v in s.items() if k != "lineOrder"}, separators=(",", ":"))
    js = ("/* enabler-sample.js - the enabler bench sample, generated by materials/build-enabler-bench.py.\n"
          " * REAL: 8,332 customers' delivered orders from the public Olist dataset (seed 20260929), with each\n"
          " * order's real customer, zip prefix and city, and each line's real store and SKU.\n"
          " * CONSTRUCTED: the three-export split, synthetic names and phones, each export's masking, the SKU\n"
          " * mapping gaps, and the roadmap assumptions. Source: Brazilian E-Commerce Public Dataset by Olist\n"
          " * (CC BY-NC-SA 4.0), Kaggle. */\n"
          "window.ENABLER_SAMPLE = " + body + ";\n")
    with open(out, "w") as f:
        f.write(js)
    print(f"\nwrote {out} ({len(js)} bytes)")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    s = build(sys.argv[1])
    report(s)
    if "--write-sample" in sys.argv:
        here = os.path.dirname(os.path.abspath(__file__))
        write_sample(s, os.path.join(here, "..", "assets", "enabler-sample.js"))
