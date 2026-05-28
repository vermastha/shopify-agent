import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}>
      {copied ? '✓ Copied' : '⎘ Copy'}
    </button>
  );
}

export default function OutputPanel({
  output,
  loading,
  error,
  emptyIcon = '✨',
  emptyTitle = 'Your AI output will appear here',
  emptyDesc = 'Fill in the form and click Generate to get your personalized results.',
  onProceed,
  proceedLabel = 'Continue to Next Phase →',
  isLastPhase = false,
}) {
  const hasOutput = !!output;

  return (
    <div className="output-panel">
      <div className="output-card">
        <div className="output-header">
          <div className="output-header-left">
            <div className={`output-status-dot ${loading ? 'pulse' : hasOutput ? 'active' : ''}`} />
            <span className="output-label">
              {loading ? 'Claude is generating...' : hasOutput ? 'AI Output Ready' : 'Waiting for input'}
            </span>
          </div>
          {hasOutput && !loading && <CopyButton text={output} />}
        </div>

        <div className="output-body">
          {loading && (
            <div className="output-loading">
              <div className="spinner" />
              <div className="loading-text">
                Generating your personalized output
                <span className="loading-dots">
                  <span>.</span><span>.</span><span>.</span>
                </span>
              </div>
              <div className="loading-sub">Claude is analyzing your inputs and crafting results</div>
            </div>
          )}

          {!loading && error && (
            <div className="output-error">
              <span className="output-error-icon">⚠️</span>
              <div>
                <div className="output-error-msg">
                  {error === 'Load failed' || error === 'Failed to fetch' || error === 'NetworkError when attempting to fetch resource.'
                    ? 'Could not reach the server. Try refreshing and trying again.'
                    : error}
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: 4 }}>
                  Make sure your Anthropic API key is valid and has credits at{' '}
                  <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer"
                    style={{ color: '#94a3b8', textDecoration: 'underline' }}>
                    console.anthropic.com
                  </a>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && !hasOutput && (
            <div className="output-empty">
              <div className="output-empty-icon">{emptyIcon}</div>
              <div className="output-empty-title">{emptyTitle}</div>
              <div className="output-empty-desc">{emptyDesc}</div>
            </div>
          )}

          {!loading && !error && hasOutput && (
            <div className="output-content">
              <ReactMarkdown>{output}</ReactMarkdown>
            </div>
          )}
        </div>

        {hasOutput && !loading && onProceed && (
          <div className="output-footer">
            <span className="output-footer-hint">
              Review the output above, then proceed when ready
            </span>
            <button className="btn btn-primary" onClick={onProceed}>
              {isLastPhase ? '🎉 Complete My Business Blueprint' : proceedLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
