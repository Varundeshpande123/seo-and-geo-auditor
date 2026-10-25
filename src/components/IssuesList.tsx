import React from 'react';
import type { AuditIssue } from '../types/audit';
import { AlertCircle, AlertTriangle, CheckCircle, ArrowRight, Code } from 'lucide-react';

interface IssuesListProps {
  issues: AuditIssue[];
  lang: 'kn' | 'en';
  onSelectIssue: (issue: AuditIssue) => void;
}

export const IssuesList: React.FC<IssuesListProps> = ({ issues, lang, onSelectIssue }) => {
  return (
    <div className="glass-panel" style={{ padding: '28px', marginBottom: '40px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '4px' }}>
          {lang === 'kn' ? 'ಕ್ರಮ ಕೈಗೊಳ್ಳಬೇಕಾದ ಅಂಶಗಳು ಮತ್ತು ಪರಿಹಾರಗಳು' : 'Actionable Fixes & Audit Breakdown'}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
          {lang === 'kn'
            ? 'ನಿಮ್ಮ ವೆಬ್‌ಸೈಟ್‌ನ ರ್ಯಾಂಕಿಂಗ್ ಮತ್ತು AI ಸೈಟೇಶನ್ ಹೆಚ್ಚಿಸಲು ಕೆಳಗಿನ ಅಂಶಗಳನ್ನು ಸರಿಪಡಿಸಿ'
            : 'Resolve these high-impact issues to maximize search and AI rankings'}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {issues.map((issue) => {
          const isCritical = issue.severity === 'critical';
          const isWarning = issue.severity === 'warning';

          return (
            <div
              key={issue.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                background: '#ffffff',
                border: '1px solid #dadce0',
                borderRadius: 'var(--radius-md)',
                gap: '16px',
                flexWrap: 'wrap',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#1a73e8';
                e.currentTarget.style.background = '#f8f9fa';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#dadce0';
                e.currentTarget.style.background = '#ffffff';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '260px' }}>
                {isCritical ? (
                  <AlertCircle size={22} color="#c5221f" style={{ flexShrink: 0 }} />
                ) : isWarning ? (
                  <AlertTriangle size={22} color="#b06000" style={{ flexShrink: 0 }} />
                ) : (
                  <CheckCircle size={22} color="#1a73e8" style={{ flexShrink: 0 }} />
                )}

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#202124' }}>
                      {issue.title}
                    </span>
                    <span className={`badge ${isCritical ? 'badge-critical' : isWarning ? 'badge-warning' : 'badge-primary'}`} style={{ fontSize: '0.7rem' }}>
                      {issue.category.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {issue.recommendation}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectIssue(issue)}
                className="btn btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.82rem', flexShrink: 0 }}
              >
                <Code size={14} />
                <span>{lang === 'kn' ? 'ಪರಿಹಾರ ನೋಡಿ' : 'View Fix'}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
