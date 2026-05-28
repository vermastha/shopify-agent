import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const PHASE_META = {
  phase1: { label: 'Phase 1', title: 'Niche Discovery', icon: '🔍' },
  phase2: { label: 'Phase 2', title: 'Digital Product', icon: '📦' },
  phase3: { label: 'Phase 3', title: 'Store Setup', icon: '🏪' },
  phase4: { label: 'Phase 4', title: 'Marketing Content', icon: '📢' },
  phase5: { label: 'Phase 5', title: '30-Day Launch Plan', icon: '🚀' },
};

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={handle}>
      {copied ? '✓ Copied' : '⎘ Copy'}
    </button>
  );
}

function PhaseResultCard({ phaseKey, data }) {
  const [open, setOpen] = useState(false);
  const meta = PHASE_META[phaseKey];
  if (!data?.output) return null;

  return (
    <div className={`prev-result-card ${open ? 'open' : ''}`}>
      <button className="prev-result-header" onClick={() => setOpen((v) => !v)}>
        <span className="prev-result-icon">{meta.icon}</span>
        <span className="prev-result-title">
          <span className="prev-result-label">{meta.label}</span>
          {meta.title}
        </span>
        <span className="prev-result-chevron">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="prev-result-body">
          <div className="prev-result-actions">
            <CopyButton text={data.output} />
          </div>
          <div className="output-content">
            <ReactMarkdown>{data.output}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PreviousResults({ projectData, currentPhase }) {
  const completedPhases = Object.keys(PHASE_META).filter((key) => {
    const num = parseInt(key.replace('phase', ''));
    return num < currentPhase && projectData[key]?.output;
  });

  if (completedPhases.length === 0) return null;

  return (
    <div className="prev-results-section">
      <div className="prev-results-heading">
        <span className="prev-results-heading-icon">📋</span>
        Previous Phase Outputs
      </div>
      <div className="prev-results-list">
        {completedPhases.map((key) => (
          <PhaseResultCard key={key} phaseKey={key} data={projectData[key]} />
        ))}
      </div>
    </div>
  );
}
