import React from 'react';
import { Lock } from 'lucide-react';
import { Card } from './ui';

export default function ComingSoon({ title, description, bullets }) {
  return (
    <div className="stack-lg">
      <Card className="pad-lg">
        <div className="hero-grid">
          <div>
            <div className="pill muted"><Lock size={14} />Coming Soon</div>
            <h2>{title}</h2>
            <p className="body-copy wide-copy">{description}</p>
          </div>
          <div className="verdict-card neutral">
            <div className="eyebrow">Module Status</div>
            <div className="verdict-title">Reserved for v2</div>
            <div className="body-copy">This module is intentionally visible in navigation so the system feels complete without forcing unfinished logic into v1.</div>
          </div>
        </div>
      </Card>
      <Card className="pad-lg">
        <div className="row-between"><h3>Planned capabilities</h3><div className="subtle">Placeholder shell</div></div>
        <div className="grid grid-4">{bullets.map((item) => <div key={item} className="mini-card">{item}</div>)}</div>
      </Card>
    </div>
  );
}
