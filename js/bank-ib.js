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
    },

    /* ---------------------- Beta and cost of equity ---------------------- */
    {
      id: 'ib_b056', topic: 'Equity & Capital Markets', subtopic: 'Beta and cost of equity', difficulty: 3, targetTime: 90,
      prompt: 'A peer has a levered beta of 1.35, a debt-to-equity ratio of 0.6, and faces a 25% tax rate. What is its unlevered beta (to 3 decimals)?',
      answerType: 'numeric', correctAnswer: 0.931, tolerance: 0.01,
      hint: 'Unlever: βu = βl / [1 + (1−t)(D/E)].',
      approach: 'βu = βl / [1 + (1−t) × (D/E)].',
      solution: 'Bracket = 1 + (0.75×0.6) = 1.45. βu = 1.35 / 1.45 ≈ 0.931.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Multiplying by the bracket term instead of dividing when unlevering.',
      tags: ['beta', 'hamada']
    },
    {
      id: 'ib_b057', topic: 'Equity & Capital Markets', subtopic: 'Beta and cost of equity', difficulty: 3, targetTime: 90,
      prompt: 'A peer-average unlevered beta is 0.85. The target has a debt-to-equity ratio of 0.5 and a 20% tax rate. What is the target\'s relevered beta (to 3 decimals)?',
      answerType: 'numeric', correctAnswer: 1.19, tolerance: 0.01,
      hint: 'Relever using the TARGET\'s own D/E: βl = βu × [1 + (1−t)(D/E)].',
      approach: 'βl = βu × [1 + (1−t) × (D/E)].',
      solution: 'Bracket = 1 + (0.80×0.5) = 1.40. βl = 0.85 × 1.40 = 1.19.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Using a peer\'s D/E ratio instead of the target\'s own D/E ratio during relevering.',
      tags: ['beta', 'hamada']
    },
    {
      id: 'ib_b058', topic: 'Equity & Capital Markets', subtopic: 'Beta and cost of equity', difficulty: 2, targetTime: 60,
      prompt: 'Why must peer betas be unlevered before averaging them across a comp set with different debt levels?',
      answerType: 'mc', options: [
        'Unlevering is not actually necessary; raw levered betas can always be averaged directly',
        'Each peer\'s levered beta reflects its own capital structure, so averaging raw levered betas mixes business risk with financing-driven risk differences across peers',
        'Unlevering is only a legal requirement, with no economic rationale',
        'Because unlevered beta is always exactly 1.0 for every company'
      ], correctAnswer: 'Each peer\'s levered beta reflects its own capital structure, so averaging raw levered betas mixes business risk with financing-driven risk differences across peers',
      hint: 'Think about what debt does to equity risk, independent of the underlying business.',
      approach: 'Debt amplifies equity risk; unlevering strips that effect out to isolate comparable business risk.',
      solution: 'Debt amplifies equity risk beyond the underlying business risk, so two peers with identical businesses but different leverage will show different levered betas. Unlevering removes this financing noise, making the betas genuinely comparable before averaging.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming beta is a pure measure of business risk regardless of capital structure.',
      tags: ['beta', 'hamada']
    },

    /* ---------------------- Systematic vs unsystematic risk / CAPM ---------------------- */
    {
      id: 'ib_b059', topic: 'Equity & Capital Markets', subtopic: 'Systematic risk & CAPM', difficulty: 2, targetTime: 60,
      prompt: 'Which of these is an example of UNSYSTEMATIC (diversifiable) risk?',
      answerType: 'mc', options: [
        'A global recession reducing consumer spending across nearly every industry',
        'A central bank raising interest rates economy-wide',
        'One company\'s factory suffering an isolated equipment failure that halts production for a month',
        'A broad geopolitical shock affecting global equity markets'
      ], correctAnswer: 'One company\'s factory suffering an isolated equipment failure that halts production for a month',
      hint: 'Diversifiable risk is firm-specific, not something affecting the whole market at once.',
      approach: 'Unsystematic risk is idiosyncratic to one company or narrow situation, not market-wide.',
      solution: 'An isolated equipment failure at one company\'s factory is firm-specific and largely uncorrelated with other companies\' fortunes — it can be diversified away by holding many stocks. The other three options all describe market-wide, undiversifiable systematic risk.',
      recognitionTechnique: 'Other', commonTrap: 'Confusing "large in magnitude for one company" with "systematic" — systematic risk is defined by breadth (market-wide), not size.',
      tags: ['risk', 'capm']
    },
    {
      id: 'ib_b060', topic: 'Equity & Capital Markets', subtopic: 'Systematic risk & CAPM', difficulty: 2, targetTime: 60,
      prompt: 'A stock has a beta of 1.25. The risk-free rate is 4.5%, and the equity risk premium is 5.5%. What is its CAPM cost of equity?',
      answerType: 'numeric', correctAnswer: 11.375, tolerance: 0.05,
      hint: 'Cost of equity = Rf + β × ERP.',
      approach: 'Apply the CAPM formula directly.',
      solution: 'Cost of equity = 4.5% + 1.25×5.5% = 4.5% + 6.875% = 11.375%.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Adding the risk-free rate to the market return instead of the equity risk premium (Rm − Rf).',
      tags: ['capm']
    },
    {
      id: 'ib_b061', topic: 'Equity & Capital Markets', subtopic: 'Systematic risk & CAPM', difficulty: 3, targetTime: 90,
      prompt: 'Why does CAPM compensate investors only for systematic risk, ignoring unsystematic risk entirely, even for a company with a very large firm-specific risk exposure?',
      answerType: 'mc', options: [
        'Because unsystematic risk never actually affects stock prices',
        'Because unsystematic risk can be eliminated for free through diversification, so a well-diversified investor does not need to be compensated for bearing a risk they could have avoided at no cost',
        'Because CAPM only applies to companies with no firm-specific risks at all',
        'Because unsystematic risk is always smaller than systematic risk for every company'
      ], correctAnswer: 'Because unsystematic risk can be eliminated for free through diversification, so a well-diversified investor does not need to be compensated for bearing a risk they could have avoided at no cost',
      hint: 'Think about what a diversified investor can accomplish for free.',
      approach: 'CAPM assumes a diversified investor, so only undiversifiable risk merits a return premium.',
      solution: 'Since unsystematic risk can be diversified away at no cost by holding a broad portfolio, the market does not need to reward investors for bearing it — only the undiversifiable, market-wide (systematic) portion, captured by beta, earns a return premium under CAPM.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming any large risk, regardless of type, must be priced into required returns.',
      tags: ['risk', 'capm']
    },

    /* ---------------------- Short selling ---------------------- */
    {
      id: 'ib_b062', topic: 'Equity & Capital Markets', subtopic: 'Short selling', difficulty: 2, targetTime: 60,
      prompt: 'An investor shorts 150 shares at $40 each. The stock falls to $28 and they cover. What is the profit, ignoring fees, in dollars?',
      answerType: 'numeric', correctAnswer: 1800, tolerance: 1,
      hint: 'Profit = (price sold at − price bought back at) × shares.',
      approach: 'Proceeds from the initial sale minus the cost to buy back and cover.',
      solution: 'Proceeds = 150×40 = $6000. Buyback cost = 150×28 = $4200. Profit = 6000 − 4200 = $1800.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Reversing the subtraction and getting a negative number for a position that actually profited.',
      tags: ['short-selling']
    },
    {
      id: 'ib_b063', topic: 'Equity & Capital Markets', subtopic: 'Short selling', difficulty: 3, targetTime: 90,
      prompt: 'Why is a short position\'s maximum possible loss theoretically unlimited, while a long position\'s maximum loss is capped at 100% of the amount invested?',
      answerType: 'mc', options: [
        'Short sellers are charged unlimited fees by their broker over time',
        'A stock price has no upper ceiling, so the cost to buy back and cover a short position can keep rising indefinitely; a long position\'s loss is bounded because price cannot fall below zero',
        'Short positions are always larger in dollar size than long positions',
        'This is a common misconception — both position types have identical, symmetric risk'
      ], correctAnswer: 'A stock price has no upper ceiling, so the cost to buy back and cover a short position can keep rising indefinitely; a long position\'s loss is bounded because price cannot fall below zero',
      hint: 'Think about the floor and ceiling of a stock price.',
      approach: 'Compare the bounds on how far a stock price can fall (long risk) versus rise (short risk).',
      solution: 'A long position\'s downside is capped since a stock price has a floor of zero, but a short position\'s downside is driven by the stock RISING, and there is no ceiling on how high a price can go — hence the theoretically unlimited loss potential for a short.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming short and long positions have mirror-image, symmetric risk profiles.',
      tags: ['short-selling']
    },
    {
      id: 'ib_b064', topic: 'Equity & Capital Markets', subtopic: 'Short selling', difficulty: 3, targetTime: 90,
      prompt: 'What specifically drives a "short squeeze"?',
      answerType: 'mc', options: [
        'A steady, gradual decline in a heavily shorted stock\'s price over many months',
        'A sharp price rise forcing short sellers to buy back shares to limit losses, and that forced buying itself adds further upward pressure, forcing even more covering',
        'A company voluntarily announcing a stock split',
        'Short sellers coordinating to sell even more shares short at once'
      ], correctAnswer: 'A sharp price rise forcing short sellers to buy back shares to limit losses, and that forced buying itself adds further upward pressure, forcing even more covering',
      hint: 'The squeeze is a self-reinforcing cycle driven by forced buying.',
      approach: 'Rising prices trigger covering (buying), which itself pushes prices higher, triggering more covering.',
      solution: 'A short squeeze begins with a sharp price increase that forces short sellers to buy back shares (cover) to cap mounting losses; that wave of forced buying adds further demand, pushing the price up even more and forcing additional shorts to cover in a reinforcing spiral.',
      recognitionTechnique: 'Other', commonTrap: 'Confusing a short squeeze with an ordinary price decline.',
      tags: ['short-selling']
    },

    /* ---------------------- Liquidity premium ---------------------- */
    {
      id: 'ib_b065', topic: 'Equity & Capital Markets', subtopic: 'Liquidity premium', difficulty: 2, targetTime: 60,
      prompt: 'A public comparable company is valued at $350m. Applying a 25% discount for lack of marketability (DLOM) to an economically similar private company, what is its estimated value, in $ millions?',
      answerType: 'numeric', correctAnswer: 262.5, tolerance: 1,
      hint: 'Multiply the public comparable value by (1 − DLOM).',
      approach: 'Private value ≈ public comparable value × (1 − DLOM).',
      solution: '350 × (1 − 0.25) = 350 × 0.75 = $262.5m.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Adding the DLOM to the public value instead of applying it as a discount.',
      tags: ['liquidity-premium', 'dlom']
    },
    {
      id: 'ib_b066', topic: 'Equity & Capital Markets', subtopic: 'Liquidity premium', difficulty: 2, targetTime: 60,
      prompt: 'Why must an illiquid alternative investment (like a locked-up private equity fund) offer a higher expected return than an otherwise-comparable liquid public equity investment?',
      answerType: 'mc', options: [
        'It is a regulatory requirement with no underlying economic logic',
        'If it offered the same expected return as a liquid asset, no rational investor would accept being unable to exit on demand for no additional compensation',
        'Illiquid investments are always managed by better investment teams',
        'Illiquid investments never carry any additional business risk'
      ], correctAnswer: 'If it offered the same expected return as a liquid asset, no rational investor would accept being unable to exit on demand for no additional compensation',
      hint: 'Think about what a rational investor would demand for giving up the ability to exit on demand.',
      approach: 'The liquidity premium compensates investors specifically for illiquidity, above and beyond business risk.',
      solution: 'Being locked into an investment for years is itself a real cost to an investor; without extra expected return to compensate for that cost, there would be no rational reason to accept illiquidity over an equally-returning liquid alternative.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming illiquid investments only need to compensate for business risk, ignoring the separate cost of being unable to exit.',
      tags: ['liquidity-premium']
    },
    {
      id: 'ib_b067', topic: 'Equity & Capital Markets', subtopic: 'Liquidity premium', difficulty: 3, targetTime: 90,
      prompt: 'A client has a high likelihood of needing a large lump sum of cash within 18 months. Why is a large allocation to a fund with a 7-year lockup inappropriate for this client, even if the fund\'s expected return looks attractive?',
      answerType: 'mc', options: [
        'Funds with lockups always perform worse than liquid investments',
        'The lockup could prevent access to capital exactly when the client needs it; the liquidity premium compensates for illiquidity in general over a long horizon, not for a specific, known, near-term cash need',
        'This client should never invest in any alternative asset under any circumstance',
        'The fund\'s expected return becomes irrelevant to every client in every situation'
      ], correctAnswer: 'The lockup could prevent access to capital exactly when the client needs it; the liquidity premium compensates for illiquidity in general over a long horizon, not for a specific, known, near-term cash need',
      hint: 'Think about what a liquidity premium actually compensates for, versus what this specific client needs.',
      approach: 'Match investment liquidity terms to the client\'s actual liquidity needs and time horizon.',
      solution: 'A liquidity premium rewards investors, on average, over a long horizon — it does not solve a specific, known, near-term cash need, which a multi-year lockup can turn into a genuine access problem rather than a mere inconvenience.',
      recognitionTechnique: 'Other', commonTrap: 'Treating an attractive expected return as sufficient justification regardless of a client\'s actual liquidity needs.',
      tags: ['liquidity-premium', 'suitability']
    },

    /* ---------------------- Stock buybacks ---------------------- */
    {
      id: 'ib_b068', topic: 'Equity & Capital Markets', subtopic: 'Stock buybacks', difficulty: 2, targetTime: 60,
      prompt: 'A company has $90m of net income and 45m shares outstanding (EPS $2.00). It spends $120m buying back shares at $30 each, with net income unchanged. What is the new EPS?',
      answerType: 'numeric', correctAnswer: 2.20, tolerance: 0.02,
      hint: 'Shares repurchased = dollars spent / price per share. New EPS = net income / remaining shares.',
      approach: 'Repurchased shares = 120/30 = 4m. Remaining shares = 45−4 = 41m. New EPS = 90/41.',
      solution: 'Shares repurchased = 120/30 = 4m, leaving 45−4 = 41m shares. New EPS = 90/41 ≈ $2.20, up from $2.00 purely from the shrinking share count.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Forgetting to first compute how many shares were actually repurchased from the dollar amount spent.',
      tags: ['buybacks', 'eps']
    },
    {
      id: 'ib_b069', topic: 'Equity & Capital Markets', subtopic: 'Stock buybacks', difficulty: 2, targetTime: 60,
      prompt: 'An analyst notices a company\'s EPS grew 10% year-over-year, but net income was completely flat. What is the most likely explanation, and what does it imply?',
      answerType: 'mc', options: [
        'The tax rate must have fallen to zero, explaining the EPS growth',
        'A share buyback likely shrank the share count, mechanically raising EPS with no real underlying earnings growth — this should not be read as improving business fundamentals',
        'This combination is mathematically impossible and indicates an error',
        'Depreciation must have increased substantially'
      ], correctAnswer: 'A share buyback likely shrank the share count, mechanically raising EPS with no real underlying earnings growth — this should not be read as improving business fundamentals',
      hint: 'EPS = net income / shares — if net income is flat but EPS rose, what must have changed?',
      approach: 'Flat net income with rising EPS is the classic fingerprint of a shrinking share count from a buyback.',
      solution: 'Since EPS = net income / shares outstanding, flat net income paired with rising EPS points directly to a shrinking share count (most likely from a buyback), not genuine business growth.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming any EPS growth reflects real improvement in the underlying business.',
      tags: ['buybacks', 'eps']
    },
    {
      id: 'ib_b070', topic: 'Equity & Capital Markets', subtopic: 'Stock buybacks', difficulty: 3, targetTime: 90,
      prompt: 'A mature company with slowing growth borrows heavily specifically to fund an aggressive buyback program that boosts EPS with no change to operating performance. What is the strongest criticism of this strategy?',
      answerType: 'mc', options: [
        'Buybacks are illegal when funded with debt',
        'The EPS growth is financial engineering rather than real earnings growth, and the new debt raises the company\'s leverage and financial risk purely to produce a cosmetic per-share metric improvement',
        'Buybacks funded with debt always immediately bankrupt the company',
        'There is no valid criticism — debt-funded buybacks carry no distinct risk versus cash-funded ones'
      ], correctAnswer: 'The EPS growth is financial engineering rather than real earnings growth, and the new debt raises the company\'s leverage and financial risk purely to produce a cosmetic per-share metric improvement',
      hint: 'Consider both the source of the EPS growth and the balance-sheet consequence of borrowing to fund it.',
      approach: 'Distinguish real earnings growth from share-count-driven EPS growth, and note the added leverage risk from debt funding.',
      solution: 'The EPS increase comes purely from a shrinking share count, not real earnings growth, while the new debt increases financial leverage and risk — a combination that is a legitimate point of scrutiny, especially for a company with limited genuine growth opportunities to invest in instead.',
      recognitionTechnique: 'Other', commonTrap: 'Evaluating the EPS improvement in isolation without considering how it was financed or where the improvement actually came from.',
      tags: ['buybacks', 'leverage']
    },

    /* ---------------------- Duration ---------------------- */
    {
      id: 'ib_b071', topic: 'Fixed Income', subtopic: 'Duration', difficulty: 2, targetTime: 60,
      prompt: 'A bond has a duration of 7 and is priced at $1,000. Yields fall by 0.5% (50bp). What is the approximate new price?',
      answerType: 'numeric', correctAnswer: 1035, tolerance: 2,
      hint: '%ΔPrice ≈ −Duration × Δyield. A FALL in yields makes Δyield negative.',
      approach: 'Compute %ΔPrice, then apply it to the current price.',
      solution: '%ΔPrice ≈ −7 × (−0.5%) = +3.5%. New price ≈ 1000 × 1.035 = $1035.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Getting the sign backwards and computing a price decline instead of a rise for a fall in yields.',
      tags: ['duration']
    },
    {
      id: 'ib_b072', topic: 'Fixed Income', subtopic: 'Duration', difficulty: 2, targetTime: 60,
      prompt: 'All else equal, which bond has HIGHER duration: a 15-year bond, or a 5-year bond with the same coupon rate?',
      answerType: 'mc', options: ['The 15-year bond', 'The 5-year bond', 'They must have identical duration', 'Duration has nothing to do with maturity'], correctAnswer: 'The 15-year bond',
      hint: 'Longer maturity means more of the bond\'s cash flows sit further in the future.',
      approach: 'Duration rises with longer maturity, all else equal.',
      solution: 'A longer maturity means more cash flows arrive further in the future, which are more sensitive (in percentage terms) to a change in the discount rate — so the 15-year bond has higher duration.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming duration depends only on coupon rate, ignoring the separate, equally important effect of maturity.',
      tags: ['duration']
    },
    {
      id: 'ib_b073', topic: 'Fixed Income', subtopic: 'Duration', difficulty: 3, targetTime: 90,
      prompt: 'Why does a zero-coupon bond have the maximum possible duration for its maturity, compared to a coupon-paying bond of the same maturity?',
      answerType: 'mc', options: [
        'Zero-coupon bonds are always riskier for unrelated credit reasons',
        'Its entire value arrives in one lump sum at maturity, while a coupon bond returns some value earlier, pulling its weighted-average cash-flow timing earlier and lowering its duration',
        'Zero-coupon bonds pay a floating interest rate',
        'This is false — they always have identical duration'
      ], correctAnswer: 'Its entire value arrives in one lump sum at maturity, while a coupon bond returns some value earlier, pulling its weighted-average cash-flow timing earlier and lowering its duration',
      hint: 'Duration is a weighted average of when cash flows arrive.',
      approach: 'Compare the timing of cash flows for a zero-coupon bond versus a coupon-paying bond of the same maturity.',
      solution: 'Duration reflects the weighted-average timing of a bond\'s cash flows; a zero-coupon bond concentrates 100% of its value at the single maturity date, while a coupon bond returns some value earlier via periodic coupons, pulling the weighted average (and therefore duration) earlier.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming duration is purely a function of stated maturity, ignoring the effect of coupon timing.',
      tags: ['duration']
    },

    /* ---------------------- Yield mechanics ---------------------- */
    {
      id: 'ib_b074', topic: 'Fixed Income', subtopic: 'Yield mechanics', difficulty: 2, targetTime: 60,
      prompt: 'A bond has a $1,000 face value and a 7% coupon rate. It trades at $1,100 (a premium). What is the correct ordering of coupon rate, current yield, and YTM?',
      answerType: 'mc', options: ['Coupon rate = Current yield = YTM', 'YTM > Current yield > Coupon rate', 'Coupon rate > Current yield > YTM'], correctAnswer: 'Coupon rate > Current yield > YTM',
      hint: 'A premium bond gives up a capital loss by holding to maturity.',
      approach: 'At a premium, holding to maturity means the price falls back to face value, a capital loss subtracted from YTM.',
      solution: 'The bond trades above face value (a premium), so holding to maturity means giving up a capital loss as the price converges to $1,000 — this drags YTM below current yield, which is itself below the coupon rate since the price (denominator) exceeds face value: Coupon rate > Current yield > YTM.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Assuming current yield alone represents total expected return, ignoring the capital loss embedded in a premium price.',
      tags: ['ytm', 'current-yield']
    },
    {
      id: 'ib_b075', topic: 'Fixed Income', subtopic: 'Yield mechanics', difficulty: 2, targetTime: 60,
      prompt: 'A bond pays a $45 annual coupon and trades at $900. What is its current yield?',
      answerType: 'numeric', correctAnswer: 5, tolerance: 0.1,
      hint: 'Current yield = annual coupon / current market price.',
      approach: 'Divide the annual coupon by the current market price.',
      solution: 'Current yield = 45/900 = 5%.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Dividing the coupon by face value instead of the current market price.',
      tags: ['current-yield']
    },
    {
      id: 'ib_b076', topic: 'Fixed Income', subtopic: 'Yield mechanics', difficulty: 3, targetTime: 90,
      prompt: 'Why can quoting only a bond\'s current yield be misleading as a measure of total expected return?',
      answerType: 'mc', options: [
        'Current yield is always identical to YTM, so this concern is unfounded',
        'Current yield ignores any capital gain or loss embedded in the gap between the purchase price and the face value received at maturity',
        'Current yield only applies to bonds that pay no coupons',
        'Current yield always overstates returns for discount bonds and understates them for premium bonds'
      ], correctAnswer: 'Current yield ignores any capital gain or loss embedded in the gap between the purchase price and the face value received at maturity',
      hint: 'Think about what current yield leaves out compared to YTM.',
      approach: 'Current yield is a simple income-over-price snapshot; YTM captures the full return to maturity.',
      solution: 'Current yield only measures income relative to today\'s price — it says nothing about the capital gain (for a discount bond) or capital loss (for a premium bond) the investor will realize as the price converges to face value by maturity, which YTM captures fully.',
      recognitionTechnique: 'Other', commonTrap: 'Treating current yield as a complete total-return measure.',
      tags: ['ytm', 'current-yield']
    },

    /* ---------------------- Bond structures ---------------------- */
    {
      id: 'ib_b077', topic: 'Fixed Income', subtopic: 'Bond structures', difficulty: 2, targetTime: 60,
      prompt: 'A zero-coupon bond with $1,000 face value matures in 6 years at a 5% discount rate. What is its approximate price?',
      answerType: 'numeric', correctAnswer: 746, tolerance: 5,
      hint: 'Price = Face value / (1+yield)^n.',
      approach: 'Discount the face value back n years at the given rate.',
      solution: 'Price = 1000/(1.05)^6 = 1000/1.340 ≈ $746.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Forgetting there are no coupon cash flows to add — the entire price comes from discounting the single face-value payment.',
      tags: ['zero-coupon']
    },
    {
      id: 'ib_b078', topic: 'Fixed Income', subtopic: 'Bond structures', difficulty: 3, targetTime: 90,
      prompt: 'Why does a callable bond typically offer a HIGHER yield than an otherwise-identical non-callable (straight) bond?',
      answerType: 'mc', options: [
        'Callable bonds always carry more default risk',
        'Investors are compensated for the risk that the issuer calls the bond away (typically when rates fall), capping the investor\'s potential price appreciation',
        'Callable bonds pay coupons less frequently',
        'This is false — callable bonds always yield less'
      ], correctAnswer: 'Investors are compensated for the risk that the issuer calls the bond away (typically when rates fall), capping the investor\'s potential price appreciation',
      hint: 'Think about which side of the trade — issuer or investor — holds the call option.',
      approach: 'The call option favors the issuer, so investors must be compensated with extra yield.',
      solution: 'Since the issuer holds the right to redeem the bond early (typically exercised when rates fall, to refinance cheaper), investors\' potential upside is capped — the extra yield compensates them for giving up that upside.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming any embedded bond option always raises yield, regardless of which side holds it.',
      tags: ['callable-bonds']
    },
    {
      id: 'ib_b079', topic: 'Fixed Income', subtopic: 'Bond structures', difficulty: 3, targetTime: 90,
      prompt: 'Why does a convertible bond typically carry a LOWER coupon than an otherwise-identical straight bond?',
      answerType: 'mc', options: [
        'Convertible bonds are always safer from a default standpoint',
        'The investor accepts less current income in exchange for the option to convert into the issuer\'s equity, offering potential upside if the stock performs well',
        'Convertible bonds never actually pay any coupons',
        'The issuer is legally required to reduce the coupon on any convertible security'
      ], correctAnswer: 'The investor accepts less current income in exchange for the option to convert into the issuer\'s equity, offering potential upside if the stock performs well',
      hint: 'Think about what valuable right the investor receives in exchange for the lower coupon.',
      approach: 'The conversion option is valuable to the investor, who pays for it via a lower coupon.',
      solution: 'The embedded right to convert into common shares is a valuable option that can pay off if the stock rallies; investors accept a lower coupon as the "price" of holding that option, similar to how option premiums work more broadly.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming the lower coupon reflects lower risk rather than compensation traded for the embedded equity option.',
      tags: ['convertible-bonds']
    },

    /* ---------------------- Creditor waterfall ---------------------- */
    {
      id: 'ib_b080', topic: 'Fixed Income', subtopic: 'Creditor waterfall', difficulty: 2, targetTime: 60,
      prompt: 'A company liquidates for $90m, with $60m of secured debt and $50m of unsecured senior debt (no other claims). How much does unsecured senior debt recover?',
      answerType: 'numeric', correctAnswer: 30, tolerance: 0.5,
      hint: 'Secured debt is paid in full first.',
      approach: 'Pay secured debt in full, then apply remaining proceeds to unsecured senior debt.',
      solution: 'Secured debt paid in full: $60m, leaving 90−60 = $30m for the $50m unsecured senior claim — a partial recovery of $30m.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Splitting proceeds proportionally across both tiers instead of following the strict, sequential priority order.',
      tags: ['creditor-waterfall']
    },
    {
      id: 'ib_b081', topic: 'Fixed Income', subtopic: 'Creditor waterfall', difficulty: 2, targetTime: 60,
      prompt: 'In the standard liquidation waterfall, which of these is paid LAST?',
      answerType: 'mc', options: ['Secured debt', 'Subordinated debt', 'Common equity', 'Unsecured senior debt'], correctAnswer: 'Common equity',
      hint: 'The residual claimant is paid only after every other claim is satisfied in full.',
      approach: 'Common equity is the most junior claim in the standard capital structure.',
      solution: 'Common equity is the residual claimant, entitled only to whatever (if anything) remains after secured debt, unsecured senior debt, subordinated debt, and preferred equity have all been paid in full.',
      recognitionTechnique: 'Other', commonTrap: 'Confusing preferred equity (paid ahead of common) with common equity.',
      tags: ['creditor-waterfall']
    },
    {
      id: 'ib_b082', topic: 'Fixed Income', subtopic: 'Creditor waterfall', difficulty: 3, targetTime: 90,
      prompt: 'Why do required yields on debt generally rise the further DOWN the capital structure a claim sits?',
      answerType: 'mc', options: [
        'Yields have no relationship to a claim\'s seniority',
        'A claim further down the waterfall faces greater risk of a shortfall in a liquidation, since more senior claims must be paid in full first, so lenders demand more yield to compensate',
        'Junior debt is always backed by more collateral than senior debt',
        'This pattern applies only to equity, never to debt'
      ], correctAnswer: 'A claim further down the waterfall faces greater risk of a shortfall in a liquidation, since more senior claims must be paid in full first, so lenders demand more yield to compensate',
      hint: 'Think about recovery risk at each successive tier.',
      approach: 'More junior claims face more recovery risk in a liquidation, which is compensated with higher required yield.',
      solution: 'Since each tier is paid in full only after all more senior tiers are satisfied, a more junior claim faces a materially higher chance of a partial or zero recovery — lenders require higher yield to compensate for that added risk.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming yield differences across the capital structure reflect something other than seniority-driven recovery risk.',
      tags: ['creditor-waterfall']
    },

    /* ---------------------- Inflation & fixed income ---------------------- */
    {
      id: 'ib_b083', topic: 'Fixed Income', subtopic: 'Inflation & TIPS', difficulty: 2, targetTime: 60,
      prompt: 'The real interest rate is 2%, and expected inflation is 4%. Using the Fisher approximation, what is the approximate nominal rate?',
      answerType: 'numeric', correctAnswer: 6, tolerance: 0.2,
      hint: 'Nominal rate ≈ real rate + expected inflation.',
      approach: 'Add the real rate and expected inflation.',
      solution: 'Nominal rate ≈ 2% + 4% = 6%.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Subtracting inflation from the real rate instead of adding it.',
      tags: ['fisher-equation']
    },
    {
      id: 'ib_b084', topic: 'Fixed Income', subtopic: 'Inflation & TIPS', difficulty: 2, targetTime: 60,
      prompt: 'A TIPS bond has an original principal of $1,000 and a 2% coupon rate. After one year, cumulative inflation is 3%. What is that year\'s coupon payment?',
      answerType: 'numeric', correctAnswer: 20.6, tolerance: 0.5,
      hint: 'First adjust the principal upward by cumulative inflation, then apply the coupon rate to the ADJUSTED principal.',
      approach: 'Adjusted principal = original × (1+inflation). Coupon = coupon rate × adjusted principal.',
      solution: 'Adjusted principal = 1000×1.03 = $1030. Coupon = 2%×1030 = $20.60.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Applying the coupon rate to the original, un-adjusted principal instead of the inflation-adjusted principal.',
      tags: ['tips']
    },
    {
      id: 'ib_b085', topic: 'Fixed Income', subtopic: 'Inflation & TIPS', difficulty: 3, targetTime: 90,
      prompt: 'Why do existing fixed-rate bond prices typically fall when inflation expectations rise, even before any inflation has actually occurred?',
      answerType: 'mc', options: [
        'Bond prices only respond to realized inflation, never to expectations',
        'Rising inflation expectations push up the yields demanded on newly-issued bonds, making existing lower-yielding fixed-rate bonds comparatively less attractive, so their prices fall to compensate',
        'Inflation expectations only affect equities, never bonds',
        'This relationship is a myth — bond prices are unaffected by inflation expectations'
      ], correctAnswer: 'Rising inflation expectations push up the yields demanded on newly-issued bonds, making existing lower-yielding fixed-rate bonds comparatively less attractive, so their prices fall to compensate',
      hint: 'Think about the Fisher equation and the duration relationship together.',
      approach: 'Higher inflation expectations raise required nominal yields (Fisher), which lowers existing bond prices (duration).',
      solution: 'Per the Fisher equation, rising inflation expectations push up the nominal yields required on new debt; existing bonds paying their old, now relatively low coupons become less attractive at their old prices, so their prices fall (per the duration relationship) until their yields become competitive again.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming bond prices only respond to inflation once it is actually realized, ignoring the forward-looking nature of yields.',
      tags: ['fisher-equation', 'inflation']
    },

    /* ---------------------- Spot/forward FX & IRP ---------------------- */
    {
      id: 'ib_b086', topic: 'Currencies & Derivatives', subtopic: 'Spot/forward FX & IRP', difficulty: 3, targetTime: 90,
      prompt: 'Domestic 1-year interest rate is 4%, foreign 1-year interest rate is 7%, spot rate is 1.30 (domestic per foreign unit). Using Interest Rate Parity, what is the approximate 1-year forward rate?',
      answerType: 'numeric', correctAnswer: 1.264, tolerance: 0.01,
      hint: 'Forward = Spot × (1+domestic rate)/(1+foreign rate).',
      approach: 'Apply the IRP formula directly.',
      solution: 'Forward = 1.30 × (1.04/1.07) ≈ 1.30 × 0.9720 ≈ 1.264.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Inverting the ratio (foreign rate over domestic rate) instead of domestic over foreign.',
      tags: ['irp', 'forward-fx']
    },
    {
      id: 'ib_b087', topic: 'Currencies & Derivatives', subtopic: 'Spot/forward FX & IRP', difficulty: 2, targetTime: 60,
      prompt: 'A currency has a HIGHER interest rate than its counterpart currency. Under Interest Rate Parity, how does it typically trade in the forward market relative to spot?',
      answerType: 'mc', options: ['At a forward premium (stronger)', 'At a forward discount (weaker)', 'Exactly at the spot rate', 'IRP does not apply to interest rate differences'], correctAnswer: 'At a forward discount (weaker)',
      hint: 'Think about what prevents a riskless arbitrage between the two currencies.',
      approach: 'The higher-rate currency must trade at a forward discount to prevent covered interest arbitrage.',
      solution: 'The higher-interest-rate currency trades at a forward discount, offsetting its rate advantage so that no risk-free arbitrage profit is available from borrowing low and investing high.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming a higher interest rate currency should trade at a forward premium instead of a discount.',
      tags: ['irp']
    },
    {
      id: 'ib_b088', topic: 'Currencies & Derivatives', subtopic: 'Spot/forward FX & IRP', difficulty: 3, targetTime: 90,
      prompt: 'Why is it incorrect to interpret the forward FX rate as the market\'s forecast of the future spot rate?',
      answerType: 'mc', options: [
        'The forward rate actually is always an accurate forecast of the future spot rate',
        'The forward rate is mechanically derived from the current interest rate differential via Interest Rate Parity, a no-arbitrage pricing relationship, not a prediction of where the spot rate will actually be',
        'Forward rates are set randomly with no underlying logic',
        'Forward rates only exist for currencies with identical interest rates'
      ], correctAnswer: 'The forward rate is mechanically derived from the current interest rate differential via Interest Rate Parity, a no-arbitrage pricing relationship, not a prediction of where the spot rate will actually be',
      hint: 'Think about what actually determines the forward rate mathematically.',
      approach: 'IRP ties the forward rate to today\'s interest rates, not to any forecast.',
      solution: 'The forward rate is set by IRP to prevent arbitrage based on TODAY\'s interest rate differential — it reflects current rates, not necessarily anyone\'s actual expectation of the future spot rate.',
      recognitionTechnique: 'Other', commonTrap: 'Conflating a mechanically-derived forward discount/premium with a market forecast.',
      tags: ['irp']
    },

    /* ---------------------- FX drivers ---------------------- */
    {
      id: 'ib_b089', topic: 'Currencies & Derivatives', subtopic: 'FX drivers', difficulty: 2, targetTime: 60,
      prompt: 'All else equal, what tends to happen to a currency when its central bank unexpectedly raises interest rates?',
      answerType: 'mc', options: ['It tends to weaken', 'It tends to strengthen, as higher rates attract capital inflows', 'Interest rates have no effect on currency values', 'It becomes fixed to another currency'], correctAnswer: 'It tends to strengthen, as higher rates attract capital inflows',
      hint: 'Think about where capital flows when a currency offers a better return.',
      approach: 'Higher rates attract capital seeking a better return, increasing demand for that currency.',
      solution: 'A higher interest rate makes holding that currency more attractive to investors seeking yield, increasing demand and typically strengthening it, all else equal.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming interest rates have no bearing on currency demand.',
      tags: ['fx-drivers']
    },
    {
      id: 'ib_b090', topic: 'Currencies & Derivatives', subtopic: 'FX drivers', difficulty: 2, targetTime: 60,
      prompt: 'A country runs a persistent, large trade deficit. All else equal, what does this tend to do to its currency over time?',
      answerType: 'mc', options: ['Strengthen it over time', 'Weaken it over time, due to continuously supplying more currency to pay for imports', 'Have no effect at all', 'Automatically cause a default'], correctAnswer: 'Weaken it over time, due to continuously supplying more currency to pay for imports',
      hint: 'Think about what a trade deficit requires the country to keep doing with its own currency.',
      approach: 'A trade deficit means continuously supplying more domestic currency to pay for excess imports.',
      solution: 'Financing a persistent trade deficit requires continuously supplying more of the domestic currency internationally to pay for excess imports, which tends to weaken it over time, all else equal.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming trade balances have no bearing on currency value.',
      tags: ['fx-drivers']
    },
    {
      id: 'ib_b091', topic: 'Currencies & Derivatives', subtopic: 'FX drivers', difficulty: 3, targetTime: 90,
      prompt: 'A currency strengthens sharply during a global risk-off event, despite that country currently running a modest trade deficit and having unremarkable interest rates. What best explains this?',
      answerType: 'mc', options: [
        'This outcome is impossible and indicates an error',
        'Safe-haven flows — investors seeking safety and liquidity during stress — can dominate and overwhelm the currency\'s usual trade-balance or rate-driven dynamics, at least in the short run',
        'Trade deficits always cause a currency to strengthen',
        'Risk-off events always weaken every currency equally'
      ], correctAnswer: 'Safe-haven flows — investors seeking safety and liquidity during stress — can dominate and overwhelm the currency\'s usual trade-balance or rate-driven dynamics, at least in the short run',
      hint: 'Multiple FX drivers act simultaneously — which one might dominate during acute market stress?',
      approach: 'Identify which driver is most likely to dominate during a risk-off event specifically.',
      solution: 'During acute global risk-off periods, flight-to-safety flows toward perceived safe-haven currencies can dominate and overwhelm the currency\'s usual trade-balance or interest-rate-driven dynamics, at least in the short run.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming only one FX driver can ever be relevant at a time, ignoring that multiple forces act simultaneously with varying dominance.',
      tags: ['fx-drivers']
    },

    /* ---------------------- Options mechanics ---------------------- */
    {
      id: 'ib_b092', topic: 'Currencies & Derivatives', subtopic: 'Options mechanics', difficulty: 2, targetTime: 60,
      prompt: 'A call option has a $70 strike. The underlying is currently at $85. What is its intrinsic value?',
      answerType: 'numeric', correctAnswer: 15, tolerance: 0.5,
      hint: 'Call intrinsic value = max(underlying − strike, 0).',
      approach: 'Subtract the strike from the underlying price, floored at zero.',
      solution: 'Intrinsic value = max(85 − 70, 0) = $15.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Subtracting in the wrong direction (strike minus underlying) for a call.',
      tags: ['options', 'intrinsic-value']
    },
    {
      id: 'ib_b093', topic: 'Currencies & Derivatives', subtopic: 'Options mechanics', difficulty: 2, targetTime: 60,
      prompt: 'What is the maximum possible loss for an option BUYER (holder), regardless of how unfavorably the underlying moves?',
      answerType: 'mc', options: ['Unlimited, the same as the seller', 'The premium paid for the option', 'Always exactly zero', 'The full value of the underlying asset'], correctAnswer: 'The premium paid for the option',
      hint: 'The buyer holds a right, not an obligation.',
      approach: 'The buyer can always simply let an unfavorable option expire worthless.',
      solution: 'Since the buyer holds a right, not an obligation, they can always let an unfavorable option expire worthless, capping their total loss at the premium already paid.',
      recognitionTechnique: 'Other', commonTrap: 'Confusing the buyer\'s capped risk with the seller\'s potentially unlimited risk.',
      tags: ['options']
    },
    {
      id: 'ib_b094', topic: 'Currencies & Derivatives', subtopic: 'Options mechanics', difficulty: 3, targetTime: 90,
      prompt: 'An option\'s premium is $9, and its intrinsic value is currently $6. What does the remaining $3 represent?',
      answerType: 'mc', options: [
        'A pricing error that will be corrected immediately',
        'The option\'s time value, which decays toward zero as expiration approaches',
        'Additional intrinsic value not yet recognized',
        'This only applies to put options, never calls'
      ], correctAnswer: 'The option\'s time value, which decays toward zero as expiration approaches',
      hint: 'Premium = intrinsic value + time value.',
      approach: 'Subtract intrinsic value from the total premium to isolate time value.',
      solution: 'Premium = intrinsic value + time value, so the remaining $3 is the option\'s time value, which decays toward zero as expiration approaches (time decay).',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Assuming the entire premium is intrinsic value with no separate time-value component.',
      tags: ['options', 'time-value']
    },

    /* ---------------------- Forwards, futures, swaps ---------------------- */
    {
      id: 'ib_b095', topic: 'Currencies & Derivatives', subtopic: 'Forwards, futures, swaps', difficulty: 2, targetTime: 60,
      prompt: 'What is the key structural difference between a forward and a futures contract?',
      answerType: 'mc', options: [
        'They are identical in every respect',
        'A futures contract is standardized, exchange-traded, and marked-to-market daily; a forward is a private, customized OTC agreement settled only at the final date',
        'Forwards are always larger in size than futures',
        'Futures never have an expiration date'
      ], correctAnswer: 'A futures contract is standardized, exchange-traded, and marked-to-market daily; a forward is a private, customized OTC agreement settled only at the final date',
      hint: 'Think about standardization, exchange trading, and settlement frequency.',
      approach: 'Compare the defining structural features of each instrument.',
      solution: 'Futures are standardized, exchange-traded, and settled daily via mark-to-market; forwards are private, customizable OTC agreements with no interim settlement, carrying more counterparty risk.',
      recognitionTechnique: 'Other', commonTrap: 'Treating "forward" and "future" as interchangeable terms.',
      tags: ['forwards-futures']
    },
    {
      id: 'ib_b096', topic: 'Currencies & Derivatives', subtopic: 'Forwards, futures, swaps', difficulty: 2, targetTime: 60,
      prompt: 'In a standard interest rate swap, what is actually exchanged between the two parties on the notional principal amount?',
      answerType: 'mc', options: [
        'The full notional principal itself, at the start of the swap',
        'Only the interest payments (e.g., fixed for floating) calculated on the notional — the notional itself is never exchanged',
        'Nothing is ever exchanged in a swap',
        'Only the notional principal, at the end of the swap, with no interim payments'
      ], correctAnswer: 'Only the interest payments (e.g., fixed for floating) calculated on the notional — the notional itself is never exchanged',
      hint: 'The notional is a reference amount, not a transferred sum.',
      approach: 'Identify what is actually exchanged versus what is merely a calculation base.',
      solution: 'The notional principal is purely a reference amount used to calculate the periodic interest cash flows exchanged between the parties; it is never itself transferred.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming the notional principal itself changes hands, like in a loan.',
      tags: ['swaps']
    },
    {
      id: 'ib_b097', topic: 'Currencies & Derivatives', subtopic: 'Forwards, futures, swaps', difficulty: 3, targetTime: 90,
      prompt: 'A company with floating-rate debt enters a swap to pay fixed and receive floating on a notional equal to its debt balance. How does this convert its effective interest rate exposure to fixed, without modifying the underlying loan?',
      answerType: 'mc', options: [
        'It does not actually change anything about the company\'s exposure',
        'The floating payments received from the swap offset the floating interest actually owed on the debt, leaving the company\'s net cash outflow equal to just the fixed rate paid in the swap',
        'The swap automatically refinances the underlying loan into a fixed-rate loan',
        'Swaps can only be used to change currency exposure, never interest rate exposure'
      ], correctAnswer: 'The floating payments received from the swap offset the floating interest actually owed on the debt, leaving the company\'s net cash outflow equal to just the fixed rate paid in the swap',
      hint: 'The swap\'s floating leg is designed to cancel out the debt\'s floating interest payments.',
      approach: 'Net the swap\'s floating receipt against the debt\'s floating interest expense.',
      solution: 'The floating-rate payments received from the swap roughly cancel the floating interest owed on the debt, leaving the company effectively paying only the fixed rate agreed in the swap, entirely through the swap\'s cash flows.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming a swap must modify the terms of the underlying loan itself to change exposure.',
      tags: ['swaps']
    },

    /* ---------------------- Hedging strategies ---------------------- */
    {
      id: 'ib_b098', topic: 'Currencies & Derivatives', subtopic: 'Hedging strategies', difficulty: 2, targetTime: 60,
      prompt: 'A forward/futures hedge locks in a future rate. What is the key tradeoff of this approach?',
      answerType: 'mc', options: [
        'It requires paying a premium but offers no protection',
        'It provides complete symmetric certainty — no downside risk, but also no ability to benefit from a favorable market move',
        'It only protects against downside, never against upside forgone',
        'It provides protection with no tradeoff of any kind'
      ], correctAnswer: 'It provides complete symmetric certainty — no downside risk, but also no ability to benefit from a favorable market move',
      hint: 'Locking in a rate works in both directions.',
      approach: 'A forward hedge eliminates uncertainty symmetrically.',
      solution: 'Locking in a rate via a forward/future removes uncertainty in BOTH directions — protection from an unfavorable move comes paired with giving up any favorable move.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming a forward hedge only protects against downside with no cost to potential upside.',
      tags: ['hedging']
    },
    {
      id: 'ib_b099', topic: 'Currencies & Derivatives', subtopic: 'Hedging strategies', difficulty: 3, targetTime: 90,
      prompt: 'Why is it incorrect to conclude that a forward hedge is simply "better" than an options hedge because it has no upfront premium cost?',
      answerType: 'mc', options: [
        'This conclusion is actually correct in every case',
        'The forward\'s lack of an upfront cost comes paired with giving up ALL potential upside from a favorable market move, a real economic cost that only becomes apparent after the fact',
        'Options hedges are always cheaper than forward hedges once all costs are considered',
        'Forward hedges never actually provide any real protection'
      ], correctAnswer: 'The forward\'s lack of an upfront cost comes paired with giving up ALL potential upside from a favorable market move, a real economic cost that only becomes apparent after the fact',
      hint: 'Think about the hidden opportunity cost of a "free" hedge.',
      approach: 'A complete cost comparison must include the forgone-upside cost of a forward.',
      solution: 'The forward\'s "free" hedge has a real, sometimes large, hidden opportunity cost (forgone upside) that only becomes visible if the market later moves favorably — a complete comparison must weigh this against the option\'s visible upfront premium.',
      recognitionTechnique: 'Other', commonTrap: 'Comparing only the visible upfront cost of each hedge, ignoring the forward\'s hidden opportunity cost.',
      tags: ['hedging']
    },
    {
      id: 'ib_b100', topic: 'Currencies & Derivatives', subtopic: 'Hedging strategies', difficulty: 2, targetTime: 60,
      prompt: 'A company buys a put option to hedge against a price decline in an asset it holds. If the asset\'s price RISES instead, what happens?',
      answerType: 'mc', options: [
        'The company is forced to sell at the lower strike price anyway',
        'The company simply lets the put expire unused, losing only the premium paid, and keeps the benefit of the higher price',
        'The company must pay an additional penalty',
        'The put automatically converts into a forward contract'
      ], correctAnswer: 'The company simply lets the put expire unused, losing only the premium paid, and keeps the benefit of the higher price',
      hint: 'An option is a right, not an obligation.',
      approach: 'If exercising would be unfavorable, the holder simply lets the option expire.',
      solution: 'Since the put is a right, not an obligation, the company lets it expire unused if the price rose (exercising would be unfavorable), losing only the premium while keeping the full benefit of the higher price.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming an option obligates its holder to exercise regardless of favorability.',
      tags: ['hedging', 'options']
    },

    /* ---------------------- Merger types ---------------------- */
    {
      id: 'ib_b101', topic: 'M&A Mechanics', subtopic: 'Merger types', difficulty: 2, targetTime: 60,
      prompt: 'A merger between two direct competitors in the same industry is classified as:',
      answerType: 'mc', options: ['Vertical', 'Horizontal', 'Conglomerate', 'None of these classifications apply to competitors'], correctAnswer: 'Horizontal',
      hint: 'Think about the relationship between the two companies\' businesses.',
      approach: 'Horizontal mergers combine direct competitors in the same market.',
      solution: 'Horizontal mergers specifically combine companies that compete directly in the same industry and market.',
      recognitionTechnique: 'Other', commonTrap: 'Confusing horizontal (competitors) with vertical (supply-chain) mergers.',
      tags: ['merger-types']
    },
    {
      id: 'ib_b102', topic: 'M&A Mechanics', subtopic: 'Merger types', difficulty: 2, targetTime: 60,
      prompt: 'A retailer acquires one of its own key suppliers. What type of merger is this, and what direction of integration does it represent?',
      answerType: 'mc', options: ['Horizontal', 'Vertical (backward integration)', 'Vertical (forward integration)', 'Conglomerate'], correctAnswer: 'Vertical (backward integration)',
      hint: 'Acquiring a supplier moves the acquirer upstream in its own supply chain.',
      approach: 'Vertical mergers combine different stages of the same supply chain; acquiring upstream is backward integration.',
      solution: 'Acquiring a supplier moves the retailer upstream in its own supply chain — this is vertical, backward integration.',
      recognitionTechnique: 'Other', commonTrap: 'Confusing backward integration (acquiring a supplier) with forward integration (acquiring a distributor or customer).',
      tags: ['merger-types']
    },
    {
      id: 'ib_b103', topic: 'M&A Mechanics', subtopic: 'Merger types', difficulty: 3, targetTime: 90,
      prompt: 'Why do conglomerate mergers, despite typically facing the LEAST antitrust scrutiny of the three merger types, often draw the most skepticism from investors and analysts?',
      answerType: 'mc', options: [
        'Conglomerate mergers are always illegal',
        'Clear operational synergies are much harder to identify between unrelated businesses, and the acquirer often lacks genuine expertise in the new, unrelated industry',
        'Conglomerate mergers never actually close',
        'Investors always prefer conglomerate mergers over the other two types'
      ], correctAnswer: 'Clear operational synergies are much harder to identify between unrelated businesses, and the acquirer often lacks genuine expertise in the new, unrelated industry',
      hint: 'Think about the strategic rationale (or lack thereof) for combining unrelated businesses.',
      approach: 'Diversification alone is a weaker strategic rationale than market-share or supply-chain logic.',
      solution: 'Without a competitive or supply-chain relationship, clear operational synergies are harder to identify, and the acquirer often lacks deep expertise in the new industry, adding execution risk.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming lower antitrust scrutiny means a deal is automatically well-received by investors.',
      tags: ['merger-types']
    },

    /* ---------------------- Takeover defenses ---------------------- */
    {
      id: 'ib_b104', topic: 'M&A Mechanics', subtopic: 'Takeover defenses', difficulty: 2, targetTime: 60,
      prompt: 'A "poison pill" defense works by:',
      answerType: 'mc', options: ['Directly suing the hostile acquirer', 'Granting existing shareholders (other than the acquirer) the right to buy additional shares at a steep discount once an ownership threshold is crossed, diluting the acquirer\'s stake', 'Automatically firing the target\'s entire management team', 'Requiring the acquirer to pay a fine to the government'], correctAnswer: 'Granting existing shareholders (other than the acquirer) the right to buy additional shares at a steep discount once an ownership threshold is crossed, diluting the acquirer\'s stake',
      hint: 'Think about what happens to the hostile acquirer\'s ownership percentage.',
      approach: 'A poison pill dilutes the hostile acquirer\'s stake once a threshold is crossed without board approval.',
      solution: 'A poison pill grants other shareholders the right to buy discounted shares once a threshold is crossed, massively diluting the hostile acquirer\'s stake and deterring the takeover.',
      recognitionTechnique: 'Other', commonTrap: 'Confusing a poison pill with a lawsuit or a direct management termination.',
      tags: ['takeover-defenses']
    },
    {
      id: 'ib_b105', topic: 'M&A Mechanics', subtopic: 'Takeover defenses', difficulty: 2, targetTime: 60,
      prompt: 'What is a "staggered board" defense designed to prevent?',
      answerType: 'mc', options: ['Any board elections from ever occurring', 'A hostile acquirer with enough votes from replacing the ENTIRE board in a single election cycle', 'The company from ever being acquired under any circumstances', 'Shareholders from voting at all'], correctAnswer: 'A hostile acquirer with enough votes from replacing the ENTIRE board in a single election cycle',
      hint: 'Only a fraction of directors is up for election each year.',
      approach: 'Staggering board terms slows a hostile takeover of board control.',
      solution: 'By only allowing a fraction of directors up for election each year, a staggered board prevents an immediate full board takeover, forcing a multi-year campaign instead.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming a staggered board makes elections impossible rather than merely staggered.',
      tags: ['takeover-defenses']
    },
    {
      id: 'ib_b106', topic: 'M&A Mechanics', subtopic: 'Takeover defenses', difficulty: 3, targetTime: 90,
      prompt: 'Why might a "golden parachute" actually help shareholders, despite sometimes being criticized as enriching management?',
      answerType: 'mc', options: [
        'It never has any positive effect on shareholders',
        'By removing executives\' personal financial disincentive to lose their jobs, it can reduce the temptation for entrenched management to fight a genuinely value-creating deal purely for self-preservation',
        'It guarantees the deal price will always be higher',
        'Golden parachutes are illegal in every jurisdiction'
      ], correctAnswer: 'By removing executives\' personal financial disincentive to lose their jobs, it can reduce the temptation for entrenched management to fight a genuinely value-creating deal purely for self-preservation',
      hint: 'Think about what motivates management to resist a deal that might otherwise benefit shareholders.',
      approach: 'A golden parachute can align management incentives with shareholders by removing a personal cost of losing their job.',
      solution: 'Without a golden parachute, executives might resist a value-creating deal purely out of self-interest; the parachute removes that personal financial disincentive, potentially aligning management\'s incentives with shareholders\'.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming golden parachutes only ever harm shareholder interests.',
      tags: ['takeover-defenses']
    },

    /* ---------------------- Stock vs cash consideration ---------------------- */
    {
      id: 'ib_b107', topic: 'M&A Mechanics', subtopic: 'Stock vs cash consideration', difficulty: 2, targetTime: 60,
      prompt: 'A deal offers a 0.6 exchange ratio, and the acquirer trades at $95. What is the implied per-share value for a target shareholder at announcement?',
      answerType: 'numeric', correctAnswer: 57, tolerance: 0.5,
      hint: 'Implied value = exchange ratio × acquirer share price.',
      approach: 'Multiply the exchange ratio by the acquirer\'s current share price.',
      solution: 'Implied value = 0.6 × 95 = $57.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Dividing instead of multiplying the exchange ratio by the acquirer share price.',
      tags: ['stock-vs-cash']
    },
    {
      id: 'ib_b108', topic: 'M&A Mechanics', subtopic: 'Stock vs cash consideration', difficulty: 2, targetTime: 60,
      prompt: 'In an all-CASH acquisition, what happens to target shareholders from a tax perspective?',
      answerType: 'mc', options: ['They face no tax consequences at all', 'They immediately realize a taxable capital gain or loss when the deal closes', 'Taxes are deferred indefinitely, exactly like a stock deal', 'Only the acquirer pays any tax in a cash deal'], correctAnswer: 'They immediately realize a taxable capital gain or loss when the deal closes',
      hint: 'Cash consideration is treated as an immediate sale.',
      approach: 'Receiving cash for shares realizes a taxable event right away.',
      solution: 'Receiving cash for shares is treated as an immediate sale, realizing a taxable capital gain or loss in the year the deal closes.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming cash consideration is tax-deferred like stock consideration.',
      tags: ['stock-vs-cash']
    },
    {
      id: 'ib_b109', topic: 'M&A Mechanics', subtopic: 'Stock vs cash consideration', difficulty: 3, targetTime: 90,
      prompt: 'A target shareholder accepts an all-stock deal at an announced implied value of $60/share, but the acquirer\'s stock falls sharply before the deal closes. What actually happens to the value the shareholder ultimately receives?',
      answerType: 'mc', options: [
        'The shareholder is guaranteed to still receive exactly $60/share worth of value regardless of the stock price move',
        'The value the shareholder actually receives falls, since it is based on the exchange ratio applied to the acquirer\'s ACTUAL share price at closing, not the price at announcement',
        'The deal is automatically canceled if the acquirer\'s stock falls',
        'The target company must pay the shareholder the difference in cash'
      ], correctAnswer: 'The value the shareholder actually receives falls, since it is based on the exchange ratio applied to the acquirer\'s ACTUAL share price at closing, not the price at announcement',
      hint: 'Stock consideration value is not locked in at announcement.',
      approach: 'The realized value in a stock deal fluctuates with the acquirer\'s actual share price.',
      solution: 'Stock consideration value fluctuates with the acquirer\'s share price up to (and after) closing — the announced implied value is not a locked-in guarantee, unlike cash.',
      recognitionTechnique: 'Other', commonTrap: 'Treating the announcement-date implied value of a stock deal as a fixed, guaranteed outcome.',
      tags: ['stock-vs-cash']
    },

    /* ---------------------- Control premium ---------------------- */
    {
      id: 'ib_b110', topic: 'M&A Mechanics', subtopic: 'Control premium', difficulty: 2, targetTime: 60,
      prompt: 'A company\'s undisturbed stock price is $55/share. An acquirer offers $71.50/share for full control. What is the control premium?',
      answerType: 'numeric', correctAnswer: 30, tolerance: 1,
      hint: 'Control premium = (offer price / undisturbed price − 1) × 100.',
      approach: 'Divide the offer price by the undisturbed price, subtract 1, convert to a percentage.',
      solution: 'Control premium = (71.50/55 − 1) × 100 = 30%.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Computing the premium as a simple dollar difference instead of a percentage.',
      tags: ['control-premium']
    },
    {
      id: 'ib_b111', topic: 'M&A Mechanics', subtopic: 'Control premium', difficulty: 3, targetTime: 90,
      prompt: 'Trading comps for an industry show a 7× median multiple; precedent transactions show 9.5× median. What best explains this gap?',
      answerType: 'mc', options: [
        'One of the two multiples must be a calculation error',
        'The precedent transactions embed a control premium not present in ordinary minority-stake trading comps, for otherwise similar underlying business fundamentals',
        'Precedent transactions always involve completely different types of companies',
        'The gap is random and carries no systematic explanation'
      ], correctAnswer: 'The precedent transactions embed a control premium not present in ordinary minority-stake trading comps, for otherwise similar underlying business fundamentals',
      hint: 'Think about what precedent transactions reflect that trading comps do not.',
      approach: 'Precedent transaction multiples embed the control premium acquirers actually paid.',
      solution: 'This is the expected, systematic fingerprint of control-premium economics: precedent transactions reflect what acquirers paid for CONTROL, while trading comps reflect ordinary minority-stake pricing.',
      recognitionTechnique: 'Other', commonTrap: 'Treating the gap between the two multiples as a calculation error rather than an expected structural difference.',
      tags: ['control-premium']
    },
    {
      id: 'ib_b112', topic: 'M&A Mechanics', subtopic: 'Control premium', difficulty: 3, targetTime: 90,
      prompt: 'An analyst is valuing a company on a STAND-ALONE, minority-shareholder basis, with no acquisition actually occurring. Should they benchmark against trading comps or precedent transactions?',
      answerType: 'mc', options: [
        'Precedent transactions, since real acquirers\' prices are always more reliable',
        'Trading comps, since these reflect ordinary minority-stake pricing that matches the stand-alone valuation being performed, without improperly embedding an unearned control premium',
        'It makes no difference which is used',
        'Neither approach is valid for a stand-alone valuation'
      ], correctAnswer: 'Trading comps, since these reflect ordinary minority-stake pricing that matches the stand-alone valuation being performed, without improperly embedding an unearned control premium',
      hint: 'Match the benchmark to whether control is actually being transferred.',
      approach: 'Use trading comps for minority-stake valuations, precedent transactions for control valuations.',
      solution: 'Using a control-inclusive precedent transaction multiple for a non-control, stand-alone valuation would improperly inflate the value with a control premium that does not actually apply.',
      recognitionTechnique: 'Other', commonTrap: 'Using precedent transaction multiples for a valuation where no change of control is actually occurring.',
      tags: ['control-premium']
    },

    /* ---------------------- Earnouts & NWC adjustments ---------------------- */
    {
      id: 'ib_b113', topic: 'M&A Mechanics', subtopic: 'Earnouts & NWC adjustments', difficulty: 2, targetTime: 60,
      prompt: 'A deal assumes $18m of target NWC. Actual closing NWC comes in at $21m. What happens to the purchase price paid to the seller?',
      answerType: 'numeric', correctAnswer: 3, tolerance: 0.2,
      hint: 'The seller is paid more if actual NWC exceeds the target.',
      approach: 'Purchase price adjustment = actual NWC − target NWC.',
      solution: 'Adjustment = 21 − 18 = $3m additional payment to the seller, since more working capital was delivered than assumed.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Assuming excess NWC delivered reduces the price rather than increasing it.',
      tags: ['nwc-adjustment']
    },
    {
      id: 'ib_b114', topic: 'M&A Mechanics', subtopic: 'Earnouts & NWC adjustments', difficulty: 2, targetTime: 60,
      prompt: 'An "earnout" makes part of the purchase price contingent on:',
      answerType: 'mc', options: ['The buyer\'s stock price after closing', 'The target business achieving specific future performance milestones after the deal has closed', 'How quickly the deal\'s legal paperwork is completed', 'The seller\'s personal creditworthiness'], correctAnswer: 'The target business achieving specific future performance milestones after the deal has closed',
      hint: 'Earnouts are tied to the acquired business\'s own future performance.',
      approach: 'Earnouts pay out contingent on the target hitting revenue or EBITDA milestones.',
      solution: 'Earnouts are tied specifically to the acquired business\'s own future performance (commonly revenue or EBITDA targets), paid out if those targets are met.',
      recognitionTechnique: 'Other', commonTrap: 'Confusing an earnout with a stock-price-contingent payment or an unrelated legal condition.',
      tags: ['earnouts']
    },
    {
      id: 'ib_b115', topic: 'M&A Mechanics', subtopic: 'Earnouts & NWC adjustments', difficulty: 3, targetTime: 90,
      prompt: 'Why are earnouts especially common when buyer and seller genuinely disagree about a target\'s future growth prospects?',
      answerType: 'mc', options: [
        'Earnouts eliminate any need for the parties to agree on anything',
        'An earnout lets the seller "bet on themselves" via a contingent future payment, bridging the valuation gap without either side simply having to accept the other\'s assumptions upfront',
        'Earnouts are legally required whenever there is any disagreement',
        'Earnouts guarantee the seller a higher price no matter what happens'
      ], correctAnswer: 'An earnout lets the seller "bet on themselves" via a contingent future payment, bridging the valuation gap without either side simply having to accept the other\'s assumptions upfront',
      hint: 'Think about how deferring part of the price resolves a forecasting disagreement.',
      approach: 'An earnout defers part of the price to let the future outcome resolve the disagreement.',
      solution: 'Deferring part of the price to a future, performance-contingent payment lets both sides avoid resolving a genuine forecasting disagreement immediately and upfront.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming an earnout guarantees the seller extra money regardless of actual performance.',
      tags: ['earnouts']
    }
  ];

  items.forEach((q) => { q.track = 'ib'; });
  global.QTL_BANK.addMany(items);
})(window);
