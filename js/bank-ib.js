/* QUANT TEST LAB — INVESTMENT BANKING TRACK curated bank.
   Hand-written scenarios across accounting flow-through, DCF mechanics,
   comps/precedents, M&A accretion-dilution and LBO basics. Loaded after
   bank.js — appends into the SAME QTL_BANK.questions array via addMany(),
   tagged track:'ib'. */
(function (global) {
  'use strict';

  const items = [

    /* ---------------------- ACCOUNTING FLOWS ---------------------- */
    {
      id: 'ib_b001', topic: 'Accounting Flows', subtopic: '3-statement effects', difficulty: 2, targetTime: 60,
      prompt: 'A company prepays $24m of insurance covering the next 12 months, paying entirely in cash today. What is the immediate impact on NET INCOME today, in $ millions?',
      answerType: 'numeric', correctAnswer: 0, tolerance: 0.01,
      hint: 'A prepayment creates an asset (prepaid insurance) — the expense is recognised gradually as the coverage is used up, not all at once when cash is paid.',
      approach: 'Prepaid expenses are capitalised as an asset and expensed over the period they cover, not when cash changes hands.',
      solution: 'Paying cash for a prepaid expense simply converts one asset (cash) into another asset (prepaid insurance) — no expense is recognised yet, so net income today is unaffected: $0.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming the full $24m hits the income statement immediately just because cash was paid — accrual accounting recognises the expense as it is used up, not when cash moves.',
      tags: ['3-statement', 'prepaid']
    },
    {
      id: 'ib_b002', topic: 'Accounting Flows', subtopic: '3-statement effects', difficulty: 2, targetTime: 60,
      prompt: 'A company issues $50m of new common stock for cash. What is the impact on the DEBT-to-EQUITY ratio, all else equal — does it rise, fall, or stay the same?',
      answerType: 'mc', options: ['Rises', 'Falls', 'Stays exactly the same'], correctAnswer: 'Falls',
      hint: 'Equity issuance adds directly to the equity side of the balance sheet, with no effect on debt.',
      approach: 'Debt/Equity = total debt / total equity. Raising new equity increases the denominator with no change to the numerator.',
      solution: 'Equity rises by $50m while debt is unchanged, so the ratio (debt divided by a now-larger equity base) falls.',
      recognitionTechnique: 'Other', commonTrap: 'Confusing an equity raise with a debt raise — the two move leverage ratios in opposite directions.',
      tags: ['3-statement', 'leverage']
    },
    {
      id: 'ib_b003', topic: 'Accounting Flows', subtopic: 'Depreciation flow-through', difficulty: 3, targetTime: 90,
      prompt: 'A company records $80m of depreciation this year, at a 25% tax rate, and made $0 in capital expenditures. If net PP&E was $600m at the start of the year, what is net PP&E at the end of the year, in $ millions?',
      answerType: 'numeric', correctAnswer: 520, tolerance: 0.5,
      hint: 'With no capex, PP&E only moves due to the depreciation charge itself.',
      approach: 'Ending PP&E = starting PP&E + capex − depreciation.',
      solution: '600 + 0 − 80 = $520m.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Adjusting PP&E for the tax effect of depreciation — the tax rate is irrelevant to the PP&E roll-forward; it only affects net income and cash.',
      tags: ['ppe', 'depreciation']
    },
    {
      id: 'ib_b004', topic: 'Accounting Flows', subtopic: 'Working capital flow-through', difficulty: 3, targetTime: 90,
      prompt: 'A retailer\'s inventory FALLS by $12m this quarter (it sold down stock faster than it restocked), while accounts payable also falls by $5m. Assuming no other changes, what is the net impact on cash flow from operations, in $ millions?',
      answerType: 'numeric', correctAnswer: 7, tolerance: 0.05,
      hint: 'A FALLING asset releases cash; a FALLING liability consumes cash — these are the opposite of the usual "rising" cases.',
      approach: 'Working-capital rule, reversed: a decrease in an operating asset is a SOURCE of cash; a decrease in an operating liability is a USE of cash.',
      solution: 'Inventory falling $12m releases +$12m of cash (less cash tied up in stock). AP falling $5m is a use of −$5m (paying down what is owed faster). Net = 12 − 5 = +$7m.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Applying the "rising asset = use of cash" rule directly to a FALLING asset without flipping the sign.',
      tags: ['working-capital']
    },
    {
      id: 'ib_b005', topic: 'Accounting Flows', subtopic: '3-statement effects', difficulty: 3, targetTime: 90,
      prompt: 'A company writes off $40m of a fully impaired intangible asset (a non-cash charge, no tax benefit assumed for simplicity). What happens to CASH as a direct, immediate result of this write-off?',
      answerType: 'mc', options: ['Cash falls by $40m', 'Cash rises by $40m', 'Cash is unaffected'], correctAnswer: 'Cash is unaffected',
      hint: 'A write-off reduces the CARRYING VALUE of an asset on the balance sheet — no cash actually changes hands to record it.',
      approach: 'Non-cash impairment charges reduce net income and the related asset\'s book value, but involve no cash movement (unlike, say, paying a cash expense).',
      solution: 'The write-off is a non-cash charge: it reduces the intangible asset\'s book value and reduces retained earnings via lower net income, but no cash leaves the company. Cash is unaffected.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming any expense that reduces net income must also reduce cash — many charges (depreciation, impairments, write-offs) are explicitly non-cash.',
      tags: ['3-statement', 'impairment']
    },
    {
      id: 'ib_b006', topic: 'Accounting Flows', subtopic: 'Depreciation flow-through', difficulty: 3, targetTime: 90,
      prompt: 'A company has $150m of pre-depreciation, pre-tax income. It records $30m of depreciation. The tax rate is 30%. What is net income, in $ millions?',
      answerType: 'numeric', correctAnswer: 84, tolerance: 0.1,
      hint: 'Subtract depreciation to get taxable income first, then apply the tax rate.',
      approach: 'Net income = (pre-depreciation pre-tax income − depreciation) × (1 − tax rate).',
      solution: 'Taxable income = 150 − 30 = $120m. Tax = 120×30% = $36m. Net income = 120 − 36 = $84m.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Applying the tax rate before subtracting depreciation, or forgetting to subtract depreciation from pre-tax income at all.',
      tags: ['depreciation', 'tax']
    },

    /* ---------------------- DCF VALUATION ---------------------- */
    {
      id: 'ib_b007', topic: 'DCF Valuation', subtopic: 'WACC', difficulty: 2, targetTime: 60,
      prompt: 'A company is financed entirely with equity (no debt at all), with a cost of equity of 11%. What is its WACC?',
      answerType: 'numeric', correctAnswer: 11, tolerance: 0.05,
      hint: 'With no debt, there is nothing else to blend into the weighted average.',
      approach: 'WACC = (E/V)×Re + (D/V)×Rd×(1−t); with D=0, this collapses to just Re.',
      solution: 'WACC = 100% × 11% = 11%.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Overcomplicating a case where debt is simply zero.',
      tags: ['wacc']
    },
    {
      id: 'ib_b008', topic: 'DCF Valuation', subtopic: 'WACC', difficulty: 3, targetTime: 90,
      prompt: 'A company is financed 55% equity (cost of equity 13%) and 45% debt (pre-tax cost of debt 7%, tax rate 20%). What is the WACC, in percent (to two decimals)?',
      answerType: 'numeric', correctAnswer: 9.67, tolerance: 0.05,
      hint: 'Remember to tax-affect the cost of debt before blending it in.',
      approach: 'WACC = (E/V)×Re + (D/V)×Rd×(1−t).',
      solution: 'After-tax cost of debt = 7%×(1−20%) = 5.6%. WACC = 55%×13% + 45%×5.6% = 7.15% + 2.52% = 9.67%.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Using the 7% pre-tax cost of debt directly instead of the 5.6% after-tax figure.',
      tags: ['wacc']
    },
    {
      id: 'ib_b009', topic: 'DCF Valuation', subtopic: 'Cost of equity (CAPM)', difficulty: 2, targetTime: 45,
      prompt: 'Risk-free rate is 3%, equity risk premium is 6%, and the stock has a beta of 1.5. What is the CAPM cost of equity, in percent?',
      answerType: 'numeric', correctAnswer: 12, tolerance: 0.1,
      hint: 'Scale the equity risk premium by beta before adding the risk-free rate.',
      approach: 'Cost of equity = risk-free rate + beta × equity risk premium.',
      solution: '3% + 1.5×6% = 3% + 9% = 12%.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Scaling the risk-free rate by beta instead of the equity risk premium.',
      tags: ['capm']
    },
    {
      id: 'ib_b010', topic: 'DCF Valuation', subtopic: 'Cost of equity (CAPM)', difficulty: 3, targetTime: 75,
      prompt: 'A stock has a beta of 0.7 (defensive, less volatile than the market). Risk-free rate is 4%, equity risk premium is 5.5%. Compared to a stock with beta 1.3 under the SAME market conditions, does this stock have a HIGHER or LOWER cost of equity?',
      answerType: 'mc', options: ['Higher', 'Lower', 'Exactly the same'], correctAnswer: 'Lower',
      hint: 'A lower beta means the stock is less sensitive to the market\'s risk premium.',
      approach: 'Cost of equity rises directly with beta, holding the risk-free rate and equity risk premium fixed.',
      solution: 'Beta 0.7: 4% + 0.7×5.5% = 7.85%. Beta 1.3: 4% + 1.3×5.5% = 11.15%. The lower-beta stock has the lower cost of equity, since it is treated as less risky relative to the market.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Assuming beta and cost of equity move in opposite directions — they move in the SAME direction (higher beta means higher required return).',
      tags: ['capm', 'beta']
    },
    {
      id: 'ib_b011', topic: 'DCF Valuation', subtopic: 'Terminal value (Gordon growth)', difficulty: 3, targetTime: 90,
      prompt: 'Final projected year FCF is $60m, long-run growth is 2%, and WACC is 9%. What is the Gordon growth terminal value, in $ millions (nearest whole number)?',
      answerType: 'numeric', correctAnswer: 874, tolerance: 3,
      hint: 'Grow the FCF by one more year before dividing by the WACC-minus-growth gap.',
      approach: 'TV = FCF_final × (1+g) / (WACC − g).',
      solution: 'TV = 60×1.02 / (0.09−0.02) = 61.2/0.07 ≈ $874.3m ≈ $874m.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Forgetting to grow the final FCF by (1+g) before dividing.',
      tags: ['terminal-value']
    },
    {
      id: 'ib_b012', topic: 'DCF Valuation', subtopic: 'Terminal value (Gordon growth)', difficulty: 4, targetTime: 120,
      prompt: 'A DCF assumes a long-run growth rate of 3% and a WACC of 3.2%. What is wrong with this assumption, if anything?',
      answerType: 'mc', options: ['Nothing — this is a perfectly normal DCF assumption', 'The growth rate is too close to WACC, producing an unrealistically explosive (or undefined, if g≥WACC) terminal value', 'WACC should always equal the growth rate exactly', 'Growth rates above 0% are never allowed in a DCF'], correctAnswer: 'The growth rate is too close to WACC, producing an unrealistically explosive (or undefined, if g≥WACC) terminal value',
      hint: 'Look at the denominator of the Gordon growth formula: WACC minus growth.',
      approach: 'The Gordon growth formula divides by (WACC − g); as g approaches WACC, this denominator shrinks toward zero, blowing up the terminal value toward infinity.',
      solution: 'With WACC=3.2% and g=3%, the denominator is only 0.2%, an extremely small number to divide by — this produces an implausibly enormous terminal value. A long-run growth rate should be comfortably below WACC (and typically anchored near long-run GDP growth), never allowed to approach it.',
      recognitionTechnique: 'Other', commonTrap: 'Not noticing that a growth rate close to WACC breaks the Gordon growth formula\'s implicit assumption of a sustainable, moderate gap.',
      tags: ['terminal-value', 'sanity-check']
    },
    {
      id: 'ib_b013', topic: 'DCF Valuation', subtopic: 'Terminal value (exit multiple)', difficulty: 2, targetTime: 60,
      prompt: 'Final projected year EBITDA is $110m. Peers trade at 7.5× EV/EBITDA. What is the exit-multiple terminal value, in $ millions?',
      answerType: 'numeric', correctAnswer: 825, tolerance: 1,
      hint: 'This is simple multiplication — the exit multiple method IS a comps valuation, applied at a future date.',
      approach: 'TV = final year EBITDA × exit multiple.',
      solution: '110 × 7.5 = $825m.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Applying the multiple to revenue instead of EBITDA.',
      tags: ['terminal-value', 'exit-multiple']
    },
    {
      id: 'ib_b014', topic: 'DCF Valuation', subtopic: 'Discounting', difficulty: 3, targetTime: 90,
      prompt: 'A terminal value of $900m is calculated as of the end of year 7. WACC is 8%. What is its present value today, in $ millions (nearest whole number)?',
      answerType: 'numeric', correctAnswer: 525, tolerance: 3,
      hint: 'Discount by exactly as many years as the terminal value is away from today.',
      approach: 'PV = TV / (1+WACC)^n, with n = 7.',
      solution: '900 / (1.08)^7 = 900/1.714 ≈ $525.0m.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Using the wrong number of discounting periods — it must match exactly when the TV is computed as of.',
      tags: ['discounting', 'terminal-value']
    },
    {
      id: 'ib_b015', topic: 'DCF Valuation', subtopic: 'Full DCF build-up', difficulty: 4, targetTime: 150,
      prompt: 'A 2-year DCF has FCF of $25m in year 1 and $30m in year 2, plus a terminal value of $400m at the end of year 2. WACC is 10%. What is the resulting enterprise value today, in $ millions (nearest whole number)?',
      answerType: 'numeric', correctAnswer: 379, tolerance: 3,
      hint: 'Discount each cash flow — including the terminal value — by its own number of years, then sum everything.',
      approach: 'EV = PV(FCF year 1) + PV(FCF year 2) + PV(terminal value).',
      solution: 'PV(FCF1) = 25/1.10 ≈ 22.7. PV(FCF2) = 30/1.10² ≈ 24.8. PV(TV) = 400/1.10² ≈ 330.6. Sum ≈ 22.7+24.8+330.6 = $378.1m ≈ $379m (rounding across steps).',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Forgetting the terminal value sits at the SAME point in time as the final explicit FCF (year 2 here), not one year later.',
      tags: ['dcf']
    },
    {
      id: 'ib_b016', topic: 'DCF Valuation', subtopic: 'Sensitivity', difficulty: 4, targetTime: 120,
      prompt: 'Holding all cash flow projections fixed, an analyst raises the assumed WACC from 8% to 11%. What happens to the resulting DCF valuation?',
      answerType: 'mc', options: ['It rises', 'It falls', 'It stays exactly the same', 'It becomes impossible to compute'], correctAnswer: 'It falls',
      hint: 'A higher discount rate treats every future cash flow as comparatively less valuable today.',
      approach: 'Discounting inverse relationship: valuation and WACC move in opposite directions, for the same projected cash flows.',
      solution: 'Every projected cash flow (including the terminal value) is divided by a larger number, (1+WACC)ⁿ, at every horizon — this uniformly shrinks all the present values, lowering total enterprise value.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming a "higher" input always means a "higher" valuation — WACC is a discount rate, and higher discount rates shrink present value.',
      tags: ['wacc', 'sensitivity']
    },

    /* ---------------------- COMPS & PRECEDENTS ---------------------- */
    {
      id: 'ib_b017', topic: 'Comps & Precedents', subtopic: 'Trading comps', difficulty: 2, targetTime: 60,
      prompt: 'Four peers trade at EV/EBITDA multiples of 6×, 8×, 9×, 11×. What is the median multiple?',
      answerType: 'numeric', correctAnswer: 8.5, tolerance: 0.01,
      hint: 'With an even number of values, average the two middle ones.',
      approach: 'Median of an even-length sorted list = average of the two middle values.',
      solution: 'Sorted: 6, 8, 9, 11. Middle two are 8 and 9. Median = (8+9)/2 = 8.5×.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Picking one of the two middle values instead of averaging them, or accidentally computing the mean of all four.',
      tags: ['comps', 'median']
    },
    {
      id: 'ib_b018', topic: 'Comps & Precedents', subtopic: 'Trading comps', difficulty: 3, targetTime: 90,
      prompt: 'A peer group trades at a median of 9× EV/EBITDA. A target has $75m of EBITDA, $40m of net debt, and 15m diluted shares. What is the implied share price?',
      answerType: 'numeric', correctAnswer: 42.33, tolerance: 0.2,
      hint: 'First get to implied EV, then bridge down to equity value, then to a per-share figure.',
      approach: 'Implied EV = median multiple × target EBITDA. Equity value = EV − net debt. Share price = equity value / diluted shares.',
      solution: 'Implied EV = 9×75 = $675m. Equity value = 675−40 = $635m. Share price = 635/15 ≈ $42.33.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Dividing EV directly by shares, skipping the net-debt adjustment to get to equity value first.',
      tags: ['comps', 'ev-bridge']
    },
    {
      id: 'ib_b019', topic: 'Comps & Precedents', subtopic: 'Trading comps', difficulty: 2, targetTime: 60,
      prompt: 'Why do analysts typically exclude a peer whose multiple is a wild outlier (e.g. due to a live takeover rumour) from a comps set, rather than simply including it in the average?',
      answerType: 'mc', options: ['Outliers should always be included for completeness', 'An outlier driven by a one-off, non-recurring event does not reflect the "typical" fundamental valuation the comps method is trying to capture', 'It is illegal to exclude any peer', 'Excluding peers always violates securities law'], correctAnswer: 'An outlier driven by a one-off, non-recurring event does not reflect the "typical" fundamental valuation the comps method is trying to capture',
      hint: 'Comps analysis is trying to capture how the market values SIMILAR, comparable businesses under normal circumstances.',
      approach: 'Peer selection judgment: a distorted multiple caused by a special situation (like takeover speculation) is not representative of normal fundamental valuation.',
      solution: 'A takeover rumour can inflate a stock price (and its multiple) for reasons that have nothing to do with the company\'s underlying fundamentals — including it would bias the comp set away from what "normal" comparable valuation looks like.',
      recognitionTechnique: 'Other', commonTrap: 'Treating every peer\'s multiple as equally valid data, without considering whether special circumstances make a particular multiple unrepresentative.',
      tags: ['comps', 'peer-selection']
    },
    {
      id: 'ib_b020', topic: 'Comps & Precedents', subtopic: 'Precedent transactions', difficulty: 2, targetTime: 60,
      prompt: 'A target\'s unaffected share price was $45. The acquirer\'s offer price is $58.50. What premium did the acquirer pay, in percent?',
      answerType: 'numeric', correctAnswer: 30, tolerance: 0.2,
      hint: 'Premium is measured relative to the unaffected (pre-deal) price.',
      approach: 'Premium % = (offer price / unaffected price − 1) × 100.',
      solution: '(58.50/45 − 1) × 100 = 30%.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Using the offer price as the base of the percentage calculation instead of the unaffected price.',
      tags: ['precedent', 'premium']
    },
    {
      id: 'ib_b021', topic: 'Comps & Precedents', subtopic: 'Precedent transactions', difficulty: 3, targetTime: 90,
      prompt: 'Why do precedent transaction multiples typically run HIGHER than trading comps multiples for similar companies?',
      answerType: 'mc', options: ['Precedent transactions are always calculated incorrectly', 'Precedent transaction prices include a control premium — the extra amount paid to acquire full control of a company, which is absent from ordinary share trading', 'Trading comps always overstate value', 'There is no systematic difference between the two'], correctAnswer: 'Precedent transaction prices include a control premium — the extra amount paid to acquire full control of a company, which is absent from ordinary share trading',
      hint: 'Buying 100% control of a company (and being able to redirect its strategy, cut costs, or combine it with your own business) is worth more than owning a small minority stake traded on an exchange.',
      approach: 'Control premium: an acquirer buying the whole company pays extra for the ability to control it outright, a value ordinary public shareholders trading small stakes do not receive.',
      solution: 'A precedent transaction price is what a buyer paid for outright CONTROL of the business, including any expected synergies — trading comps only reflect minority-stake pricing in the open market, with no control premium baked in. This structural difference is why precedents tend to imply higher multiples.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming trading comps and precedent transactions should produce identical multiples for similar companies — the control premium is a real, structural difference, not an error.',
      tags: ['precedent', 'control-premium']
    },
    {
      id: 'ib_b022', topic: 'Comps & Precedents', subtopic: 'Trading comps', difficulty: 3, targetTime: 90,
      prompt: 'Peers trade at EV/Revenue multiples of 2×, 2.5×, 3×, 3.5×, 12× (the 12× peer is a high-growth outlier with a completely different growth profile from the target). Which multiple should most reasonably be used to value a slow-growth, mature target — the mean of all five, or the median of the four "normal" peers?',
      answerType: 'mc', options: ['The mean of all five (4.6×)', 'The median of the four comparable, mature peers (2.75×)', 'Always use the highest multiple available', 'Always use the lowest multiple available'], correctAnswer: 'The median of the four comparable, mature peers (2.75×)',
      hint: 'The high-growth outlier is not actually comparable to a mature, slow-growth target — its inclusion would misrepresent the target\'s appropriate valuation.',
      approach: 'Peer comparability: exclude or down-weight peers whose fundamental profile (growth, risk, margin) differs meaningfully from the target, since the entire comps method rests on genuine similarity.',
      solution: 'Median of the four genuinely comparable (mature) peers: sorted 2, 2.5, 3, 3.5, middle two average to (2.5+3)/2 = 2.75×. The 12× high-growth peer reflects a fundamentally different growth story and should not anchor the valuation of a mature, slow-growth target.',
      recognitionTechnique: 'Other', commonTrap: 'Mechanically averaging every available peer multiple without first checking whether each peer is genuinely comparable to the target.',
      tags: ['comps', 'peer-selection']
    },
    {
      id: 'ib_b023', topic: 'Comps & Precedents', subtopic: 'Trading comps', difficulty: 2, targetTime: 60,
      prompt: 'Six peers trade at EV/EBITDA of 5×, 6×, 7×, 8×, 9×, 10×. What is the median?',
      answerType: 'numeric', correctAnswer: 7.5, tolerance: 0.01,
      hint: 'Six values — average the 3rd and 4th after sorting.',
      approach: 'Median of an even-length list = average of the two middle values.',
      solution: 'Already sorted. Middle two (3rd and 4th of 6) are 7 and 8. Median = (7+8)/2 = 7.5×.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Picking the exact middle position incorrectly for an even-sized list.',
      tags: ['comps', 'median']
    },
    {
      id: 'ib_b024', topic: 'Comps & Precedents', subtopic: 'Precedent transactions', difficulty: 3, targetTime: 90,
      prompt: 'An unaffected share price is $80. If the acquirer is willing to pay up to a 40% premium, what is the maximum offer price per share?',
      answerType: 'numeric', correctAnswer: 112, tolerance: 0.5,
      hint: 'Apply the premium multiplicatively to the unaffected price.',
      approach: 'Maximum offer price = unaffected price × (1 + maximum premium %).',
      solution: '80 × 1.40 = $112.00.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Adding 40 dollars instead of 40 percent.',
      tags: ['precedent', 'premium']
    },

    /* ---------------------- M&A MECHANICS ---------------------- */
    {
      id: 'ib_b025', topic: 'M&A Mechanics', subtopic: 'Accretion / dilution', difficulty: 3, targetTime: 90,
      prompt: 'Acquirer has $120m net income and 60m shares (EPS $2.00). It buys a target for all cash, adding $30m of net income with no new shares issued and no financing cost. What is the new pro-forma EPS?',
      answerType: 'numeric', correctAnswer: 2.5, tolerance: 0.02,
      hint: 'No new shares means the denominator does not change at all.',
      approach: 'Pro-forma EPS = combined net income / unchanged share count.',
      solution: '(120+30)/60 = 150/60 = $2.50, up from $2.00 — accretive.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Assuming shares must increase in every deal — an all-cash deal, by definition, issues none.',
      tags: ['merger-model']
    },
    {
      id: 'ib_b026', topic: 'M&A Mechanics', subtopic: 'Accretion / dilution', difficulty: 4, targetTime: 120,
      prompt: 'Acquirer EPS is $4.00. After an all-stock acquisition, pro-forma EPS is $3.60. What is the accretion/dilution percentage, and is the deal accretive or dilutive?',
      answerType: 'numeric', correctAnswer: -10, tolerance: 0.3,
      hint: 'Compare the new EPS to the old EPS as a percentage change.',
      approach: 'Accretion/dilution % = (pro-forma EPS / standalone EPS − 1) × 100.',
      solution: '(3.60/4.00 − 1) × 100 = −10% — a dilutive deal.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Reporting the raw dollar change ($0.40) instead of the percentage change, or getting the sign backwards.',
      tags: ['merger-model', 'accretion-dilution']
    },
    {
      id: 'ib_b027', topic: 'M&A Mechanics', subtopic: 'Accretion / dilution', difficulty: 4, targetTime: 150,
      prompt: 'An acquirer trades at 20× P/E. It is considering buying Target A (trades at 12× P/E) or Target B (trades at 28× P/E), both all-stock deals with no synergies. Which acquisition is more likely to be EPS-accretive, all else equal?',
      answerType: 'mc', options: ['Target A (the lower P/E target)', 'Target B (the higher P/E target)', 'Both are equally likely to be accretive', 'Neither can ever be accretive in a stock deal'], correctAnswer: 'Target A (the lower P/E target)',
      hint: 'In a stock deal, you are effectively "trading" your own shares (priced at your own P/E) for the target\'s earnings.',
      approach: 'Rule of thumb: buying a target at a LOWER P/E than the acquirer\'s own P/E tends to be accretive; buying at a HIGHER P/E tends to be dilutive, in an all-stock deal with no synergies.',
      solution: 'Buying Target A (12× P/E) with stock priced at the acquirer\'s own 20× P/E means relatively FEW new shares are issued per dollar of acquired earnings, tending to be accretive. Buying Target B (28× P/E, more expensive than the acquirer\'s own earnings) requires issuing relatively MORE shares per dollar of acquired earnings, tending to be dilutive.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming a "better" or more expensive company (higher P/E) is automatically the more attractive acquisition from an EPS-accretion standpoint — the opposite is usually true in an all-stock deal.',
      tags: ['merger-model', 'accretion-dilution']
    },
    {
      id: 'ib_b028', topic: 'M&A Mechanics', subtopic: 'Exchange ratio', difficulty: 3, targetTime: 90,
      prompt: 'An acquirer\'s stock trades at $80. The deal price for the target is $60 per target share, paid entirely in acquirer stock. What is the exchange ratio (acquirer shares issued per target share)?',
      answerType: 'numeric', correctAnswer: 0.75, tolerance: 0.005,
      hint: 'The exchange ratio converts the deal price into a number of acquirer shares.',
      approach: 'Exchange ratio = deal price per target share / acquirer share price.',
      solution: '60/80 = 0.75 — each target share is exchanged for 0.75 acquirer shares.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Inverting the ratio (dividing acquirer price by target deal price instead of the other way around).',
      tags: ['merger-model', 'exchange-ratio']
    },
    {
      id: 'ib_b029', topic: 'M&A Mechanics', subtopic: 'Accretion / dilution', difficulty: 4, targetTime: 150,
      prompt: 'A target has 40m shares. The exchange ratio in an all-stock deal is 0.5. How many new acquirer shares are issued to fund the deal?',
      answerType: 'numeric', correctAnswer: 20, tolerance: 0.1,
      hint: 'Apply the exchange ratio directly to the target\'s share count.',
      approach: 'New shares issued = target share count × exchange ratio.',
      solution: '40m × 0.5 = 20m new acquirer shares.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Applying the exchange ratio to the acquirer\'s OWN share count instead of the target\'s.',
      tags: ['merger-model', 'exchange-ratio']
    },
    {
      id: 'ib_b030', topic: 'M&A Mechanics', subtopic: 'Synergies', difficulty: 3, targetTime: 90,
      prompt: 'A deal is dilutive by 8% before accounting for cost synergies. Management expects $15m of annual pre-tax cost synergies, at a 25% tax rate, on a combined pro-forma net income base of $300m (before synergies). Roughly how much does the after-tax synergy add to combined net income, in $ millions?',
      answerType: 'numeric', correctAnswer: 11.25, tolerance: 0.2,
      hint: 'Synergies flow through the income statement just like any other cost saving — they are taxed too.',
      approach: 'After-tax synergy benefit = pre-tax synergies × (1 − tax rate).',
      solution: '15 × (1 − 25%) = 15 × 0.75 = $11.25m added to combined net income.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Adding the full pre-tax synergy figure to net income, forgetting that realised cost savings are taxed just like any other income.',
      tags: ['merger-model', 'synergies']
    },
    {
      id: 'ib_b031', topic: 'M&A Mechanics', subtopic: 'Deal rationale', difficulty: 2, targetTime: 60,
      prompt: 'A board approves an acquisition that is modestly EPS-dilutive in year one. Which of the following is the WEAKEST justification for proceeding anyway?',
      answerType: 'mc', options: [
        'The target owns a key technology patent the acquirer could not build in-house in time to remain competitive',
        'Cost synergies are expected to make the deal accretive within 18 months',
        'The CEO simply prefers a larger company, with no other stated rationale',
        'The deal blocks a key competitor from acquiring the same target first'
      ], correctAnswer: 'The CEO simply prefers a larger company, with no other stated rationale',
      hint: 'Look for the option that offers no economic or strategic logic at all, just a preference.',
      approach: 'Legitimate rationale for accepting short-term dilution requires a genuine strategic or financial argument, not simply a preference for scale.',
      solution: 'Wanting to be "bigger" with no further justification ignores whether the deal actually creates value for shareholders — the other three options each describe a specific, checkable value driver (irreplaceable capability, synergy-driven EPS recovery, competitive defense).',
      recognitionTechnique: 'Other', commonTrap: 'Assuming any strategic-sounding justification is automatically sufficient — "empire building" with no real economic logic is a classic red flag in M&A.',
      tags: ['deal-rationale']
    },
    {
      id: 'ib_b032', topic: 'M&A Mechanics', subtopic: 'Accretion / dilution', difficulty: 3, targetTime: 90,
      prompt: 'A cash-and-stock deal is funded 50% by cash (from the acquirer\'s balance sheet, no new debt) and 50% by newly issued stock. Compared to an ALL-stock deal of the same total size, does the cash-and-stock structure issue MORE or FEWER new shares?',
      answerType: 'mc', options: ['More new shares', 'Fewer new shares', 'Exactly the same number of new shares'], correctAnswer: 'Fewer new shares',
      hint: 'Only the STOCK portion of the deal requires issuing new shares.',
      approach: 'Only the stock-funded portion of a deal requires new share issuance; the cash-funded portion does not.',
      solution: 'Since only half of the purchase price is funded with stock (versus 100% in an all-stock deal), roughly half as many new shares need to be issued — reducing the dilutive pressure on the share count, all else equal.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming financing mix has no effect on share issuance — the cash portion of a deal specifically avoids diluting the share count.',
      tags: ['merger-model', 'financing-mix']
    },

    /* ---------------------- LBO ---------------------- */
    {
      id: 'ib_b033', topic: 'LBO', subtopic: 'Sources & uses', difficulty: 2, targetTime: 60,
      prompt: 'A sponsor buys a company for 6× its $90m EBITDA, financed with debt of 3.5× EBITDA. How much sponsor equity is required, in $ millions?',
      answerType: 'numeric', correctAnswer: 225, tolerance: 1,
      hint: 'Find the total purchase price first, then subtract the debt raised.',
      approach: 'Sponsor equity = purchase EV − debt raised = (entry multiple × EBITDA) − (leverage multiple × EBITDA).',
      solution: 'Purchase EV = 6×90 = $540m. Debt = 3.5×90 = $315m. Sponsor equity = 540−315 = $225m.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Confusing the entry multiple (applied to get purchase price) with the leverage multiple (applied to get debt) — they are two DIFFERENT multiples of the same EBITDA.',
      tags: ['lbo', 'sources-uses']
    },
    {
      id: 'ib_b034', topic: 'LBO', subtopic: 'Returns (MOIC)', difficulty: 3, targetTime: 90,
      prompt: 'A sponsor invests $100m of equity in an LBO. Five years later, the equity is worth $280m at exit. What is the MOIC?',
      answerType: 'numeric', correctAnswer: 2.8, tolerance: 0.02,
      hint: 'MOIC is simply exit equity value divided by entry equity value.',
      approach: 'MOIC = exit equity value / entry equity value.',
      solution: '280/100 = 2.8×.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Using enterprise value instead of equity value on either side of the ratio.',
      tags: ['lbo', 'returns']
    },
    {
      id: 'ib_b035', topic: 'LBO', subtopic: 'Returns (IRR)', difficulty: 4, targetTime: 120,
      prompt: 'A sponsor achieves a MOIC of 2.25× over exactly a 5-year hold, with no interim cash distributions. Approximately what annualised IRR does this represent, in percent (nearest whole number)?',
      answerType: 'numeric', correctAnswer: 18, tolerance: 1,
      hint: 'IRR here is just the annual compounding rate that grows $1 into the MOIC over the hold period: MOIC^(1/years) − 1.',
      approach: 'For a single lump-sum investment held for n years with no interim cash flows, IRR = MOIC^(1/n) − 1.',
      solution: '2.25^(1/5) − 1. 2.25^0.2 ≈ 1.1758, so IRR ≈ 17.6%, roughly 18%.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Simply dividing the MOIC by the number of years (2.25/5 = 0.45, i.e. 45%) — returns compound, they do not divide linearly across years.',
      tags: ['lbo', 'irr']
    },
    {
      id: 'ib_b036', topic: 'LBO', subtopic: 'Deleveraging', difficulty: 3, targetTime: 90,
      prompt: 'An LBO starts with $400m of debt. The company generates $45m of free cash flow per year, entirely applied to debt paydown, for 6 years. How much debt remains at the end of year 6, in $ millions?',
      answerType: 'numeric', correctAnswer: 130, tolerance: 1,
      hint: 'Total paydown = annual FCF × number of years, subtracted from the starting debt.',
      approach: 'Remaining debt = initial debt − (annual FCF × years).',
      solution: 'Paydown = 45×6 = $270m. Remaining debt = 400−270 = $130m.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Forgetting that debt cannot go negative if cumulative FCF happens to exceed the starting balance — here it does not, but the check is always worth making.',
      tags: ['lbo', 'deleveraging']
    },
    {
      id: 'ib_b037', topic: 'LBO', subtopic: 'Returns drivers', difficulty: 4, targetTime: 120,
      prompt: 'An LBO\'s total equity return can be decomposed into three drivers: EBITDA growth, multiple expansion/contraction, and debt paydown (deleveraging). If a company is bought and sold at the exact SAME EV/EBITDA multiple, with no EBITDA growth at all, but debt was meaningfully paid down during the hold, which driver(s) contributed to the sponsor\'s positive return?',
      answerType: 'mc', options: ['EBITDA growth only', 'Multiple expansion only', 'Deleveraging only', 'All three contributed equally'], correctAnswer: 'Deleveraging only',
      hint: 'With flat EBITDA and an unchanged multiple, enterprise value itself does not move at all.',
      approach: 'Isolate each driver: EBITDA growth (none, given flat EBITDA), multiple change (none, given identical entry/exit multiples), leaving only debt paydown as the source of equity value creation.',
      solution: 'With EBITDA flat and the multiple unchanged, exit enterprise value equals entry enterprise value exactly — so the ENTIRE increase in equity value must come from the debt that was paid down during the hold, converting what used to be debt into equity value.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming a positive return always implies the underlying business grew — deleveraging alone, with a completely flat business, is a fully valid and common source of LBO returns.',
      tags: ['lbo', 'returns-drivers']
    },
    {
      id: 'ib_b038', topic: 'LBO', subtopic: 'Leverage and risk', difficulty: 3, targetTime: 90,
      prompt: 'Two LBOs both buy companies for a $500m enterprise value. Deal A uses $300m of debt (60% levered); Deal B uses $100m of debt (20% levered). If BOTH companies\' enterprise values fall by 15% due to a downturn, which sponsor\'s EQUITY is hit harder, in percentage terms?',
      answerType: 'mc', options: ['Deal A (more levered)', 'Deal B (less levered)', 'Both are hit by exactly the same percentage', 'Cannot be determined without more information'], correctAnswer: 'Deal A (more levered)',
      hint: 'The dollar loss in enterprise value is the same for both, but it is absorbed entirely by a much SMALLER equity base in the more levered deal.',
      approach: 'Leverage amplifies both gains and losses — the same dollar decline in enterprise value represents a much larger percentage hit to a smaller equity cushion.',
      solution: 'Both lose $75m of enterprise value (15% × $500m). Deal A\'s equity was 500−300 = $200m, so the loss is 75/200 = 37.5% of its equity. Deal B\'s equity was 500−100 = $400m, so the loss is only 75/400 = 18.75% of its equity. The more heavily levered deal absorbs a far larger percentage hit from the identical dollar decline.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Assuming leverage only amplifies gains — it amplifies losses by exactly the same mechanism, which is why highly levered companies are considered financially riskier.',
      tags: ['lbo', 'leverage', 'risk']
    },
    {
      id: 'ib_b039', topic: 'LBO', subtopic: 'Sources & uses', difficulty: 3, targetTime: 90,
      prompt: 'A sponsor\'s uses of funds are: purchase enterprise value of $600m, plus $20m of transaction fees. Debt financing provides $380m. How much sponsor equity is required, in $ millions?',
      answerType: 'numeric', correctAnswer: 240, tolerance: 1,
      hint: 'Total uses include the fees, not just the purchase price.',
      approach: 'Sponsor equity = total uses (purchase price + fees) − debt raised.',
      solution: 'Total uses = 600+20 = $620m. Sponsor equity = 620−380 = $240m.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Forgetting to include transaction fees as part of total uses, understating the required equity check.',
      tags: ['lbo', 'sources-uses']
    },
    {
      id: 'ib_b040', topic: 'LBO', subtopic: 'Returns (MOIC)', difficulty: 4, targetTime: 150,
      prompt: 'Entry: EBITDA $70m, entry multiple 7× (EV=$490m), debt $280m, sponsor equity $210m. Exit after 4 years: EBITDA grows to $91m, exit multiple is 8×, and $120m of debt has been paid down (debt at exit = $160m). What is the exit equity value, in $ millions?',
      answerType: 'numeric', correctAnswer: 568, tolerance: 2,
      hint: 'First find exit enterprise value using the NEW EBITDA and the NEW multiple, then subtract remaining debt.',
      approach: 'Exit equity value = (exit EBITDA × exit multiple) − remaining debt at exit.',
      solution: 'Exit EV = 91×8 = $728m. Exit equity = 728−160 = $568m.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Using the entry multiple or entry EBITDA instead of the exit figures — exit equity value must be built entirely from exit-year numbers.',
      tags: ['lbo', 'returns']
    },

    /* ---------------------- GOODWILL & PURCHASE ACCOUNTING ---------------------- */
    {
      id: 'ib_b041', topic: 'M&A Mechanics', subtopic: 'Purchase accounting', difficulty: 3, targetTime: 90,
      prompt: 'An acquirer pays $650m for a target. Fair-value identifiable assets are $580m and assumed liabilities are $90m. How much goodwill is created, in $ millions?',
      answerType: 'numeric', correctAnswer: 160, tolerance: 1,
      hint: 'Net the identifiable assets against liabilities first, then compare to purchase price.',
      approach: 'Goodwill = Purchase price − (Fair value identifiable assets − liabilities assumed).',
      solution: 'Net identifiable assets = 580 − 90 = $490m. Goodwill = 650 − 490 = $160m.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Forgetting to subtract the assumed liabilities before comparing identifiable assets to the purchase price.',
      tags: ['goodwill']
    },
    {
      id: 'ib_b042', topic: 'M&A Mechanics', subtopic: 'Purchase accounting', difficulty: 2, targetTime: 60,
      prompt: 'A company records a $25m goodwill impairment charge (non-cash, no tax benefit assumed). What is the DIRECT, immediate effect on cash?',
      answerType: 'mc', options: ['Cash falls by $25m', 'Cash rises by $25m', 'Cash is unaffected'], correctAnswer: 'Cash is unaffected',
      hint: 'The cash for the original purchase was already spent when the acquisition closed.',
      approach: 'Goodwill impairment is a non-cash re-assessment of an already-spent purchase price, just like a depreciation write-down.',
      solution: 'The impairment reduces net income and the goodwill asset on the balance sheet, but no new cash leaves the company at the moment it is recorded — cash is unaffected.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming any charge that reduces net income must also reduce cash immediately.',
      tags: ['goodwill', 'impairment']
    },
    {
      id: 'ib_b043', topic: 'M&A Mechanics', subtopic: 'Purchase accounting', difficulty: 3, targetTime: 75,
      prompt: 'Why does goodwill typically arise in an acquisition, rather than the purchase price simply equaling the fair value of the target\'s identifiable assets and liabilities?',
      answerType: 'mc', options: [
        'Because acquirers always overpay by mistake',
        'Because the acquirer is paying for the whole functioning business, including brand, workforce, customer relationships and expected synergies — none of which are individually identifiable assets on their own',
        'Because goodwill is required by law in every deal regardless of price',
        'Because fair value is always lower than book value'
      ], correctAnswer: 'Because the acquirer is paying for the whole functioning business, including brand, workforce, customer relationships and expected synergies — none of which are individually identifiable assets on their own',
      hint: 'Think about what value exists in a business beyond its individually identifiable, separately-sellable assets.',
      approach: 'Goodwill captures the value of everything paid for beyond individually identifiable net assets.',
      solution: 'A functioning business is worth more than the sum of its individually identifiable parts — the acquirer is also paying for brand, workforce, customer relationships and expected synergies, none of which can be separately valued as an identifiable asset, so this excess shows up as goodwill.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming goodwill signals a mistake or overpayment rather than a normal, expected feature of most acquisitions.',
      tags: ['goodwill']
    },

    /* ---------------------- NET WORKING CAPITAL ---------------------- */
    {
      id: 'ib_b044', topic: 'Accounting Flows', subtopic: 'Working capital flow-through', difficulty: 3, targetTime: 90,
      prompt: 'This quarter, receivables rise $9m, inventory rises $4m, and payables rise $6m. What is the impact on free cash flow, in $ millions?',
      answerType: 'numeric', correctAnswer: -7, tolerance: 0.2,
      hint: 'Rising assets use cash; rising liabilities free up cash.',
      approach: 'ΔNWC = ΔReceivables + ΔInventory − ΔPayables. FCF impact = −ΔNWC.',
      solution: 'ΔNWC = 9 + 4 − 6 = +7. FCF impact = −7, i.e. FCF falls by $7m.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Treating rising payables as a use of cash instead of a source.',
      tags: ['working-capital']
    },
    {
      id: 'ib_b045', topic: 'Accounting Flows', subtopic: 'Working capital flow-through', difficulty: 3, targetTime: 90,
      prompt: 'In an M&A agreement, why do buyers typically insist on a "normalized" NWC target with a post-closing purchase price true-up?',
      answerType: 'mc', options: [
        'To make the closing process simpler',
        'To prevent the seller from artificially stripping working capital out of the business right before closing, which would leave the buyer with an under-cushioned business',
        'Because working capital has no real effect on the business',
        'It is purely a formality with no financial consequence'
      ], correctAnswer: 'To prevent the seller from artificially stripping working capital out of the business right before closing, which would leave the buyer with an under-cushioned business',
      hint: 'Think about what a seller could do to inflate their own cash position right before a deal closes.',
      approach: 'The NWC target-and-true-up mechanism protects the buyer against last-minute working-capital manipulation.',
      solution: 'Without a target and true-up, a seller could aggressively collect receivables, delay paying suppliers, or run down inventory right before closing to inflate their own cash proceeds — the true-up mechanism adjusts the purchase price if actual NWC delivered falls short of the agreed normalized target.',
      recognitionTechnique: 'Other', commonTrap: 'Treating the NWC adjustment as a minor technicality rather than a real economic protection for the buyer.',
      tags: ['working-capital', 'm&a']
    },
    {
      id: 'ib_b046', topic: 'Accounting Flows', subtopic: 'Working capital flow-through', difficulty: 2, targetTime: 60,
      prompt: 'Which of the following describes a HIGHER Days Payable Outstanding (DPO)?',
      answerType: 'mc', options: [
        'The company collects from its customers faster',
        'The company takes longer, on average, to pay its own suppliers',
        'The company holds inventory for a shorter time',
        'The company has no accounts payable at all'
      ], correctAnswer: 'The company takes longer, on average, to pay its own suppliers',
      hint: 'DPO measures the payables side, not receivables or inventory.',
      approach: 'DPO = (Accounts Payable / COGS) × 365 — a higher figure means slower payment to suppliers.',
      solution: 'A higher DPO means the company is taking longer to pay suppliers, which — within reason — is generally favorable for the company\'s own cash position, though pushed too far it can strain supplier relationships.',
      recognitionTechnique: 'Other', commonTrap: 'Confusing DPO (payables) with DSO (receivables) or DIO (inventory) — all three measure different things.',
      tags: ['working-capital', 'dpo']
    },

    /* ---------------------- IRR AS DECISION CRITERION ---------------------- */
    {
      id: 'ib_b047', topic: 'DCF Valuation', subtopic: 'Investment decision criteria', difficulty: 2, targetTime: 60,
      prompt: 'A project requires a $100 investment today and returns $128 in exactly one year, with no other cash flows. What is its IRR?',
      answerType: 'numeric', correctAnswer: 28, tolerance: 0.2,
      hint: 'IRR is the rate that makes NPV exactly zero.',
      approach: '−100 + 128/(1+r) = 0 → 1+r = 1.28 → r = 28%.',
      solution: 'IRR = (128/100) − 1 = 28%.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Reporting the raw dollar gain ($28) instead of converting it to a percentage rate.',
      tags: ['irr']
    },
    {
      id: 'ib_b048', topic: 'DCF Valuation', subtopic: 'Investment decision criteria', difficulty: 4, targetTime: 120,
      prompt: 'A project has cash flows that change sign more than once over its life (e.g. an outflow, then inflows, then a large outflow again). What specific problem can this create for using IRR as a decision tool?',
      answerType: 'mc', options: [
        'No problem — IRR is always reliable regardless of the cash flow pattern',
        'The IRR equation can have multiple mathematically valid solutions, making "the IRR" ambiguous as a single decision number',
        'NPV can no longer be computed for this project',
        'The project automatically has negative NPV'
      ], correctAnswer: 'The IRR equation can have multiple mathematically valid solutions, making "the IRR" ambiguous as a single decision number',
      hint: 'Think about how many different discount rates could make a more complex cash flow pattern equal zero.',
      approach: 'Multiple sign changes in a cash flow stream can produce multiple valid roots to the IRR equation.',
      solution: 'With more than one sign change, the equation defining IRR can have more than one valid solution — in ambiguous cases like this, NPV (computed directly at the actual hurdle rate) is the more reliable decision criterion.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming IRR is always a single, unambiguous number regardless of the cash flow pattern.',
      tags: ['irr', 'npv']
    },
    {
      id: 'ib_b049', topic: 'DCF Valuation', subtopic: 'Investment decision criteria', difficulty: 3, targetTime: 90,
      prompt: 'Fund A achieves a 2.0× MOIC in 2 years. Fund B achieves the same 2.0× MOIC in 6 years. Which fund has the better IRR?',
      answerType: 'mc', options: ['Fund A (shorter hold)', 'Fund B (longer hold)', 'They have identical IRR', 'IRR cannot be compared across different hold periods'], correctAnswer: 'Fund A (shorter hold)',
      hint: 'IRR annualizes the return — the same total multiple achieved faster implies a higher annual rate.',
      approach: 'IRR = MOIC^(1/years) − 1; for a fixed MOIC, a shorter hold period produces a higher annualized IRR.',
      solution: 'Fund A: 2.0^(1/2) − 1 ≈ 41.4%. Fund B: 2.0^(1/6) − 1 ≈ 12.2%. Despite identical MOIC, Fund A\'s much shorter hold period gives it a dramatically higher IRR.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Assuming identical MOIC means identical performance — IRR reveals that TIME matters, which MOIC alone ignores.',
      tags: ['irr', 'moic']
    },

    /* ---------------------- OPERATING LEVERAGE ---------------------- */
    {
      id: 'ib_b050', topic: 'Accounting Flows', subtopic: 'Operating leverage', difficulty: 3, targetTime: 90,
      prompt: 'Fixed costs are $300m. Variable cost is $25/unit. At 8m units sold and a $65 price, what is operating income, in $ millions?',
      answerType: 'numeric', correctAnswer: 20, tolerance: 1,
      hint: 'Revenue minus variable costs gives contribution margin; subtract fixed costs from that.',
      approach: 'Operating income = Revenue − Variable costs − Fixed costs.',
      solution: 'Revenue = 8m×$65 = $520m. Variable costs = 8m×$25 = $200m. Operating income = 520 − 200 − 300 = $20m.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Forgetting to subtract the fixed cost component after computing the contribution margin.',
      tags: ['operating-leverage']
    },
    {
      id: 'ib_b051', topic: 'Accounting Flows', subtopic: 'Operating leverage', difficulty: 3, targetTime: 90,
      prompt: 'Two companies have identical revenue and identical operating income this year. Company X has mostly FIXED costs; Company Y has mostly VARIABLE costs. If both experience a 15% revenue decline next year, which company\'s operating income falls by a LARGER percentage?',
      answerType: 'mc', options: ['Company X (mostly fixed costs)', 'Company Y (mostly variable costs)', 'Both fall by exactly the same percentage', 'Neither company\'s operating income is affected by revenue changes'], correctAnswer: 'Company X (mostly fixed costs)',
      hint: 'Fixed costs do not shrink along with a revenue decline; variable costs do.',
      approach: 'High operating leverage (mostly fixed costs) amplifies the percentage swing in operating income relative to revenue, in both directions.',
      solution: 'Company X\'s fixed costs stay the same even as revenue falls, eating into a shrinking base — its operating income falls by a much larger percentage than its revenue does. Company Y\'s costs shrink roughly in proportion to the revenue decline, cushioning the impact on operating income.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming both companies are affected equally just because their starting revenue and operating income are identical.',
      tags: ['operating-leverage', 'risk']
    },

    /* ---------------------- TREASURY STOCK METHOD ---------------------- */
    {
      id: 'ib_b052', topic: 'M&A Mechanics', subtopic: 'Share count mechanics', difficulty: 3, targetTime: 90,
      prompt: '6 million options have a $12 strike price. The current market price is $20. Using the treasury stock method, how many NET new shares does this tranche add?',
      answerType: 'numeric', correctAnswer: 2.4, tolerance: 0.05,
      hint: 'Work out exercise proceeds first, then how many shares that cash could hypothetically repurchase.',
      approach: 'Net new shares = options exercised − (options × strike / market price).',
      solution: 'Proceeds = 6m×$12 = $72m. Shares repurchased = $72m/$20 = 3.6m. Net new shares = 6m − 3.6m = 2.4m.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Treating all 6 million options as pure dilution without netting off the hypothetical share repurchase.',
      tags: ['treasury-stock-method']
    },
    {
      id: 'ib_b053', topic: 'M&A Mechanics', subtopic: 'Share count mechanics', difficulty: 2, targetTime: 60,
      prompt: '3 million options have a $45 strike price. The current market price is $38. How many net new shares does the treasury stock method add for this tranche?',
      answerType: 'numeric', correctAnswer: 0, tolerance: 0.01,
      hint: 'Compare the strike price to the market price before doing any arithmetic.',
      approach: 'Out-of-the-money options (strike above market price) are excluded entirely from the treasury stock method.',
      solution: 'Since the $45 strike price exceeds the $38 market price, these options are out-of-the-money — a rational holder would not exercise them, so they add 0 net new shares.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Running the exercise/repurchase mechanics anyway without first checking whether the options are even in-the-money.',
      tags: ['treasury-stock-method']
    },

    /* ---------------------- APV vs WACC ---------------------- */
    {
      id: 'ib_b054', topic: 'DCF Valuation', subtopic: 'APV', difficulty: 3, targetTime: 75,
      prompt: 'A company\'s unlevered value is $420m. The present value of its interest tax shield is $30m. What is its APV, in $ millions?',
      answerType: 'numeric', correctAnswer: 450, tolerance: 1,
      hint: 'APV simply adds the two pieces together.',
      approach: 'APV = unlevered value + PV of interest tax shield.',
      solution: '420 + 30 = $450m.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Subtracting the tax shield instead of adding it — the tax shield is a genuine value BENEFIT of debt financing.',
      tags: ['apv']
    },
    {
      id: 'ib_b055', topic: 'DCF Valuation', subtopic: 'APV', difficulty: 4, targetTime: 120,
      prompt: 'Why would a private equity analyst modeling an LBO with aggressive, scheduled debt paydown generally prefer APV over a standard WACC-based DCF?',
      answerType: 'mc', options: [
        'APV always produces a lower valuation, which sponsors prefer',
        'A single WACC assumes a roughly stable capital structure, but the LBO\'s debt (and its tax shield) shrinks predictably every year — APV values the tax shield as its own explicit, separately-modeled stream instead of requiring a new WACC every year',
        'APV does not require any assumptions about future cash flows',
        'WACC cannot be used for any company with debt'
      ], correctAnswer: 'A single WACC assumes a roughly stable capital structure, but the LBO\'s debt (and its tax shield) shrinks predictably every year — APV values the tax shield as its own explicit, separately-modeled stream instead of requiring a new WACC every year',
      hint: 'Think about what happens to the correct WACC each year as an LBO\'s debt balance shrinks.',
      approach: 'APV separates unlevered business value from the tax-shield benefit, sidestepping the need to recompute WACC as capital structure changes.',
      solution: 'WACC implicitly assumes a roughly stable capital structure; in an LBO, debt shrinks substantially and predictably each year, which would require a new WACC every year under that approach. APV avoids this by valuing the business unlevered once, then separately modeling the shrinking tax shield year by year.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming APV and WACC are simply two equally-valid ways to reach the identical answer with no practical difference in when each is appropriate.',
      tags: ['apv', 'wacc']
    }
  ];

  items.forEach((q) => { q.track = 'ib'; });
  global.QTL_BANK.addMany(items);
})(window);
