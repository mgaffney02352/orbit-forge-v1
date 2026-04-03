import React from 'react';
import { CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { Card, StatCard } from './ui';

export default function Home({ nav, module, setModule, selectedProduct, gateStatus, passesGate, borderlineGate, supplierCount }) {
  return (
    <div className="stack-lg">
      <Card className="pad-lg">
        <div className="hero-grid">
          <div>
            <div className="pill success"><Sparkles size={14} />V1 Demo</div>
            <h2>Orbit Forge Command Center</h2>
            <p className="body-copy wide-copy">A navigable v1 demo for Amazon private label sellers. Product Validation and Sourcing are live enough to click through. Branding, Listing, Launch, and Omni Channel are reserved for future builds.</p>
          </div>
          <div className="grid grid-2">
            <StatCard label="Active Modules" value="2" tone="good" />
            <StatCard label="Coming Soon" value="4" />
            <StatCard label="Selected Product" value={selectedProduct} />
            <StatCard label="AI Gate" value={gateStatus} tone={passesGate ? 'good' : borderlineGate ? 'caution' : 'danger'} />
          </div>
        </div>
      </Card>
      <Card className="pad-lg">
        <div className="row-between"><h3>Module Navigator</h3><div className="subtle">Use these as your clickable demo entry points</div></div>
        <div className="grid grid-3">
          {nav.filter((item) => item.key !== 'home').map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.key} type="button" onClick={() => setModule(item.key)} className={`module-tile ${item.active ? 'active' : ''}`}>
                <div className="row-between">
                  <div className="row-gap"><Icon size={18} /><div className="module-name">{item.label}</div></div>
                  {item.active ? <CheckCircle2 size={18} className="icon-good" /> : <Lock size={18} className="icon-muted" />}
                </div>
                <div className="body-copy">{item.active ? 'Clickable in this demo.' : 'Reserved placeholder space for a future release.'}</div>
              </button>
            );
          })}
        </div>
      </Card>
      <Card className="pad-lg">
        <div className="row-between"><h3>Live v1 status</h3><div className="subtle">Current build posture</div></div>
        <div className="grid grid-4">
          <StatCard label="Current View" value={nav.find((n) => n.key === module)?.label || 'Home'} />
          <StatCard label="Product" value={selectedProduct} />
          <StatCard label="Suppliers" value={String(supplierCount)} tone={supplierCount > 0 ? 'good' : 'default'} />
          <StatCard label="Validation State" value={gateStatus} tone={passesGate ? 'good' : borderlineGate ? 'caution' : 'danger'} />
        </div>
      </Card>
    </div>
  );
}
