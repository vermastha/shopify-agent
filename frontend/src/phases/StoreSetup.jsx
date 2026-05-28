import { useState } from 'react';
import OutputPanel from '../components/OutputPanel';

const BRAND_VALUE_OPTIONS = [
  'Trustworthy & Reliable',
  'Fun & Playful',
  'Professional & Authoritative',
  'Warm & Supportive',
  'Minimalist & Clean',
  'Bold & Energetic',
  'Educational & Informative',
  'Luxury & Premium',
];

export default function StoreSetup({ projectData, onComplete, onBack }) {
  const phase1 = projectData?.phase1;
  const phase2 = projectData?.phase2;

  const [selectedValues, setSelectedValues] = useState([]);
  const [inputs, setInputs] = useState({
    niche: phase2?.inputs?.niche || phase1?.inputs?.interests?.slice(0, 60) || '',
    productName: '',
    storeNameIdeas: '',
  });
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key) => (e) => setInputs((prev) => ({ ...prev, [key]: e.target.value }));

  const toggleValue = (val) => {
    setSelectedValues((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };

  const canGenerate = inputs.niche.trim().length > 3 && inputs.productName.trim().length > 3 && selectedValues.length > 0;

  const generate = async () => {
    setLoading(true);
    setError('');
    setOutput('');
    try {
      const res = await fetch('/api/phase3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...inputs,
          brandValues: selectedValues.join(', '),
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'API error');
      setOutput(data.result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="phase-hero">
        <div className="phase-badge">Phase 3 of 5 · 🏪 Store Setup</div>
        <h1 className="phase-title">Brand Your Shopify Store</h1>
        <p className="phase-desc">
          Get your store name, tagline, brand voice, About page, hero copy, and product page template — all conversion-optimized.
        </p>
      </div>

      {phase2?.inputs?.niche && (
        <div className="context-bar">
          ↑ From Phase 2: Niche — <strong>{phase2.inputs.niche}</strong>
          {phase2?.inputs?.productType && <> · Products — <strong>{phase2.inputs.productType.split(', ').slice(0, 2).join(', ')}</strong></>}
        </div>
      )}

      <div className="phase-grid">
        <div className="card">
          <div className="card-title">Store Details</div>

          <div className="form-group">
            <label className="form-label">Your niche *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Personal finance for millennial women"
              value={inputs.niche}
              onChange={set('niche')}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Your main product *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Budget Planning Masterclass, Yoga for Desk Workers eBook..."
              value={inputs.productName}
              onChange={set('productName')}
            />
            <div className="form-hint">The hero product Claude will write copy around.</div>
          </div>

          <div className="form-group">
            <label className="form-label">Brand personality (choose up to 3) *</label>
            <div className="checkbox-group">
              {BRAND_VALUE_OPTIONS.map((val) => (
                <div
                  key={val}
                  className={`checkbox-item ${selectedValues.includes(val) ? 'checked' : ''}`}
                  onClick={() => {
                    if (!selectedValues.includes(val) && selectedValues.length >= 3) return;
                    toggleValue(val);
                  }}
                >
                  <span className="checkbox-check">{selectedValues.includes(val) ? '✓' : ''}</span>
                  <span className="checkbox-label">{val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Store name ideas (optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. WealthHer, FinanceFlow, BudgetBliss..."
              value={inputs.storeNameIdeas}
              onChange={set('storeNameIdeas')}
            />
            <div className="form-hint">Leave blank and Claude will generate them from scratch.</div>
          </div>

          <div className="action-row">
            <button className="btn btn-ghost" onClick={onBack}>← Back</button>
            <button
              className="btn btn-primary btn-lg"
              style={{ flex: 1 }}
              onClick={generate}
              disabled={!canGenerate || loading}
            >
              {loading ? 'Generating...' : '✨ Build My Brand'}
            </button>
          </div>
        </div>

        <OutputPanel
          output={output}
          loading={loading}
          error={error}
          emptyIcon="🏪"
          emptyTitle="Complete Store Branding Package"
          emptyDesc="Store names, taglines, brand voice, About page, hero copy, and a product page template — all ready to paste into Shopify."
          onProceed={() => onComplete({ inputs: { ...inputs, brandValues: selectedValues.join(', ') }, output })}
          proceedLabel="Branding done → Next Phase"
        />
      </div>
    </div>
  );
}
