import { useState } from 'react';
import OutputPanel from '../components/OutputPanel';

const BUDGET_OPTIONS = [
  '$0 – $100 (Bootstrap)',
  '$100 – $500 (Minimal)',
  '$500 – $1,500 (Moderate)',
  '$1,500 – $5,000 (Invested)',
  '$5,000+ (Well-funded)',
];

const HOURS_OPTIONS = [
  '1–5 hours/week (Side project)',
  '5–10 hours/week (Part-time)',
  '10–20 hours/week (Committed)',
  '20–40 hours/week (Full focus)',
];

export default function NicheDiscovery({ onComplete, apiKey }) {
  const [inputs, setInputs] = useState({
    interests: '',
    budget: BUDGET_OPTIONS[1],
    targetAudience: '',
    hoursPerWeek: HOURS_OPTIONS[1],
  });
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key) => (e) => setInputs((prev) => ({ ...prev, [key]: e.target.value }));

  const canGenerate = inputs.interests.trim().length > 10 && inputs.targetAudience.trim().length > 5;

  const generate = async () => {
    setLoading(true);
    setError('');
    setOutput('');
    try {
      const res = await fetch('/api/phase1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Api-Key': apiKey },
        body: JSON.stringify(inputs),
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
        <div className="phase-badge">Phase 1 of 5 · 🔍 Niche Discovery</div>
        <h1 className="phase-title">Find Your Profitable Niche</h1>
        <p className="phase-desc">
          Tell us about yourself and your Shopify Agent will identify 3 high-potential niches tailored specifically to your skills, budget, and goals.
        </p>
      </div>

      <div className="phase-grid">
        {/* Input Form */}
        <div className="card">
          <div className="card-title">Your Profile</div>

          <div className="form-group">
            <label className="form-label">What are your interests, skills, or expertise? *</label>
            <textarea
              className="form-textarea"
              placeholder="e.g. graphic design, personal finance, fitness, cooking, coding tutorials, photography, parenting..."
              value={inputs.interests}
              onChange={set('interests')}
              rows={4}
            />
            <div className="form-hint">Be specific — the more detail, the better your niche recommendations.</div>
          </div>

          <div className="form-group">
            <label className="form-label">Starting Budget</label>
            <select className="form-select" value={inputs.budget} onChange={set('budget')}>
              {BUDGET_OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Who do you want to help? *</label>
            <textarea
              className="form-textarea"
              placeholder="e.g. busy moms who want to start investing, freelance designers who struggle with client pricing, new parents looking for sleep schedules..."
              value={inputs.targetAudience}
              onChange={set('targetAudience')}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Hours available per week</label>
            <select className="form-select" value={inputs.hoursPerWeek} onChange={set('hoursPerWeek')}>
              {HOURS_OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>

          <div className="action-row">
            <button
              className="btn btn-primary btn-lg btn-block"
              onClick={generate}
              disabled={!canGenerate || loading}
            >
              {loading ? 'Generating...' : '✨ Discover My Niche'}
            </button>
          </div>
          {!canGenerate && (
            <p className="text-sm text-muted" style={{ marginTop: 8, textAlign: 'center' }}>
              Fill in your interests and target audience to continue.
            </p>
          )}
        </div>

        {/* Output */}
        <OutputPanel
          output={output}
          loading={loading}
          error={error}
          emptyIcon="🔍"
          emptyTitle="3 Niche Recommendations"
          emptyDesc="Your Shopify Agent will analyze your profile and surface the most profitable niches for your digital product business."
          onProceed={() => onComplete({ inputs, output })}
          proceedLabel="I've chosen my niche → Next Phase"
        />
      </div>
    </div>
  );
}
