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
      background: 'rgba(32, 33, 36, 0.6)',
      backdropFilter: 'blur(4px)',
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
        background: '#ffffff',
        border: '1px solid #dadce0',
        boxShadow: '0 4px 16px rgba(60, 64, 67, 0.25)',
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
            color: '#5f6368',
            cursor: 'pointer',
          }}
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: '#e8f0fe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <FileCode size={20} color="#1a73e8" />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#202124' }}>{issue.title}</h3>
        </div>

        {/* Description */}
        <p style={{ color: '#5f6368', fontSize: '0.92rem', marginBottom: '16px' }}>
          {issue.description}
        </p>

        {/* Recommendation */}
        <div style={{
          background: '#e8f0fe',
          borderLeft: '4px solid #1a73e8',
          padding: '12px 16px',
          borderRadius: '4px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
        }}>
          <Lightbulb size={18} color="#1a73e8" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.88rem', color: '#174ea6' }}>
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
              <span style={{ fontSize: '0.82rem', color: '#5f6368', fontWeight: 600 }}>
                {lang === 'kn' ? 'ನೇರವಾಗಿ ಕಾಪಿ ಮಾಡಲು ರೆಡಿ ಕೋಡ್:' : 'Ready-to-use Code:'}
              </span>
              <button
                onClick={handleCopy}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.78rem', gap: '6px' }}
              >
                {copied ? (
                  <>
                    <Check size={14} color="#137333" />
                    <span style={{ color: '#137333' }}>{lang === 'kn' ? 'ಕಾಪಿ ಮಾಡಲಾಗಿದೆ!' : 'Copied!'}</span>
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
          <div style={{ color: '#5f6368', fontSize: '0.85rem' }}>
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
