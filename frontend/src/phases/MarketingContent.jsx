import { useState } from 'react';
import OutputPanel from '../components/OutputPanel';

const PLATFORM_OPTIONS = [
  'Instagram',
  'TikTok',
  'Pinterest',
  'Facebook',
  'Twitter / X',
  'LinkedIn',
  'YouTube',
  'Threads',
];

export default function MarketingContent({ projectData, onComplete, onBack, apiKey, storeType }) {
  const phase2 = projectData?.phase2;
  const phase3 = projectData?.phase3;
  const phase1 = projectData?.phase1;

  const [selectedPlatforms, setSelectedPlatforms] = useState(['Instagram', 'Pinterest']);
  const [inputs, setInputs] = useState({
    storeName: '',
    product: phase2?.inputs?.niche || '',
    niche: phase2?.inputs?.niche || phase1?.inputs?.interests?.slice(0, 60) || '',
    targetAudience: phase1?.inputs?.targetAudience || '',
  });
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key) => (e) => setInputs((prev) => ({ ...prev, [key]: e.target.value }));

  const togglePlatform = (p) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const canGenerate =
    inputs.storeName.trim().length > 2 &&
    inputs.product.trim().length > 3 &&
    inputs.niche.trim().length > 3 &&
    selectedPlatforms.length > 0;

  const generate = async () => {
    setLoading(true);
    setError('');
    setOutput('');
    try {
      const res = await fetch('/api/phase4', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Api-Key': apiKey },
        body: JSON.stringify({
          ...inputs,
          platforms: selectedPlatforms.join(', '),
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

  return (
    <div>
      <div className="phase-hero">
        <div className="phase-badge">Phase 4 of 5 · 📢 Marketing Content</div>
        <h1 className="phase-title">Generate Your Marketing Content</h1>
        <p className="phase-desc">
          Get 10 social media posts, a 5-email welcome sequence, Pinterest pins, ad copy, and a full content strategy — ready to publish.
        </p>
      </div>

      {phase3?.inputs?.productName && (
        <div className="context-bar">
          ↑ From Phase 3: Product — <strong>{phase3.inputs.productName}</strong>
          {phase3.inputs.niche && <> · Niche — <strong>{phase3.inputs.niche}</strong></>}
        </div>
      )}

      <div className="phase-grid">
        <div className="card">
          <div className="card-title">Campaign Details</div>

          <div className="form-group">
            <label className="form-label">Store / Brand name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. WealthHer, FitDesk, BudgetBliss..."
              value={inputs.storeName}
              onChange={set('storeName')}
            />
            <div className="form-hint">The name you're promoting — from your branding in Phase 3.</div>
          </div>

          <div className="form-group">
            <label className="form-label">Hero product you're selling *</label>
            <input
              type="text"
              className="form-input"
              placeholder={storeType === 'physical' ? 'e.g. Minimalist Leather Wallet, Custom Pet Portrait Mug...' : 'e.g. 30-Day Budget Bootcamp eBook, Yoga for Desk Workers Course...'}
              value={inputs.product}
              onChange={set('product')}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Niche / Topic *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Personal finance for millennial women"
              value={inputs.niche}
              onChange={set('niche')}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Target audience</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Women 25–35 who want to pay off debt and start investing"
              value={inputs.targetAudience}
              onChange={set('targetAudience')}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Platforms to create content for *</label>
            <div className="checkbox-group">
              {PLATFORM_OPTIONS.map((p) => (
                <div
                  key={p}
                  className={`checkbox-item ${selectedPlatforms.includes(p) ? 'checked' : ''}`}
                  onClick={() => togglePlatform(p)}
                >
                  <span className="checkbox-check">{selectedPlatforms.includes(p) ? '✓' : ''}</span>
                  <span className="checkbox-label">{p}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="action-row">
            <button className="btn btn-ghost" onClick={onBack}>← Back</button>
            <button
              className="btn btn-primary btn-lg"
              style={{ flex: 1 }}
              onClick={generate}
              disabled={!canGenerate || loading}
            >
              {loading ? 'Generating...' : '✨ Generate Content'}
            </button>
          </div>
        </div>

        <OutputPanel
          output={output}
          loading={loading}
          error={error}
          emptyIcon="📢"
          emptyTitle="Complete Marketing Content Package"
          emptyDesc="10 social posts, 5 emails, Pinterest pins, ad copy, and content pillars — tailored to your store and product."
          onProceed={() => onComplete({ inputs: { ...inputs, platforms: selectedPlatforms.join(', ') }, output })}
          proceedLabel="Content ready → Final Phase"
        />
      </div>
    </div>
  );
}
