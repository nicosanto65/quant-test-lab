/* QUANT TEST LAB — INVESTMENT BANKING TRACK generators.
   Accounting flow-through, DCF mechanics, comps/precedents, M&A accretion-
   dilution and basic LBO math. Every answer is derived by exact formula from
   the same parameters used to build the prompt. track:'ib' throughout.
   References the existing quant-track 'Finance' topic (market cap, basic EV,
   P/E, EV/EBITDA, growth, basic dilution) for the trading-desk-speed version
   of these ideas; this file adds the IB-specific mechanics on top of it
   (full EV bridge, WACC/DCF, comps methodology, merger-model accretion/
   dilution, LBO sources & uses / returns) rather than repeating it. */
(function (global) {
  'use strict';
  const U = global.QTL_UTIL;
  const { round } = U;
  const G = [];
  const add = (g) => { g.track = 'ib'; G.push(g); };

  /* ============================ ACCOUNTING FLOWS ============================ */

  add({
    id: 'ib_dep_flow', topic: 'Accounting Flows', subtopic: 'Depreciation flow-through', difficulty: 2, targetTime: 60,
    build(r) {
      const dep = r.pick([10, 20, 30, 40, 60, 80]), tax = r.pick([0.2, 0.25, 0.28, 0.3, 0.35]);
      const ask = r.pick(['ni', 'cfo', 'ppe']);
      const niImpact = round(-dep * (1 - tax), 2);
      const cfoImpact = round(dep * tax, 2);
      const ppeImpact = -dep;
      let prompt, correctAnswer, solutionTail;
      if (ask === 'ni') {
        prompt = `A company records $${dep}m of depreciation this year, with a tax rate of ${round(tax * 100, 0)}%. By how much does NET INCOME change, in $ millions (use a negative number for a decrease)?`;
        correctAnswer = niImpact;
        solutionTail = `Depreciation reduces pre-tax income by $${dep}m, but taxes fall by $${dep}m × ${round(tax * 100, 0)}% = $${round(dep * tax, 2)}m, so net income falls by only $${dep}m × (1 − ${round(tax * 100, 0)}%) = $${Math.abs(niImpact)}m. Net income impact = ${niImpact}.`;
      } else if (ask === 'cfo') {
        prompt = `A company records $${dep}m of depreciation this year, with a tax rate of ${round(tax * 100, 0)}%. Assuming nothing else changes, by how much does CASH FLOW FROM OPERATIONS change, in $ millions?`;
        correctAnswer = cfoImpact;
        solutionTail = `Depreciation is non-cash: it reduces net income by $${Math.abs(niImpact)}m, but CFO adds the full $${dep}m back. Net CFO effect = −${Math.abs(niImpact)} + ${dep} = ${cfoImpact}. In other words, depreciation's only real cash effect is the tax shield: $${dep}m × ${round(tax * 100, 0)}% = $${cfoImpact}m.`;
      } else {
        prompt = `A company records $${dep}m of depreciation this year (ignore any new capital expenditure). By how much does NET PP&E on the balance sheet change, in $ millions?`;
        correctAnswer = ppeImpact;
        solutionTail = `Depreciation directly reduces net PP&E by the depreciation charge itself, with no tax adjustment (the tax effect flows through net income and cash, not PP&E). Net PP&E impact = ${ppeImpact}.`;
      }
      return {
        prompt, answerType: 'numeric', correctAnswer, tolerance: 0.05,
        hint: 'Depreciation touches all three statements differently: it lowers net income by less than its full amount (because of the tax shield), it lowers PP&E by its full amount, and its only true cash effect is the tax shield.',
        approach: 'Trace the depreciation add-back through the income statement, cash flow statement and balance sheet separately.',
        solution: solutionTail,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Assuming depreciation reduces cash flow, when in fact — being non-cash — it is added back and only its tax shield affects cash.',
        tags: ['3-statement', 'depreciation']
      };
    }
  });

  add({
    id: 'ib_wc_flow', topic: 'Accounting Flows', subtopic: 'Working capital flow-through', difficulty: 2, targetTime: 60,
    build(r) {
      const dAR = r.pick([5, 10, 15, 20]), dAP = r.pick([3, 8, 12, 18]), dInv = r.pick([2, 6, 10]);
      const cfoImpact = -dAR - dInv + dAP;
      return {
        prompt: `This quarter, accounts receivable increased by $${dAR}m, inventory increased by $${dInv}m, and accounts payable increased by $${dAP}m. Assuming no other changes, what is the NET impact on cash flow from operations, in $ millions (negative if it reduces cash)?`,
        answerType: 'numeric', correctAnswer: cfoImpact, tolerance: 0.05,
        hint: 'A rising asset (AR, inventory) ties up cash — it is a USE of cash. A rising liability (AP) delays paying cash out — it is a SOURCE of cash.',
        approach: 'Working-capital rule: increase in an operating asset ⇒ subtract from CFO; increase in an operating liability ⇒ add to CFO.',
        solution: `AR up $${dAR}m ⇒ −$${dAR}m (cash tied up in unpaid receivables). Inventory up $${dInv}m ⇒ −$${dInv}m (cash tied up in stock). AP up $${dAP}m ⇒ +$${dAP}m (cash kept longer before paying suppliers). Net CFO impact = −${dAR} − ${dInv} + ${dAP} = ${cfoImpact}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Treating a rising accounts payable as a use of cash instead of a source — it is the opposite of accounts receivable.',
        tags: ['3-statement', 'working-capital']
      };
    }
  });

  /* ============================ DCF VALUATION ============================ */

  add({
    id: 'ib_capm', topic: 'DCF Valuation', subtopic: 'Cost of equity (CAPM)', difficulty: 2, targetTime: 45,
    build(r) {
      const rf = r.pick([2, 2.5, 3, 3.5, 4]), beta = r.pick([0.8, 1, 1.1, 1.2, 1.4, 1.6]), erp = r.pick([4.5, 5, 5.5, 6]);
      const coe = round(rf + beta * erp, 3);
      return {
        prompt: `The risk-free rate is ${rf}%, the equity risk premium is ${erp}%, and the stock's beta is ${beta}. Using CAPM, what is the cost of equity, in percent?`,
        answerType: 'numeric', correctAnswer: coe, tolerance: 0.05,
        hint: 'CAPM: start from the risk-free rate, then add a beta-scaled premium for equity risk.',
        approach: 'CAPM: Cost of equity = risk-free rate + beta × equity risk premium.',
        solution: `${rf}% + ${beta} × ${erp}% = ${rf}% + ${round(beta * erp, 3)}% = ${coe}%.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Multiplying beta by the risk-free rate instead of the equity risk premium.',
        tags: ['wacc', 'capm']
      };
    }
  });

  add({
    id: 'ib_wacc', topic: 'DCF Valuation', subtopic: 'WACC', difficulty: 3, targetTime: 90,
    build(r) {
      const equityPct = r.pick([50, 60, 65, 70, 75, 80]);
      const debtPct = 100 - equityPct;
      const coe = r.pick([8, 9, 10, 11, 12, 13]);
      const codPre = r.pick([4, 5, 6, 7]);
      const tax = r.pick([0.21, 0.25, 0.28, 0.3]);
      const codAfter = codPre * (1 - tax);
      const wacc = round((equityPct / 100) * coe + (debtPct / 100) * codAfter, 3);
      return {
        prompt: `A company is financed ${equityPct}% equity and ${debtPct}% debt. Cost of equity is ${coe}%, pre-tax cost of debt is ${codPre}%, and the tax rate is ${round(tax * 100, 0)}%. What is the WACC, in percent?`,
        answerType: 'numeric', correctAnswer: wacc, tolerance: 0.08,
        hint: 'Debt gets a tax shield — always use the AFTER-TAX cost of debt in WACC, never the pre-tax figure directly.',
        approach: 'WACC = (E/V)×cost of equity + (D/V)×cost of debt×(1 − tax rate).',
        solution: `After-tax cost of debt = ${codPre}% × (1 − ${round(tax * 100, 0)}%) = ${round(codAfter, 3)}%. WACC = ${equityPct}%×${coe}% + ${debtPct}%×${round(codAfter, 3)}% = ${round((equityPct / 100) * coe, 3)}% + ${round((debtPct / 100) * codAfter, 3)}% = ${wacc}%.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Using the pre-tax cost of debt directly, ignoring the tax shield that makes debt cheaper on an after-tax basis.',
        tags: ['wacc']
      };
    }
  });

  add({
    id: 'ib_tv_gordon', topic: 'DCF Valuation', subtopic: 'Terminal value (Gordon growth)', difficulty: 3, targetTime: 90,
    build(r) {
      const fcf = r.pick([40, 60, 80, 100, 150]), g = r.pick([1.5, 2, 2.5, 3]), wacc = r.pick([8, 9, 10, 11, 12]);
      const tv = round(fcf * (1 + g / 100) / (wacc / 100 - g / 100), 1);
      const ask = r.pick(['tv', 'pv']);
      if (ask === 'tv') {
        return {
          prompt: `Final projected year free cash flow is $${fcf}m, the long-run growth rate is ${g}%, and WACC is ${wacc}%. Using the Gordon growth (perpetuity) method, what is the terminal value at the end of that year, in $ millions?`,
          answerType: 'numeric', correctAnswer: tv, tolerance: Math.max(2, tv * 0.01),
          hint: 'Grow the final year\'s cash flow by one more year of growth before applying the perpetuity formula.',
          approach: 'Gordon growth terminal value = FCF_final × (1+g) / (WACC − g).',
          solution: `TV = ${fcf} × (1+${g}%) / (${wacc}% − ${g}%) = ${round(fcf * (1 + g / 100), 2)} / ${round((wacc - g) / 100, 4)} = $${tv}m.`,
          recognitionTechnique: 'Direct calculation', commonTrap: 'Forgetting to grow the final year\'s cash flow by (1+g) before dividing — using the un-grown FCF understates the terminal value.',
          tags: ['terminal-value', 'gordon-growth']
        };
      }
      const n = r.pick([4, 5, 6]);
      const pv = round(tv / Math.pow(1 + wacc / 100, n), 1);
      return {
        prompt: `A DCF's terminal value, computed at the end of year ${n}, is $${tv}m. WACC is ${wacc}%. What is the present value of that terminal value today, in $ millions?`,
        answerType: 'numeric', correctAnswer: pv, tolerance: Math.max(2, pv * 0.015),
        hint: 'The terminal value is a lump sum sitting at the end of year ' + n + ' — discount it back like any other future cash flow.',
        approach: `PV of terminal value = TV / (1+WACC)^n.`,
        solution: `PV = ${tv} / (1+${wacc}%)^${n} = ${tv} / ${round(Math.pow(1 + wacc / 100, n), 4)} = $${pv}m.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Discounting the terminal value by one year too many or too few — it sits at the END of year ' + n + ', not year ' + (n + 1) + '.',
        tags: ['terminal-value', 'discounting']
      };
    }
  });

  add({
    id: 'ib_tv_exit', topic: 'DCF Valuation', subtopic: 'Terminal value (exit multiple)', difficulty: 2, targetTime: 60,
    build(r) {
      const ebitda = r.pick([60, 90, 120, 180, 240]), mult = r.pick([6, 7, 8, 9, 10]);
      const tv = ebitda * mult;
      return {
        prompt: `Final projected year EBITDA is $${ebitda}m. Comparable companies trade at ${mult}× EV/EBITDA. Using the exit multiple method, what is the terminal value at the end of that year, in $ millions?`,
        answerType: 'numeric', correctAnswer: tv, tolerance: 0.5,
        hint: 'This is the same mechanic as a comps valuation — apply a multiple to the final projected metric.',
        approach: 'Exit multiple terminal value = final-year EBITDA × exit EV/EBITDA multiple.',
        solution: `TV = $${ebitda}m × ${mult}× = $${tv}m.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Applying the multiple to revenue or net income instead of EBITDA, the metric the multiple is actually quoted against.',
        tags: ['terminal-value', 'exit-multiple']
      };
    }
  });

  add({
    id: 'ib_dcf_full', topic: 'DCF Valuation', subtopic: 'Full DCF build-up', difficulty: 4, targetTime: 150,
    build(r) {
      const wacc = r.pick([8, 9, 10, 11]);
      const f1 = r.pick([30, 40, 50]), growth = r.pick([1.08, 1.1, 1.12]);
      const fcfs = [f1, round(f1 * growth, 1), round(f1 * growth * growth, 1)];
      const tv = r.pick([500, 700, 900, 1100]);
      const n = fcfs.length;
      const pvFcf = fcfs.map((f, i) => f / Math.pow(1 + wacc / 100, i + 1));
      const pvTv = tv / Math.pow(1 + wacc / 100, n);
      const ev = round(pvFcf.reduce((s, v) => s + v, 0) + pvTv, 1);
      return {
        prompt: `A 3-year DCF has projected free cash flows of $${fcfs[0]}m, $${fcfs[1]}m and $${fcfs[2]}m in years 1, 2 and 3, and a terminal value of $${tv}m at the end of year 3. WACC is ${wacc}%. What is the resulting enterprise value today, in $ millions?`,
        answerType: 'numeric', correctAnswer: ev, tolerance: Math.max(3, ev * 0.01),
        hint: 'Every cash flow — including the terminal value — gets discounted back by however many years separate it from today.',
        approach: 'Enterprise value = sum of the present values of every projected free cash flow, plus the present value of the terminal value.',
        solution: `PV(FCF₁)=${round(pvFcf[0], 2)}, PV(FCF₂)=${round(pvFcf[1], 2)}, PV(FCF₃)=${round(pvFcf[2], 2)}, PV(TV)=${round(pvTv, 2)}. Sum = $${ev}m.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Discounting the terminal value by only 1 year, or forgetting to discount it at all — it must be discounted back the SAME number of years as the final projected cash flow.',
        tags: ['dcf', 'discounting']
      };
    }
  });

  /* ======================= VALUATION BRIDGE & COMPS ======================= */

  add({
    id: 'ib_ev_equity', topic: 'Comps & Precedents', subtopic: 'EV-to-equity bridge', difficulty: 3, targetTime: 90,
    build(r) {
      const ev = r.pick([1200, 1800, 2400, 3000]), debt = r.pick([300, 500, 700]), cash = r.pick([100, 200, 350]);
      const pref = r.pick([0, 0, 100, 150]), minority = r.pick([0, 0, 50, 80]);
      const shares = r.pick([50, 80, 100, 120]);
      const equityValue = ev - debt + cash - pref - minority;
      const price = round(equityValue / shares, 2);
      return {
        prompt: `A target has an enterprise value of $${ev}m, total debt of $${debt}m, cash of $${cash}m, preferred stock of $${pref}m and minority interest of $${minority}m. With ${shares}m diluted shares outstanding, what is the implied share price?`,
        answerType: 'numeric', correctAnswer: price, tolerance: 0.1,
        hint: 'Equity value = EV minus everything that is senior to common equity (net debt, preferred, minority interest).',
        approach: 'Full EV-to-equity bridge: Equity value = EV − debt + cash − preferred stock − minority interest, then divide by diluted shares.',
        solution: `Equity value = ${ev} − ${debt} + ${cash} − ${pref} − ${minority} = $${equityValue}m. Price = ${equityValue}/${shares} = $${price}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Only subtracting net debt and forgetting preferred stock and minority interest, both of which also sit ahead of common equity.',
        tags: ['ev-bridge']
      };
    }
  });

  add({
    id: 'ib_comps_multiple', topic: 'Comps & Precedents', subtopic: 'Trading comps', difficulty: 3, targetTime: 90,
    build(r) {
      const peers = r.shuffle([r.pick([6, 6.5, 7]), r.pick([7.5, 8, 8.5]), r.pick([9, 9.5, 10]), r.pick([10.5, 11]), r.pick([11.5, 12, 12.5])]);
      const sorted = peers.slice().sort((a, b) => a - b);
      const median = sorted[2];
      const targetEbitda = r.pick([80, 120, 160, 200]);
      const ask = r.pick(['median', 'ev']);
      if (ask === 'median') {
        return {
          prompt: `Five comparable companies trade at the following EV/EBITDA multiples: ${peers.join('×, ')}×. What is the MEDIAN multiple?`,
          answerType: 'numeric', correctAnswer: median, tolerance: 0.01,
          hint: 'Sort the five multiples first — the median is the middle value, not the average.',
          approach: 'Median of 5 sorted values = the 3rd value.',
          solution: `Sorted: ${sorted.join('×, ')}×. The middle (3rd) value is ${median}×.`,
          recognitionTechnique: 'Direct calculation', commonTrap: 'Computing the mean instead of the median — a single outlier peer can distort the mean, which is exactly why comps analysis prefers the median.',
          tags: ['comps', 'median']
        };
      }
      const impliedEv = round(median * targetEbitda, 1);
      return {
        prompt: `Five comparable companies trade at the following EV/EBITDA multiples: ${peers.join('×, ')}×. Using the MEDIAN of these peers, what enterprise value does that imply for a target with $${targetEbitda}m of EBITDA, in $ millions?`,
        answerType: 'numeric', correctAnswer: impliedEv, tolerance: 1,
        hint: 'First find the median multiple, then apply it to the target\'s own EBITDA.',
        approach: 'Comps valuation: implied EV = median peer multiple × target\'s own metric.',
        solution: `Sorted multiples: ${sorted.join('×, ')}×, median = ${median}×. Implied EV = ${median}× × $${targetEbitda}m = $${impliedEv}m.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Averaging all five multiples instead of using the median, or applying the multiple to the wrong metric.',
        tags: ['comps']
      };
    }
  });

  add({
    id: 'ib_precedent_premium', topic: 'Comps & Precedents', subtopic: 'Precedent transactions', difficulty: 2, targetTime: 60,
    build(r) {
      const unaffected = r.pick([20, 30, 40, 50, 60]), premium = r.pick([15, 20, 25, 30, 35]);
      const ask = r.pick(['offer', 'premium']);
      const offer = round(unaffected * (1 + premium / 100), 2);
      if (ask === 'offer') {
        return {
          prompt: `A target's unaffected share price (before deal rumours) was $${unaffected}. The acquirer pays a ${premium}% premium. What is the offer price per share?`,
          answerType: 'numeric', correctAnswer: offer, tolerance: 0.05,
          hint: 'A premium is applied on top of the unaffected price, not subtracted from the deal price.',
          approach: 'Offer price = unaffected price × (1 + premium %).',
          solution: `$${unaffected} × (1 + ${premium}%) = $${unaffected} × ${round(1 + premium / 100, 2)} = $${offer}.`,
          recognitionTechnique: 'Direct calculation', commonTrap: 'Applying the premium to the WRONG base price — precedent-transaction premiums are measured against the unaffected (pre-announcement) price.',
          tags: ['precedent', 'premium']
        };
      }
      return {
        prompt: `A target's unaffected share price was $${unaffected}, and the acquirer's offer price is $${offer}. What premium did the acquirer pay, in percent?`,
        answerType: 'numeric', correctAnswer: premium, tolerance: 0.15,
        hint: 'Premium is the percentage increase from the unaffected price to the offer price.',
        approach: 'Premium % = (offer price / unaffected price − 1) × 100.',
        solution: `(${offer}/${unaffected} − 1) × 100 = ${premium}%.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Computing the percentage on the offer price instead of the unaffected price as the base.',
        tags: ['precedent', 'premium']
      };
    }
  });

  /* ============================== M&A MECHANICS ============================== */

  add({
    id: 'ib_accretion_dilution', topic: 'M&A Mechanics', subtopic: 'Accretion / dilution', difficulty: 4, targetTime: 150,
    build(r) {
      const niA = r.pick([200, 300, 400, 500]), sharesA = r.pick([80, 100, 120, 150]);
      const pxA = r.pick([25, 35, 50, 60]);
      const niT = r.pick([40, 60, 80, 100]), sharesT = r.pick([20, 30, 40]);
      const pxT0 = r.pick([15, 20, 25, 30]);
      const premium = r.pick([20, 25, 30, 35]);
      const dealPxT = round(pxT0 * (1 + premium / 100), 2);
      const exchangeRatio = round(dealPxT / pxA, 4);
      const sharesIssued = round(sharesT * exchangeRatio, 2);
      const combinedNI = niA + niT;
      const newShares = round(sharesA + sharesIssued, 2);
      const epsA = round(niA / sharesA, 4);
      const proFormaEps = round(combinedNI / newShares, 4);
      const pctChange = round((proFormaEps / epsA - 1) * 100, 2);
      const verdict = pctChange >= 0 ? 'accretive' : 'dilutive';
      return {
        prompt: `Acquirer: net income $${niA}m, ${sharesA}m shares outstanding, share price $${pxA}. Target: net income $${niT}m, ${sharesT}m shares outstanding, current share price $${pxT0}. The deal is 100% stock-funded at a ${premium}% premium to the target's current price, and ignores synergies and financing costs. What is the resulting % change in the acquirer's EPS (negative if dilutive)?`,
        answerType: 'numeric', correctAnswer: pctChange, tolerance: 0.5,
        hint: 'Work out the deal price per target share, then the exchange ratio, then how many new acquirer shares get issued — only then can you build the pro-forma EPS.',
        approach: 'All-stock merger model: deal price = target price × (1+premium) → exchange ratio = deal price / acquirer price → new shares issued = target shares × exchange ratio → pro-forma EPS = combined NI / (acquirer shares + new shares issued), compared to the acquirer\'s standalone EPS.',
        solution: `Deal price/target share = ${pxT0}×(1+${premium}%) = $${dealPxT}. Exchange ratio = ${dealPxT}/${pxA} = ${exchangeRatio}. New shares issued = ${sharesT}×${exchangeRatio} = ${sharesIssued}m. Combined NI = ${niA}+${niT} = $${combinedNI}m. New share count = ${sharesA}+${sharesIssued} = ${newShares}m. Acquirer standalone EPS = ${niA}/${sharesA} = $${epsA}. Pro-forma EPS = ${combinedNI}/${newShares} = $${proFormaEps}. % change = (${proFormaEps}/${epsA} − 1)×100 = ${pctChange}% — the deal is ${verdict}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Simply comparing combined net income to acquirer net income, instead of comparing PER-SHARE earnings — a deal can grow total profit while still diluting EPS if too many new shares are issued.',
        tags: ['merger-model', 'accretion-dilution']
      };
    }
  });

  /* ==================================== LBO ==================================== */

  add({
    id: 'ib_sources_uses', topic: 'LBO', subtopic: 'Sources & uses', difficulty: 3, targetTime: 90,
    build(r) {
      const ebitda = r.pick([60, 80, 100, 150]), entryMult = r.pick([7, 8, 9, 10]);
      const leverageMult = r.pick([4, 4.5, 5, 5.5]);
      const purchaseEv = ebitda * entryMult;
      const debt = round(ebitda * leverageMult, 1);
      const sponsorEquity = round(purchaseEv - debt, 1);
      return {
        prompt: `A sponsor buys a company for ${entryMult}× its $${ebitda}m EBITDA. The deal is financed with debt equal to ${leverageMult}× EBITDA, and the rest is sponsor equity (ignore fees). How much sponsor equity is required, in $ millions?`,
        answerType: 'numeric', correctAnswer: sponsorEquity, tolerance: 0.5,
        hint: 'Sources must equal uses — figure out the total purchase price first, then subtract the debt raised.',
        approach: 'Sources & uses: Purchase EV = entry multiple × EBITDA (the USE). Debt = leverage multiple × EBITDA (one SOURCE); sponsor equity is the plug that makes sources equal uses.',
        solution: `Purchase EV = ${entryMult}× × $${ebitda}m = $${purchaseEv}m. Debt = ${leverageMult}× × $${ebitda}m = $${debt}m. Sponsor equity = ${purchaseEv} − ${debt} = $${sponsorEquity}m.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Applying the leverage multiple to the purchase price instead of EBITDA — leverage multiples in LBOs are quoted against EBITDA, not deal value.',
        tags: ['lbo', 'sources-uses']
      };
    }
  });

  add({
    id: 'ib_debt_paydown', topic: 'LBO', subtopic: 'Debt paydown', difficulty: 2, targetTime: 60,
    build(r) {
      const initialDebt = r.pick([300, 400, 500, 600]), fcfPerYear = r.pick([30, 40, 50, 60]), years = r.pick([3, 4, 5]);
      const paidDown = fcfPerYear * years;
      const remaining = Math.max(0, initialDebt - paidDown);
      return {
        prompt: `An LBO starts with $${initialDebt}m of debt. The company generates $${fcfPerYear}m of free cash flow per year, all of which is used to pay down debt, for ${years} years. How much debt remains at the end of year ${years}, in $ millions?`,
        answerType: 'numeric', correctAnswer: remaining, tolerance: 0.5,
        hint: 'Total paydown = annual free cash flow × number of years (assuming it is all applied to debt).',
        approach: 'Remaining debt = initial debt − (annual FCF × years), floored at zero.',
        solution: `Total paydown = $${fcfPerYear}m × ${years} = $${paidDown}m. Remaining debt = ${initialDebt} − ${paidDown} = $${remaining}m.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Forgetting debt cannot go negative — if cumulative FCF exceeds the debt balance, remaining debt is simply zero, not negative.',
        tags: ['lbo', 'deleveraging']
      };
    }
  });

  add({
    id: 'ib_lbo_returns', topic: 'LBO', subtopic: 'Returns (MOIC)', difficulty: 4, targetTime: 150,
    build(r) {
      const ebitdaEntry = r.pick([60, 80, 100]), entryMult = r.pick([7, 8, 9]);
      const leverageMult = r.pick([4, 4.5, 5]);
      const purchaseEv = ebitdaEntry * entryMult;
      const debtEntry = round(ebitdaEntry * leverageMult, 1);
      const sponsorEquity = round(purchaseEv - debtEntry, 1);
      const years = r.pick([3, 4, 5]);
      const ebitdaGrowth = r.pick([1.05, 1.08, 1.1]);
      const ebitdaExit = round(ebitdaEntry * Math.pow(ebitdaGrowth, years), 1);
      const exitMult = r.pick([entryMult - 1, entryMult, entryMult + 1]);
      const exitEv = round(ebitdaExit * exitMult, 1);
      const fcfPerYear = r.pick([15, 20, 25]);
      const debtPaidDown = Math.min(debtEntry, fcfPerYear * years);
      const debtExit = round(debtEntry - debtPaidDown, 1);
      const exitEquity = round(exitEv - debtExit, 1);
      const moic = round(exitEquity / sponsorEquity, 3);
      return {
        prompt: `A sponsor buys a company for ${entryMult}× its $${ebitdaEntry}m EBITDA, financed at ${leverageMult}× EBITDA of debt (rest is sponsor equity). Over a ${years}-year hold, EBITDA grows to $${ebitdaExit}m and the company is sold at ${exitMult}× EBITDA. The company pays down $${fcfPerYear}m of debt per year from free cash flow. What MOIC (multiple of invested capital) does the sponsor earn?`,
        answerType: 'numeric', correctAnswer: moic, tolerance: 0.03,
        hint: 'Work out entry equity (purchase price minus entry debt) and exit equity (exit enterprise value minus remaining debt) separately, then divide.',
        approach: 'MOIC = exit equity value / entry (sponsor) equity, where exit equity value = exit EV − remaining debt at exit.',
        solution: `Entry: EV = ${entryMult}×$${ebitdaEntry}m = $${purchaseEv}m; debt = ${leverageMult}×$${ebitdaEntry}m = $${debtEntry}m; sponsor equity = ${purchaseEv}−${debtEntry} = $${sponsorEquity}m. Exit: EV = ${exitMult}×$${ebitdaExit}m = $${exitEv}m; debt paid down = min($${debtEntry}m, $${fcfPerYear}m×${years}) = $${debtPaidDown}m, remaining debt = $${debtExit}m; exit equity = ${exitEv}−${debtExit} = $${exitEquity}m. MOIC = ${exitEquity}/${sponsorEquity} = ${moic}×.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Comparing exit ENTERPRISE value to entry EQUITY (or vice versa) — MOIC is always equity-to-equity, since debt is a claim the sponsor does not own.',
        tags: ['lbo', 'returns']
      };
    }
  });

  global.QTL_GEN_IB = G;
})(window);
