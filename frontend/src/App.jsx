import { useState } from 'react';
import PhaseProgress from './components/PhaseProgress';
import NicheDiscovery from './phases/NicheDiscovery';
import ProductCreation from './phases/ProductCreation';
import StoreSetup from './phases/StoreSetup';
import MarketingContent from './phases/MarketingContent';
import LaunchPlan from './phases/LaunchPlan';
import CompletionScreen from './components/CompletionScreen';
import PreviousResults from './components/PreviousResults';

const PHASES = [
  { id: 1, label: 'Niche', title: 'Niche Discovery', icon: '🔍' },
  { id: 2, label: 'Product', title: 'Product Creation', icon: '📦' },
  { id: 3, label: 'Store', title: 'Store Setup', icon: '🏪' },
  { id: 4, label: 'Marketing', title: 'Marketing', icon: '📢' },
  { id: 5, label: 'Launch', title: '30-Day Plan', icon: '🚀' },
];

function ApiKeyGate({ onSubmit }) {
  const [key, setKey] = useState('');
  const valid = key.trim().startsWith('sk-ant-') && key.trim().length > 20;

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-mark">⚡</div>
            <span className="logo-name">ShopifyAgent<span>.ai</span></span>
          </div>
          <div className="header-badge">AI Powered</div>
        </div>
      </header>
      <main className="main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div className="card" style={{ maxWidth: 480, width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔑</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--dark)', marginBottom: 8 }}>
              Enter your API Key
            </h1>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Your key powers the AI and is never stored on our servers. Each session requires you to enter it once.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">API Key</label>
            <input
              type="password"
              className="form-input"
              placeholder="sk-ant-..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && valid && onSubmit(key.trim())}
              autoFocus
            />
            <div className="form-hint">
              Don't have a key?{' '}
              <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer"
                style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>
                Get your API key →
              </a>
            </div>
          </div>

          <button
            className="btn btn-primary btn-lg btn-block"
            onClick={() => onSubmit(key.trim())}
            disabled={!valid}
          >
            Start Building My Shopify Business →
          </button>
        </div>
      </main>
    </div>
  );
}

function StoreTypeGate({ onSubmit }) {
  const [selected, setSelected] = useState('');

  const options = [
    {
      value: 'digital',
      icon: '💻',
      title: 'Digital Products',
      desc: 'Sell eBooks, courses, templates, printables, presets, and other downloadable goods. No inventory, no shipping — pure margin.',
      examples: 'eBooks · Online Courses · Templates · Notion Planners · Presets',
    },
    {
      value: 'physical',
      icon: '📦',
      title: 'Physical Products',
      desc: 'Sell tangible goods via dropshipping, print-on-demand, wholesale, private label, or your own handmade products.',
      examples: 'Dropshipping · Print-on-Demand · Private Label · Handmade · Wholesale',
    },
  ];

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-mark">⚡</div>
            <span className="logo-name">ShopifyAgent<span>.ai</span></span>
          </div>
          <div className="header-badge">AI Powered</div>
        </div>
      </header>
      <main className="main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div style={{ maxWidth: 640, width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🏪</div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--dark)', marginBottom: 8 }}>
              What kind of store are you building?
            </h1>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Your choice shapes every recommendation — from niche selection to your 30-day launch plan.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 16, flexDirection: 'column' }}>
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => setSelected(opt.value)}
                className="card"
                style={{
                  cursor: 'pointer',
                  border: selected === opt.value ? '2px solid var(--primary)' : '2px solid transparent',
                  background: selected === opt.value ? 'var(--primary-light)' : undefined,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 16,
                  padding: 20,
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ fontSize: 36, lineHeight: 1, flexShrink: 0 }}>{opt.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--dark)' }}>{opt.title}</span>
                    {selected === opt.value && (
                      <span style={{
                        background: 'var(--primary)', color: '#fff', fontSize: 11,
                        fontWeight: 600, padding: '2px 8px', borderRadius: 99,
                      }}>Selected</span>
                    )}
                  </div>
                  <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: 8 }}>{opt.desc}</p>
                  <div style={{ fontSize: '0.8rem', color: 'var(--primary-dark)', fontWeight: 500 }}>{opt.examples}</div>
                </div>
              </div>
            ))}
          </div>

          <button
            className="btn btn-primary btn-lg btn-block"
            style={{ marginTop: 24 }}
            onClick={() => onSubmit(selected)}
            disabled={!selected}
          >
            {selected === 'digital' && 'Build My Digital Product Store →'}
            {selected === 'physical' && 'Build My Physical Product Store →'}
            {!selected && 'Select a store type to continue →'}
          </button>
        </div>
      </main>
    </div>
  );
}

function SwitchStoreModal({ currentType, onConfirm, onCancel }) {
  const target = currentType === 'physical' ? 'digital' : 'physical';
  const targetLabel = target === 'physical' ? '📦 Physical Store' : '💻 Digital Store';

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 24,
    }}>
      <div className="card" style={{ maxWidth: 420, width: '100%', padding: 28 }}>
        <div style={{ fontSize: 36, marginBottom: 12, textAlign: 'center' }}>🔄</div>
        <h2 style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--dark)', marginBottom: 8, textAlign: 'center' }}>
          Switch to {targetLabel}?
        </h2>
        <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', lineHeight: 1.6, textAlign: 'center', marginBottom: 24 }}>
          Switching store type will clear your current progress and restart from Phase 1 with{' '}
          <strong>{target === 'physical' ? 'physical product' : 'digital product'}</strong> recommendations.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onCancel}>
            Keep current
          </button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => onConfirm(target)}>
            Yes, switch →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [storeType, setStoreType] = useState('');
  const [currentPhase, setCurrentPhase] = useState(1);
  const [projectData, setProjectData] = useState({});
  const [completed, setCompleted] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);

  if (!apiKey) return <ApiKeyGate onSubmit={setApiKey} />;
  if (!storeType) return <StoreTypeGate onSubmit={setStoreType} />;

  const handlePhaseComplete = (phaseNum, data) => {
    const updated = { ...projectData, [`phase${phaseNum}`]: data };
    setProjectData(updated);
    if (phaseNum < 5) {
      setCurrentPhase(phaseNum + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCompleted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPhase = (phaseNum) => {
    if (phaseNum < currentPhase || projectData[`phase${phaseNum - 1}`] || phaseNum === 1) {
      setCurrentPhase(phaseNum);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRestart = () => {
    setCurrentPhase(1);
    setProjectData({});
    setCompleted(false);
    setStoreType('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSwitchConfirm = (newType) => {
    setStoreType(newType);
    setCurrentPhase(1);
    setProjectData({});
    setCompleted(false);
    setShowSwitchModal(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const phaseProps = {
    projectData,
    apiKey,
    storeType,
    onComplete: (data) => handlePhaseComplete(currentPhase, data),
    onBack: () => { if (currentPhase > 1) { setCurrentPhase(currentPhase - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
  };

  const renderPhase = () => {
    switch (currentPhase) {
      case 1: return <NicheDiscovery {...phaseProps} />;
      case 2: return <ProductCreation {...phaseProps} />;
      case 3: return <StoreSetup {...phaseProps} />;
      case 4: return <MarketingContent {...phaseProps} />;
      case 5: return <LaunchPlan {...phaseProps} />;
      default: return null;
    }
  };

  const storeTypeBadge = storeType === 'physical' ? '📦 Physical Store' : '💻 Digital Store';
  const switchLabel = storeType === 'physical' ? 'Switch to Digital' : 'Switch to Physical';

  return (
    <div className="app">
      {showSwitchModal && (
        <SwitchStoreModal
          currentType={storeType}
          onConfirm={handleSwitchConfirm}
          onCancel={() => setShowSwitchModal(false)}
        />
      )}

      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-mark">⚡</div>
            <span className="logo-name">ShopifyAgent<span>.ai</span></span>
          </div>

          {!completed && (
            <PhaseProgress
              phases={PHASES}
              currentPhase={currentPhase}
              projectData={projectData}
              onPhaseClick={goToPhase}
            />
          )}

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div className="header-badge" style={{ background: 'rgba(255,255,255,0.12)', fontSize: 12 }}>
              {storeTypeBadge}
            </div>
            <button
              onClick={() => setShowSwitchModal(true)}
              style={{
                background: 'none', border: '1px solid var(--gray-300)',
                borderRadius: 99, padding: '4px 12px', fontSize: 12,
                fontWeight: 500, color: 'var(--gray-600)', cursor: 'pointer',
                whiteSpace: 'nowrap', transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.color = 'var(--primary)'; }}
              onMouseLeave={(e) => { e.target.style.borderColor = 'var(--gray-300)'; e.target.style.color = 'var(--gray-600)'; }}
            >
              {switchLabel} ⇄
            </button>
            <div className="header-badge">AI Powered</div>
          </div>
        </div>
      </header>

      <main className="main">
        {completed ? (
          <CompletionScreen projectData={projectData} onRestart={handleRestart} />
        ) : (
          <>
            {renderPhase()}
            <PreviousResults projectData={projectData} currentPhase={currentPhase} storeType={storeType} />
          </>
        )}
      </main>
    </div>
  );
}
