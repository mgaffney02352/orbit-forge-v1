import React from 'react';
import { Search } from 'lucide-react';
import { Card, InfoField, StatCard } from './ui';

export default function Sourcing(props) {
  const {
    products,
    selectedProductId,
    setSelectedProductId,
    sourcingByProduct,
    selectedSupplierId,
    setSelectedSupplierId,
    supplierSearch,
    setSupplierSearch,
    suppliers,
    filteredSuppliers,
    selectedSupplier,
    showAddSupplier,
    setShowAddSupplier,
    showAISourcingShell,
    setShowAISourcingShell,
    newSupplier,
    setNewSupplier,
    addSupplier,
    openInfo,
    setOpenInfo,
  } = props;

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const supplierFields = [
    ['company', 'Company', 'Supplier company name.', 'Use the supplier or factory name exactly as provided.'],
    ['representative', 'Representative', 'Main contact person.', 'The rep or contact person handling your communication.'],
    ['contact', 'Contact', 'Email, phone, or contact handle.', 'Use the best direct channel for follow-up.'],
    ['moq', 'MOQ', 'Minimum order quantity.', 'Important for cash planning and order feasibility.'],
    ['pricing', 'Pricing', 'Quoted unit cost.', 'Store the quoted unit cost exactly as shared.'],
    ['leadTime', 'Lead Time', 'Production time estimate.', 'How long the supplier expects production to take before shipment.'],
    ['sampleCost', 'Sample Cost', 'Cost to receive a sample.', 'Track sample pricing separately.'],
    ['notes', 'Notes', 'General supplier notes.', 'Use this for negotiation notes, quality observations, or red flags.'],
  ];

  return (
    <div className="stack-lg">
      <Card className="pad-lg">
        <div className="row-between">
          <div>
            <div className="section-kicker">Module</div>
            <h2>Sourcing</h2>
          </div>
          <div className="subtle">Interactive demo</div>
        </div>

        <div className="module-grid">
          <div className="stack">
            <Card className="pad-md">
              <div className="row-between"><h3>Products</h3><div className="subtle">Folders</div></div>
              <div className="stack-sm">
                {products.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedProductId(p.id);
                      setSelectedSupplierId((sourcingByProduct[p.id] || [])[0]?.id || null);
                    }}
                    className={`supplier-list-item ${p.id === selectedProductId ? 'selected' : ''}`}
                  >
                    <div className="item-title">{p.name}</div>
                    <div className="item-meta">{(sourcingByProduct[p.id] || []).length} suppliers tracked</div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          <div className="stack-lg">
            <Card className="pad-lg accent-cyan">
              <div className="row-between wrap">
                <div>
                  <div className="section-kicker">Active Workspace</div>
                  <h2>Supplier Management</h2>
                  <p className="body-copy">Add suppliers, store details, and keep them tied to the selected product.</p>
                </div>
                <div className="toolbar-wrap">
                  <div className="search-wrap">
                    <Search size={16} className="search-icon" />
                    <input value={supplierSearch} onChange={(e) => setSupplierSearch(e.target.value)} placeholder="Search suppliers..." className="field-input search-input" />
                  </div>
                  <button type="button" className="secondary-button">Export</button>
                  <button type="button" className="primary-button cyan" onClick={() => setShowAddSupplier(true)}>Add Supplier</button>
                </div>
              </div>

              <div className="two-col">
                <div className="mini-panel">
                  <div className="row-between"><div className="panel-title">Tracked Suppliers</div><div className="subtle">{filteredSuppliers.length} visible</div></div>
                  {filteredSuppliers.length === 0 ? (
                    <div className="empty-box">No suppliers found for this product yet.</div>
                  ) : (
                    <div className="stack-sm">
                      {filteredSuppliers.map((supplier) => (
                        <button key={supplier.id} type="button" onClick={() => setSelectedSupplierId(supplier.id)} className={`supplier-list-item ${supplier.id === selectedSupplierId ? 'selected' : ''}`}>
                          <div className="item-title">{supplier.company}</div>
                          <div className="item-meta">{supplier.representative} · {supplier.pricing}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mini-panel">
                  <div className="row-between"><div className="panel-title">Supplier Detail Card</div><div className="subtle">{selectedSupplier ? selectedSupplier.source : '—'}</div></div>
                  {!selectedSupplier ? (
                    <div className="empty-box">Select a supplier to view details.</div>
                  ) : (
                    <div className="grid grid-2">
                      <StatCard label="Company" value={selectedSupplier.company} />
                      <StatCard label="Representative" value={selectedSupplier.representative} />
                      <StatCard label="Contact" value={selectedSupplier.contact} />
                      <StatCard label="MOQ" value={selectedSupplier.moq} />
                      <StatCard label="Pricing" value={selectedSupplier.pricing} tone="good" />
                      <StatCard label="Lead Time" value={selectedSupplier.leadTime} />
                      <StatCard label="Sample Cost" value={selectedSupplier.sampleCost} />
                      <div className="note-span"><div className="eyebrow">Notes</div><div className="body-copy">{selectedSupplier.notes}</div></div>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            <Card className="pad-lg accent-emerald">
              <div className="row-between wrap">
                <div>
                  <div className="section-kicker">Future Module Layer</div>
                  <h2>Alibaba Claude Assistant Placeholder</h2>
                  <p className="body-copy">Reserved for a future sourcing bot that can find suppliers, compare suppliers, and populate company info into the supplier cards.</p>
                </div>
                <button type="button" className="primary-button emerald" onClick={() => setShowAISourcingShell(!showAISourcingShell)}>{showAISourcingShell ? 'Hide Assistant Shell' : 'Show Assistant Shell'}</button>
              </div>
              {!showAISourcingShell ? (
                <div className="empty-box">Placeholder hidden. Toggle the assistant shell to preview where the future bot will live.</div>
              ) : (
                <div className="two-col">
                  <div className="mini-panel">
                    <div className="panel-title">Assistant Capabilities</div>
                    <div className="body-copy stack-sm">
                      <p>• Find suppliers with one click</p>
                      <p>• Pull supplier candidates from Alibaba</p>
                      <p>• Compare suppliers against current tracked options</p>
                      <p>• Populate supplier company information into the supplier section</p>
                    </div>
                  </div>
                  <div className="mini-panel">
                    <div className="row-between"><div className="panel-title">Future Bot Surface</div><div className="mini-pill">Placeholder</div></div>
                    <div className="stack-sm">
                      <div className="skeleton-card" />
                      <div className="grid grid-2"><div className="skeleton-card" /><div className="skeleton-card" /></div>
                      <div className="empty-box">The production version would return supplier candidates and push selected supplier data into the card system above.</div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          <div className="stack">
            <Card className="pad-md">
              <div className="row-between"><h3>Live Summary Rail</h3><div className="subtle">Current sourcing state</div></div>
              <div className="stack">
                <StatCard label="Linked Product" value={selectedProduct.name} />
                <StatCard label="Suppliers Tracked" value={String(suppliers.length)} tone={suppliers.length > 0 ? 'good' : 'caution'} />
                <StatCard label="Selected Supplier" value={selectedSupplier ? selectedSupplier.company : 'None'} />
                <StatCard label="MOQ Snapshot" value={selectedSupplier ? selectedSupplier.moq : '—'} />
                <StatCard label="Pricing Snapshot" value={selectedSupplier ? selectedSupplier.pricing : '—'} tone="good" />
              </div>
            </Card>
          </div>
        </div>
      </Card>

      {showAddSupplier ? (
        <div className="modal-backdrop">
          <div className="modal-shell">
            <div className="row-between">
              <div>
                <div className="section-kicker">Add Supplier</div>
                <h2>New Supplier Card</h2>
              </div>
              <button type="button" className="secondary-button" onClick={() => setShowAddSupplier(false)}>Close</button>
            </div>

            <div className="link-box">Linking to product: <span className="strong">{selectedProduct.name}</span></div>

            <div className="grid grid-3">
              {supplierFields.map(([key, label, helper, info]) => (
                <InfoField key={key} label={label} helper={helper} info={info} openInfo={openInfo} setOpenInfo={setOpenInfo} fieldKey={`supplier-${key}`} accent="cyan">
                  {key === 'notes' ? (
                    <textarea value={newSupplier[key]} onChange={(e) => setNewSupplier((prev) => ({ ...prev, [key]: e.target.value }))} className="field-area" />
                  ) : (
                    <input value={newSupplier[key]} onChange={(e) => setNewSupplier((prev) => ({ ...prev, [key]: e.target.value }))} className="field-input" />
                  )}
                </InfoField>
              ))}
            </div>

            <div className="toolbar-right">
              <button type="button" className="secondary-button" onClick={() => setShowAddSupplier(false)}>Cancel</button>
              <button type="button" className="primary-button cyan" onClick={addSupplier} disabled={!newSupplier.company.trim() || suppliers.length >= 40}>Add Supplier</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
