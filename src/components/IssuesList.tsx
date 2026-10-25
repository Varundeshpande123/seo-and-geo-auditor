import React, { useState } from 'react';
import type { AuditIssue } from '../types/audit';
import { AlertCircle, AlertTriangle, ArrowRight, Code, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface IssuesListProps {
  issues: AuditIssue[];
  lang: 'kn' | 'en';
  onSelectIssue: (issue: AuditIssue) => void;
}

export const IssuesList: React.FC<IssuesListProps> = ({ issues, lang, onSelectIssue }) => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const criticalIssues = issues.filter((i) => i.severity === 'critical');
  const warningIssues = issues.filter((i) => i.severity === 'warning');
  const infoIssues = issues.filter((i) => i.severity === 'info');

  const filteredIssues = issues.filter((issue) => {
    if (filter === 'critical') return issue.severity === 'critical';
    if (filter === 'warning') return issue.severity === 'warning';
    if (filter === 'info') return issue.severity === 'info';
    return true;
  });

  // Show top 4 by default if in 'all' view and not expanded, to avoid terrifying user with 15 red cards
  const displayedIssues = (filter === 'all' && !isExpanded)
    ? filteredIssues.slice(0, 4)
    : filteredIssues;

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'geo':
        return { label: lang === 'kn' ? '🤖 AI ಸರ್ಚ್ (ChatGPT)' : '🤖 AI Search & Citation', color: '#137333', bg: '#e6f4ea' };
      case 'seo':
        return { label: lang === 'kn' ? '🔍 Google ರ್ಯಾಂಕಿಂಗ್' : '🔍 Google Ranking', color: '#1a73e8', bg: '#e8f0fe' };
      case 'performance':
        return { label: lang === 'kn' ? '⚡ ಲೋಡಿಂಗ್ ಸ್ಪೀಡ್' : '⚡ Page Speed', color: '#b06000', bg: '#fef7e0' };
      case 'insider':
        return { label: lang === 'kn' ? '🛡️ ಸೆಕ್ಯುರಿಟಿ & ಟ್ರಸ್ಟ್' : '🛡️ Trust & Security', color: '#a142f4', bg: '#f3e8fd' };
      default:
        return { label: category.toUpperCase(), color: '#5f6368', bg: '#f1f3f4' };
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '28px', marginBottom: '40px', background: '#ffffff' }}>
      {/* Header and Filter Chips */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        borderBottom: '1px solid #dadce0',
        paddingBottom: '20px',
        marginBottom: '20px',
      }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#202124', marginBottom: '4px' }}>
            {lang === 'kn' ? '🎯 ಸರಿಪಡಿಸಬೇಕಾದ ಮುಖ್ಯ ಅಂಶಗಳು (Action Plan)' : '🎯 Actionable Optimization Plan'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#5f6368', margin: 0 }}>
            {lang === 'kn'
              ? 'ಪ್ರತಿಯೊಂದು ಅಂಶವನ್ನು ಸರಿಪಡಿಸಿದಾಗ ನಿಮ್ಮ ಅಂಕಗಳು ತಕ್ಷಣವೇ ಹೆಚ್ಚಾಗುತ್ತವೆ.'
              : 'Fix high-impact items to boost your ranking and AI search visibility.'}
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '6px 14px',
              fontSize: '0.82rem',
              fontWeight: 600,
              borderRadius: '20px',
              border: '1px solid',
              borderColor: filter === 'all' ? '#1a73e8' : '#dadce0',
              background: filter === 'all' ? '#e8f0fe' : '#ffffff',
              color: filter === 'all' ? '#1a73e8' : '#3c4043',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {lang === 'kn' ? `ಎಲ್ಲವೂ (${issues.length})` : `All (${issues.length})`}
          </button>

          {criticalIssues.length > 0 && (
            <button
              onClick={() => setFilter('critical')}
              style={{
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: 600,
                borderRadius: '20px',
                border: '1px solid',
                borderColor: filter === 'critical' ? '#c5221f' : '#dadce0',
                background: filter === 'critical' ? '#fce8e6' : '#ffffff',
                color: filter === 'critical' ? '#c5221f' : '#3c4043',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              🔴 {lang === 'kn' ? `ಗಂಭೀರ (${criticalIssues.length})` : `Critical (${criticalIssues.length})`}
            </button>
          )}

          {warningIssues.length > 0 && (
            <button
              onClick={() => setFilter('warning')}
              style={{
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: 600,
                borderRadius: '20px',
                border: '1px solid',
                borderColor: filter === 'warning' ? '#b06000' : '#dadce0',
                background: filter === 'warning' ? '#fef7e0' : '#ffffff',
                color: filter === 'warning' ? '#b06000' : '#3c4043',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              🟡 {lang === 'kn' ? `ಎಚ್ಚರಿಕೆ (${warningIssues.length})` : `Warnings (${warningIssues.length})`}
            </button>
          )}

          {infoIssues.length > 0 && (
            <button
              onClick={() => setFilter('info')}
              style={{
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: 600,
                borderRadius: '20px',
                border: '1px solid',
                borderColor: filter === 'info' ? '#137333' : '#dadce0',
                background: filter === 'info' ? '#e6f4ea' : '#ffffff',
                color: filter === 'info' ? '#137333' : '#3c4043',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              💡 {lang === 'kn' ? `ಟಿಪ್ಸ್ (${infoIssues.length})` : `Tips (${infoIssues.length})`}
            </button>
          )}
        </div>
      </div>

      {/* Issues Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {displayedIssues.map((issue) => {
          const isCritical = issue.severity === 'critical';
          const isWarning = issue.severity === 'warning';
          const cat = getCategoryBadge(issue.category);

          return (
            <div
              key={issue.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '18px 20px',
                background: '#ffffff',
                border: '1px solid #dadce0',
                borderRadius: 'var(--radius-md)',
                gap: '16px',
                flexWrap: 'wrap',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#1a73e8';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(60,64,67,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#dadce0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1, minWidth: '260px' }}>
                <div style={{ marginTop: '2px' }}>
                  {isCritical ? (
                    <AlertCircle size={22} color="#c5221f" />
                  ) : isWarning ? (
                    <AlertTriangle size={22} color="#b06000" />
                  ) : (
                    <Sparkles size={22} color="#1a73e8" />
                  )}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.96rem', color: '#202124' }}>
                      {issue.title}
                    </span>

                    {/* Layman Friendly Category Badge */}
                    <span style={{
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '12px',
                      background: cat.bg,
                      color: cat.color,
                    }}>
                      {cat.label}
                    </span>

                    {/* Score Impact Points */}
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '12px',
                      background: '#f1f3f4',
                      color: '#137333',
                    }}>
                      +{issue.impactScore || 5} {lang === 'kn' ? 'ಅಂಕಗಳು' : 'Points'}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.84rem', color: '#5f6368', margin: 0, lineHeight: 1.45 }}>
                    {issue.recommendation}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectIssue(issue)}
                className="btn btn-secondary"
                style={{
                  padding: '8px 18px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  borderColor: '#dadce0',
                }}
              >
                <Code size={14} color="#1a73e8" />
                <span>{lang === 'kn' ? 'ಪರಿಹಾರ ನೋಡಿ' : 'View Fix'}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Expand / Collapse Button if more than 4 items */}
      {filter === 'all' && filteredIssues.length > 4 && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              padding: '10px 24px',
              fontSize: '0.88rem',
              fontWeight: 600,
              borderRadius: '24px',
              border: '1px solid #dadce0',
              background: '#f8f9fa',
              color: '#1a73e8',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 1px 2px rgba(60,64,67,0.1)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#e8f0fe';
              e.currentTarget.style.borderColor = '#1a73e8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f8f9fa';
              e.currentTarget.style.borderColor = '#dadce0';
            }}
          >
            {isExpanded ? (
              <>
                <ChevronUp size={16} />
                <span>{lang === 'kn' ? 'ಕಡಿಮೆ ತೋರಿಸಿ (Collapse)' : 'Show Less'}</span>
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                <span>
                  {lang === 'kn'
                    ? `ಉಳಿದ ${filteredIssues.length - 4} ಸಮಸ್ಯೆಗಳನ್ನು ವಿಸ್ತರಿಸಿ (Expand)`
                    : `Show ${filteredIssues.length - 4} More Diagnostics`}
                </span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
