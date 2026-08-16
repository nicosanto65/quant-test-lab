/* QUANT TEST LAB — WEALTH MANAGEMENT TRACK curated bank.
   Asset allocation logic, suitability/risk profiling, tax & liquidity
   planning, and alternative investments from a client's perspective.
   Loaded after bank.js — appends into the SAME QTL_BANK.questions array via
   addMany(), tagged track:'wm'. */
(function (global) {
  'use strict';

  const items = [

    /* ---------------------- ASSET ALLOCATION ---------------------- */
    {
      id: 'wm_b001', topic: 'Asset Allocation', subtopic: 'Diversification', difficulty: 2, targetTime: 60,
      prompt: 'A client owns 60 different individual technology stocks and believes this makes them "fully diversified." What key risk remains largely UNADDRESSED by this strategy?',
      answerType: 'mc', options: ['Company-specific risk (a single company having bad news)', 'Risk common to the entire technology sector/asset class', 'Currency risk on foreign holdings', 'None — this client is fully diversified'], correctAnswer: 'Risk common to the entire technology sector/asset class',
      hint: 'All 60 stocks belong to the same sector and the same asset class.',
      approach: 'Diversifying WITHIN a sector or asset class only removes company-specific risk, not risk shared by the whole group.',
      solution: 'Since all 60 holdings are technology stocks, a downturn hitting the tech sector broadly (or equities generally) will affect nearly all of them at once — true diversification requires spreading across asset classes and sectors that do not all move together.',
      recognitionTechnique: 'Other', commonTrap: 'Equating "many individual holdings" with "true diversification," without checking whether those holdings share a common, undiversified risk.',
      tags: ['diversification']
    },
    {
      id: 'wm_b002', topic: 'Asset Allocation', subtopic: 'Diversification', difficulty: 2, targetTime: 45,
      prompt: 'Which pair of terms correctly matches "the decision to split wealth across broad categories" versus "the decision of which individual securities to buy within one category"?',
      answerType: 'mc', options: ['Security selection; asset allocation', 'Asset allocation; security selection', 'Tactical allocation; strategic allocation', 'Rebalancing; diversification'], correctAnswer: 'Asset allocation; security selection',
      hint: 'One term is about the broad mix; the other is about the specific picks within it.',
      approach: 'Asset allocation = across categories. Security selection = within a category.',
      solution: 'Asset allocation is the split across broad categories (equities, bonds, cash...); security selection is choosing specific holdings within one of those categories.',
      recognitionTechnique: 'Other', commonTrap: 'Mixing up which term refers to the broad, top-level decision versus the more granular one.',
      tags: ['terminology']
    },
    {
      id: 'wm_b003', topic: 'Asset Allocation', subtopic: 'Rebalancing', difficulty: 3, targetTime: 75,
      prompt: 'A portfolio\'s strategic target is 50% equities / 50% bonds. After a strong bond rally and flat equities, the portfolio drifts to 42% equities / 58% bonds. What does rebalancing back to target require?',
      answerType: 'mc', options: ['Selling bonds and buying equities', 'Selling equities and buying bonds', 'Selling everything and moving to cash', 'Doing nothing, since bonds performed well'], correctAnswer: 'Selling bonds and buying equities',
      hint: 'Whichever asset class grew ABOVE its target needs to be trimmed; whichever fell below needs to be topped up.',
      approach: 'Rebalancing sells the now-overweight asset class and buys the now-underweight one, restoring the original target.',
      solution: 'Bonds are now overweight (58% vs 50% target) and equities are underweight (42% vs 50% target), so rebalancing means selling some bonds and buying more equities.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Assuming rebalancing always means selling equities — it depends entirely on which asset class has actually drifted above its target.',
      tags: ['rebalancing']
    },
    {
      id: 'wm_b004', topic: 'Asset Allocation', subtopic: 'Strategic vs tactical', difficulty: 3, targetTime: 75,
      prompt: 'An adviser temporarily overweights equities by 5 percentage points versus the client\'s long-run target, based on a view that valuations look attractive right now, planning to return to target once the view plays out. This is best described as:',
      answerType: 'mc', options: ['Rebalancing', 'A tactical allocation tilt', 'A change to the strategic allocation', 'A suitability violation'], correctAnswer: 'A tactical allocation tilt',
      hint: 'This is a deliberate, temporary deviation based on a specific market view — not a restoration of the existing target.',
      approach: 'Tactical allocation = deliberate, temporary deviation from the strategic target based on a market view.',
      solution: 'This is a tactical tilt: a temporary, view-driven deviation from the strategic target, distinct from rebalancing (which restores the target) or a permanent change to the strategic target itself.',
      recognitionTechnique: 'Other', commonTrap: 'Confusing a deliberate, view-based deviation (tactical) with rebalancing (which restores a target, requiring no market prediction).',
      tags: ['tactical-allocation']
    },
    {
      id: 'wm_b005', topic: 'Asset Allocation', subtopic: 'Diversification', difficulty: 2, targetTime: 60,
      prompt: 'During a recession, equities fall sharply while high-quality government bonds hold steady or rise. What does this illustrate?',
      answerType: 'mc', options: ['Bonds and equities always move in the same direction', 'Asset classes with low or negative correlation can offset each other, reducing overall portfolio swings', 'Diversification is impossible during a recession', 'Government bonds always outperform equities in every market environment'], correctAnswer: 'Asset classes with low or negative correlation can offset each other, reducing overall portfolio swings',
      hint: 'The two asset classes are behaving differently in this scenario — that difference is the point.',
      approach: 'Combining assets that do not move together shrinks portfolio-level risk below what either asset carries on its own.',
      solution: 'This is a real-world illustration of low/negative correlation between asset classes: when equities fall, bonds not falling (or rising) partially offsets the decline in a blended portfolio.',
      recognitionTechnique: 'Other', commonTrap: 'Overgeneralizing this specific historical pattern into an unconditional guarantee that bonds will always behave this way in every scenario.',
      tags: ['correlation']
    },
    {
      id: 'wm_b006', topic: 'Asset Allocation', subtopic: 'Rebalancing', difficulty: 3, targetTime: 75,
      prompt: 'Why is rebalancing sometimes described as a "sell high, buy low" discipline, achieved without predicting future returns?',
      answerType: 'mc', options: ['It requires correctly forecasting which asset will outperform next', 'It mechanically trims the asset class that has recently risen (relatively "high") and adds to the one that has lagged (relatively "low"), based only on restoring the agreed target', 'It always involves buying whatever asset class is currently most popular', 'It has nothing to do with buying or selling patterns'], correctAnswer: 'It mechanically trims the asset class that has recently risen (relatively "high") and adds to the one that has lagged (relatively "low"), based only on restoring the agreed target',
      hint: 'Rebalancing does not require any view about what will happen NEXT — only about restoring the PAST target.',
      approach: 'Restoring target weights mechanically requires trimming outperformers and adding to underperformers.',
      solution: 'Because rebalancing restores a fixed target weight, it automatically sells some of whatever recently outperformed and buys more of whatever recently lagged — a rough, automatic version of "sell high, buy low," with no prediction required.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming rebalancing requires forecasting skill, when it actually requires none — only a pre-agreed target.',
      tags: ['rebalancing']
    },
    {
      id: 'wm_b007', topic: 'Asset Allocation', subtopic: 'Correlation', difficulty: 3, targetTime: 75,
      prompt: 'A client holds two asset classes that are PERFECTLY positively correlated (correlation = +1). What diversification benefit do they provide when combined?',
      answerType: 'mc', options: ['Maximum diversification benefit possible', 'No diversification benefit at all — the combined portfolio risk is just the weighted average of the two individual risks', 'A guaranteed reduction in expected return', 'They cancel out completely, producing zero risk'], correctAnswer: 'No diversification benefit at all — the combined portfolio risk is just the weighted average of the two individual risks',
      hint: 'Recall the quant-track portfolio variance formula: at correlation = +1, there is no diversification benefit.',
      approach: 'Perfect positive correlation means the two assets always move together in the same direction and proportion, providing no offsetting effect.',
      solution: 'When correlation is exactly +1, the two asset classes always move in lockstep, so combining them provides no risk-reduction benefit — portfolio risk is just the simple weighted average of the two, unlike lower or negative correlation cases.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming that combining ANY two different asset classes automatically provides diversification benefit, regardless of their correlation.',
      tags: ['correlation']
    },
    {
      id: 'wm_b008', topic: 'Asset Allocation', subtopic: 'Strategic vs tactical', difficulty: 2, targetTime: 60,
      prompt: 'A client\'s strategic asset allocation is set primarily based on which of the following?',
      answerType: 'mc', options: ['Yesterday\'s market headlines', 'The client\'s risk profile, goals, and time horizon', 'Whichever asset class had the best return last year', 'The adviser\'s personal investment preferences'], correctAnswer: 'The client\'s risk profile, goals, and time horizon',
      hint: 'Strategic allocation is meant to be a durable, long-run policy specific to the client.',
      approach: 'Strategic allocation is derived from the client\'s own circumstances, not from short-term market conditions.',
      solution: 'The strategic allocation is meant to reflect the specific client\'s risk profile, goals and time horizon, and to be held through ordinary market ups and downs.',
      recognitionTechnique: 'Other', commonTrap: 'Confusing strategic (durable, client-specific) allocation with a tactical or performance-chasing decision.',
      tags: ['strategic-allocation']
    },
    {
      id: 'wm_b009', topic: 'Asset Allocation', subtopic: 'Diversification', difficulty: 4, targetTime: 90,
      prompt: 'A wealth manager explains that asset allocation historically explains the large majority of a diversified portfolio\'s long-run return and risk variation. What is the most direct practical implication for how an adviser should spend their time with a new client?',
      answerType: 'mc', options: ['Spend the overwhelming majority of effort picking the single best individual stocks', 'Spend the greater share of effort getting the broad allocation mix right for that client\'s specific situation, in addition to reasonable security selection', 'Security selection and allocation are equally unimportant', 'Ignore the client\'s risk profile entirely and focus only on recent market trends'], correctAnswer: 'Spend the greater share of effort getting the broad allocation mix right for that client\'s specific situation, in addition to reasonable security selection',
      hint: 'If one decision explains most of the variation in outcomes, it deserves a proportionate share of attention.',
      approach: 'Match effort to where the evidence says it matters most, without claiming security selection is worthless.',
      solution: 'Since the allocation decision explains most of the variation in long-run outcomes, it warrants the greater share of an adviser\'s attention and client-specific customization — though sound security selection still has some role.',
      recognitionTechnique: 'Other', commonTrap: 'Overcorrecting into "security selection never matters at all," when the research shows it matters LESS, not not-at-all.',
      tags: ['diversification']
    },
    {
      id: 'wm_b010', topic: 'Asset Allocation', subtopic: 'Rebalancing', difficulty: 2, targetTime: 60,
      prompt: 'Which of the following is a common rebalancing trigger?',
      answerType: 'mc', options: ['A fixed calendar schedule, or an asset class drifting beyond a set percentage threshold from its target', 'Only when the client explicitly demands it in a panic', 'Never — a portfolio should never be rebalanced once set', 'Only during a declared recession'], correctAnswer: 'A fixed calendar schedule, or an asset class drifting beyond a set percentage threshold from its target',
      hint: 'Rebalancing rules are usually set in advance, not reactive to news.',
      approach: 'Pre-agreed calendar or threshold rules keep rebalancing systematic rather than emotionally driven.',
      solution: 'Common approaches include rebalancing on a fixed schedule (e.g. annually) or whenever an asset class drifts beyond a pre-set threshold (e.g. 5 percentage points) from its target.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming rebalancing is an ad hoc, reactive decision rather than a systematic, pre-agreed discipline.',
      tags: ['rebalancing']
    },

    /* ---------------------- SUITABILITY & RISK PROFILING ---------------------- */
    {
      id: 'wm_b011', topic: 'Suitability & Risk Profiling', subtopic: 'Risk tolerance vs capacity', difficulty: 2, targetTime: 60,
      prompt: 'A client says they are "very comfortable" with large portfolio swings, but has minimal savings and would face genuine hardship from a large loss. Which factor should generally constrain the recommendation?',
      answerType: 'mc', options: ['Risk tolerance (the client\'s stated comfort)', 'Risk capacity (the client\'s objective financial ability to absorb loss)', 'Neither — always follow the client\'s exact stated wishes', 'The adviser\'s own personal risk preference'], correctAnswer: 'Risk capacity (the client\'s objective financial ability to absorb loss)',
      hint: 'When stated comfort and financial ability to absorb loss conflict, the more conservative one should generally govern.',
      approach: 'Suitability generally defers to the most conservative of tolerance, capacity, and horizon when they conflict.',
      solution: 'Even though the client feels comfortable with risk, their limited financial capacity means a large loss would cause real hardship — capacity should generally constrain the recommendation here.',
      recognitionTechnique: 'Other', commonTrap: 'Treating a client\'s stated comfort with risk as sufficient justification on its own, without checking whether their finances can actually support that risk.',
      tags: ['suitability']
    },
    {
      id: 'wm_b012', topic: 'Suitability & Risk Profiling', subtopic: 'Time horizon', difficulty: 2, targetTime: 45,
      prompt: 'Why does a client retiring in 2 years generally warrant a more conservative allocation than an otherwise-identical client retiring in 25 years?',
      answerType: 'mc', options: ['Older clients are always legally required to hold only bonds', 'A shorter time horizon leaves less time to recover from a downturn before the funds are actually needed', 'There is no meaningful difference — time horizon is irrelevant to allocation', 'Younger clients cannot invest in bonds'], correctAnswer: 'A shorter time horizon leaves less time to recover from a downturn before the funds are actually needed',
      hint: 'Think about what happens if a downturn strikes right before the money must be withdrawn.',
      approach: 'Shorter horizons reduce the time available to recover from a market decline before withdrawal.',
      solution: 'With only 2 years until retirement, a market downturn shortly before or during that window leaves little time to recover before the funds are needed — this argues for a more conservative allocation than a 25-year horizon would.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming time horizon is just about age rather than about how soon the funds will actually be needed.',
      tags: ['time-horizon']
    },
    {
      id: 'wm_b013', topic: 'Suitability & Risk Profiling', subtopic: 'Investment Policy Statement', difficulty: 3, targetTime: 75,
      prompt: 'What is the PRIMARY purpose of a written Investment Policy Statement?',
      answerType: 'mc', options: ['To serve as a marketing document for prospective clients', 'To serve as a stable, pre-agreed anchor documenting goals and target allocation, guarding against emotionally-driven changes during market swings', 'To guarantee a specific investment return', 'To satisfy a one-time paperwork requirement with no ongoing relevance'], correctAnswer: 'To serve as a stable, pre-agreed anchor documenting goals and target allocation, guarding against emotionally-driven changes during market swings',
      hint: 'Think about why it is created during a calm moment, in writing, in advance.',
      approach: 'An IPS records the plan before market stress hits, so it can be referenced during periods of fear or euphoria.',
      solution: 'The IPS documents the client\'s goals, risk profile and target allocation in a calmer moment, specifically to provide a stable reference point that helps avoid reactive, emotionally-driven decisions during market volatility.',
      recognitionTechnique: 'Other', commonTrap: 'Treating the IPS as a purely administrative document with no real behavioral or practical purpose.',
      tags: ['ips']
    },
    {
      id: 'wm_b014', topic: 'Suitability & Risk Profiling', subtopic: 'Investment Policy Statement', difficulty: 3, targetTime: 75,
      prompt: 'A client loses their job unexpectedly and now needs to draw on their portfolio much sooner than originally planned. Should this prompt revisiting the IPS?',
      answerType: 'mc', options: ['No, the IPS should never change once set', 'Yes — this is a genuine change in the client\'s actual circumstances (time horizon and capacity), exactly the kind of situation that should prompt an update', 'Only if the market is currently declining', 'The IPS is irrelevant to employment changes'], correctAnswer: 'Yes — this is a genuine change in the client\'s actual circumstances (time horizon and capacity), exactly the kind of situation that should prompt an update',
      hint: 'Distinguish a genuine change in circumstances from a purely emotional reaction to market noise.',
      approach: 'The IPS guards against reacting to market noise, not against updating in response to real changes in the client\'s life.',
      solution: 'A genuine change in the client\'s financial situation (job loss, changed time horizon) is precisely the kind of event that should prompt revisiting and updating the IPS — this is different from reacting to short-term market movement alone.',
      recognitionTechnique: 'Other', commonTrap: 'Treating the IPS as permanently fixed under all circumstances, when it should be updated for genuine life changes.',
      tags: ['ips']
    },
    {
      id: 'wm_b015', topic: 'Suitability & Risk Profiling', subtopic: 'Risk tolerance vs capacity', difficulty: 3, targetTime: 75,
      prompt: 'A client has very high risk capacity (substantial financial resources, long horizon) but describes genuine anxiety about volatility from a past bad experience. What is the most suitable approach?',
      answerType: 'mc', options: ['Ignore the stated anxiety entirely and recommend the most aggressive allocation their capacity supports', 'Take the psychological discomfort seriously too — an overly aggressive portfolio risks the client panic-selling during a downturn', 'Refuse to manage the account', 'Recommend an all-cash portfolio regardless of capacity or horizon'], correctAnswer: 'Take the psychological discomfort seriously too — an overly aggressive portfolio risks the client panic-selling during a downturn',
      hint: 'A technically "optimal" portfolio the client cannot emotionally hold through a downturn is not actually suitable in practice.',
      approach: 'Suitability requires respecting genuine risk tolerance alongside capacity and horizon, not overriding it just because capacity is favorable.',
      solution: 'Even with high capacity, ignoring genuine psychological discomfort risks the client abandoning the strategy (panic-selling) at the worst possible time — a suitable recommendation should account for all three factors together.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming that favorable capacity alone justifies maximum aggressiveness, without regard for the client\'s actual ability to stay invested through volatility.',
      tags: ['suitability']
    },
    {
      id: 'wm_b016', topic: 'Suitability & Risk Profiling', subtopic: 'Risk tolerance vs capacity', difficulty: 2, targetTime: 60,
      prompt: 'Which of the following is an example of "risk CAPACITY" rather than "risk TOLERANCE"?',
      answerType: 'mc', options: ['A client saying they feel comfortable with big swings', 'A client having a large emergency reserve and stable income, allowing them to absorb a temporary large loss without real hardship', 'A client\'s general enthusiasm for investing', 'A client\'s favorite stock'], correctAnswer: 'A client having a large emergency reserve and stable income, allowing them to absorb a temporary large loss without real hardship',
      hint: 'Capacity is about objective financial circumstances, not feelings.',
      approach: 'Capacity is measured through financial facts (income stability, savings cushion, need for funds), not stated comfort.',
      solution: 'Having the financial cushion to genuinely absorb a loss without real hardship is a capacity factor — an objective, financial measure, distinct from how the client FEELS about risk (tolerance).',
      recognitionTechnique: 'Other', commonTrap: 'Confusing a stated feeling (tolerance) with an objective financial fact (capacity).',
      tags: ['risk-capacity']
    },
    {
      id: 'wm_b017', topic: 'Suitability & Risk Profiling', subtopic: 'Suitability', difficulty: 4, targetTime: 90,
      prompt: 'Why is "suitability" not simply about recommending whatever investment has the highest expected return?',
      answerType: 'mc', options: ['Because the highest-return investment is always the most suitable for every client', 'Because suitability requires matching the recommendation to the SPECIFIC client\'s risk tolerance, capacity, horizon and goals — not just the investment\'s abstract merit', 'Because regulators forbid recommending high-return investments to anyone', 'Suitability and expected return are unrelated concepts with no connection at all'], correctAnswer: 'Because suitability requires matching the recommendation to the SPECIFIC client\'s risk tolerance, capacity, horizon and goals — not just the investment\'s abstract merit',
      hint: 'The same investment can be highly suitable for one client and completely unsuitable for another.',
      approach: 'Suitability is inherently client-specific, not a property of the investment in isolation.',
      solution: 'An investment with a high expected return might carry a level of volatility or illiquidity that is completely inappropriate for a specific client\'s circumstances — suitability is about the FIT between the client and the recommendation, not the recommendation\'s standalone merit.',
      recognitionTechnique: 'Other', commonTrap: 'Treating "best investment in the abstract" and "most suitable investment for this client" as the same question.',
      tags: ['suitability']
    },
    {
      id: 'wm_b018', topic: 'Suitability & Risk Profiling', subtopic: 'Time horizon', difficulty: 3, targetTime: 75,
      prompt: 'A 35-year-old client is investing for a goal 30 years away, but says they have a very low tolerance for seeing their portfolio value decline, even temporarily. What is the most balanced approach?',
      answerType: 'mc', options: ['Ignore the stated low tolerance entirely because the time horizon is long', 'Recommend an allocation that respects the genuine long horizon (supporting more growth exposure) while still taking the stated risk tolerance seriously, possibly moderated relative to a purely horizon-driven maximum', 'Recommend 100% cash regardless of the long horizon', 'Time horizon should always override tolerance completely with no exceptions'], correctAnswer: 'Recommend an allocation that respects the genuine long horizon (supporting more growth exposure) while still taking the stated risk tolerance seriously, possibly moderated relative to a purely horizon-driven maximum',
      hint: 'All three factors — tolerance, capacity, horizon — need to be weighed together, not just one in isolation.',
      approach: 'Suitability blends all three factors rather than letting one completely override the others in every case.',
      solution: 'While the long horizon supports a more growth-oriented allocation, genuinely low stated tolerance should still be respected to avoid the client abandoning the strategy during a downturn — a balanced approach considers both factors together rather than one overriding the other completely.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming a long time horizon automatically overrides genuine psychological risk tolerance in every case.',
      tags: ['suitability', 'time-horizon']
    },
    {
      id: 'wm_b019', topic: 'Suitability & Risk Profiling', subtopic: 'Investment Policy Statement', difficulty: 2, targetTime: 60,
      prompt: 'Which of the following would typically be documented in a client\'s Investment Policy Statement?',
      answerType: 'mc', options: ['Only the client\'s email address', 'Goals, time horizon, risk tolerance/capacity, target allocation, and rebalancing rules', 'The adviser\'s personal stock picks with no client-specific information', 'Nothing related to risk or allocation'], correctAnswer: 'Goals, time horizon, risk tolerance/capacity, target allocation, and rebalancing rules',
      hint: 'The IPS is meant to be a comprehensive record of the agreed plan.',
      approach: 'A thorough IPS documents the full picture needed to guide future decisions.',
      solution: 'A typical IPS covers the client\'s goals and constraints, time horizon, risk tolerance and capacity, target strategic allocation, and the rebalancing policy.',
      recognitionTechnique: 'Other', commonTrap: 'Underestimating how comprehensive a proper IPS should be.',
      tags: ['ips']
    },

    /* ---------------------- TAX & LIQUIDITY PLANNING ---------------------- */
    {
      id: 'wm_b020', topic: 'Tax & Liquidity Planning', subtopic: 'Asset location', difficulty: 3, targetTime: 75,
      prompt: 'What is the key difference between "asset location" and "asset allocation"?',
      answerType: 'mc', options: ['They are the same thing', 'Asset allocation is WHICH asset classes to hold; asset location is WHICH TYPE OF ACCOUNT holds each investment', 'Asset location refers only to a client\'s physical address', 'Asset allocation only applies to tax-deferred accounts'], correctAnswer: 'Asset allocation is WHICH asset classes to hold; asset location is WHICH TYPE OF ACCOUNT holds each investment',
      hint: 'One is about WHAT is held; the other is about WHERE (which account type) it is held.',
      approach: 'These are two distinct decisions that can be optimized separately.',
      solution: 'Asset allocation determines the mix of asset classes; asset location determines which account (taxable, tax-deferred, tax-exempt) holds each piece of that same allocation.',
      recognitionTechnique: 'Other', commonTrap: 'Using the two terms interchangeably, when they refer to genuinely different decisions.',
      tags: ['asset-location']
    },
    {
      id: 'wm_b021', topic: 'Tax & Liquidity Planning', subtopic: 'Asset location', difficulty: 3, targetTime: 90,
      prompt: 'A client has both a taxable account and a tax-deferred retirement account, and wants an overall 50/50 stocks/bonds split across both combined. Which general asset-location heuristic (subject to their specific tax situation) tends to improve after-tax outcomes?',
      answerType: 'mc', options: ['Hold all stocks in the tax-deferred account and all bonds in the taxable account', 'Hold more of the frequently/higher-taxed income-generating assets (like many bonds) in the tax-deferred account, and more of the often lower-taxed, deferrable-gain assets (like many stocks) in the taxable account', 'Location never affects after-tax outcomes', 'Always hold 100% of each account in cash'], correctAnswer: 'Hold more of the frequently/higher-taxed income-generating assets (like many bonds) in the tax-deferred account, and more of the often lower-taxed, deferrable-gain assets (like many stocks) in the taxable account',
      hint: 'Shield the type of income that would otherwise be taxed most heavily and most often.',
      approach: 'General heuristic: shelter tax-inefficient income in tax-advantaged accounts.',
      solution: 'Bond interest is often taxed annually at higher rates than long-term capital gains; sheltering that income inside the tax-deferred account (while holding stocks, which can defer gains, in the taxable account) tends to reduce total tax drag, for a given overall allocation.',
      recognitionTechnique: 'Other', commonTrap: 'Reversing the heuristic, or assuming location choices cannot meaningfully affect after-tax wealth.',
      tags: ['asset-location']
    },
    {
      id: 'wm_b022', topic: 'Tax & Liquidity Planning', subtopic: 'Asset location', difficulty: 4, targetTime: 90,
      prompt: 'A client wants to shift entirely into tax-exempt investments, abandoning their previously agreed suitable stock/bond mix, purely to minimize taxes. What is the most appropriate response?',
      answerType: 'mc', options: ['Agree immediately since minimizing taxes should always come first', 'Explain that tax efficiency should generally be pursued within a suitable allocation (e.g. via asset location), not by abandoning the risk profile and allocation that fits the client\'s actual goals and capacity', 'Refuse to discuss taxes at all', 'Taxes are irrelevant to any wealth management conversation'], correctAnswer: 'Explain that tax efficiency should generally be pursued within a suitable allocation (e.g. via asset location), not by abandoning the risk profile and allocation that fits the client\'s actual goals and capacity',
      hint: 'Tax efficiency is an additional layer on top of a suitable allocation, not a reason to override it.',
      approach: 'Suitability (risk profile, capacity, horizon) should drive the allocation; tax optimization should be layered on top, not override it.',
      solution: 'Tax efficiency (like optimizing asset location) should be pursued without abandoning the allocation that is actually suitable for the client\'s risk profile and goals — chasing tax minimization at the expense of suitability can leave a client mismatched to their own real financial needs.',
      recognitionTechnique: 'Other', commonTrap: 'Letting tax minimization override the suitability analysis entirely, rather than treating it as a complementary layer.',
      tags: ['asset-location', 'suitability']
    },
    {
      id: 'wm_b023', topic: 'Tax & Liquidity Planning', subtopic: 'Liquidity bucketing', difficulty: 2, targetTime: 60,
      prompt: 'A client has $30,000 needed for a home repair in 6 months and $500,000 for retirement in 28 years. How should these two amounts generally be treated?',
      answerType: 'mc', options: ['Identically, since they belong to the same client', 'Very differently — the $30,000 should be held very conservatively/liquid, the $500,000 can be invested more aggressively', 'Both should be invested 100% in equities', 'Both should be held entirely in cash'], correctAnswer: 'Very differently — the $30,000 should be held very conservatively/liquid, the $500,000 can be invested more aggressively',
      hint: 'The two amounts have dramatically different time horizons.',
      approach: 'Liquidity bucketing matches investment risk/liquidity to when the funds will actually be needed.',
      solution: 'The near-term $30,000 should be highly liquid and low-volatility (a downturn right before it is needed would be very damaging), while the 28-year retirement money has ample time to be invested more aggressively.',
      recognitionTechnique: 'Other', commonTrap: 'Applying a single blended allocation to money with very different actual time horizons.',
      tags: ['liquidity-bucketing']
    },
    {
      id: 'wm_b024', topic: 'Tax & Liquidity Planning', subtopic: 'Liquidity bucketing', difficulty: 3, targetTime: 75,
      prompt: 'What is the PSYCHOLOGICAL (behavioral) benefit of liquidity bucketing during a market downturn, beyond the purely financial benefit?',
      answerType: 'mc', options: ['There is no psychological benefit', 'Seeing that near-term needs are structurally protected can make it easier for a client to stay invested in the long-term bucket rather than panic-selling', 'It guarantees the client will feel no anxiety whatsoever', 'It removes the need for any client communication'], correctAnswer: 'Seeing that near-term needs are structurally protected can make it easier for a client to stay invested in the long-term bucket rather than panic-selling',
      hint: 'Concrete, tangible separation can provide reassurance that a single blended number cannot.',
      approach: 'Structural separation gives clients a concrete reason to trust that near-term needs are safe.',
      solution: 'Bucketing gives clients tangible, structural confidence that near-term needs are insulated from market swings, making it psychologically easier to remain invested in the higher-return, more volatile long-term bucket during downturns.',
      recognitionTechnique: 'Other', commonTrap: 'Focusing only on the financial mechanics of bucketing and overlooking its real behavioral value during periods of market stress.',
      tags: ['liquidity-bucketing', 'behavioral']
    },
    {
      id: 'wm_b025', topic: 'Tax & Liquidity Planning', subtopic: 'Liquidity bucketing', difficulty: 2, targetTime: 60,
      prompt: 'Which asset is generally the MOST liquid?',
      answerType: 'mc', options: ['A stake in a private equity fund', 'Direct ownership of commercial real estate', 'Cash', 'A 10-year private business partnership interest'], correctAnswer: 'Cash',
      hint: 'Liquidity is about how quickly and easily something converts to spendable cash without a value loss.',
      approach: 'Cash is, by definition, already in its most liquid form.',
      solution: 'Cash is perfectly liquid — it requires no conversion at all — while private equity, direct real estate, and private partnerships are all comparatively illiquid, often requiring months or years to sell.',
      recognitionTechnique: 'Other', commonTrap: 'Confusing "liquidity" with "return potential" — the most liquid asset is not necessarily the one with the highest expected return.',
      tags: ['liquidity']
    },
    {
      id: 'wm_b026', topic: 'Tax & Liquidity Planning', subtopic: 'Asset location', difficulty: 2, targetTime: 60,
      prompt: 'Two clients hold identical stocks and bonds in identical proportions, but Client A ignores asset location while Client B optimizes it (per the general heuristic) across their taxable and tax-deferred accounts. Over a long horizon, what is the most likely outcome?',
      answerType: 'mc', options: ['Both clients end up with identical after-tax wealth, since the investments are identical', 'Client B is likely to end up with somewhat more after-tax wealth, due to reduced tax drag, even though the underlying investments are the same', 'Client A is likely to end up with more after-tax wealth', 'Asset location has no effect on either client'], correctAnswer: 'Client B is likely to end up with somewhat more after-tax wealth, due to reduced tax drag, even though the underlying investments are the same',
      hint: 'Location does not change WHAT is owned, but it can change how much is lost to taxes along the way.',
      approach: 'Reduced tax drag compounds into a meaningful after-tax wealth difference over a long horizon, even with identical underlying holdings.',
      solution: 'Even with identical investments, Client B\'s more tax-efficient location of those same holdings is expected to reduce cumulative tax drag, likely resulting in somewhat greater after-tax wealth over a long horizon.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming identical investments must always produce identical after-tax outcomes, ignoring the effect of account placement.',
      tags: ['asset-location']
    },
    {
      id: 'wm_b027', topic: 'Tax & Liquidity Planning', subtopic: 'Liquidity bucketing', difficulty: 3, targetTime: 75,
      prompt: 'A client with a well-structured liquidity-bucket portfolio calls during a downturn, alarmed by the TOTAL portfolio value decline, and wants to sell everything (including retirement funds not needed for 30 years). What is the most useful thing the adviser can point out?',
      answerType: 'mc', options: ['That the entire portfolio should indeed be sold immediately', 'That the near-term bucket is unaffected, and the declining portion is money that was never going to be touched for decades, giving ample time to recover', 'That liquidity bucketing has failed as a strategy', 'Nothing — there is no useful distinction to make'], correctAnswer: 'That the near-term bucket is unaffected, and the declining portion is money that was never going to be touched for decades, giving ample time to recover',
      hint: 'Bring the conversation back to which specific portion of the wealth is actually at risk of being needed soon.',
      approach: 'Use the bucket structure itself to directly address the source of the client\'s anxiety with concrete facts.',
      solution: 'Reminding the client that their near-term needs remain fully protected, and that the declining portion was always intended for a multi-decade horizon with ample time to recover, directly addresses the real source of the anxiety.',
      recognitionTechnique: 'Other', commonTrap: 'Reacting to the client\'s fear about the TOTAL number rather than clarifying which specific portion of their wealth is actually relevant to their near-term needs.',
      tags: ['liquidity-bucketing', 'behavioral']
    },

    /* ---------------------- ALTERNATIVE INVESTMENTS (CLIENT VIEW) ---------------------- */
    {
      id: 'wm_b028', topic: 'Alternative Investments (Client View)', subtopic: 'Illiquidity', difficulty: 2, targetTime: 60,
      prompt: 'What is the "illiquidity premium" meant to compensate an investor for?',
      answerType: 'mc', options: ['Paying higher management fees', 'Accepting a long lock-up period with no ability to easily sell early', 'Choosing a low-cost index fund', 'Investing only in publicly traded stocks'], correctAnswer: 'Accepting a long lock-up period with no ability to easily sell early',
      hint: 'It compensates for giving up flexibility, not for paying fees.',
      approach: 'Illiquidity premium rewards investors for accepting reduced flexibility over a long lock-up period.',
      solution: 'Investors generally expect potential extra return specifically as compensation for accepting an illiquid, long lock-up investment versus an equally risky but liquid alternative.',
      recognitionTechnique: 'Other', commonTrap: 'Confusing the illiquidity premium with compensation for fees, which is a separate, additional consideration.',
      tags: ['illiquidity']
    },
    {
      id: 'wm_b029', topic: 'Alternative Investments (Client View)', subtopic: 'Fees', difficulty: 3, targetTime: 75,
      prompt: 'A hedge fund charges a common "two and twenty" fee structure. What does this refer to?',
      answerType: 'mc', options: ['A guaranteed 20% annual return with a 2% guarantee fee', 'Roughly a 2% annual management fee on assets, plus roughly 20% of investment profits generated', 'A 2-year minimum holding period with a 20% early withdrawal penalty', 'A fund open only to investors aged 20 to 2 (a typo for a wide age range)'], correctAnswer: 'Roughly a 2% annual management fee on assets, plus roughly 20% of investment profits generated',
      hint: 'This describes a fee structure, not a return guarantee or an age range.',
      approach: 'The "2" is a management fee percentage; the "20" is a performance/profit-share percentage.',
      solution: '"Two and twenty" describes a common fee structure: roughly a 2% annual management fee on the amount invested, plus roughly 20% of any investment profits generated.',
      recognitionTechnique: 'Other', commonTrap: 'Mistaking a fee structure for a guaranteed return or an eligibility requirement.',
      tags: ['fees']
    },
    {
      id: 'wm_b030', topic: 'Alternative Investments (Client View)', subtopic: 'Illiquidity', difficulty: 3, targetTime: 75,
      prompt: 'A client\'s ONLY liquid wealth is their 6-month emergency reserve. An adviser is considering a private equity fund with a 10-year lock-up for this client. What does the liquidity-bucketing framework suggest?',
      answerType: 'mc', options: ['This is an ideal fit — proceed immediately', 'This would very likely be unsuitable, since committing near-term-needed funds to a 10-year lock-up directly conflicts with the emergency reserve\'s purpose', 'Liquidity considerations are irrelevant to alternative investments', 'The lock-up period does not matter as long as the expected return is high'], correctAnswer: 'This would very likely be unsuitable, since committing near-term-needed funds to a 10-year lock-up directly conflicts with the emergency reserve\'s purpose',
      hint: 'An emergency reserve exists specifically to be accessible on short notice.',
      approach: 'Match the investment\'s liquidity profile to the actual purpose and time horizon of the funds being considered.',
      solution: 'Committing a client\'s only liquid reserve — funds meant to be accessible on short notice for emergencies — to a 10-year illiquid lock-up would defeat the entire purpose of that reserve and is very likely unsuitable.',
      recognitionTechnique: 'Other', commonTrap: 'Focusing only on an alternative investment\'s potential return, without checking whether the specific funds being committed can actually tolerate the lock-up.',
      tags: ['illiquidity', 'suitability']
    },
    {
      id: 'wm_b031', topic: 'Alternative Investments (Client View)', subtopic: 'Role in portfolio', difficulty: 4, targetTime: 90,
      prompt: 'A client\'s primary goal for adding an alternative investment is to REDUCE overall portfolio volatility through diversification, not to maximize raw return. Which type of alternative is most directly aligned with this specific goal?',
      answerType: 'mc', options: ['A private equity fund explicitly focused on aggressive return enhancement', 'A hedge fund strategy specifically designed for lower correlation to traditional stocks and bonds', 'Any alternative investment works equally well for this specific goal', 'No alternative investment can ever help with diversification'], correctAnswer: 'A hedge fund strategy specifically designed for lower correlation to traditional stocks and bonds',
      hint: 'Different alternative investment types are built around different primary objectives.',
      approach: 'Match the intended role of the alternative (diversification vs. return enhancement) to the client\'s actual stated goal.',
      solution: 'Since the goal is diversification rather than maximizing raw return, a hedge fund strategy specifically designed to be less correlated with traditional markets is more directly aligned than a return-enhancement-focused private equity fund.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming all alternative investments serve the identical purpose, rather than recognizing that different types are built for different roles.',
      tags: ['role-in-portfolio']
    },
    {
      id: 'wm_b032', topic: 'Alternative Investments (Client View)', subtopic: 'Fees', difficulty: 3, targetTime: 90,
      prompt: 'A hedge fund returns 10% gross in a year, charging a 2% management fee and 20% of profits. Roughly how much of the gross gain is consumed by fees combined (management fee plus performance fee on the gain, order of magnitude)?',
      answerType: 'mc', options: ['Essentially $0 — fees never reduce client returns', 'A meaningful chunk — roughly the 2% management fee plus about 20% of the 10% gain (about 2 percentage points), together eroding a substantial part of the gross return', 'Exactly 50% in every case, regardless of the specific terms', 'Fees only apply if the fund loses money'], correctAnswer: 'A meaningful chunk — roughly the 2% management fee plus about 20% of the 10% gain (about 2 percentage points), together eroding a substantial part of the gross return',
      hint: 'Add the flat management fee percentage to roughly a fifth of the gross gain.',
      approach: 'Estimate the combined drag of a flat management fee plus a percentage-of-profit performance fee.',
      solution: 'Roughly 2 percentage points from the management fee, plus roughly 20% of the 10% gain (about 2 percentage points) from the performance fee — together consuming a meaningful share of the 10% gross return, illustrating why the strategy must add real value to justify the fee load.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming fees are a negligible drag, when a "two and twenty" structure can consume a substantial share of a given year\'s gross return.',
      tags: ['fees']
    },
    {
      id: 'wm_b033', topic: 'Alternative Investments (Client View)', subtopic: 'Illiquidity', difficulty: 2, targetTime: 60,
      prompt: 'Which of the following is generally considered the MOST illiquid?',
      answerType: 'mc', options: ['Cash held in a bank account', 'A publicly-traded, large-company stock', 'A stake in a private equity fund with a 10-year lock-up', 'A government treasury bill'], correctAnswer: 'A stake in a private equity fund with a 10-year lock-up',
      hint: 'Which of these cannot easily be sold on short notice?',
      approach: 'Compare how quickly and easily each asset can be converted to cash without a significant loss of value.',
      solution: 'A private equity stake with a multi-year lock-up cannot be readily sold at all during that period, making it far less liquid than cash, publicly-traded stock, or short-term government debt.',
      recognitionTechnique: 'Other', commonTrap: 'Underestimating just how illiquid a locked-up private investment vehicle really is compared to public markets.',
      tags: ['illiquidity']
    },
    {
      id: 'wm_b034', topic: 'Alternative Investments (Client View)', subtopic: 'Role in portfolio', difficulty: 3, targetTime: 75,
      prompt: 'Why might a wealth manager evaluating a private equity allocation for a client focus on the client\'s liquidity bucketing FIRST, before discussing the fund\'s expected returns?',
      answerType: 'mc', options: ['Expected returns are always irrelevant to alternative investments', 'Because an attractive expected return does not matter if the client does not actually have funds available that can remain untouched for the full lock-up period', 'Liquidity has no bearing on which clients can appropriately access an illiquid fund', 'Fees are always more important than liquidity'], correctAnswer: 'Because an attractive expected return does not matter if the client does not actually have funds available that can remain untouched for the full lock-up period',
      hint: 'A great potential return is irrelevant if the money cannot actually be locked up for the required period.',
      approach: 'Suitability requires clearing the liquidity hurdle before the return potential becomes relevant.',
      solution: 'No matter how attractive the expected return, an illiquid investment is only appropriate for funds the client can genuinely afford to have locked up for the full period — this is a threshold suitability question that should be addressed before return potential.',
      recognitionTechnique: 'Other', commonTrap: 'Leading with return potential and treating liquidity as an afterthought, rather than as a threshold suitability requirement.',
      tags: ['illiquidity', 'suitability']
    },
    {
      id: 'wm_b035', topic: 'Alternative Investments (Client View)', subtopic: 'Role in portfolio', difficulty: 2, targetTime: 60,
      prompt: 'Which asset class is generally categorized as a "real asset"?',
      answerType: 'mc', options: ['Government bonds', 'Commercial real estate', 'Common stock in a publicly-traded company', 'Money market funds'], correctAnswer: 'Commercial real estate',
      hint: 'Real assets are physical, tangible holdings.',
      approach: 'Real assets include physical property such as real estate, infrastructure, and commodities.',
      solution: 'Commercial real estate is a physical, tangible asset, placing it in the "real assets" category, distinct from traditional financial instruments like stocks and bonds.',
      recognitionTechnique: 'Other', commonTrap: 'Confusing real estate investment trusts (publicly traded, liquid) with direct real estate ownership (illiquid, a genuine real asset) — both broadly relate to real estate but have very different liquidity profiles.',
      tags: ['real-assets']
    },

    /* ---------------------- Duration ---------------------- */
    {
      id: 'wm_b036', topic: 'Fixed Income', subtopic: 'Duration', difficulty: 2, targetTime: 60,
      prompt: 'A client\'s bond fund has a duration of 6. Rates rise by 0.75% (75bp). Approximately how much does the fund\'s value change?',
      answerType: 'numeric', correctAnswer: -4.5, tolerance: 0.3,
      hint: '%ΔValue ≈ −Duration × Δyield.',
      approach: 'Multiply duration by the yield change (with the correct sign) to approximate the % value change.',
      solution: '%ΔValue ≈ −6 × 0.75% = −4.5%.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Forgetting the negative sign — a rate rise should produce a value decline.',
      tags: ['duration']
    },
    {
      id: 'wm_b037', topic: 'Fixed Income', subtopic: 'Duration', difficulty: 2, targetTime: 60,
      prompt: 'A client with a 2-year time horizon for a specific goal is choosing bond duration. Which is generally more appropriate?',
      answerType: 'mc', options: ['A long-duration bond fund, for the higher stated yield', 'A short-duration bond fund, to limit the risk of a rate-driven price dip right when the funds are needed', 'Duration is irrelevant to a 2-year time horizon', 'An all-equity allocation instead of any bonds'], correctAnswer: 'A short-duration bond fund, to limit the risk of a rate-driven price dip right when the funds are needed',
      hint: 'Think about how much time the client has to ride out a rate move.',
      approach: 'Match bond duration to the client\'s time horizon to reduce the risk of being forced to sell at a depressed price.',
      solution: 'A short time horizon means the client cannot easily wait out a rate-driven price swing, making the lower sensitivity of a short-duration bond fund the more appropriate match.',
      recognitionTechnique: 'Other', commonTrap: 'Chasing the higher yield of longer-duration bonds without considering the client\'s actual time horizon.',
      tags: ['duration', 'suitability']
    },
    {
      id: 'wm_b038', topic: 'Fixed Income', subtopic: 'Duration', difficulty: 3, targetTime: 90,
      prompt: 'A client is upset that their "safe" bond fund lost value in a year when rates rose sharply, even though no underlying issuer had any credit trouble. What should a wealth manager explain?',
      answerType: 'mc', options: [
        'The fund must be poorly managed or fraudulent',
        'This is a normal, mechanical consequence of interest-rate risk (duration), separate from credit risk, and the value can recover as rates stabilize or bonds mature at face value',
        'Bonds should never be described as relatively lower-risk under any circumstances',
        'This loss is permanent and has nothing to do with interest rates'
      ], correctAnswer: 'This is a normal, mechanical consequence of interest-rate risk (duration), separate from credit risk, and the value can recover as rates stabilize or bonds mature at face value',
      hint: 'Distinguish interest-rate risk from credit risk.',
      approach: 'Explain the price decline as a normal duration-driven effect, not a sign of deteriorating credit quality.',
      solution: 'The loss reflects interest-rate risk (duration), not credit risk — a normal, expected mechanical consequence of holding bonds with meaningful duration during a rising-rate environment, not a sign of financial distress at the underlying issuers.',
      recognitionTechnique: 'Other', commonTrap: 'Conflating interest-rate risk with credit/default risk when communicating with a client.',
      tags: ['duration', 'client-communication']
    },

    /* ---------------------- Yield mechanics ---------------------- */
    {
      id: 'wm_b039', topic: 'Fixed Income', subtopic: 'Yield mechanics', difficulty: 2, targetTime: 60,
      prompt: 'A client\'s bond pays a $35 annual coupon and trades at $700. What is its current yield?',
      answerType: 'numeric', correctAnswer: 5, tolerance: 0.1,
      hint: 'Current yield = annual coupon / current market price.',
      approach: 'Divide the annual coupon by the current market price.',
      solution: 'Current yield = 35/700 = 5%.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Dividing by face value instead of the current market price.',
      tags: ['current-yield']
    },
    {
      id: 'wm_b040', topic: 'Fixed Income', subtopic: 'Yield mechanics', difficulty: 3, targetTime: 90,
      prompt: 'A wealth manager quotes a client only the current yield on a premium bond as "your expected return." What is missing from this explanation?',
      answerType: 'mc', options: [
        'Nothing — current yield is always a complete and accurate figure to quote',
        'Current yield ignores the capital loss the client will realize as the premium bond\'s price converges to face value by maturity; YTM should be quoted as the accurate total-return figure',
        'Premium bonds never lose any value by maturity',
        'YTM is only relevant for discount bonds, not premium bonds'
      ], correctAnswer: 'Current yield ignores the capital loss the client will realize as the premium bond\'s price converges to face value by maturity; YTM should be quoted as the accurate total-return figure',
      hint: 'Think about what a premium bond\'s price does by maturity.',
      approach: 'Current yield alone systematically overstates a premium bond\'s true expected return.',
      solution: 'Current yield omits the built-in capital loss a premium bond gives back by maturity; YTM is the complete, client-appropriate figure that captures the bond\'s true total expected return.',
      recognitionTechnique: 'Other', commonTrap: 'Presenting current yield alone as a client\'s full expected return.',
      tags: ['ytm', 'current-yield', 'client-communication']
    },
    {
      id: 'wm_b041', topic: 'Fixed Income', subtopic: 'Yield mechanics', difficulty: 2, targetTime: 60,
      prompt: 'A client\'s bond was purchased at exactly its face (par) value. What is true of its coupon rate, current yield, and YTM?',
      answerType: 'mc', options: ['They are always different', 'They are all exactly equal', 'Only current yield and YTM match', 'Only coupon rate and current yield match'], correctAnswer: 'They are all exactly equal',
      hint: 'At par, there is no capital gain or loss embedded.',
      approach: 'A bond bought at par has no gap between purchase price and face value to create a gain or loss.',
      solution: 'With price equal to face value, there is no capital gain or loss to maturity, so coupon rate, current yield, and YTM all collapse to the same figure.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming these three figures always differ, regardless of the bond\'s price relative to face value.',
      tags: ['ytm', 'current-yield', 'coupon-rate']
    },

    /* ---------------------- Bond structures ---------------------- */
    {
      id: 'wm_b042', topic: 'Fixed Income', subtopic: 'Bond structures', difficulty: 2, targetTime: 60,
      prompt: 'A client needs exactly $40,000 in 8 years for a known future expense and wants to avoid reinvestment guesswork along the way. Which bond structure best matches this goal?',
      answerType: 'mc', options: ['A callable bond', 'A zero-coupon bond', 'A convertible bond', 'A floating-rate bond'], correctAnswer: 'A zero-coupon bond',
      hint: 'Think about which structure delivers its entire return as a single lump sum on a known date.',
      approach: 'A zero-coupon bond delivers a single payment at maturity with no interim coupons to reinvest.',
      solution: 'A zero-coupon bond purchased to mature at the target date delivers the full face value precisely when needed, with no interim coupons to reinvest or track — a clean match for a single, known future liability.',
      recognitionTechnique: 'Other', commonTrap: 'Recommending a coupon-paying bond, which introduces reinvestment-rate uncertainty for the interim coupons.',
      tags: ['zero-coupon', 'suitability']
    },
    {
      id: 'wm_b043', topic: 'Fixed Income', subtopic: 'Bond structures', difficulty: 3, targetTime: 90,
      prompt: 'A client is comparing a straight bond yielding 5.5% to a callable bond (callable after year 3) from the same issuer yielding 6.3%. Why might a wealth manager caution against assuming the callable bond is simply "the better deal"?',
      answerType: 'mc', options: [
        'Callable bonds always default more often',
        'If rates fall after year 3, the issuer may call the bond away, forcing the client to reinvest at lower prevailing rates — undermining the cash-flow certainty the higher yield seemed to promise',
        'Callable bonds pay no coupons at all',
        'There is no reason for caution — the higher yield is simply better with no tradeoff'
      ], correctAnswer: 'If rates fall after year 3, the issuer may call the bond away, forcing the client to reinvest at lower prevailing rates — undermining the cash-flow certainty the higher yield seemed to promise',
      hint: 'Think about what happens to the client\'s cash flows if the bond gets called.',
      approach: 'The call option benefits the issuer and can disrupt the client\'s expected income stream.',
      solution: 'The extra yield compensates for the risk that the issuer calls the bond away if rates fall, forcing the client to reinvest at now-lower rates — a real risk to the cash-flow certainty the higher stated yield might suggest.',
      recognitionTechnique: 'Other', commonTrap: 'Treating a callable bond\'s higher yield as simply "more return for the same risk."',
      tags: ['callable-bonds', 'suitability']
    },
    {
      id: 'wm_b044', topic: 'Fixed Income', subtopic: 'Bond structures', difficulty: 3, targetTime: 90,
      prompt: 'A client wants some equity-like upside potential but more downside protection than owning the stock directly. Which bond structure most directly addresses this goal?',
      answerType: 'mc', options: ['A zero-coupon bond', 'A convertible bond', 'A putable bond', 'A callable bond'], correctAnswer: 'A convertible bond',
      hint: 'Think about which structure lets the client participate in equity upside while keeping bond-like protection.',
      approach: 'A convertible bond lets the client convert into equity if the stock performs well, while otherwise behaving like a bond.',
      solution: 'A convertible bond combines bond-like downside protection (coupons, principal repayment if never converted) with the option to convert into equity if the stock rallies — directly matching this client\'s stated goal.',
      recognitionTechnique: 'Other', commonTrap: 'Recommending a callable or putable bond, neither of which offers any equity upside participation.',
      tags: ['convertible-bonds', 'suitability']
    },

    /* ---------------------- Creditor seniority ---------------------- */
    {
      id: 'wm_b045', topic: 'Fixed Income', subtopic: 'Creditor seniority', difficulty: 2, targetTime: 60,
      prompt: 'A client is comparing two bonds from the SAME issuer: a senior secured bond yielding 5%, and a subordinated bond yielding 8%. What explains the yield gap?',
      answerType: 'mc', options: [
        'The subordinated bond must have a typo in its yield',
        'The subordinated bond is paid only after the senior secured bond (and other senior claims) are fully satisfied in a potential insolvency — a materially higher risk of an incomplete recovery',
        'The two bonds must actually be from different issuers',
        'Higher yield always means better value with no added risk'
      ], correctAnswer: 'The subordinated bond is paid only after the senior secured bond (and other senior claims) are fully satisfied in a potential insolvency — a materially higher risk of an incomplete recovery',
      hint: 'Think about where each bond sits in the liquidation priority order.',
      approach: 'Seniority within the same issuer\'s capital structure can differ substantially between bonds.',
      solution: 'The extra yield on the subordinated bond directly compensates for being paid only after senior claims are satisfied in full — a materially higher risk of an incomplete recovery, despite sharing the same issuer.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming all bonds from the same issuer carry identical risk regardless of seniority.',
      tags: ['creditor-waterfall', 'suitability']
    },
    {
      id: 'wm_b046', topic: 'Fixed Income', subtopic: 'Creditor seniority', difficulty: 2, targetTime: 60,
      prompt: 'An issuer liquidates for $50m, with $30m of senior secured debt and $25m of subordinated debt (no other claims). What does the subordinated debt recover?',
      answerType: 'numeric', correctAnswer: 20, tolerance: 0.5,
      hint: 'Senior secured debt is paid in full first.',
      approach: 'Pay senior secured in full, then apply remaining proceeds to subordinated debt.',
      solution: 'Senior secured paid in full: $30m, leaving 50−30 = $20m for the $25m subordinated claim — a partial recovery of $20m.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Splitting proceeds proportionally instead of following the strict, sequential priority order.',
      tags: ['creditor-waterfall']
    },
    {
      id: 'wm_b047', topic: 'Fixed Income', subtopic: 'Creditor seniority', difficulty: 3, targetTime: 90,
      prompt: 'A client, chasing yield, wants to buy only the highest-yielding bond from a well-known, financially healthy company, without checking anything else. Why should a wealth manager push back?',
      answerType: 'mc', options: [
        'Yield-chasing is always appropriate as long as the issuer is well-known',
        'The high yield may simply reflect that this specific bond sits low in the issuer\'s capital structure (e.g., subordinated), meaning the client is taking on more structural risk than the issuer\'s reputation alone would suggest',
        'Well-known issuers never offer bonds with varying seniority',
        'Yield differences within one issuer are always due to maturity alone, never seniority'
      ], correctAnswer: 'The high yield may simply reflect that this specific bond sits low in the issuer\'s capital structure (e.g., subordinated), meaning the client is taking on more structural risk than the issuer\'s reputation alone would suggest',
      hint: 'Consider what a bond\'s yield can reveal about its seniority, independent of the issuer\'s overall reputation.',
      approach: 'A complete risk assessment requires checking the specific bond\'s seniority, not just the issuer\'s name.',
      solution: 'A yield premium from an otherwise solid issuer often reflects that the specific bond sits low in the capital structure (e.g., subordinated), not that the issuer itself is unusually risky — the client may be taking on more structural risk than realized.',
      recognitionTechnique: 'Other', commonTrap: 'Relying on an issuer\'s general reputation instead of checking a specific bond\'s seniority.',
      tags: ['creditor-waterfall', 'suitability']
    },

    /* ---------------------- Inflation & TIPS ---------------------- */
    {
      id: 'wm_b048', topic: 'Fixed Income', subtopic: 'Inflation & TIPS', difficulty: 2, targetTime: 60,
      prompt: 'A client\'s target real return is 3%, and expected inflation is 2.5%. Using the Fisher approximation, what nominal return do they need?',
      answerType: 'numeric', correctAnswer: 5.5, tolerance: 0.2,
      hint: 'Nominal rate ≈ real rate + expected inflation.',
      approach: 'Add the target real return and expected inflation.',
      solution: 'Nominal rate ≈ 3% + 2.5% = 5.5%.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Confusing the nominal and real return targets when discussing goals with a client.',
      tags: ['fisher-equation']
    },
    {
      id: 'wm_b049', topic: 'Fixed Income', subtopic: 'Inflation & TIPS', difficulty: 2, targetTime: 60,
      prompt: 'A client holds a TIPS bond with an original $8,000 principal and a 1.5% coupon rate. After one year, cumulative inflation is 3%. What is that year\'s coupon payment?',
      answerType: 'numeric', correctAnswer: 123.6, tolerance: 2,
      hint: 'First adjust the principal upward by cumulative inflation, then apply the coupon rate to the adjusted principal.',
      approach: 'Adjusted principal = original × (1+inflation). Coupon = coupon rate × adjusted principal.',
      solution: 'Adjusted principal = 8000×1.03 = $8240. Coupon = 1.5%×8240 = $123.60.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Applying the coupon rate to the original, un-adjusted principal instead of the inflation-adjusted principal.',
      tags: ['tips']
    },
    {
      id: 'wm_b050', topic: 'Fixed Income', subtopic: 'Inflation & TIPS', difficulty: 3, targetTime: 90,
      prompt: 'A retired client, well into a 30-year retirement, is entirely invested in conventional nominal bonds and is confident their fixed coupon income is fully "safe" since the dollar amounts never change. What should a wealth manager flag?',
      answerType: 'mc', options: [
        'Nothing — nominal safety and real safety are the same thing',
        'Over a long retirement, even moderate inflation compounds substantially, eroding the real purchasing power of fixed nominal payments even though the dollar figures never change — a case for allocating some fixed income to TIPS',
        'Nominal bonds automatically convert into TIPS after enough years',
        'This client should hold no bonds at all'
      ], correctAnswer: 'Over a long retirement, even moderate inflation compounds substantially, eroding the real purchasing power of fixed nominal payments even though the dollar figures never change — a case for allocating some fixed income to TIPS',
      hint: 'Distinguish nominal safety from real (purchasing-power) safety over a long horizon.',
      approach: 'Inflation compounds meaningfully over decades, eroding real purchasing power even when nominal payments are reliable.',
      solution: 'A long retirement gives inflation more time to compound and erode real purchasing power even while nominal payments remain perfectly reliable — a real risk to the client\'s long-run standard of living, which allocating part of the fixed-income sleeve to TIPS directly addresses.',
      recognitionTechnique: 'Other', commonTrap: 'Reassuring a client that fixed nominal payments are fully safe without distinguishing nominal safety from real (inflation-adjusted) safety.',
      tags: ['inflation', 'tips', 'client-communication']
    },

    /* ---------------------- Buyer types (business owner clients) ---------------------- */
    {
      id: 'wm_b051', topic: 'Business Owner & Liquidity Events', subtopic: 'Buyer types', difficulty: 2, targetTime: 60,
      prompt: 'Why might a direct competitor (strategic, horizontal buyer) be willing to pay MORE for a client\'s business than a financial buyer?',
      answerType: 'mc', options: ['Competitors are always required by law to overpay', 'The competitor can capture operational cost synergies (combined facilities, eliminated overhead) by merging operations, value a financial buyer typically cannot access', 'Financial buyers never have enough capital to make competitive offers', 'There is no typical pattern — offers are always random'], correctAnswer: 'The competitor can capture operational cost synergies (combined facilities, eliminated overhead) by merging operations, value a financial buyer typically cannot access',
      hint: 'Think about what a competitor can do with the business that a financial buyer cannot.',
      approach: 'Operational synergies from combining with a rival are a real, extractable source of extra value.',
      solution: 'A competitor can extract real cost synergies by combining operations, a source of value a purely financial buyer generally cannot access, which is often reflected in a higher price.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming all buyer types value a business identically.',
      tags: ['buyer-types']
    },
    {
      id: 'wm_b052', topic: 'Business Owner & Liquidity Events', subtopic: 'Buyer types', difficulty: 3, targetTime: 90,
      prompt: 'A client receives a lower offer from a buyer that would preserve the company\'s brand and existing employees, versus a higher offer from a competitor that would likely eliminate both. How should a wealth manager frame this decision?',
      answerType: 'mc', options: ['Always recommend the highest price regardless of any other factor', 'Help the client explicitly weigh how much the higher price is worth relative to their own priorities around brand and employee continuity — a decision only the client can ultimately make', 'Refuse to discuss any offer below the highest one received', 'Assume the client only cares about price and ignore their stated concerns'], correctAnswer: 'Help the client explicitly weigh how much the higher price is worth relative to their own priorities around brand and employee continuity — a decision only the client can ultimately make',
      hint: 'This is a values-based tradeoff, not a purely financial calculation.',
      approach: 'Help the client frame the tradeoff clearly rather than deciding it for them.',
      solution: 'This is fundamentally a values-based tradeoff for the client; the wealth manager\'s role is to help frame the tradeoff clearly (price versus non-price priorities), not to decide it unilaterally.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming the highest headline price is automatically the best outcome for every client.',
      tags: ['buyer-types', 'suitability']
    },
    {
      id: 'wm_b053', topic: 'Business Owner & Liquidity Events', subtopic: 'Buyer types', difficulty: 2, targetTime: 60,
      prompt: 'A client\'s key supplier proposes acquiring the client\'s business. What is a likely motivation for this vertical acquirer?',
      answerType: 'mc', options: ['Eliminating a direct competitor', 'Securing supply and capturing margin currently paid between the two companies', 'Diversifying into a completely unrelated industry', 'There is no typical strategic motivation for this type of buyer'], correctAnswer: 'Securing supply and capturing margin currently paid between the two companies',
      hint: 'Think about the supply-chain relationship between the two companies.',
      approach: 'A vertical acquirer is motivated by securing supply and capturing margin along the existing relationship.',
      solution: 'A vertical (supply-chain) acquirer is typically motivated by securing supply and capturing margin along the existing supplier-customer relationship.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming only competitors have a strategic motivation to acquire a business.',
      tags: ['buyer-types']
    },

    /* ---------------------- Takeover defenses (shareholder view) ---------------------- */
    {
      id: 'wm_b054', topic: 'Business Owner & Liquidity Events', subtopic: 'Takeover defenses (shareholder view)', difficulty: 2, targetTime: 60,
      prompt: 'From an ordinary shareholder\'s perspective, what is the main practical effect of a poison pill on a hostile takeover attempt?',
      answerType: 'mc', options: ['It immediately cancels the shareholder\'s existing shares', 'It generally does not directly harm existing shareholders, and can force the hostile acquirer to negotiate directly with the board rather than accumulate control unilaterally', 'It automatically doubles the shareholder\'s tax liability', 'It guarantees the takeover will never happen under any circumstances'], correctAnswer: 'It generally does not directly harm existing shareholders, and can force the hostile acquirer to negotiate directly with the board rather than accumulate control unilaterally',
      hint: 'Think about whether a poison pill directly harms an ordinary shareholder\'s existing rights.',
      approach: 'A poison pill deters unilateral accumulation of control without directly harming ordinary shareholders.',
      solution: 'A poison pill\'s main function is deterring unilateral accumulation of control, generally without directly harming existing shareholders\' rights, and can lead to a better-negotiated outcome.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming a poison pill directly harms the shareholder\'s existing position.',
      tags: ['takeover-defenses']
    },
    {
      id: 'wm_b055', topic: 'Business Owner & Liquidity Events', subtopic: 'Takeover defenses (shareholder view)', difficulty: 3, targetTime: 90,
      prompt: 'A board resists a takeover bid for over a year with no competing offer ever emerging and no articulated value rationale. What should this pattern suggest to a wealth manager evaluating the client\'s position?',
      answerType: 'mc', options: ['This is always a sign of excellent governance', 'This is a potential governance red flag, since it may indicate entrenchment rather than genuine shareholder value protection', 'This pattern has no relevance to the client\'s position', 'This always means the original bid was too low'], correctAnswer: 'This is a potential governance red flag, since it may indicate entrenchment rather than genuine shareholder value protection',
      hint: 'Consider whether the defense is producing any measurable benefit for shareholders.',
      approach: 'Prolonged resistance with no competing bid or rationale is a recognizable entrenchment pattern.',
      solution: 'Prolonged resistance with no competing bid and no articulated value rationale is a recognizable pattern worth flagging as a possible governance concern for the client.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming all takeover resistance is automatically in shareholders\' best interest.',
      tags: ['takeover-defenses', 'governance']
    },
    {
      id: 'wm_b056', topic: 'Business Owner & Liquidity Events', subtopic: 'Takeover defenses (shareholder view)', difficulty: 2, targetTime: 60,
      prompt: 'How can a "white knight" defense directly benefit a client holding stock in the target company?',
      answerType: 'mc', options: ['It never benefits shareholders in any way', 'If it triggers competitive bidding, it can push the ultimate sale price higher than the original hostile bid, directly benefiting shareholders', 'It automatically cancels the deal entirely', 'It only benefits the target company\'s management, never shareholders'], correctAnswer: 'If it triggers competitive bidding, it can push the ultimate sale price higher than the original hostile bid, directly benefiting shareholders',
      hint: 'Think about what happens when two acquirers compete for the same target.',
      approach: 'Competitive bidding from a white knight search can raise the final price.',
      solution: 'Competitive bidding driven by a white knight search can produce a measurably higher final price, a direct benefit to shareholders like the client.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming a white knight defense only ever serves management\'s interests.',
      tags: ['takeover-defenses']
    },

    /* ---------------------- Cash vs stock consideration (client planning) ---------------------- */
    {
      id: 'wm_b057', topic: 'Business Owner & Liquidity Events', subtopic: 'Cash vs stock (client planning)', difficulty: 2, targetTime: 60,
      prompt: 'Why does receiving STOCK consideration create a concentration risk for a client selling their business?',
      answerType: 'mc', options: ['Stock consideration never creates any concentration risk', 'The client ends up holding a large, often outsized position in a single stock (the acquirer\'s shares), directly conflicting with diversification unless deliberately reduced over time', 'Stock consideration is always split evenly across many different companies automatically', 'Concentration risk only applies to cash consideration, never stock'], correctAnswer: 'The client ends up holding a large, often outsized position in a single stock (the acquirer\'s shares), directly conflicting with diversification unless deliberately reduced over time',
      hint: 'Think about what the client now holds after receiving stock consideration.',
      approach: 'Stock consideration creates a new, potentially concentrated single-stock position.',
      solution: 'A large single-stock position, even if tax-deferred, represents exactly the kind of concentration risk diversification is meant to avoid, unless actively managed down over time.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming a stock-for-stock deal automatically achieves diversification.',
      tags: ['stock-vs-cash', 'concentration-risk']
    },
    {
      id: 'wm_b058', topic: 'Business Owner & Liquidity Events', subtopic: 'Cash vs stock (client planning)', difficulty: 2, targetTime: 60,
      prompt: 'Why should a wealth manager plan for a client\'s cash-consideration tax bill BEFORE the deal closes, rather than after?',
      answerType: 'mc', options: ['There is no benefit to planning ahead versus reacting afterward', 'Proactive planning avoids the client committing or spending funds that will actually be needed for a large, known upcoming tax liability', 'Tax bills from a business sale are always negligible and require no planning', 'Planning ahead is illegal under most tax regimes'], correctAnswer: 'Proactive planning avoids the client committing or spending funds that will actually be needed for a large, known upcoming tax liability',
      hint: 'Think about what could go wrong if the tax bill is only addressed after cash has already arrived.',
      approach: 'A large, foreseeable tax liability should be reserved for in advance.',
      solution: 'A large, foreseeable tax liability should be reserved for in advance, not discovered as a surprise after cash has already been deployed elsewhere.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming tax planning can be deferred until after a large cash windfall has already been received and spent.',
      tags: ['stock-vs-cash', 'tax-planning']
    },
    {
      id: 'wm_b059', topic: 'Business Owner & Liquidity Events', subtopic: 'Cash vs stock (client planning)', difficulty: 3, targetTime: 90,
      prompt: 'A client receives stock consideration subject to a 12-month lock-up period. What should a wealth manager do regarding diversification planning?',
      answerType: 'mc', options: ['Wait until the lock-up expires before doing any planning at all', 'Build a concrete diversification plan in advance (pace of future sales, tax coordination, any available interim risk-management options) so execution can begin as soon as the lock-up permits', 'Advise the client that nothing can be done about concentration risk until the lock-up ends, with no further planning needed', 'Recommend the client immediately violate the lock-up restriction'], correctAnswer: 'Build a concrete diversification plan in advance (pace of future sales, tax coordination, any available interim risk-management options) so execution can begin as soon as the lock-up permits',
      hint: 'Proactive planning during a restriction period still adds value.',
      approach: 'Planning ahead ensures the client is ready to act immediately once restrictions lift.',
      solution: 'Proactive planning during the lock-up period ensures the client is ready to act immediately once restrictions lift, rather than starting the planning process late.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming nothing productive can be planned until a trading restriction formally expires.',
      tags: ['stock-vs-cash', 'concentration-risk']
    },

    /* ---------------------- Control premium (business owner clients) ---------------------- */
    {
      id: 'wm_b060', topic: 'Business Owner & Liquidity Events', subtopic: 'Control premium (client expectations)', difficulty: 2, targetTime: 60,
      prompt: 'If similar public companies trade at 7× EBITDA, should a client selling their ENTIRE private business expect to receive exactly 7×?',
      answerType: 'mc', options: ['Yes, this benchmark should be used exactly as-is with no adjustment', 'Not necessarily — since the client is transferring full control, a control premium above this minority-stake benchmark would reasonably be expected', 'The public benchmark is always completely irrelevant to a private sale', 'A private sale should always be valued at a discount to the public benchmark'], correctAnswer: 'Not necessarily — since the client is transferring full control, a control premium above this minority-stake benchmark would reasonably be expected',
      hint: 'Think about what public trading multiples actually reflect versus a full-company sale.',
      approach: 'Public multiples reflect minority-stake pricing; a full sale transfers control and reasonably commands a premium.',
      solution: 'The public multiple reflects passive minority-stake pricing; a full-company sale transferring control reasonably commands a premium above it.',
      recognitionTechnique: 'Other', commonTrap: 'Anchoring a client\'s expectations directly on an unadjusted public trading multiple.',
      tags: ['control-premium', 'suitability']
    },
    {
      id: 'wm_b061', topic: 'Business Owner & Liquidity Events', subtopic: 'Control premium (client expectations)', difficulty: 3, targetTime: 90,
      prompt: 'Why should a wealth manager caution a client against assuming an unlimited control premium simply because "control is valuable"?',
      answerType: 'mc', options: ['Control premiums are never actually valuable in practice', 'The actual size of the premium a specific buyer will pay is bounded by how much real extra value that particular buyer can capture, not an unlimited amount', 'Every buyer always pays the exact same premium regardless of circumstances', 'Only public companies are ever subject to a control premium'], correctAnswer: 'The actual size of the premium a specific buyer will pay is bounded by how much real extra value that particular buyer can capture, not an unlimited amount',
      hint: 'Think about what actually determines how large a premium a specific buyer will pay.',
      approach: 'A realistic premium estimate must be grounded in the specific buyer\'s ability to extract extra value.',
      solution: 'A realistic premium estimate is bounded by the specific buyer\'s actual ability to capture extra value (synergies, strategic fit), not treated as boundless.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming "control has value" implies an unlimited premium in every case.',
      tags: ['control-premium', 'suitability']
    },
    {
      id: 'wm_b062', topic: 'Business Owner & Liquidity Events', subtopic: 'Control premium (client expectations)', difficulty: 2, targetTime: 60,
      prompt: 'A client\'s undisturbed comparison benchmark implies $40/share, but the actual full-company acquisition offer is $52/share. What is the control premium?',
      answerType: 'numeric', correctAnswer: 30, tolerance: 1,
      hint: 'Control premium = (offer / benchmark − 1) × 100.',
      approach: 'Divide the offer by the benchmark, subtract 1, convert to a percentage.',
      solution: 'Control premium = (52/40 − 1) × 100 = 30%.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Computing a simple dollar difference instead of a percentage premium.',
      tags: ['control-premium']
    },

    /* ---------------------- Earnouts & NWC adjustments (client planning) ---------------------- */
    {
      id: 'wm_b063', topic: 'Business Owner & Liquidity Events', subtopic: 'Earnouts (client planning)', difficulty: 2, targetTime: 60,
      prompt: 'Why should a wealth manager help a client plan near-term finances around the UPFRONT portion of a deal, rather than the full headline value including an earnout?',
      answerType: 'mc', options: ['Earnouts are always guaranteed to be paid in full', 'The earnout is contingent on future performance targets being met, so it is not guaranteed — planning around it as if certain risks overcommitting the client\'s finances', 'Upfront payments are always smaller than earnouts and therefore irrelevant', 'There is no meaningful difference between upfront and earnout proceeds for planning purposes'], correctAnswer: 'The earnout is contingent on future performance targets being met, so it is not guaranteed — planning around it as if certain risks overcommitting the client\'s finances',
      hint: 'Think about what happens if the earnout targets are ultimately missed.',
      approach: 'Near-term financial commitments should be built around certain proceeds only.',
      solution: 'An earnout\'s contingent nature means it should be treated as a potential bonus, not counted on for firm financial commitments, to avoid overcommitting the client\'s finances.',
      recognitionTechnique: 'Other', commonTrap: 'Treating the full headline deal value, including a contingent earnout, as guaranteed.',
      tags: ['earnouts', 'financial-planning']
    },
    {
      id: 'wm_b064', topic: 'Business Owner & Liquidity Events', subtopic: 'Earnouts (client planning)', difficulty: 3, targetTime: 90,
      prompt: 'A client is offered a deal requiring 3 more years of active operational involvement to help achieve an earnout, but had hoped to retire within 1 year. What should a wealth manager help the client evaluate?',
      answerType: 'mc', options: ['Only the financial size of the potential earnout, ignoring the client\'s retirement timeline entirely', 'The explicit tradeoff between the additional (contingent) earnout proceeds and the real cost of delaying retirement, modeling the client\'s financial plan under both the "earnout achieved" and "earnout missed" scenarios', 'Automatically recommending the client reject any deal involving an earnout', 'Automatically recommending the client accept any deal with a larger total headline value'], correctAnswer: 'The explicit tradeoff between the additional (contingent) earnout proceeds and the real cost of delaying retirement, modeling the client\'s financial plan under both the "earnout achieved" and "earnout missed" scenarios',
      hint: 'This decision involves both financial modeling and the client\'s own life priorities.',
      approach: 'Surface both the financial and non-financial tradeoffs explicitly, under multiple scenarios.',
      solution: 'This decision involves both financial modeling under multiple scenarios and the client\'s own non-financial priorities (retirement timing), both of which the wealth manager should help surface explicitly.',
      recognitionTechnique: 'Other', commonTrap: 'Reducing this decision to a pure financial calculation, ignoring the client\'s life-timeline priorities.',
      tags: ['earnouts', 'financial-planning']
    },
    {
      id: 'wm_b065', topic: 'Business Owner & Liquidity Events', subtopic: 'NWC adjustments (client planning)', difficulty: 2, targetTime: 60,
      prompt: 'A client\'s deal assumes $5m of target NWC at closing; actual NWC delivered comes in at $5.3m. How should a wealth manager explain this to the client?',
      answerType: 'mc', options: [
        'This indicates a serious problem with the deal that requires renegotiation',
        'This is a normal, expected mechanical true-up: the client delivered slightly more working capital than assumed, resulting in an additional $300,000 at closing',
        'This means the deal must be canceled',
        'This has no effect on the client\'s proceeds whatsoever'
      ], correctAnswer: 'This is a normal, expected mechanical true-up: the client delivered slightly more working capital than assumed, resulting in an additional $300,000 at closing',
      hint: 'NWC adjustments are a routine part of most deals.',
      approach: 'Explain the NWC adjustment as a normal, expected mechanical true-up.',
      solution: 'This is a normal, expected mechanical true-up of the client\'s closing proceeds, not a sign of any problem or a renegotiation.',
      recognitionTechnique: 'Other', commonTrap: 'Alarming the client by treating a routine NWC true-up as a sign of deal trouble.',
      tags: ['nwc-adjustment', 'client-communication']
    }
  ];

  items.forEach((q) => { q.track = 'wm'; });
  global.QTL_BANK.addMany(items);
})(window);
