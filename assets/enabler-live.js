/* enabler-live.js - the enabler bench for learn-ship-ecommerce-enabler-with-phoebe
 *
 * Panel 1, the identity ladder. Real Olist orders (see enabler-sample.js) split into three
 * marketplace-style exports, each masked the way the public reports describe. Pick join keys and a
 * grain; the bench groups the rows by those keys and scores the links against the hidden real ids.
 *   True match rate = TP / (P + T - TP): correct links over every link that is either real or
 *   claimed. It falls when a key misses real links and when it invents false ones.
 *   The break button shuffles the hidden ids. Every grain must then fall to near zero, which is
 *   the proof that the number measures matching and not something about the data's shape.
 *
 * Panel 2, the roadmap sequencer. Ten use cases sized from ONE assumptions block (editable on the
 * page). One build squad builds them in the order you choose. A use case whose grain did not clear
 * the gate on panel 1 still costs its build weeks and earns nothing. Score: Serai's cumulative net
 * margin by quarter, and the quarter it pays back.
 *
 * REAL: orders, customers, zip and city, stores, SKUs, every link count.
 * CONSTRUCTED (and the widget says so): the export split, names and phones, masking rules, mapping
 * gaps, every figure in the assumptions block.
 *
 * materials/build-enabler-bench.py is the Python reference; selfCheck() must print the same numbers.
 */
(function (root) {
  "use strict";

  var KEYS = ["mname", "mphone", "hphone", "loc", "oid", "store", "sku"];
  var KEY_LABELS = { mname: "masked name", mphone: "masked phone", hphone: "hashed phone",
    loc: "city + zip", oid: "order id", store: "store id", sku: "SKU" };
  var KEY_NOTES = {
    mname: "first letter, ***, last letter, as every export shows it",
    mphone: "the last two digits the exports leave visible",
    hphone: "only exists where the raw phone was exported",
    loc: "zip prefix and city, where the export keeps the address",
    oid: "one per order, never shared",
    store: "Serai's own store id, mapped from each platform's shop id",
    sku: "Serai's master SKU, mapped from each platform's listing id"
  };
  var GRAINS = ["customer", "store", "sku"];
  var GRAIN_LABELS = { customer: "Customer", store: "Store", sku: "SKU" };
  var NEED_LABELS = { none: "no join", store: "store grain", sku: "SKU grain", customer: "customer grain" };

  /* ---------- mulberry32 and a seeded shuffle, mirrored in the Python reference ---------- */
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function shuffled(arr, seed) {
    var out = arr.slice(), r = mulberry32(seed);
    for (var i = out.length - 1; i > 0; i--) {
      var j = Math.floor(r() * (i + 1));
      var t = out[i]; out[i] = out[j]; out[j] = t;
    }
    return out;
  }

  /* ---------- rows at a grain ---------- */
  function expand(s) {
    if (!s.lineOrder) {
      s.lineOrder = [];
      for (var o = 0; o < s.linesPerOrder.length; o++) for (var k = 0; k < s.linesPerOrder[o]; k++) s.lineOrder.push(o);
    }
    return s;
  }

  function rowsFor(s, grain) {
    expand(s);
    var firstLine = {}, i;
    for (i = 0; i < s.lineOrder.length; i++) if (!(s.lineOrder[i] in firstLine)) firstLine[s.lineOrder[i]] = i;
    function orderFields(o) {
      var c = s.cust[o], e = s.exp[o], sh = s.shipped[o];
      return { mname: s.mname[c], mphone: s.phone2[c], hphone: sh ? c : null,
        loc: (e === 0 || sh) ? s.loc[o] : null, oid: o };
    }
    var rows = [], truth = [];
    if (grain === "customer") {
      for (var o = 0; o < s.nOrders; o++) {
        var f = orderFields(o), li = firstLine[o];
        f.store = s.lineStore[li];
        f.sku = s.lineUnmapped[li] ? null : s.lineSku[li];
        rows.push(f); truth.push(s.cust[o]);
      }
    } else {
      for (i = 0; i < s.lineOrder.length; i++) {
        var g = orderFields(s.lineOrder[i]);
        g.store = s.lineStore[i];
        g.sku = s.lineUnmapped[i] ? null : s.lineSku[i];
        rows.push(g);
        truth.push(grain === "store" ? s.lineStore[i] : s.lineSku[i]);
      }
    }
    return { rows: rows, truth: truth };
  }

  function c2(n) { return n * (n - 1) / 2; }

  function score(rows, truth, keys) {
    var tr = {}, pred = {}, both = {}, i, k;
    for (i = 0; i < rows.length; i++) {
      tr[truth[i]] = (tr[truth[i]] || 0) + 1;
      if (!keys.length) continue;
      var parts = [], miss = false;
      for (k = 0; k < keys.length; k++) {
        var v = rows[i][keys[k]];
        if (v === null || v === undefined) { miss = true; break; }
        parts.push(v);
      }
      if (miss) continue;
      var pk = parts.join("|");
      pred[pk] = (pred[pk] || 0) + 1;
      var bk = pk + "#" + truth[i];
      both[bk] = (both[bk] || 0) + 1;
    }
    var P = 0, T = 0, TP = 0, x;
    for (x in pred) P += c2(pred[x]);
    for (x in tr) T += c2(tr[x]);
    for (x in both) TP += c2(both[x]);
    var den = P + T - TP;
    return { P: P, T: T, TP: TP, rate: den ? TP / den : 0, recall: T ? TP / T : 0, precision: P ? TP / P : null };
  }

  function combos() {
    var out = [];
    for (var m = 1; m < (1 << KEYS.length); m++) {
      var c = [];
      for (var b = 0; b < KEYS.length; b++) if (m & (1 << b)) c.push(KEYS[b]);
      out.push(c);
    }
    /* same enumeration order as itertools.combinations by size, so ties resolve identically */
    out.sort(function (a, b) {
      if (a.length !== b.length) return a.length - b.length;
      for (var i = 0; i < a.length; i++) {
        var d = KEYS.indexOf(a[i]) - KEYS.indexOf(b[i]);
        if (d) return d;
      }
      return 0;
    });
    return out;
  }

  function prepare(s, broken) {
    var g = {};
    GRAINS.forEach(function (grain) {
      var r = rowsFor(s, grain);
      if (broken) r.truth = shuffled(r.truth, s.breakSeed);
      g[grain] = r;
    });
    return g;
  }

  function bestPerGrain(prep) {
    var out = {}, all = combos();
    GRAINS.forEach(function (grain) {
      var best = null;
      all.forEach(function (c) {
        var sc = score(prep[grain].rows, prep[grain].truth, c);
        if (!best || sc.rate > best.score.rate + 1e-12) best = { keys: c, score: sc };
      });
      out[grain] = best;
    });
    return out;
  }

  /* ---------- the roadmap sequencer ---------- */
  function weekValue(u, a) {
    var hours = u.people * u.hoursPerWeek * u.automatable;
    var serai = hours * a.loadedCostPerHour + u.attachPerQuarter / a.weeksPerQuarter +
      a.gmvPerQuarter / a.weeksPerQuarter * u.gmvUplift * a.seraiGmvShare - u.runPerWeek;
    var brandGmv = a.gmvPerQuarter / a.weeksPerQuarter * u.gmvUplift;
    return { hours: hours, serai: serai, brandGmv: brandGmv };
  }

  function sequence(order, useCases, a, bestRate) {
    var by = {}; useCases.forEach(function (u) { by[u.id] = u; });
    var W = a.weeksPerQuarter, Q = a.horizonQuarters, H = W * Q, wk = 0, q;
    var qNet = [], qGmv = [], qHours = [];
    for (q = 0; q < Q; q++) { qNet.push(0); qGmv.push(0); qHours.push(0); }
    var rows = [];
    order.forEach(function (id) {
      var u = by[id];
      var blocked = (u.needs in bestRate) && bestRate[u.needs] < a.gateThreshold;
      var start = wk, end = wk + u.buildWeeks, w;
      for (w = start; w < Math.min(end, H); w++) qNet[Math.floor(w / W)] -= a.buildWeeklyCost;
      wk = end;
      var v = weekValue(u, a), live = 0;
      if (!blocked) {
        for (w = end; w < H; w++) {
          q = Math.floor(w / W);
          qNet[q] += v.serai; qGmv[q] += v.brandGmv; qHours[q] += v.hours; live++;
        }
      }
      rows.push({ id: id, name: u.name, needs: u.needs, start: start, ship: end, blocked: blocked, liveWeeks: live, value: v });
    });
    var cum = 0, payback = null, cums = [];
    for (q = 0; q < Q; q++) {
      cum += qNet[q]; cums.push(cum);
      if (payback === null && cum >= 0 && q > 0) payback = q + 1;
    }
    var sum = function (arr) { return arr.reduce(function (x, y) { return x + y; }, 0); };
    return { rows: rows, qNet: qNet, cum: cums, net: cum, payback: payback, brandGmv: sum(qGmv), hours: sum(qHours) };
  }

  function bestRates(best) {
    var r = {}; GRAINS.forEach(function (g) { r[g] = best[g].score.rate; }); return r;
  }

  /* ---------- headless check, prints what the Python reference prints ---------- */
  function selfCheck(s) {
    var log = function (x) { console.log(x); };
    ["normal", "broken"].forEach(function (mode) {
      var prep = prepare(s, mode === "broken"), best = bestPerGrain(prep);
      GRAINS.forEach(function (g) {
        if (mode === "normal") {
          KEYS.forEach(function (k) {
            var sc = score(prep[g].rows, prep[g].truth, [k]);
            log(g + " " + k + " rate " + sc.rate.toFixed(4) + " recall " + sc.recall.toFixed(4) + " P " + sc.P + " T " + sc.T + " TP " + sc.TP);
          });
          [["mname", "mphone"], ["mname", "mphone", "loc"], ["store", "sku"]].forEach(function (c) {
            var sc = score(prep[g].rows, prep[g].truth, c);
            log(g + " " + c.join("+") + " rate " + sc.rate.toFixed(4) + " recall " + sc.recall.toFixed(4) + " P " + sc.P + " TP " + sc.TP);
          });
        }
        log(mode + " " + g + " BEST " + best[g].keys.join("+") + " rate " + best[g].score.rate.toFixed(4) +
          " recall " + best[g].score.recall.toFixed(4));
      });
      var br = bestRates(best);
      s.presets.forEach(function (p) {
        var r = sequence(p.order, s.useCases, s.assumptions, br);
        log(mode + " preset " + p.id + " net " + Math.round(r.net) + " payback " + r.payback + " brandGmv " + Math.round(r.brandGmv) +
          " hours " + Math.round(r.hours) + " blocked " + r.rows.filter(function (x) { return x.blocked; }).length +
          " cum " + r.cum.map(Math.round).join(","));
      });
    });
  }

  /* ================================================================ UI */
  function esc(x) {
    return String(x).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  function fmt(n) { return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
  function usd(n) { return (n < 0 ? "-$" : "$") + fmt(Math.abs(n)); }
  function pct(x) { return (x * 100).toFixed(1) + "%"; }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; }
  function kind(k) { return '<span class="eb-kind is-' + k + '">' + k + "</span>"; }

  var S, prepN, prepB, bestN, bestB, state = { grain: "customer", keys: ["mname"], broken: false, preset: "hours", order: null };
  var A, UC, ui = {};

  function currentPrep() { return state.broken ? prepB : prepN; }
  function currentBest() { return state.broken ? bestB : bestN; }

  function renderLadder() {
    var p = currentPrep()[state.grain];
    var sc = score(p.rows, p.truth, state.keys);
    var best = currentBest();
    var verdict, cls;
    if (!state.keys.length) { verdict = "Pick at least one key. With no key, nothing is linked and the rate is zero."; cls = "bad"; }
    else if (sc.rate >= A.gateThreshold) { verdict = "This key holds at " + GRAIN_LABELS[state.grain].toLowerCase() + " grain: " + pct(sc.rate) + " true match rate clears the " + pct(A.gateThreshold) + " gate."; cls = "good"; }
    else if (sc.precision !== null && sc.precision < 0.5) { verdict = "More than half the links this key makes are false: " + fmt(sc.P - sc.TP) + " wrong links against " + fmt(sc.TP) + " right ones."; cls = "bad"; }
    else { verdict = "This key finds " + pct(sc.recall) + " of the real links and stays under the " + pct(A.gateThreshold) + " gate."; cls = "ok"; }
    if (state.broken) verdict = "Hidden ids shuffled. " + verdict;
    ui.lread.innerHTML =
      '<div class="eb-verdict is-' + cls + '">' + esc(verdict) + " " + kind("measured") + "</div>" +
      '<div class="eb-metrics">' +
        metric("True match rate", pct(sc.rate), "correct links over every real or claimed link", "measured") +
        metric("Real links found", pct(sc.recall), fmt(sc.TP) + " of " + fmt(sc.T) + " pairs that truly belong together", "measured") +
        metric("False links", fmt(Math.max(0, sc.P - sc.TP)), "pairs this key joins that are different " + (state.grain === "customer" ? "people" : state.grain === "store" ? "stores" : "SKUs"), "measured") +
      "</div>";
    ui.lbest.innerHTML = '<p class="eb-sub">Best any of the 127 key combinations can reach, per grain' + (state.broken ? ", hidden ids shuffled" : "") + "</p>" +
      GRAINS.map(function (g) {
        var b = best[g], ok = b.score.rate >= A.gateThreshold;
        return '<div class="eb-gauge"><span class="eb-glabel">' + GRAIN_LABELS[g] + '</span>' +
          '<span class="eb-gtrack"><span class="eb-gfill' + (ok ? "" : " is-low") + '" style="width:' + Math.max(1, b.score.rate * 100).toFixed(1) + '%"></span>' +
          '<span class="eb-gtick" style="left:' + (A.gateThreshold * 100).toFixed(1) + '%"></span></span>' +
          '<span class="eb-gval">' + pct(b.score.rate) + "</span>" +
          '<span class="eb-gkeys">' + esc(b.keys.map(function (k) { return KEY_LABELS[k]; }).join(" + ")) + (ok ? " · gate open" : " · gate shut") + "</span></div>";
      }).join("");
    ui.breakBtn.textContent = state.broken ? "Restore the hidden ids" : "Break it: shuffle the hidden ids";
    ui.breakBtn.classList.toggle("is-on", state.broken);
  }

  function metric(label, value, unit, k) {
    return '<div class="eb-metric"><span class="eb-mlabel">' + esc(label) + '</span><span class="eb-mvalue">' + esc(value) +
      '</span><span class="eb-munit">' + esc(unit) + "</span>" + kind(k) + "</div>";
  }

  function renderSeq() {
    var br = bestRates(currentBest());
    var r = sequence(state.order, UC, A, br);
    var blocked = r.rows.filter(function (x) { return x.blocked; }).length;
    var preset = S.presets.filter(function (p) { return p.id === state.preset; })[0];
    var verdict, cls;
    if (r.net < 0) { verdict = "This order has not paid back after " + A.horizonQuarters + " quarters."; cls = "bad"; }
    else if (preset && preset.anti) { verdict = "Big for the brands (" + usd(r.brandGmv) + " of added GMV) and slow for Serai: payback in quarter " + r.payback + "."; cls = "bad"; }
    else { verdict = "Pays back in quarter " + r.payback + "; " + usd(r.net) + " net to Serai after " + A.horizonQuarters + " quarters."; cls = r.payback && r.payback <= 4 ? "good" : "ok"; }
    if (blocked) verdict += " " + blocked + " use case" + (blocked === 1 ? "" : "s") + " blocked by the identity gate, built and earning nothing.";
    ui.sread.innerHTML =
      '<div class="eb-verdict is-' + cls + '">' + esc(verdict) + " " + kind("modelled") + "</div>" +
      '<div class="eb-metrics">' +
        metric("Serai net margin", usd(r.net), "after " + A.horizonQuarters + " quarters, build cost included", "modelled") +
        metric("Pays back in", r.payback ? "quarter " + r.payback : "not yet", "first quarter the running total is at or above zero", "modelled") +
        metric("GMV added for brands", usd(r.brandGmv), "most of it is the brands' money, not Serai's", "modelled") +
        metric("Hours removed", fmt(r.hours), "staff hours taken out over the horizon", "modelled") +
      "</div>" + bars(r);
    ui.list.innerHTML = "";
    r.rows.forEach(function (row, i) {
      var li = el("li", "eb-uc" + (row.blocked ? " is-blocked" : ""));
      li.innerHTML = '<span class="eb-uname">' + (i + 1) + ". " + esc(row.name) + "</span>" +
        '<span class="eb-uneeds">' + esc(NEED_LABELS[row.needs]) + (row.blocked ? " · blocked" : "") + "</span>" +
        '<span class="eb-uval">' + usd(row.value.serai) + " a week to Serai" + (row.value.brandGmv ? " · " + usd(row.value.brandGmv) + " GMV for brands" : "") + "</span>" +
        '<span class="eb-uship">ships week ' + row.ship + "</span>";
      var up = el("button", "eb-mv", "▲"); up.type = "button"; up.setAttribute("aria-label", "Move " + row.name + " earlier");
      var dn = el("button", "eb-mv", "▼"); dn.type = "button"; dn.setAttribute("aria-label", "Move " + row.name + " later");
      up.disabled = i === 0; dn.disabled = i === r.rows.length - 1;
      up.addEventListener("click", function () { move(i, -1); });
      dn.addEventListener("click", function () { move(i, 1); });
      var ctl = el("span", "eb-ctl"); ctl.appendChild(up); ctl.appendChild(dn); li.appendChild(ctl);
      ui.list.appendChild(li);
    });
    Object.keys(ui.pbtn).forEach(function (k) { ui.pbtn[k].classList.toggle("is-on", k === state.preset); });
  }

  function bars(r) {
    var pos = Math.max.apply(null, r.cum.concat([0])), neg = -Math.min.apply(null, r.cum.concat([0]));
    var w = 640, h = 150, bw = w / r.cum.length, span = Math.max(pos + neg, 1);
    var mid = 8 + (h - 16) * pos / span;
    var svg = '<svg class="eb-bars" viewBox="0 0 ' + (w + 90) + " " + (h + 30) + '" role="img" aria-label="Serai cumulative net margin by quarter: ' +
      r.cum.map(function (c, i) { return "quarter " + (i + 1) + " " + usd(c); }).join(", ") + '">' +
      '<line x1="60" x2="' + (w + 60) + '" y1="' + mid + '" y2="' + mid + '" class="eb-axis"/>';
    r.cum.forEach(function (c, i) {
      var bh = Math.abs(c) / span * (h - 16), x = 60 + i * bw + 8, y = c >= 0 ? mid - bh : mid;
      svg += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + (bw - 16).toFixed(1) + '" height="' + Math.max(1, bh).toFixed(1) + '" class="' + (c >= 0 ? "eb-pos" : "eb-neg") + '"/>';
      svg += '<text x="' + (x + (bw - 16) / 2).toFixed(1) + '" y="' + (h + 22) + '" class="eb-tx" text-anchor="middle">Q' + (i + 1) + "</text>";
    });
    svg += '<text x="4" y="' + (mid - 4) + '" class="eb-tx">$0</text></svg>';
    return '<div class="eb-barwrap"><p class="eb-sub">Running total to Serai, by quarter</p>' + svg + "</div>";
  }

  function move(i, d) {
    var j = i + d; if (j < 0 || j >= state.order.length) return;
    var t = state.order[i]; state.order[i] = state.order[j]; state.order[j] = t;
    state.preset = "custom"; renderSeq();
  }

  function setPreset(id) {
    var p = S.presets.filter(function (x) { return x.id === id; })[0];
    state.preset = id; state.order = p.order.slice(); renderSeq();
  }

  function buildAssumptions(host) {
    var g = [["loadedCostPerHour", "Loaded cost per staff hour, USD"], ["gmvPerQuarter", "GMV Serai runs for brands, per quarter, USD"],
      ["seraiGmvShare", "Serai's GMV-linked fee, share of GMV"], ["buildWeeklyCost", "One build squad, per week, USD"],
      ["gateThreshold", "Identity gate: true match rate a grain must clear"]];
    var html = '<div class="eb-agrid">' + g.map(function (x) {
      return '<label class="eb-afield"><span>' + esc(x[1]) + '</span><input type="number" step="any" data-g="' + x[0] + '" value="' + A[x[0]] + '"></label>';
    }).join("") + "</div>";
    html += '<div class="eb-tablewrap"><table class="eb-atable"><thead><tr><th>Use case</th><th>Needs</th><th>People</th><th>Hours a week</th><th>Automatable</th><th>Build weeks</th><th>Run cost a week</th><th>Attach a quarter</th><th>GMV uplift</th></tr></thead><tbody>' +
      UC.map(function (u, i) {
        var f = function (k) { return '<td><input type="number" step="any" data-u="' + i + '" data-k="' + k + '" value="' + u[k] + '"></td>'; };
        return "<tr><th>" + esc(u.name) + "</th><td>" + esc(NEED_LABELS[u.needs]) + "</td>" + f("people") + f("hoursPerWeek") + f("automatable") + f("buildWeeks") + f("runPerWeek") + f("attachPerQuarter") + f("gmvUplift") + "</tr>";
      }).join("") + "</tbody></table></div>";
    host.innerHTML = html;
    host.querySelectorAll("input").forEach(function (inp) {
      inp.addEventListener("input", function () {
        var v = parseFloat(inp.value); if (!isFinite(v)) return;
        if (inp.dataset.g) A[inp.dataset.g] = v; else UC[+inp.dataset.u][inp.dataset.k] = v;
        renderLadder(); renderSeq();
      });
    });
  }

  function init() {
    var host = document.getElementById("en-bench");
    if (!host || !root.ENABLER_SAMPLE) return;
    S = root.ENABLER_SAMPLE;
    A = JSON.parse(JSON.stringify(S.assumptions));
    UC = JSON.parse(JSON.stringify(S.useCases));
    prepN = prepare(S, false); prepB = prepare(S, true);
    bestN = bestPerGrain(prepN); bestB = bestPerGrain(prepB);
    state.order = S.presets[0].order.slice();

    /* ---- panel 1 ---- */
    var p1 = el("div", "eb-panel");
    p1.appendChild(el("h4", null, "Panel 1 · The identity ladder"));
    p1.appendChild(el("p", "eb-intro", fmt(S.nOrders) + " real orders from " + fmt(S.nCustomers) + " real Olist customers (" + S.nRepeat +
      " of them bought more than once), " + fmt(S.nLines) + " order lines across " + fmt(S.nStores) + " stores and " + fmt(S.nSkus) + " SKUs. " +
      "The split into three exports and each export's masking are constructed; the orders and who placed them are real."));
    var gr = el("div", "eb-row"); gr.appendChild(el("span", "eb-rlabel", "Grain"));
    ui.gbtn = {};
    GRAINS.forEach(function (g) {
      var b = el("button", "eb-chip", GRAIN_LABELS[g]); b.type = "button";
      b.addEventListener("click", function () { state.grain = g; Object.keys(ui.gbtn).forEach(function (k) { ui.gbtn[k].classList.toggle("is-on", k === g); }); renderLadder(); });
      ui.gbtn[g] = b; gr.appendChild(b);
    });
    ui.gbtn.customer.classList.add("is-on");
    p1.appendChild(gr);
    var kr = el("div", "eb-keys");
    KEYS.forEach(function (k) {
      var lab = el("label", "eb-key");
      lab.innerHTML = '<input type="checkbox" value="' + k + '"' + (state.keys.indexOf(k) >= 0 ? " checked" : "") + '><span class="eb-kname">' + esc(KEY_LABELS[k]) + '</span><span class="eb-knote">' + esc(KEY_NOTES[k]) + "</span>";
      lab.querySelector("input").addEventListener("change", function (e) {
        state.keys = KEYS.filter(function (x) { return kr.querySelector('input[value="' + x + '"]').checked; });
        renderLadder();
      });
      kr.appendChild(lab);
    });
    p1.appendChild(kr);
    ui.breakBtn = el("button", "eb-break"); ui.breakBtn.type = "button";
    ui.breakBtn.addEventListener("click", function () { state.broken = !state.broken; renderLadder(); renderSeq(); });
    p1.appendChild(ui.breakBtn);
    ui.lread = el("div", "eb-readout"); p1.appendChild(ui.lread);
    ui.lbest = el("div", "eb-best"); p1.appendChild(ui.lbest);
    p1.appendChild(el("p", "eb-hint", "Masking, constructed and modelled on the public reports: every export masks the buyer's name as first letter, three stars, last letter, and leaves the last two phone digits. " +
      "Platform A (" + S.exportShare[0] * 100 + "% of orders) keeps the zip and city. Platform B (" + S.exportShare[1] * 100 + "%) keeps neither. " +
      "Platform C (" + S.exportShare[2] * 100 + "%) exposes the raw phone and the address only on seller-shipped orders. " +
      "Serai's own store ids always map; a few percent of platform listings are missing from its SKU table. The names and phones are synthetic because Olist publishes neither."));
    host.appendChild(p1);

    /* ---- panel 2 ---- */
    var p2 = el("div", "eb-panel");
    p2.appendChild(el("h4", null, "Panel 2 · The roadmap sequencer"));
    p2.appendChild(el("p", "eb-intro", "Ten use cases, one build squad, " + A.horizonQuarters + " quarters. A use case that needs a grain panel 1 could not clear is built and earns nothing. " +
      "Every figure below comes from the assumptions block under the list, and every one of them is constructed: change them and the answer changes."));
    var pr = el("div", "eb-row"); pr.appendChild(el("span", "eb-rlabel", "Order"));
    ui.pbtn = {};
    S.presets.forEach(function (p) {
      var b = el("button", "eb-chip" + (p.anti ? " is-anti" : ""), esc(p.label)); b.type = "button";
      b.addEventListener("click", function () { setPreset(p.id); });
      ui.pbtn[p.id] = b; pr.appendChild(b);
    });
    var cu = el("span", "eb-chip is-static", "Your order: use the arrows"); ui.pbtn.custom = cu; pr.appendChild(cu);
    p2.appendChild(pr);
    ui.sread = el("div", "eb-readout"); p2.appendChild(ui.sread);
    ui.list = el("ol", "eb-list"); p2.appendChild(ui.list);
    var det = el("details", "eb-assume");
    det.appendChild(el("summary", null, "The assumptions block · every number the sequencer uses, editable"));
    var ah = el("div", "eb-abody"); det.appendChild(ah);
    var reset = el("button", "eb-chip", "Reset to defaults"); reset.type = "button";
    reset.addEventListener("click", function () {
      A = JSON.parse(JSON.stringify(S.assumptions)); UC = JSON.parse(JSON.stringify(S.useCases));
      buildAssumptions(ah); renderLadder(); renderSeq();
    });
    det.appendChild(reset);
    p2.appendChild(det);
    buildAssumptions(ah);
    p2.appendChild(el("p", "eb-hint", "Value to Serai per live week = hours removed x loaded cost + attach revenue + brand GMV uplift x Serai's GMV share - run cost. " +
      "Build weeks cost the squad whether or not the use case can ship. Hours removed are people x hours a week x the automatable share. All constructed."));
    host.appendChild(p2);

    renderLadder(); renderSeq();
    root.ENABLER_LIVE = {
      setGrain: function (g) { ui.gbtn[g].click(); },
      setKeys: function (ks) { kr.querySelectorAll("input").forEach(function (i) { i.checked = ks.indexOf(i.value) >= 0; }); state.keys = KEYS.filter(function (x) { return ks.indexOf(x) >= 0; }); renderLadder(); },
      toggleBreak: function () { ui.breakBtn.click(); },
      setPreset: setPreset,
      score: function () { var p = currentPrep()[state.grain]; return score(p.rows, p.truth, state.keys); },
      best: function () { return currentBest(); },
      run: function () { return sequence(state.order, UC, A, bestRates(currentBest())); },
      assumptions: function () { return A; }, useCases: function () { return UC; }
    };
  }

  var api = { KEYS: KEYS, rowsFor: rowsFor, score: score, prepare: prepare, bestPerGrain: bestPerGrain,
    sequence: sequence, weekValue: weekValue, bestRates: bestRates, mulberry32: mulberry32, shuffled: shuffled, selfCheck: selfCheck };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
  }
})(typeof window !== "undefined" ? window : this);
