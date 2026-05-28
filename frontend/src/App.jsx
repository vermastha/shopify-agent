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
  { id: 2, label: 'Product', title: 'Digital Product', icon: '📦' },
  { id: 3, label: 'Store', title: 'Store Setup', icon: '🏪' },
  { id: 4, label: 'Marketing', title: 'Marketing', icon: '📢' },
  { id: 5, label: 'Launch', title: '30-Day Plan', icon: '🚀' },
];

export default function App() {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [projectData, setProjectData] = useState({});
  const [completed, setCompleted] = useState(false);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const phaseProps = {
    projectData,
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

  return (
    <div className="app">
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

          <div className="header-badge">Powered by Claude</div>
        </div>
      </header>

      <main className="main">
        {completed ? (
          <CompletionScreen projectData={projectData} onRestart={handleRestart} />
        ) : (
          <>
            {renderPhase()}
            <PreviousResults projectData={projectData} currentPhase={currentPhase} />
          </>
        )}
      </main>
    </div>
  );
}
