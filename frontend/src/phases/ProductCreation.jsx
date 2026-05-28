import { useState } from 'react';
import OutputPanel from '../components/OutputPanel';

const DIGITAL_PRODUCT_TYPES = [
  'eBooks & Guides',
  'Templates & Swipe Files',
  'Online Courses & Lessons',
  'Printables & Worksheets',
  'Digital Planners & Journals',
  'Presets & Actions (Photo/Video)',
  'Notion / Canva Templates',
  'Spreadsheets & Trackers',
  'Audio & Music',
  'Stock Photos & Graphics',
];

const PHYSICAL_PRODUCT_TYPES = [
  'Dropshipping (no inventory)',
  'Print-on-Demand (custom printed)',
  'Wholesale / Resell',
  'Private Label',
  'Handmade / Crafts',
  'Subscription / Mystery Box',
];

const PRICE_RANGES = [
  '$5 – $20 (Volume-based)',
  '$20 – $50 (Mid-range)',
  '$50 – $100 (Premium)',
  '$100 – $300 (High-value)',
  '$300+ (Flagship product)',
];

const SKILL_LEVELS = ['Complete beginner', 'Some experience', 'Intermediate', 'Advanced / Expert'];

export default function ProductCreation({ projectData, onComplete, onBack, apiKey, storeType }) {
  const isPhysical = storeType === 'physical';
  const phase1 = projectData?.phase1;
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [inputs, setInputs] = useState({
    niche: '',
    priceRange: PRICE_RANGES[1],
    skillLevel: SKILL_LEVELS[1],
  });
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key) => (e) => setInputs((prev) => ({ ...prev, [key]: e.target.value }));

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const canGenerate = inputs.niche.trim().length > 3 && selectedTypes.length > 0;

  const generate = async () => {
    setLoading(true);
    setError('');
    setOutput('');
    try {
      const res = await fetch('/api/phase2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Api-Key': apiKey },
        body: JSON.stringify({
          ...inputs,
          productType: selectedTypes.join(', '),
          phase1Output: phase1?.output || '',
          storeType,
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

  const productTypes = isPhysical ? PHYSICAL_PRODUCT_TYPES : DIGITAL_PRODUCT_TYPES;
  const badgeLabel = isPhysical ? '📦 Physical Product Sourcing' : '📦 Digital Product Creation';
  const phaseTitle = isPhysical ? 'Plan Your Physical Products' : 'Design Your Digital Products';
  const phaseDesc = isPhysical
    ? 'Your Shopify Agent will generate 5 physical product ideas with sourcing models, profit margins, supplier recommendations, and time-to-first-sale estimates.'
    : 'Your Shopify Agent will generate 5 ready-to-build digital product ideas — complete with descriptions, pricing, and creation timelines.';
  const typesLabel = isPhysical ? 'Sourcing model(s) you want to use *' : 'Product types you want to create *';
  const emptyTitle = isPhysical ? '5 Physical Product Ideas' : '5 Product Ideas Incoming';
  const emptyDesc = isPhysical
    ? 'Your Shopify Agent will identify 5 physical products for your niche — with sourcing models, margins, supplier options, and logistics profiles.'
    : 'Your Shopify Agent will design 5 digital products built for your niche — with pricing, content lists, and creation timelines.';
  const nichePlaceholder = isPhysical
    ? 'e.g. Pet accessories, Home gym equipment, Eco-friendly kitchen...'
    : 'e.g. Personal finance for millennials, Yoga for desk workers...';

  return (
    <div>
      <div className="phase-hero">
        <div className="phase-badge">Phase 2 of 5 · {badgeLabel}</div>
        <h1 className="phase-title">{phaseTitle}</h1>
        <p className="phase-desc">{phaseDesc}</p>
      </div>

      {phase1?.inputs?.interests && (
        <div className="context-bar">
          ↑ From Phase 1: <strong>{phase1.inputs.interests.slice(0, 80)}{phase1.inputs.interests.length > 80 ? '...' : ''}</strong>
        </div>
      )}

      <div className="phase-grid">
        <div className="card">
          <div className="card-title">Product Details</div>

          <div className="form-group">
            <label className="form-label">Your chosen niche *</label>
            <input
              type="text"
              className="form-input"
              placeholder={nichePlaceholder}
              value={inputs.niche}
              onChange={set('niche')}
            />
            <div className="form-hint">Copy from Phase 1 or refine it here.</div>
          </div>

          <div className="form-group">
            <label className="form-label">{typesLabel}</label>
            <div className="checkbox-group">
              {productTypes.map((type) => (
                <div
                  key={type}
                  className={`checkbox-item ${selectedTypes.includes(type) ? 'checked' : ''}`}
                  onClick={() => toggleType(type)}
                >
                  <span className="checkbox-check">{selectedTypes.includes(type) ? '✓' : ''}</span>
                  <span className="checkbox-label">{type}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{isPhysical ? 'Target retail price range' : 'Target price range'}</label>
            <select className="form-select" value={inputs.priceRange} onChange={set('priceRange')}>
              {PRICE_RANGES.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">{isPhysical ? 'Your e-commerce experience level' : 'Your skill level in this niche'}</label>
            <select className="form-select" value={inputs.skillLevel} onChange={set('skillLevel')}>
              {SKILL_LEVELS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>

          <div className="action-row">
            <button className="btn btn-ghost" onClick={onBack}>← Back</button>
            <button
              className="btn btn-primary btn-lg"
              style={{ flex: 1 }}
              onClick={generate}
              disabled={!canGenerate || loading}
            >
              {loading ? 'Generating...' : isPhysical ? '✨ Find Product Ideas' : '✨ Generate Product Ideas'}
            </button>
          </div>
        </div>

        <OutputPanel
          output={output}
          loading={loading}
          error={error}
          emptyIcon="📦"
          emptyTitle={emptyTitle}
          emptyDesc={emptyDesc}
          onProceed={() => onComplete({ inputs: { ...inputs, productType: selectedTypes.join(', ') }, output })}
          proceedLabel="Pick my product → Next Phase"
        />
      </div>
    </div>
  );
}
