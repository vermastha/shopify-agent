export default function PhaseProgress({ phases, currentPhase, projectData, onPhaseClick }) {
  return (
    <div className="phase-stepper">
      {phases.map((phase, idx) => {
        const isDone = !!projectData[`phase${phase.id}`];
        const isActive = phase.id === currentPhase;
        const isClickable = phase.id < currentPhase || isDone || phase.id === 1 ||
          !!projectData[`phase${phase.id - 1}`];

        return (
          <div key={phase.id} className="phase-step">
            {idx > 0 && (
              <div className={`step-connector ${projectData[`phase${phase.id - 1}`] ? 'done' : ''}`} />
            )}
            <button
              className={`phase-step-btn ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
              onClick={() => isClickable && onPhaseClick(phase.id)}
              disabled={!isClickable}
              title={phase.title}
            >
              <div className={`step-circle ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
                {isDone ? '✓' : phase.id}
              </div>
              <span className="step-label">{phase.label}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
