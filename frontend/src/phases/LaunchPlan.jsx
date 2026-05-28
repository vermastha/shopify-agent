import { useState } from 'react';
import OutputPanel from '../components/OutputPanel';

const BUDGET_OPTIONS = [
  '$0 (Organic only)',
  '$50/week',
  '$100/week',
  '$250/week',
  '$500+/week',
];

const HOURS_OPTIONS = [
  '1–5 hours/week',
  '5–10 hours/week',
  '10–20 hours/week',
  '20–40 hours/week (Full-time)',
];

export default function LaunchPlan({ projectData, onComplete, onBack, apiKey }) {
  const phase1 = projectData?.phase1;
  const phase2 = projectData?.phase2;
  const phase3 = projectData?.phase3;
  const phase4 = projectData?.phase4;

  const [inputs, setInputs] = useState({
    storeName: phase4?.inputs?.storeName || '',
    niche: phase2?.inputs?.niche || phase1?.inputs?.interests?.slice(0, 60) || '',
    product: phase3?.inputs?.productName || phase4?.inputs?.product || '',
    weeklyBudget: BUDGET_OPTIONS[1],
    hoursPerWeek: phase1?.inputs?.hoursPerWeek?.split(' ')[0] || HOURS_OPTIONS[1],
  });
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key) => (e) => setInputs((prev) => ({ ...prev, [key]: e.target.value }));

  const canGenerate =
    inputs.storeName.trim().length > 2 &&
    inputs.niche.trim().length > 3 &&
    inputs.product.trim().length > 3;

  const generate = async () => {
    setLoading(true);
    setError('');
    setOutput('');
    try {
      const res = await fetch('/api/phase5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Api-Key': apiKey },
        body: JSON.stringify({
          ...inputs,
          allContext: {
            niche: inputs.niche,
            product: inputs.product,
            platforms: phase4?.inputs?.platforms || '',
            targetAudience: phase1?.inputs?.targetAudience || '',
          },
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
        <div className="phase-badge">Phase 5 of 5 · 🚀 30-Day Launch Plan</div>
        <h1 className="phase-title">Your 30-Day Launch Roadmap</h1>
        <p className="phase-desc">
          A day-by-day action plan that takes you from zero to your first sales — built around your real schedule and budget.
        </p>
      </div>

      {phase4?.inputs?.storeName && (
        <div className="context-bar">
          ↑ Launching: <strong>{phase4.inputs.storeName}</strong>
          {phase3?.inputs?.productName && <> · Product: <strong>{phase3.inputs.productName}</strong></>}
          {phase4?.inputs?.platforms && <> · Platforms: <strong>{phase4.inputs.platforms}</strong></>}
        </div>
      )}

      <div className="phase-grid">
        <div className="card">
          <div className="card-title">Launch Details</div>

          <div className="form-group">
            <label className="form-label">Store name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. WealthHer"
              value={inputs.storeName}
              onChange={set('storeName')}
            />
          </div>

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
            <label className="form-label">Hero product *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. 30-Day Budget Bootcamp eBook"
              value={inputs.product}
              onChange={set('product')}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Weekly marketing budget</label>
            <select className="form-select" value={inputs.weeklyBudget} onChange={set('weeklyBudget')}>
              {BUDGET_OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
            <div className="form-hint">Your agent will build a plan that stays within this budget.</div>
          </div>

          <div className="form-group">
            <label className="form-label">Hours you can commit per week</label>
            <select className="form-select" value={inputs.hoursPerWeek} onChange={set('hoursPerWeek')}>
              {HOURS_OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>

          <div className="card" style={{ background: 'var(--primary-light)', border: '1px solid rgba(0,184,107,0.2)', marginTop: 16 }}>
            <p style={{ fontSize: 13, color: 'var(--primary-dark)', lineHeight: 1.6 }}>
              <strong>🎯 Final Phase:</strong> Your Shopify Agent will synthesize everything from all 5 phases into a complete, actionable 30-day roadmap tailored to your exact situation.
            </p>
          </div>

          <div className="action-row">
            <button className="btn btn-ghost" onClick={onBack}>← Back</button>
            <button
              className="btn btn-primary btn-lg"
              style={{ flex: 1 }}
              onClick={generate}
              disabled={!canGenerate || loading}
            >
              {loading ? 'Building your plan...' : '🚀 Generate Launch Plan'}
            </button>
          </div>
        </div>

        <OutputPanel
          output={output}
          loading={loading}
          error={error}
          emptyIcon="🚀"
          emptyTitle="Your 30-Day Launch Roadmap"
          emptyDesc="Day-by-day tasks, weekly milestones, troubleshooting guides, and Month 2 priorities — all built around your time and budget."
          onProceed={() => onComplete({ inputs, output })}
          proceedLabel="Complete"
          isLastPhase
        />
      </div>
    </div>
  );
}
