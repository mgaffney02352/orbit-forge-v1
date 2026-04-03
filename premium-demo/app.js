const state = {
  view: 'overview',
  validationStep: 'market',
  aiRun: false,
  aiOverride: false,
  market: {
    product: 'Ceramic Meal Prep Container',
    monthlySearchVolume: 24500,
    twoYearThreshold: 'yes',
    clickedProducts: 42,
    marketCR: 11.4,
    expectedCR: 14.2,
    totalSellers: 26,
    newSellers: 6,
    successfulSellers: 11,
    avgReviews: 184,
  },
  financials: {
    sellingPrice: 39.99,
    cogsManualOverride: false,
    cogs: 13.2,
    amazonFees: 9.8,
    shippingCost: 2.1,
    ppcCost: 4.2,
    inventoryInvestment: 2800,
    launchCosts: 1300,
    dailyUnits: 8,
  },
  suppliers: [
    {
      id: 1,
      company: 'Ningbo Kitchenware Co.',
      representative: 'Lily Chen',
      contact: 'lily@ningbokitchen.com',
      moq: '500 units',
      pricing: '$3.50/unit',
      leadTime: '18 days',
      sampleCost: '$65 shipped',
      notes: 'Strong communication. Packaging customization available.',
      source: 'Alibaba',
    },
    {
      id: 2,
      company: 'Shenzhen Home Supply',
      representative: 'Ryan Wu',
      contact: 'ryan@shzhome.com',
      moq: '1000 units',
      pricing: '$3.10/unit',
      leadTime: '22 days',
      sampleCost: '$50 shipped',
      notes: 'Lower unit cost, but slower response times.',
      source: 'Alibaba',
    },
  ],
  selectedSupplierId: 1,
};

const views = {
  overview: {
    title: 'Orbit Forge Overview',
    copy: 'A premium walkthrough of the v1 experience with stronger presentation, clearer hierarchy, and more decisive outputs.',
  },
  validation: {
    title: 'Product Validation',
    copy: 'Structured progression through Market, Financials, Strategy Gate, AI Research, and Results.',
  },
  sourcing: {
    title: 'Sourcing Workspace',
    copy: 'Supplier command surface tied directly to the product, with a premium insertion point for future Alibaba AI support.',
  },
  roadmap: {
    title: 'Orbit Forge Roadmap',
    copy: 'Four future modules held intentionally in reserve so the product feels complete without forcing unfinished workflows into v1.',
  },
};

function metrics() {
  const m = state.market;
  const f = state.financials;
  const autoCogs = Number((f.sellingPrice * 0.33).toFixed(2));
  const cogs = f.cogsManualOverride ? f.cogs : autoCogs;
  const totalCost = cogs + f.amazonFees + f.shippingCost + f.ppcCost;
  const profitPerUnit = f.sellingPrice - totalCost;
  const netMargin = f.sellingPrice > 0 ? (profitPerUnit / f.sellingPrice) * 100 : 0;
  const monthlyUnits = f.dailyUnits * 30;
  const monthlyProfit = monthlyUnits * profitPerUnit;
  const totalInvestment = f.inventoryInvestment + f.launchCosts;
  const breakEvenUnits = profitPerUnit > 0 ? totalInvestment / profitPerUnit : 0;
  const breakEvenDays = f.dailyUnits > 0 ? breakEvenUnits / f.dailyUnits : 0;
  const crGap = m.expectedCR - m.marketCR;
  const crScore = crGap >= 3 ? 3 : crGap >= 1 ? 2 : crGap >= 0 ? 1 : 0;
  const clickRatio = m.monthlySearchVolume / Math.max(m.clickedProducts, 1);
  const clickScore = clickRatio > 500 ? 2 : clickRatio > 200 ? 1.5 : 1;
  const newSellerRatio = m.totalSellers > 0 ? m.newSellers / m.totalSellers : 0;
  const satScore = m.newSellers < 5 && m.totalSellers < 20 ? 2 : m.newSellers < 10 && newSellerRatio < 0.2 ? 1.5 : m.newSellers < 20 && newSellerRatio < 0.35 ? 1 : 0;
  const successRate = m.totalSellers > 0 ? m.successfulSellers / m.totalSellers : 0;
  const successScore = successRate >= 0.5 ? 2 : successRate >= 0.3 ? 1.5 : successRate >= 0.15 ? 1 : 0;
  const historyScore = m.twoYearThreshold === 'yes' ? 2 : 0;
  const marketScore = Math.min(10, Math.round(((crScore + clickScore + satScore + successScore + historyScore) * 10) / 10.5));
  const isSaturated = m.newSellers > 20 || m.totalSellers > 60 || newSellerRatio > 0.4;
  const lowSuccessRate = successRate < 0.2 && m.totalSellers > 10;
  const crMaxed = m.expectedCR <= m.marketCR + 1;
  const marginThin = netMargin < 15;
  const riskLevel = (isSaturated ? 2 : 0) + (lowSuccessRate ? 2 : 0) + (crMaxed ? 1 : 0) + (marginThin ? 2 : 0);
  const riskLabel = riskLevel >= 5 ? 'High' : riskLevel >= 3 ? 'Medium' : 'Low';
  const passesGate = netMargin >= 20 && marketScore >= 6 && riskLevel < 5 && profitPerUnit > 5 && successRate >= 0.2;
  const borderlineGate = !passesGate && ((netMargin >= 15 && marketScore >= 5 && profitPerUnit >= 4) || successRate >= 0.15);
  return {
    autoCogs, cogs, totalCost, profitPerUnit, netMargin, monthlyUnits, monthlyProfit,
    totalInvestment, breakEvenUnits, breakEvenDays, newSellerRatio, successRate,
    marketScore, riskLevel, riskLabel, passesGate, borderlineGate,
    gateStatus: passesGate ? 'Pass' : borderlineGate ? 'Borderline' : 'Fail',
    aiAvailable: passesGate || borderlineGate || state.aiOverride,
  };
}

function setView(view) {
  state.view = view;
  document.querySelectorAll('.nav-item').forEach((node) => node.classList.toggle('active', node.dataset.view === view));
  document.querySelectorAll('.view').forEach((node) => node.classList.toggle('active', node.id === `view-${view}`));
  document.getElementById('hero-title').textContent = views[view].title;
  document.getElementById('hero-copy').textContent = views[view].copy;
}

function renderOverview() {
  document.getElementById('view-overview').innerHTML = `
    <div class="grid-hero">
      <div class="panel feature-panel">
        <div class="eyebrow">Why this version is stronger</div>
        <h3>Built to feel like a real product room</h3>
        <p>This concept pushes Orbit Forge toward a cleaner executive feel: larger hierarchy, clearer status language, stronger module framing, and a more deliberate visual system.</p>
        <div class="feature-points">
          <div class="feature-chip">Premium shell</div>
          <div class="feature-chip">Decisive outputs</div>
          <div class="feature-chip">Modular growth path</div>
          <div class="feature-chip">Client-facing polish</div>
        </div>
      </div>
      <div class="panel verdict-panel">
        <div class="eyebrow">Recommended V1 Story</div>
        <div class="verdict-title">Validate → Source → Expand</div>
        <p>Lead with two strong working modules, then make the future modules feel intentional rather than missing.</p>
      </div>
    </div>
    <div class="grid-3">
      <div class="panel module-card live"><div class="module-top"><div><div class="eyebrow">Live Module</div><h4>Product Validation</h4></div><span class="pill success">Active</span></div><p>Market, Financials, Strategy Gate, AI Improvement Research, and Results in one progression.</p></div>
      <div class="panel module-card live"><div class="module-top"><div><div class="eyebrow">Live Module</div><h4>Sourcing</h4></div><span class="pill success">Active</span></div><p>Product-linked supplier cards, sourcing workflow continuity, and a reserved Alibaba AI assistant surface.</p></div>
      <div class="panel module-card preview"><div class="module-top"><div><div class="eyebrow">Reserved Modules</div><h4>Branding · Listing · Launch · Omni Channel</h4></div><span class="pill muted">Preview</span></div><p>Structured placeholders keep the system feeling complete without forcing weak unfinished logic into v1.</p></div>
    </div>`;
}

function renderValidation() {
  const m = metrics();
  const stage = document.getElementById('validation-stage');
  const readout = document.getElementById('validation-readout');
  document.querySelectorAll('.rail-step').forEach((node) => node.classList.toggle('active', node.dataset.step === state.validationStep));

  readout.innerHTML = '';
  const readouts = state.validationStep === 'market'
    ? [
        ['Current Product', state.market.product, 'good'],
        ['Monthly Search Volume', String(state.market.monthlySearchVolume), 'good'],
        ['2-Year Threshold', state.market.twoYearThreshold === 'yes' ? 'Pass' : 'Fail', state.market.twoYearThreshold === 'yes' ? 'good' : 'caution'],
        ['Seller Snapshot', `${state.market.successfulSellers} successful / ${state.market.totalSellers} total`, 'default'],
      ]
    : state.validationStep === 'financials'
    ? [
        ['Profit / Unit', `$${m.profitPerUnit.toFixed(2)}`, m.profitPerUnit > 5 ? 'good' : 'caution'],
        ['Net Margin', `${m.netMargin.toFixed(1)}%`, m.netMargin >= 20 ? 'good' : 'caution'],
        ['Total Investment', `$${m.totalInvestment.toFixed(0)}`, 'default'],
        ['ROI Snapshot', `${m.monthlyProfit > 0 ? ((m.monthlyProfit / m.totalInvestment) * 100).toFixed(1) : '0'}%`, 'good'],
      ]
    : state.validationStep === 'gate'
    ? [
        ['Gate Status', m.gateStatus, m.passesGate ? 'good' : m.borderlineGate ? 'caution' : 'danger'],
        ['Market Score', `${m.marketScore}/10`, m.marketScore >= 6 ? 'good' : 'caution'],
        ['Risk', m.riskLabel, m.riskLabel === 'Low' ? 'good' : m.riskLabel === 'Medium' ? 'caution' : 'danger'],
        ['Success Rate', `${(m.successRate * 100).toFixed(0)}%`, m.successRate >= 0.2 ? 'good' : 'caution'],
      ]
    : state.validationStep === 'ai'
    ? [
        ['AI Access', m.aiAvailable ? 'Available' : 'Locked', m.aiAvailable ? 'good' : 'danger'],
        ['Research Run', state.aiRun ? 'Completed' : 'Waiting', state.aiRun ? 'good' : 'default'],
        ['Gate Status', m.gateStatus, m.passesGate ? 'good' : m.borderlineGate ? 'caution' : 'danger'],
      ]
    : [
        ['Verdict', m.passesGate ? 'Viable' : m.borderlineGate ? 'Proceed with Caution' : 'High Risk', m.passesGate ? 'good' : m.borderlineGate ? 'caution' : 'danger'],
        ['Monthly Profit', `$${m.monthlyProfit.toFixed(0)}`, m.monthlyProfit > 0 ? 'good' : 'danger'],
        ['Break-Even', `${m.breakEvenDays ? m.breakEvenDays.toFixed(0) : '—'} days`, 'default'],
      ];

  readouts.forEach(([label, value, tone]) => {
    const div = document.createElement('div');
    div.className = `readout-card ${tone === 'default' ? '' : tone}`;
    div.innerHTML = `<div class="eyebrow">${label}</div><div class="value">${value}</div>`;
    readout.appendChild(div);
  });

  document.getElementById('advance-validation').onclick = () => {
    const order = ['market', 'financials', 'gate', 'ai', 'results'];
    const idx = order.indexOf(state.validationStep);
    const next = order[Math.min(idx + 1, order.length - 1)];
    if (next === 'ai' && !m.aiAvailable) return;
    if (next === 'results' && !state.aiRun) return;
    state.validationStep = next;
    renderValidation();
  };

  if (state.validationStep === 'market') {
    document.getElementById('validation-title').textContent = 'Market Inputs';
    document.getElementById('validation-copy').textContent = 'Evaluate demand, competition, and seller quality before spending AI usage or capital.';
    stage.innerHTML = `
      <div class="input-grid">
        ${[
          ['Product', 'product', state.market.product],
          ['Monthly Search Volume', 'monthlySearchVolume', state.market.monthlySearchVolume],
          ['Clicked Products', 'clickedProducts', state.market.clickedProducts],
          ['Market Avg. CR', 'marketCR', state.market.marketCR],
          ['Expected CR', 'expectedCR', state.market.expectedCR],
          ['Total Sellers', 'totalSellers', state.market.totalSellers],
          ['New Sellers', 'newSellers', state.market.newSellers],
          ['Successful Sellers', 'successfulSellers', state.market.successfulSellers],
          ['Avg Reviews', 'avgReviews', state.market.avgReviews],
        ].map(([label, key, value]) => `<div class="input-card"><label><span>${label}</span><input data-market="${key}" value="${value}" /></label></div>`).join('')}
        <div class="input-card"><label><span>2-Year Threshold</span><select data-market="twoYearThreshold"><option ${state.market.twoYearThreshold === 'yes' ? 'selected' : ''}>yes</option><option ${state.market.twoYearThreshold === 'no' ? 'selected' : ''}>no</option></select></label></div>
      </div>`;
    stage.querySelectorAll('[data-market]').forEach((node) => node.addEventListener('input', (e) => {
      const key = e.target.dataset.market;
      state.market[key] = e.target.tagName === 'SELECT' ? e.target.value : (key === 'product' ? e.target.value : Number(e.target.value));
      if (key !== 'product') resetDownstream();
      renderValidation();
    }));
  } else if (state.validationStep === 'financials') {
    document.getElementById('validation-title').textContent = 'Financial Inputs';
    document.getElementById('validation-copy').textContent = 'Pressure-test unit economics before moving into gate logic.';
    stage.innerHTML = `
      <div class="input-grid">
        ${[
          ['Selling Price', 'sellingPrice', state.financials.sellingPrice],
          ['Amazon Fees', 'amazonFees', state.financials.amazonFees],
          ['Shipping Cost', 'shippingCost', state.financials.shippingCost],
          ['PPC Cost', 'ppcCost', state.financials.ppcCost],
          ['Inventory Investment', 'inventoryInvestment', state.financials.inventoryInvestment],
          ['Launch Costs', 'launchCosts', state.financials.launchCosts],
          ['Expected Daily Units', 'dailyUnits', state.financials.dailyUnits],
        ].map(([label, key, value]) => `<div class="input-card"><label><span>${label}</span><input data-financial="${key}" value="${value}" /></label></div>`).join('')}
        <div class="input-card"><label><span>COGS</span><input data-financial="cogs" value="${state.financials.cogsManualOverride ? state.financials.cogs : m.autoCogs}" ${state.financials.cogsManualOverride ? '' : 'readonly'} /></label><div class="eyebrow">${state.financials.cogsManualOverride ? 'Manual override enabled' : `Auto-filled at 33%: $${m.autoCogs}`}</div><button class="secondary-btn" id="toggle-cogs" type="button">${state.financials.cogsManualOverride ? 'Use Auto' : 'Manual Override'}</button></div>
      </div>`;
    stage.querySelectorAll('[data-financial]').forEach((node) => node.addEventListener('input', (e) => {
      const key = e.target.dataset.financial;
      state.financials[key] = Number(e.target.value);
      resetDownstream();
      renderValidation();
    }));
    document.getElementById('toggle-cogs').onclick = () => {
      state.financials.cogsManualOverride = !state.financials.cogsManualOverride;
      state.financials.cogs = m.autoCogs;
      resetDownstream();
      renderValidation();
    };
  } else if (state.validationStep === 'gate') {
    document.getElementById('validation-title').textContent = 'Strategy Gate';
    document.getElementById('validation-copy').textContent = 'Decide whether the idea deserves AI usage and deeper effort.';
    stage.innerHTML = `
      <div class="results-grid">
        <div class="results-card panel">
          <div class="grid-4">
            <div class="metric-chip ${m.marketScore >= 6 ? 'good' : 'caution'}"><div class="eyebrow">Market Score</div><div class="value">${m.marketScore}/10</div></div>
            <div class="metric-chip ${m.riskLabel === 'Low' ? 'good' : m.riskLabel === 'Medium' ? 'caution' : 'danger'}"><div class="eyebrow">Risk</div><div class="value">${m.riskLabel}</div></div>
            <div class="metric-chip ${m.netMargin >= 20 ? 'good' : 'caution'}"><div class="eyebrow">Net Margin</div><div class="value">${m.netMargin.toFixed(1)}%</div></div>
            <div class="metric-chip ${m.successRate >= 0.2 ? 'good' : 'caution'}"><div class="eyebrow">Success Rate</div><div class="value">${(m.successRate * 100).toFixed(0)}%</div></div>
          </div>
          <div class="decision-card">
            <div class="eyebrow">Why it landed here</div>
            <p>${m.marketScore >= 6 ? 'Market quality is supportive.' : 'Market quality is below the preferred threshold.'}</p>
            <p>${m.netMargin >= 20 ? 'Margin structure is healthy.' : 'Margin structure is not comfortably strong yet.'}</p>
            <p>${m.successRate >= 0.2 ? 'Seller success rate suggests the niche can reward execution.' : 'Too few sellers appear to win cleanly here.'}</p>
          </div>
        </div>
        <div class="decision-card">
          <div class="eyebrow">AI Access State</div>
          <div class="verdict-title">${m.passesGate ? 'Unlocked' : m.borderlineGate ? 'Unlocked with Warning' : m.aiAvailable ? 'Override Unlocked' : 'Locked'}</div>
          <p>${m.passesGate ? 'The idea clears the default thresholds.' : m.borderlineGate ? 'The idea is workable, but not fully convincing.' : 'The current signal mix is too weak for a clean pass.'}</p>
          ${!m.aiAvailable ? '<button id="override-ai" class="primary-btn" type="button">Override and Unlock AI</button>' : '<button id="go-ai" class="primary-btn" type="button">Continue to AI Research</button>'}
        </div>
      </div>`;
    const override = document.getElementById('override-ai');
    if (override) override.onclick = () => { state.aiOverride = true; renderValidation(); };
    const goAi = document.getElementById('go-ai');
    if (goAi) goAi.onclick = () => { state.validationStep = 'ai'; renderValidation(); };
  } else if (state.validationStep === 'ai') {
    document.getElementById('validation-title').textContent = 'AI Improvement Research';
    document.getElementById('validation-copy').textContent = 'Premium shell for the existing Claude-powered improvement research.';
    stage.innerHTML = `
      <div class="results-grid">
        <div class="decision-card">
          <div class="eyebrow">Research Trigger</div>
          <div class="verdict-title">${state.market.product}</div>
          <p>One search per idea. The research result stays attached to the idea after generation.</p>
          <button id="run-ai" class="primary-btn" type="button" ${state.aiRun || !m.aiAvailable ? 'disabled' : ''}>${state.aiRun ? 'Research already completed' : 'Run AI Improvement Research'}</button>
        </div>
        <div class="decision-card">
          <div class="eyebrow">Research Output Surface</div>
          ${!state.aiRun ? '<div class="assistant-shell"><div class="assistant-line"></div><div class="assistant-line short"></div><div class="assistant-boxes"><div></div><div></div></div></div>' : '<div class="bar-wrap"><div class="result-note good"><div class="eyebrow">Top Improvement Opportunity</div><p>Primary review-driven improvement area from the current engine would appear here.</p></div><div class="result-note"><div class="eyebrow">Differentiation Direction</div><p>The main strategic differentiation angle would surface here.</p></div></div>'}
        </div>
      </div>
      ${state.aiRun ? '<div style="margin-top:16px"><button id="go-results" class="primary-btn" type="button">Continue to Results</button></div>' : ''}`;
    const run = document.getElementById('run-ai');
    if (run) run.onclick = () => { state.aiRun = true; renderValidation(); };
    const results = document.getElementById('go-results');
    if (results) results.onclick = () => { state.validationStep = 'results'; renderValidation(); };
  } else {
    document.getElementById('validation-title').textContent = 'Results';
    document.getElementById('validation-copy').textContent = 'Premium synthesis layer for the final go-forward readout.';
    stage.innerHTML = `
      <div class="results-grid">
        <div class="results-card panel">
          <div class="eyebrow">Final Verdict</div>
          <div class="verdict-title">${m.passesGate ? 'Viable' : m.borderlineGate ? 'Proceed with Caution' : 'High Risk'}</div>
          <p>${m.passesGate ? 'The idea clears the core thresholds with enough strength to justify progression.' : m.borderlineGate ? 'The idea is usable, but the signal is not fully convincing.' : 'The current signal mix is too weak to support a clean go-forward decision.'}</p>
          <div class="grid-4" style="margin-top:16px">
            <div class="metric-chip ${m.profitPerUnit > 5 ? 'good' : 'caution'}"><div class="eyebrow">Profit / Unit</div><div class="value">$${m.profitPerUnit.toFixed(2)}</div></div>
            <div class="metric-chip ${m.netMargin >= 20 ? 'good' : 'caution'}"><div class="eyebrow">Net Margin</div><div class="value">${m.netMargin.toFixed(1)}%</div></div>
            <div class="metric-chip ${m.marketScore >= 6 ? 'good' : 'caution'}"><div class="eyebrow">Market Score</div><div class="value">${m.marketScore}/10</div></div>
            <div class="metric-chip ${m.riskLabel === 'Low' ? 'good' : m.riskLabel === 'Medium' ? 'caution' : 'danger'}"><div class="eyebrow">Risk</div><div class="value">${m.riskLabel}</div></div>
          </div>
          <div class="bar-wrap" style="margin-top:16px">
            <div>
              <div class="eyebrow">Market Quality Gauge</div>
              <div class="bar-track"><div class="bar-fill ${m.marketScore >= 6 ? '' : m.marketScore >= 5 ? 'caution' : 'danger'}" style="width:${m.marketScore * 10}%"></div></div>
            </div>
            <div class="bar-chart">
              <div class="bar-a" style="height:${Math.min(90, Math.max(22, (m.profitPerUnit / Math.max(state.financials.sellingPrice, 1)) * 180))}%"></div>
              <div class="bar-b" style="height:${Math.min(86, Math.max(24, (m.monthlyProfit / Math.max(m.totalInvestment, 1)) * 60 + 25))}%"></div>
              <div class="bar-c" style="height:${Math.min(90, Math.max(20, 90 - Math.min(70, m.breakEvenDays || 70)))}%"></div>
              <div class="bar-d" style="height:${Math.min(84, Math.max(20, (m.monthlyProfit > 0 ? ((m.monthlyProfit / m.totalInvestment) * 100) : 0) / 3))}%"></div>
            </div>
          </div>
        </div>
        <div class="results-card panel">
          <div class="eyebrow">AI Insight Layer</div>
          ${state.aiRun ? '<div class="result-note good"><div class="eyebrow">Improvement Summary</div><p>The top research-driven product improvement direction would appear here.</p></div><div class="result-note"><div class="eyebrow">Differentiation Insight</div><p>The differentiation angle from the AI module feeds into the final decision context here.</p></div>' : '<p>AI improvement research has not been run for this idea, so the readout currently reflects only the quantitative layers.</p>'}
          <div class="radar-box" style="margin-top:16px">
            <div class="radar-ring"></div>
            <div class="radar-cross"></div>
            <svg class="radar-shape" viewBox="0 0 100 100">
              <polygon points="50,${50 - Math.min(40, m.marketScore * 4)} ${50 + Math.min(38, Math.max(10, m.netMargin * 1.2))},50 50,${50 + Math.min(38, Math.max(10, (m.riskLevel >= 5 ? 10 : 40 - m.riskLevel * 6)))} ${50 - Math.min(38, Math.max(10, m.successRate * 120))},50" fill="rgba(52,211,153,0.22)" stroke="rgba(110,231,183,0.78)" stroke-width="1.5"></polygon>
            </svg>
            <div class="radar-label top">Market</div>
            <div class="radar-label right">Margin</div>
            <div class="radar-label bottom">Risk</div>
            <div class="radar-label left">Success</div>
          </div>
        </div>
      </div>`;
  }
}

function renderSourcing() {
  const list = document.getElementById('supplier-list');
  const detail = document.getElementById('supplier-detail');
  list.innerHTML = '<div class="eyebrow">Tracked Suppliers</div>';
  state.suppliers.forEach((supplier) => {
    const btn = document.createElement('button');
    btn.className = `supplier-item ${supplier.id === state.selectedSupplierId ? 'active' : ''}`;
    btn.innerHTML = `<div>${supplier.company}</div><div class="supplier-meta">${supplier.representative} · ${supplier.pricing}</div>`;
    btn.onclick = () => { state.selectedSupplierId = supplier.id; renderSourcing(); };
    list.appendChild(btn);
  });
  const supplier = state.suppliers.find((s) => s.id === state.selectedSupplierId) || state.suppliers[0];
  detail.innerHTML = `
    <div class="eyebrow">Supplier Detail Card</div>
    <div class="grid-2">
      <div class="metric-card"><div class="eyebrow">Company</div><div class="metric-value">${supplier.company}</div></div>
      <div class="metric-card"><div class="eyebrow">Representative</div><div class="metric-value">${supplier.representative}</div></div>
      <div class="metric-card"><div class="eyebrow">Contact</div><div class="metric-value">${supplier.contact}</div></div>
      <div class="metric-card"><div class="eyebrow">MOQ</div><div class="metric-value">${supplier.moq}</div></div>
      <div class="metric-card accent-good"><div class="eyebrow">Pricing</div><div class="metric-value">${supplier.pricing}</div></div>
      <div class="metric-card"><div class="eyebrow">Lead Time</div><div class="metric-value">${supplier.leadTime}</div></div>
      <div class="metric-card"><div class="eyebrow">Sample Cost</div><div class="metric-value">${supplier.sampleCost}</div></div>
      <div class="panel" style="padding:16px; grid-column:1/-1"><div class="eyebrow">Notes</div><p>${supplier.notes}</p></div>
    </div>`;
}

function renderRoadmap() {
  document.getElementById('view-roadmap').innerHTML = `
    <div class="grid-4 roadmap-grid">
      <div class="panel roadmap-card"><div class="eyebrow">Coming Soon</div><h4>Branding</h4><p>Brand angle, packaging direction, identity, and positioning guidance.</p></div>
      <div class="panel roadmap-card"><div class="eyebrow">Coming Soon</div><h4>Listing</h4><p>Listing copy, keyword structure, image planning, and optimization workflow.</p></div>
      <div class="panel roadmap-card"><div class="eyebrow">Coming Soon</div><h4>Launch</h4><p>Launch planning, PPC readiness, inventory timing, and execution control.</p></div>
      <div class="panel roadmap-card"><div class="eyebrow">Coming Soon</div><h4>Omni Channel</h4><p>Expansion strategy beyond Amazon into broader brand distribution.</p></div>
    </div>`;
}

function resetDownstream() {
  state.aiRun = false;
  state.aiOverride = false;
  if (state.validationStep === 'ai' || state.validationStep === 'results') {
    state.validationStep = 'gate';
  }
}

function attachEvents() {
  document.querySelectorAll('.nav-item').forEach((node) => node.addEventListener('click', () => setView(node.dataset.view)));
  document.querySelectorAll('.rail-step').forEach((node) => node.addEventListener('click', () => {
    const step = node.dataset.step;
    const m = metrics();
    if (step === 'ai' && !m.aiAvailable) return;
    if (step === 'results' && !state.aiRun) return;
    state.validationStep = step;
    renderValidation();
  }));
  document.getElementById('add-supplier-btn').onclick = () => document.getElementById('supplier-modal').showModal();
  document.getElementById('supplier-form').addEventListener('close', () => {});
  document.getElementById('supplier-form').addEventListener('submit', (e) => {
    if (e.submitter?.value !== 'save') return;
    e.preventDefault();
    const data = new FormData(e.target);
    state.suppliers.push({
      id: Date.now(),
      company: data.get('company'),
      representative: data.get('representative'),
      contact: data.get('contact'),
      moq: data.get('moq'),
      pricing: data.get('pricing'),
      leadTime: data.get('leadTime'),
      sampleCost: data.get('sampleCost'),
      notes: data.get('notes'),
      source: 'Manual',
    });
    state.selectedSupplierId = state.suppliers[state.suppliers.length - 1].id;
    document.getElementById('supplier-modal').close();
    e.target.reset();
    renderSourcing();
  });
}

function init() {
  renderOverview();
  renderValidation();
  renderSourcing();
  renderRoadmap();
  attachEvents();
  setView('overview');
}

init();
