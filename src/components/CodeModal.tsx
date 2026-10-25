import React, { useState } from 'react';
import type { AuditIssue } from '../types/audit';
import { X, Copy, Check, FileCode, Lightbulb } from 'lucide-react';

interface CodeModalProps {
  issue: AuditIssue | null;
  onClose: () => void;
  lang: 'kn' | 'en';
}

export const CodeModal: React.FC<CodeModalProps> = ({ issue, onClose, lang }) => {
  const [copied, setCopied] = useState(false);

  if (!issue) return null;

  const handleCopy = () => {
    if (issue.codeSnippet) {
      navigator.clipboard.writeText(issue.codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px',
    }}>
      <div className="glass-panel animate-fade-in" style={{
        maxWidth: '680px',
        width: '100%',
        padding: '28px',
        background: '#0d131f',
        border: '1px solid var(--border-focus)',
        position: 'relative',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'rgba(99, 102, 241, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <FileCode size={20} color="#818cf8" />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{issue.title}</h3>
        </div>

        {/* Description */}
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '16px' }}>
          {issue.description}
        </p>

        {/* Recommendation */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          borderLeft: '3px solid #818cf8',
          padding: '12px 16px',
          borderRadius: '4px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
        }}>
          <Lightbulb size={18} color="#818cf8" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.88rem', color: '#e0e7ff' }}>
            {issue.recommendation}
          </div>
        </div>

        {/* Code Snippet Box */}
        {issue.codeSnippet ? (
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                {lang === 'kn' ? 'ನೇರವಾಗಿ ಕಾಪಿ ಮಾಡಲು ರೆಡಿ ಕೋಡ್:' : 'Ready-to-use Code:'}
              </span>
              <button
                onClick={handleCopy}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.78rem', gap: '6px' }}
              >
                {copied ? (
                  <>
                    <Check size={14} color="#34d399" />
                    <span style={{ color: '#34d399' }}>{lang === 'kn' ? 'ಕಾಪಿ ಮಾಡಲಾಗಿದೆ!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>{lang === 'kn' ? 'ಕೋಡ್ ಕಾಪಿ ಮಾಡಿ' : 'Copy Code'}</span>
                  </>
                )}
              </button>
            </div>
            <pre className="code-preview" style={{ maxHeight: '250px' }}>
              {issue.codeSnippet}
            </pre>
          </div>
        ) : (
          <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
            {lang === 'kn' ? 'ಕೋಡ್ ಸ್ನಿಪ್ಪೆಟ್ ಅಗತ್ಯವಿಲ್ಲ. ಮೇಲಿನ ಸೂಚನೆ ಪಾಲಿಸಿ.' : 'No code snippet required. Follow instructions above.'}
          </div>
        )}

        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-primary" style={{ padding: '8px 24px' }}>
            {lang === 'kn' ? 'ಮುಕ್ತಾಯ' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
