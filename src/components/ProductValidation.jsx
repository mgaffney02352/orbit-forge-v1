import React from 'react';
import { Card, InfoField, StatCard } from './ui';

export default function ProductValidation(props) {
  const {
    market,
    updateMarket,
    financials,
    updateFinancials,
    openInfo,
    setOpenInfo,
    activeStep,
    setActiveStep,
    autoCogsValue,
    effectiveCogs,
    totalCost,
    profitPerUnit,
    netMargin,
    totalInvestment,
    roi,
    marketScore,
    riskLabel,
    successRate,
    gateStatus,
    passesGate,
    borderlineGate,
    aiAvailable,
    setAiOverride,
    aiRun,
    setAiRun,
    monthlyProfit,
    breakEvenDays,
    newSellerRatio,
    riskLevel,
    nums,
  } = props;

  const marketFields = [
    ['product', 'Product', 'The product idea you are validating.', 'Use the main product identity exactly as you want it tracked.', <input value={market.product} onChange={(e) => updateMarket('product', e.target.value)} className="field-input" />],
    ['monthlySearchVolume', 'Monthly Search Volume', 'Current monthly demand for the main keyword.', 'This reflects present search demand.', <input value={market.monthlySearchVolume} onChange={(e) => updateMarket('monthlySearchVolume', e.target.value)} className="field-input" />],
    ['twoYearThreshold', '2-Year Search Volume Threshold', 'At least 2000 search volume over 2 years?', 'This confirms a longer-term search baseline.', <select value={market.twoYearThreshold} onChange={(e) => updateMarket('twoYearThreshold', e.target.value)} className="field-input"><option className="dark-option">yes</option><option className="dark-option">no</option></select>],
    ['clickedProducts', 'Clicked Products', 'How many products are being clicked in results.', 'This helps show click concentration.', <input value={market.clickedProducts} onChange={(e) => updateMarket('clickedProducts', e.target.value)} className="field-input" />],
    ['marketCR', 'Market Average Conversion Rate', 'Estimated average niche conversion rate.', 'This is the baseline conversion performance of the niche.', <div className="suffix-wrap"><input value={market.marketCR} onChange={(e) => updateMarket('marketCR', e.target.value)} className="field-input with-suffix" /><span className="suffix">%</span></div>],
    ['expectedCR', 'Expected Conversion Rate', 'Your estimated conversion rate after execution.', 'This is your projected conversion rate after execution.', <div className="suffix-wrap"><input value={market.expectedCR} onChange={(e) => updateMarket('expectedCR', e.target.value)} className="field-input with-suffix" /><span className="suffix">%</span></div>],
    ['totalSellers', 'Total Sellers in Niche', 'How many sellers are actively competing.', 'This measures the size of the competitive field.', <input value={market.totalSellers} onChange={(e) => updateMarket('totalSellers', e.target.value)} className="field-input" />],
    ['newSellers', 'New Sellers Last 90 Days', 'Recent seller influx into the niche.', 'This shows whether the niche is attracting new entrants.', <input value={market.newSellers} onChange={(e) => updateMarket('newSellers', e.target.value)} className="field-input" />],
    ['successfulSellers', 'Successful Sellers', 'How many sellers are truly succeeding.', 'This separates a crowded niche from a healthy one.', <input value={market.successfulSellers} onChange={(e) => updateMarket('successfulSellers', e.target.value)} className="field-input" />],
    ['avgReviews', 'Average Review Count', 'Average reviews among top competitors.', 'This gives context around listing maturity.', <input value={market.avgReviews} onChange={(e) => updateMarket('avgReviews', e.target.value)} className="field-input" />],
  ];

  const financialFields = [
    ['sellingPrice', 'Selling Price', 'Planned retail selling price per unit.', 'This is the price you expect to charge.', <div className="prefix-wrap"><span className="prefix">$</span><input value={financials.sellingPrice} onChange={(e) => updateFinancials('sellingPrice', e.target.value)} className="field-input with-prefix" /></div>],
    ['cogs', 'COGS', 'Defaults to 33% of selling price, but can be manually overridden.', 'COGS defaults to 33% of selling price.', <div><div className="prefix-wrap"><span className="prefix">$</span><input value={effectiveCogs} readOnly={!financials.cogsManualOverride} onChange={(e) => updateFinancials('cogs', e.target.value)} className={`field-input with-prefix ${!financials.cogsManualOverride ? 'read-only' : ''}`} /></div><div className="auto-strip lime"><span>{financials.cogsManualOverride ? 'Manual COGS entry enabled' : `Auto-filled at 33% of selling price: $${autoCogsValue}`}</span><button type="button" className="mini-button" onClick={() => { updateFinancials('cogsManualOverride', !financials.cogsManualOverride); updateFinancials('cogs', autoCogsValue); }}>{financials.cogsManualOverride ? 'Use Auto' : 'Manual Override'}</button></div></div>],
    ['amazonFees', 'Amazon Fees', 'FBA and referral fees per unit.', 'Include referral and FBA fees together.', <div className="prefix-wrap"><span className="prefix">$</span><input value={financials.amazonFees} onChange={(e) => updateFinancials('amazonFees', e.target.value)} className="field-input with-prefix" /></div>],
    ['shippingCost', 'Shipping / Landed Cost', 'Per-unit landed shipping cost.', 'Reflect landed shipping cost per unit.', <div className="prefix-wrap"><span className="prefix">$</span><input value={financials.shippingCost} onChange={(e) => updateFinancials('shippingCost', e.target.value)} className="field-input with-prefix" /></div>],
    ['ppcCost', 'PPC Cost per Unit', 'Estimated ad spend per unit sold.', 'Estimated advertising cost needed to generate one sale.', <div className="prefix-wrap"><span className="prefix">$</span><input value={financials.ppcCost} onChange={(e) => updateFinancials('ppcCost', e.target.value)} className="field-input with-prefix" /></div>],
    ['inventoryInvestment', 'Initial Inventory Investment', 'Capital committed to opening inventory.', 'Cash needed for your first inventory order.', <div className="prefix-wrap"><span className="prefix">$</span><input value={financials.inventoryInvestment} onChange={(e) => updateFinancials('inventoryInvestment', e.target.value)} className="field-input with-prefix" /></div>],
    ['launchCosts', 'Other Launch Costs', 'Non-inventory costs required to launch.', 'Non-inventory launch expenses.', <div className="prefix-wrap"><span className="prefix">$</span><input value={financials.launchCosts} onChange={(e) => updateFinancials('launchCosts', e.target.value)} className="field-input with-prefix" /></div>],
    ['dailyUnits', 'Expected Daily Units Sold', 'Projected unit sales per day.', 'Drives monthly projection and break-even timing.', <input value={financials.dailyUnits} onChange={(e) => updateFinancials('dailyUnits', e.target.value)} className="field-input" />],
  ];

  const rightRail = activeStep === 'market'
    ? [
        ['Current Product', market.product || 'Untitled', 'default'],
        ['Monthly Search Volume', market.monthlySearchVolume || '—', 'good'],
        ['2-Year Threshold', market.twoYearThreshold === 'yes' ? 'Pass' : 'Fail', market.twoYearThreshold === 'yes' ? 'good' : 'caution'],
        ['Seller Snapshot', `${market.successfulSellers || '0'} successful / ${market.totalSellers || '0'} total`, 'default'],
        ['Conversion Gap', `${market.expectedCR || '0'}% vs ${market.marketCR || '0'}%`, 'default'],
      ]
    : activeStep === 'financials'
      ? [
          ['Total Cost / Unit', `$${totalCost.toFixed(2)}`, 'default'],
          ['Profit / Unit', `$${profitPerUnit.toFixed(2)}`, profitPerUnit > 5 ? 'good' : 'caution'],
          ['Net Margin', `${netMargin.toFixed(1)}%`, netMargin >= 20 ? 'good' : 'caution'],
          ['Total Investment', `$${totalInvestment.toFixed(0)}`, 'default'],
          ['ROI Snapshot', `${roi.toFixed(2)}%`, roi > 0 ? 'good' : 'caution'],
        ]
      : activeStep === 'gate'
        ? [
            ['Gate Status', gateStatus, passesGate ? 'good' : borderlineGate ? 'caution' : 'danger'],
            ['AI Access', aiAvailable ? (passesGate ? 'Unlocked' : borderlineGate ? 'Warning' : 'Override') : 'Locked', aiAvailable ? 'good' : 'danger'],
            ['Market Score', `${marketScore}/10`, marketScore >= 6 ? 'good' : 'caution'],
            ['Net Margin', `${netMargin.toFixed(1)}%`, netMargin >= 20 ? 'good' : 'caution'],
            ['Success Rate', `${(successRate * 100).toFixed(0)}%`, successRate >= 0.2 ? 'good' : 'caution'],
          ]
        : activeStep === 'ai'
          ? [
              ['AI Access', aiAvailable ? 'Available' : 'Locked', aiAvailable ? 'good' : 'danger'],
              ['Research Run', aiRun ? 'Completed' : 'Waiting', aiRun ? 'good' : 'default'],
              ['Gate Status', gateStatus, passesGate ? 'good' : borderlineGate ? 'caution' : 'danger'],
              ['Current Product', market.product || 'Untitled', 'default'],
              ['Next Step', 'Results', 'default'],
            ]
          : [
              ['Verdict', passesGate ? 'Viable' : borderlineGate ? 'Proceed with Caution' : 'High Risk', passesGate ? 'good' : borderlineGate ? 'caution' : 'danger'],
              ['Monthly Profit', `$${monthlyProfit.toFixed(0)}`, monthlyProfit > 0 ? 'good' : 'danger'],
              ['Break-Even', `${breakEvenDays ? breakEvenDays.toFixed(0) : '—'} days`, 'default'],
              ['Market Score', `${marketScore}/10`, marketScore >= 6 ? 'good' : 'caution'],
              ['AI Research', aiRun ? 'Completed' : 'Not Run', aiRun ? 'good' : 'default'],
            ];

  return (
    <div className="stack-lg">
      <Card className="pad-lg">
        <div className="row-between">
          <div>
            <div className="section-kicker">Module</div>
            <h2>Product Validation</h2>
          </div>
          <div className="subtle">Interactive demo</div>
        </div>

        <div className="module-grid">
          <div className="stack">
            <Card className="pad-md">
              <div className="row-between"><h3>Step Rail</h3><div className="subtle">Navigate</div></div>
              <div className="stack-sm">
                {['market', 'financials', 'gate', 'ai', 'results'].map((step) => {
                  const unlocked = step === 'market' || step === 'financials' || step === 'gate' || (step === 'ai' && aiAvailable) || (step === 'results' && aiRun);
                  const label = step === 'gate' ? 'Strategy Gate' : step === 'ai' ? 'AI Improvement Research' : step.charAt(0).toUpperCase() + step.slice(1);
                  return (
                    <button key={step} type="button" disabled={!unlocked} onClick={() => unlocked && setActiveStep(step)} className={`step-button ${step === activeStep ? 'selected' : ''} ${!unlocked ? 'locked' : ''}`}>
                      <span>{label}</span>
                      {!unlocked ? <span className="tiny-label">Locked</span> : null}
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          <div>
            {activeStep === 'market' ? (
              <Card className="pad-lg accent-emerald">
                <div className="row-between wrap">
                  <div>
                    <div className="section-kicker">Active Workspace</div>
                    <h2>Market Inputs</h2>
                    <p className="body-copy">Enter the market-side validation data for the selected idea.</p>
                  </div>
                  <button type="button" className="primary-button emerald" onClick={() => setActiveStep('financials')}>Continue to Financials</button>
                </div>
                <div className="grid grid-3">
                  {marketFields.map(([key, label, helper, info, node]) => (
                    <InfoField key={key} label={label} helper={helper} info={info} openInfo={openInfo} setOpenInfo={setOpenInfo} fieldKey={key} accent="emerald">{node}</InfoField>
                  ))}
                </div>
              </Card>
            ) : activeStep === 'financials' ? (
              <Card className="pad-lg accent-lime">
                <div className="row-between wrap">
                  <div>
                    <div className="section-kicker">Active Workspace</div>
                    <h2>Financial Inputs</h2>
                    <p className="body-copy">Enter the financial assumptions that drive unit economics and break-even.</p>
                  </div>
                  <button type="button" className="primary-button lime" onClick={() => setActiveStep('gate')}>Continue to Strategy Gate</button>
                </div>
                <div className="grid grid-3">
                  {financialFields.map(([key, label, helper, info, node]) => (
                    <InfoField key={key} label={label} helper={helper} info={info} openInfo={openInfo} setOpenInfo={setOpenInfo} fieldKey={key} accent="lime">{node}</InfoField>
                  ))}
                </div>
              </Card>
            ) : activeStep === 'gate' ? (
              <Card className="pad-lg">
                <div className="row-between wrap">
                  <div>
                    <div className="section-kicker">Active Workspace</div>
                    <h2>Strategy Gate</h2>
                    <p className="body-copy">This decides whether the idea has earned access to AI Improvement Research using the prototype thresholds.</p>
                  </div>
                  <StatCard label="Gate Status" value={gateStatus} tone={passesGate ? 'good' : borderlineGate ? 'caution' : 'danger'} />
                </div>
                <div className="grid grid-5">
                  <StatCard label="Market Score" value={`${marketScore}/10`} tone={marketScore >= 6 ? 'good' : marketScore >= 5 ? 'caution' : 'danger'} />
                  <StatCard label="Risk Level" value={riskLabel} tone={riskLabel === 'Low' ? 'good' : riskLabel === 'Medium' ? 'caution' : 'danger'} />
                  <StatCard label="Net Margin" value={`${netMargin.toFixed(1)}%`} tone={netMargin >= 20 ? 'good' : netMargin >= 15 ? 'caution' : 'danger'} />
                  <StatCard label="Profit / Unit" value={`$${profitPerUnit.toFixed(2)}`} tone={profitPerUnit > 5 ? 'good' : profitPerUnit >= 4 ? 'caution' : 'danger'} />
                  <StatCard label="Success Rate" value={`${(successRate * 100).toFixed(0)}%`} tone={successRate >= 0.2 ? 'good' : successRate >= 0.15 ? 'caution' : 'danger'} />
                </div>
                <div className="two-col">
                  <div className="mini-panel">
                    <div className="panel-title">Why it landed here</div>
                    <ul className="list-copy">
                      <li>{marketScore >= 6 ? 'Market score meets the default threshold.' : 'Market score is below the preferred threshold.'}</li>
                      <li>{netMargin >= 20 ? 'Net margin is strong enough for the default pass condition.' : netMargin >= 15 ? 'Net margin is workable, but not comfortably strong.' : 'Net margin is thin and weakens the idea materially.'}</li>
                      <li>{profitPerUnit > 5 ? 'Profit per unit is above the minimum threshold.' : 'Profit per unit is too close to the floor or below it.'}</li>
                      <li>{successRate >= 0.2 ? 'Seller success rate suggests the niche can reward good execution.' : 'Seller success rate implies a harder niche where too few sellers win.'}</li>
                      <li>{riskLevel < 5 ? 'Risk level remains below the hard fail cutoff.' : 'Risk level is high enough to create a fail condition.'}</li>
                    </ul>
                  </div>
                  <div className="mini-panel">
                    <div className="panel-title">AI Access State</div>
                    <div className={`ai-state ${aiAvailable ? 'good' : 'danger'}`}>{passesGate ? 'Unlocked' : borderlineGate ? 'Unlocked with Warning' : 'Locked'}</div>
                    {borderlineGate ? <div className="warning-box">This idea can proceed to AI research, but it should do so with warning because the signals are not fully convincing.</div> : null}
                    {!aiAvailable ? <button type="button" className="primary-button emerald full" onClick={() => setAiOverride(true)}>Override and Unlock AI</button> : null}
                    {aiAvailable ? <button type="button" className="primary-button cyan full" onClick={() => setActiveStep('ai')}>Continue to AI Research</button> : null}
                  </div>
                </div>
              </Card>
            ) : activeStep === 'ai' ? (
              <Card className="pad-lg accent-cyan">
                <div className="row-between wrap">
                  <div>
                    <div className="section-kicker">Active Workspace</div>
                    <h2>AI Improvement Research</h2>
                    <p className="body-copy">Plug-in ready shell for the existing Claude-powered improvement research. One run per idea.</p>
                  </div>
                  <StatCard label="AI Access" value={aiAvailable ? 'Available' : 'Locked'} tone={aiAvailable ? 'good' : 'danger'} />
                </div>
                <div className="two-col">
                  <div className="mini-panel">
                    <div className="panel-title">Research Trigger</div>
                    <div className="readout-box">Product keyword inherited from idea: <span className="strong">{market.product}</span></div>
                    {borderlineGate ? <div className="warning-box">Warning: this idea reached AI with a borderline gate result.</div> : null}
                    <button type="button" disabled={!aiAvailable || aiRun} className="primary-button cyan full" onClick={() => setAiRun(true)}>{aiRun ? 'Research already completed for this idea' : 'Run AI Improvement Research'}</button>
                    <div className="subtle body-copy">One search per idea. Once generated, the result set stays attached to this idea.</div>
                  </div>
                  <div className="mini-panel">
                    <div className="row-between"><div className="panel-title">Research Output Surface</div><div className={`mini-pill ${aiRun ? 'good' : ''}`}>{aiRun ? 'Ready' : 'Waiting'}</div></div>
                    {!aiRun ? (
                      <div className="stack-sm"><div className="skeleton-card" /><div className="skeleton-card" /><div className="skeleton-card" /></div>
                    ) : (
                      <div className="stack-sm">
                        <div className="result-note good"><div className="note-title">Top Improvement Opportunity</div><div>Primary review-driven opportunity area from the existing research engine would render here.</div></div>
                        <div className="result-note"><div className="note-title">Differentiation Direction</div><div>The main strategic differentiation angle from the current dashboard research would surface here.</div></div>
                        <div className="result-note"><div className="note-title">Customer Friction Themes</div><div>Grouped review pain points and recurring complaint patterns would be displayed here.</div></div>
                      </div>
                    )}
                  </div>
                </div>
                {aiRun ? <div className="top-gap"><button type="button" className="primary-button neutral" onClick={() => setActiveStep('results')}>Continue to Results</button></div> : null}
              </Card>
            ) : (
              <Card className="pad-lg">
                <div className="hero-grid">
                  <div>
                    <div className="section-kicker">Final Decision Layer</div>
                    <h2>Results</h2>
                    <p className="body-copy wide-copy">This is the final synthesis layer for Product Validation, combining Market, Financials, Strategy Gate, and AI Improvement Research into one decision surface.</p>
                  </div>
                  <div className={`verdict-card ${passesGate ? 'good' : borderlineGate ? 'caution' : 'danger'}`}>
                    <div className="eyebrow">Verdict</div>
                    <div className="verdict-title">{passesGate ? 'Viable' : borderlineGate ? 'Proceed with Caution' : 'High Risk'}</div>
                    <div className="body-copy">{passesGate ? 'The idea clears the default gate thresholds with enough strength to justify progression.' : borderlineGate ? 'The idea is usable, but the numbers are not fully convincing and should be treated with caution.' : 'The current signal mix is too weak to support a clean go-forward decision.'}</div>
                  </div>
                </div>

                <div className="results-grid">
                  <div className="stack">
                    <Card className="pad-lg">
                      <div className="row-between"><h3>Performance Snapshot</h3><div className={`mini-pill ${passesGate ? 'good' : borderlineGate ? 'caution' : 'danger'}`}>{gateStatus}</div></div>
                      <div className="grid grid-4">
                        <div className="mini-card"><div className="eyebrow">Profit / Unit</div><div className="big-number">${profitPerUnit.toFixed(2)}</div></div>
                        <div className="mini-card"><div className="eyebrow">Net Margin</div><div className="big-number">{netMargin.toFixed(1)}%</div></div>
                        <div className="mini-card"><div className="eyebrow">Market Score</div><div className="big-number">{marketScore}/10</div></div>
                        <div className="mini-card"><div className="eyebrow">Risk</div><div className="big-number">{riskLabel}</div></div>
                      </div>
                      <div className="two-col">
                        <div className="mini-panel">
                          <div className="row-between"><div className="panel-title">Market Quality Gauge</div><div className="subtle">{marketScore}/10</div></div>
                          <div className="gauge-track"><div className={`gauge-fill ${marketScore >= 6 ? 'good' : marketScore >= 5 ? 'caution' : 'danger'}`} style={{ width: `${marketScore * 10}%` }} /></div>
                          <div className="grid grid-2">
                            <div className="mini-card compact">Success Rate: {(successRate * 100).toFixed(0)}%</div>
                            <div className="mini-card compact">New Seller Ratio: {(newSellerRatio * 100).toFixed(0)}%</div>
                          </div>
                        </div>
                        <div className="mini-panel">
                          <div className="row-between"><div className="panel-title">Capital Recovery View</div><div className="subtle">{breakEvenDays ? breakEvenDays.toFixed(0) : '—'} days</div></div>
                          <div className="bar-chart">
                            <div className="bar emerald" style={{ height: `${Math.min(75, Math.max(20, (profitPerUnit / Math.max(nums.price, 1)) * 180))}%` }} />
                            <div className="bar cyan" style={{ height: `${Math.min(85, Math.max(25, (monthlyProfit / Math.max(totalInvestment, 1)) * 60 + 25))}%` }} />
                            <div className="bar soft" style={{ height: `${Math.min(90, Math.max(20, 90 - Math.min(70, breakEvenDays || 70)))}%` }} />
                            <div className="bar lime" style={{ height: `${Math.min(85, Math.max(20, roi / 3))}%` }} />
                          </div>
                          <div className="grid grid-4 tiny-grid-labels"><div>Margin</div><div>Monthly</div><div>Recovery</div><div>ROI</div></div>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="stack">
                    <Card className="pad-lg">
                      <h3>Decision Drivers</h3>
                      <div className="stack-sm">
                        <div className="result-note good"><div className="note-title">What helps</div><div>{marketScore >= 6 ? 'Market quality is supportive.' : 'Market quality is not a strong support.'} {netMargin >= 20 ? 'Margin structure is healthy.' : 'Margin structure is not yet strong.'}</div></div>
                        <div className="result-note caution"><div className="note-title">What pressures the decision</div><div>{successRate >= 0.2 ? 'Seller success rate is acceptable.' : 'Seller success rate is lower than preferred.'} {riskLabel === 'Low' ? 'Overall risk remains controlled.' : 'Risk factors need attention before stronger conviction.'}</div></div>
                      </div>
                    </Card>
                    <Card className="pad-lg">
                      <div className="row-between"><h3>AI Insight Layer</h3><div className={`mini-pill ${aiRun ? 'good' : ''}`}>{aiRun ? 'Integrated' : 'Waiting'}</div></div>
                      {!aiRun ? <div className="mini-panel body-copy">AI improvement research has not yet been run for this idea, so Results is currently showing only the market and financial layers.</div> : <div className="stack-sm"><div className="result-note good"><div className="note-title">Improvement Summary</div><div>The top research-driven product improvement direction appears here.</div></div><div className="result-note"><div className="note-title">Differentiation Insight</div><div>The differentiation angle from the AI module feeds into the final decision context here.</div></div><div className="result-note"><div className="note-title">Customer Friction Themes</div><div>Recurring complaints and review-driven friction patterns appear here to sharpen the final readout.</div></div></div>}
                    </Card>
                  </div>
                </div>
              </Card>
            )}
          </div>

          <div className="stack">
            <Card className="pad-md">
              <div className="row-between"><h3>Live Summary Rail</h3><div className="subtle">Updates by step</div></div>
              <div className="stack">{rightRail.map(([label, value, tone]) => <StatCard key={label} label={label} value={value} tone={tone} />)}</div>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
}
