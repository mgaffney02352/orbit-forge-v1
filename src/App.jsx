import React, { useMemo, useState } from 'react';
import { Boxes, CheckCircle2, FileText, Globe2, Lock, Package, Palette, Rocket } from 'lucide-react';
import { Card, ShellHeader, StatCard } from './components/ui';
import Home from './components/Home';
import ProductValidation from './components/ProductValidation';
import Sourcing from './components/Sourcing';
import ComingSoon from './components/ComingSoon';

export default function App() {
  const [module, setModule] = useState('home');
  const [openInfo, setOpenInfo] = useState('');
  const [activePVStep, setActivePVStep] = useState('market');
  const [aiOverride, setAiOverride] = useState(false);
  const [aiRun, setAiRun] = useState(false);

  const [products, setProducts] = useState([
    { id: 1, name: 'Ceramic Meal Prep Container' },
    { id: 2, name: 'Magnetic Spice Rack' },
    { id: 3, name: 'Collapsible Laundry Basket' },
  ]);
  const [selectedProductId, setSelectedProductId] = useState(1);

  const [market, setMarket] = useState({
    product: 'Ceramic Meal Prep Container',
    monthlySearchVolume: '24500',
    twoYearThreshold: 'yes',
    clickedProducts: '42',
    marketCR: '11.4',
    expectedCR: '14.2',
    totalSellers: '26',
    newSellers: '6',
    successfulSellers: '11',
    avgReviews: '184',
  });

  const [financials, setFinancials] = useState({
    sellingPrice: '39.99',
    cogs: '13.20',
    cogsManualOverride: false,
    amazonFees: '9.80',
    shippingCost: '2.10',
    ppcCost: '4.20',
    inventoryInvestment: '2800',
    launchCosts: '1300',
    dailyUnits: '8',
  });

  const [sourcingByProduct, setSourcingByProduct] = useState({
    1: [
      {
        id: 101,
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
        id: 102,
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
    2: [],
    3: [],
  });

  const [selectedSupplierId, setSelectedSupplierId] = useState(101);
  const [supplierSearch, setSupplierSearch] = useState('');
  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [showAISourcingShell, setShowAISourcingShell] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    company: '', representative: '', contact: '', moq: '', pricing: '', leadTime: '', sampleCost: '', notes: ''
  });

  const nav = [
    { key: 'home', label: 'Home', icon: Package, active: true },
    { key: 'validation', label: 'Product Validation', icon: CheckCircle2, active: true },
    { key: 'sourcing', label: 'Sourcing', icon: Boxes, active: true },
    { key: 'branding', label: 'Branding', icon: Palette, active: false },
    { key: 'listing', label: 'Listing', icon: FileText, active: false },
    { key: 'launch', label: 'Launch', icon: Rocket, active: false },
    { key: 'omni', label: 'Omni Channel', icon: Globe2, active: false },
  ];

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];
  const suppliers = sourcingByProduct[selectedProductId] || [];
  const filteredSuppliers = suppliers.filter((s) =>
    [s.company, s.representative, s.contact, s.notes, s.source].join(' ').toLowerCase().includes(supplierSearch.toLowerCase())
  );
  const selectedSupplier = suppliers.find((s) => s.id === selectedSupplierId) || filteredSuppliers[0] || null;

  const autoCogsValue = useMemo(() => ((parseFloat(financials.sellingPrice) || 0) * 0.33).toFixed(2), [financials.sellingPrice]);
  const effectiveCogs = financials.cogsManualOverride ? financials.cogs : autoCogsValue;
  const num = (v) => parseFloat(v) || 0;
  const nums = {
    searchVol: num(market.monthlySearchVolume),
    clicked: Math.max(num(market.clickedProducts), 1),
    marketCR: num(market.marketCR),
    expectedCR: num(market.expectedCR),
    totalSellers: num(market.totalSellers),
    newSellers: num(market.newSellers),
    successfulSellers: num(market.successfulSellers),
    price: num(financials.sellingPrice),
    cogs: num(effectiveCogs),
    fees: num(financials.amazonFees),
    shipping: num(financials.shippingCost),
    ppc: num(financials.ppcCost),
    inventory: num(financials.inventoryInvestment),
    launch: num(financials.launchCosts),
    dailyUnits: num(financials.dailyUnits),
  };

  const totalCost = nums.cogs + nums.fees + nums.shipping + nums.ppc;
  const profitPerUnit = nums.price - totalCost;
  const netMargin = nums.price > 0 ? (profitPerUnit / nums.price) * 100 : 0;
  const monthlyUnits = nums.dailyUnits * 30;
  const monthlyProfit = monthlyUnits * profitPerUnit;
  const totalInvestment = nums.inventory + nums.launch;
  const breakEvenUnits = profitPerUnit > 0 ? totalInvestment / profitPerUnit : 0;
  const breakEvenDays = nums.dailyUnits > 0 ? breakEvenUnits / nums.dailyUnits : 0;
  const roi = totalInvestment > 0 ? (monthlyProfit / totalInvestment) * 100 : 0;

  const crGap = nums.expectedCR - nums.marketCR;
  const crScore = crGap >= 3 ? 3 : crGap >= 1 ? 2 : crGap >= 0 ? 1 : 0;
  const clickScore = nums.searchVol / nums.clicked > 500 ? 2 : nums.searchVol / nums.clicked > 200 ? 1.5 : 1;
  const newSellerRatio = nums.totalSellers > 0 ? nums.newSellers / nums.totalSellers : 0;
  const satScore = nums.newSellers < 5 && nums.totalSellers < 20 ? 2 : nums.newSellers < 10 && newSellerRatio < 0.2 ? 1.5 : nums.newSellers < 20 && newSellerRatio < 0.35 ? 1 : 0;
  const successRate = nums.totalSellers > 0 ? nums.successfulSellers / nums.totalSellers : 0;
  const successScore = successRate >= 0.5 ? 2 : successRate >= 0.3 ? 1.5 : successRate >= 0.15 ? 1 : 0;
  const historyScore = market.twoYearThreshold === 'yes' ? 2 : 0;
  const marketScore = Math.min(10, Math.round(((crScore + clickScore + satScore + successScore + historyScore) * 10) / 10.5));
  const isSaturated = nums.newSellers > 20 || nums.totalSellers > 60 || newSellerRatio > 0.4;
  const lowSuccessRate = successRate < 0.2 && nums.totalSellers > 10;
  const crMaxed = nums.expectedCR <= nums.marketCR + 1;
  const marginThin = netMargin < 15;
  const riskLevel = (isSaturated ? 2 : 0) + (lowSuccessRate ? 2 : 0) + (crMaxed ? 1 : 0) + (marginThin ? 2 : 0);
  const riskLabel = riskLevel >= 5 ? 'High' : riskLevel >= 3 ? 'Medium' : 'Low';
  const passesGate = netMargin >= 20 && marketScore >= 6 && riskLevel < 5 && profitPerUnit > 5 && successRate >= 0.2;
  const borderlineGate = !passesGate && ((netMargin >= 15 && marketScore >= 5 && profitPerUnit >= 4) || successRate >= 0.15);
  const gateStatus = passesGate ? 'Pass' : borderlineGate ? 'Borderline' : 'Fail';
  const aiAvailable = passesGate || borderlineGate || aiOverride;

  function updateMarket(key, value) {
    setMarket((prev) => ({ ...prev, [key]: value }));
    if (key === 'product') {
      setProducts((prev) => prev.map((p) => (p.id === selectedProductId ? { ...p, name: value || p.name } : p)));
    }
  }

  function updateFinancials(key, value) {
    setFinancials((prev) => ({ ...prev, [key]: value }));
  }

  function addSupplier() {
    if (!newSupplier.company.trim() || suppliers.length >= 40) return;
    const supplier = { id: Date.now(), ...newSupplier, source: 'Manual' };
    setSourcingByProduct((prev) => ({ ...prev, [selectedProductId]: [...(prev[selectedProductId] || []), supplier] }));
    setSelectedSupplierId(supplier.id);
    setShowAddSupplier(false);
    setNewSupplier({ company: '', representative: '', contact: '', moq: '', pricing: '', leadTime: '', sampleCost: '', notes: '' });
  }

  let content;
  if (module === 'home') {
    content = <Home nav={nav} module={module} setModule={setModule} selectedProduct={selectedProduct.name} gateStatus={gateStatus} passesGate={passesGate} borderlineGate={borderlineGate} supplierCount={suppliers.length} />;
  } else if (module === 'validation') {
    content = <ProductValidation market={market} updateMarket={updateMarket} financials={financials} updateFinancials={updateFinancials} openInfo={openInfo} setOpenInfo={setOpenInfo} activeStep={activePVStep} setActiveStep={setActivePVStep} autoCogsValue={autoCogsValue} effectiveCogs={effectiveCogs} totalCost={totalCost} profitPerUnit={profitPerUnit} netMargin={netMargin} totalInvestment={totalInvestment} roi={roi} marketScore={marketScore} riskLabel={riskLabel} successRate={successRate} gateStatus={gateStatus} passesGate={passesGate} borderlineGate={borderlineGate} aiAvailable={aiAvailable} aiOverride={aiOverride} setAiOverride={setAiOverride} aiRun={aiRun} setAiRun={setAiRun} monthlyProfit={monthlyProfit} monthlyUnits={monthlyUnits} breakEvenUnits={breakEvenUnits} breakEvenDays={breakEvenDays} newSellerRatio={newSellerRatio} riskLevel={riskLevel} nums={nums} />;
  } else if (module === 'sourcing') {
    content = <Sourcing products={products} selectedProductId={selectedProductId} setSelectedProductId={setSelectedProductId} sourcingByProduct={sourcingByProduct} selectedSupplierId={selectedSupplierId} setSelectedSupplierId={setSelectedSupplierId} supplierSearch={supplierSearch} setSupplierSearch={setSupplierSearch} suppliers={suppliers} filteredSuppliers={filteredSuppliers} selectedSupplier={selectedSupplier} showAddSupplier={showAddSupplier} setShowAddSupplier={setShowAddSupplier} showAISourcingShell={showAISourcingShell} setShowAISourcingShell={setShowAISourcingShell} newSupplier={newSupplier} setNewSupplier={setNewSupplier} addSupplier={addSupplier} openInfo={openInfo} setOpenInfo={setOpenInfo} />;
  } else if (module === 'branding') {
    content = <ComingSoon title="Branding" description="Future space for brand positioning, naming direction, packaging notes, visual identity guidance, and overall brand structure." bullets={['Brand angle', 'Packaging direction', 'Brand voice', 'Identity guidance']} />;
  } else if (module === 'listing') {
    content = <ComingSoon title="Listing" description="Future workspace for listing creation, copy structure, keyword mapping, image planning, and listing optimization support." bullets={['Listing copy', 'Keyword structure', 'Image stack planning', 'Optimization workflow']} />;
  } else if (module === 'launch') {
    content = <ComingSoon title="Launch" description="Future module for launch planning, PPC readiness, inventory coordination, and early-stage launch execution tracking." bullets={['Launch planning', 'PPC readiness', 'Inventory timing', 'Execution tracking']} />;
  } else {
    content = <ComingSoon title="Omni Channel" description="Future expansion layer for off-Amazon growth, multi-channel planning, and broader brand distribution strategy." bullets={['Channel expansion', 'Off-Amazon growth', 'Multi-platform planning', 'Brand distribution']} />;
  }

  return (
    <div className="app-shell">
      <div className="app-bg">
        <div className="app-frame">
          <ShellHeader
            title="Actual navigable demo model"
            subtitle="This is a single demo app you can navigate. Product Validation and Sourcing are interactive. The remaining modules are present as structured placeholders so the full system can be explored."
            right={
              <div className="grid grid-2">
                <StatCard label="Current View" value={nav.find((n) => n.key === module)?.label || 'Home'} />
                <StatCard label="Selected Product" value={selectedProduct.name} />
                <StatCard label="Gate Status" value={gateStatus} tone={passesGate ? 'good' : borderlineGate ? 'caution' : 'danger'} />
                <StatCard label="Suppliers Tracked" value={String(suppliers.length)} tone={suppliers.length > 0 ? 'good' : 'default'} />
              </div>
            }
          />

          <div className="app-grid">
            <Card className="pad-lg sidebar-card">
              <div className="row-between"><h3>Navigation</h3><div className="subtle">Demo modules</div></div>
              <div className="stack-sm">
                {nav.map((item) => {
                  const Icon = item.icon;
                  const selected = item.key === module;
                  return (
                    <button key={item.key} type="button" onClick={() => setModule(item.key)} className={`nav-button ${selected ? 'selected' : ''}`}>
                      <div className="row-between">
                        <div className="row-gap"><Icon size={18} /><span className="nav-label">{item.label}</span></div>
                        {item.active ? <CheckCircle2 size={16} className="icon-good" /> : <Lock size={16} className="icon-muted" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>

            <div>{content}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
