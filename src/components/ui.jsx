import React from 'react';

export function Card({ children, className = '' }) {
  return <div className={`card ${className}`}>{children}</div>;
}

export function StatCard({ label, value, tone = 'default' }) {
  return (
    <div className={`stat-card tone-${tone}`}>
      <div className="eyebrow">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}

export function InfoField({ label, helper, info, children, openInfo, setOpenInfo, fieldKey, accent = 'emerald' }) {
  const isOpen = openInfo === fieldKey;
  return (
    <div className={`input-card accent-${accent}`}>
      <div className="input-head">
        <div>
          <div className="input-label">{label}</div>
          <div className="input-helper">{helper}</div>
        </div>
        <button type="button" className={`info-button ${isOpen ? 'is-open' : ''}`} onClick={() => setOpenInfo(isOpen ? '' : fieldKey)}>i</button>
      </div>
      {children}
      {isOpen ? <div className={`info-panel accent-${accent}`}>{info}</div> : null}
    </div>
  );
}

export function ShellHeader({ title, subtitle, right }) {
  return (
    <div className="shell-header">
      <div>
        <div className="section-kicker">Orbit Forge · V1 Demo</div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {right ? <div className="header-right">{right}</div> : null}
    </div>
  );
}
