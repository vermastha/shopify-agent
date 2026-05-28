import { useState } from 'react';
import OutputPanel from '../components/OutputPanel';

const PRODUCT_TYPES = [
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

const PRICE_RANGES = [
  '$5 – $20 (Volume-based)',
  '$20 – $50 (Mid-range)',
  '$50 – $100 (Premium)',
  '$100 – $300 (High-value)',
  '$300+ (Flagship product)',
];

const SKILL_LEVELS = ['Complete beginner', 'Some experience', 'Intermediate', 'Advanced / Expert'];

export default function ProductCreation({ projectData, onComplete, onBack, apiKey }) {
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
        <div className="phase-badge">Phase 2 of 5 · 📦 Digital Product Creation</div>
        <h1 className="phase-title">Design Your Digital Products</h1>
        <p className="phase-desc">
          Claude will generate 5 ready-to-build digital product ideas — complete with descriptions, pricing, and creation timelines.
        </p>
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
              placeholder="e.g. Personal finance for millennials, Yoga for desk workers..."
              value={inputs.niche}
              onChange={set('niche')}
            />
            <div className="form-hint">Copy from Phase 1 or refine it here.</div>
          </div>

          <div className="form-group">
            <label className="form-label">Product types you want to create *</label>
            <div className="checkbox-group">
              {PRODUCT_TYPES.map((type) => (
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
            <label className="form-label">Target price range</label>
            <select className="form-select" value={inputs.priceRange} onChange={set('priceRange')}>
              {PRICE_RANGES.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Your skill level in this niche</label>
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
              {loading ? 'Generating...' : '✨ Generate Product Ideas'}
            </button>
          </div>
        </div>

        <OutputPanel
          output={output}
          loading={loading}
          error={error}
          emptyIcon="📦"
          emptyTitle="5 Product Ideas Incoming"
          emptyDesc="Claude will design 5 digital products built for your niche — with pricing, content lists, and creation timelines."
          onProceed={() => onComplete({ inputs: { ...inputs, productType: selectedTypes.join(', ') }, output })}
          proceedLabel="Pick my product → Next Phase"
        />
      </div>
    </div>
  );
}
