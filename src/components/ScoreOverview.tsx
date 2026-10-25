import React from 'react';
import type { FullAuditResult } from '../types/audit';
import { AlertTriangle, CheckCircle2, XCircle, Printer } from 'lucide-react';

interface ScoreOverviewProps {
  audit: FullAuditResult;
  lang: 'kn' | 'en';
}

export const ScoreOverview: React.FC<ScoreOverviewProps> = ({ audit, lang }) => {
  const criticalCount = audit.issues.filter((i) => i.severity === 'critical').length;
  const warningCount = audit.issues.filter((i) => i.severity === 'warning').length;

  const getScoreColor = (score: number) => {
    if (score >= 85) return '#10b981'; // Emerald
    if (score >= 65) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '32px', marginBottom: '32px' }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '24px',
        marginBottom: '28px',
      }}>
        {/* Domain & URL */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{audit.domain}</h2>
            <span className="badge badge-primary" style={{ fontSize: '0.8rem' }}>
              Grade {audit.grade}
            </span>
          </div>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', wordBreak: 'break-all' }}>
            {audit.url} • {new Date(audit.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Print / Export Button */}
        <button
          onClick={handlePrint}
          className="btn btn-secondary"
          style={{ padding: '8px 18px', fontSize: '0.88rem' }}
        >
          <Printer size={16} />
          {lang === 'kn' ? 'ವರದಿ ಪ್ರಿಂಟ್ / PDF' : 'Print / Save PDF'}
        </button>
      </div>

      {/* Grid of Scores */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '24px',
        alignItems: 'center',
      }}>
        {/* Overall Master Score */}
        <div style={{
          textAlign: 'center',
          padding: '24px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
        }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px', fontWeight: 600 }}>
            {lang === 'kn' ? 'ಒಟ್ಟಾರೆ ಹೆಲ್ತ್ ಸ್ಕೋರ್' : 'Overall Health Score'}
          </div>
          <div style={{
            fontSize: '3.6rem',
            fontWeight: 800,
            lineHeight: 1,
            color: getScoreColor(audit.overallScore),
            textShadow: `0 0 30px ${getScoreColor(audit.overallScore)}40`,
            marginBottom: '8px',
          }}>
            {audit.overallScore}
            <span style={{ fontSize: '1.4rem', color: 'var(--text-dim)' }}>/100</span>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {audit.overallScore >= 80
              ? (lang === 'kn' ? 'ಉತ್ತಮ ಸ್ಥಿತಿಯಲ್ಲಿದೆ' : 'Optimal Condition')
              : (lang === 'kn' ? 'ಗಮನಾರ್ಹ ಸುಧಾರಣೆ ಅಗತ್ಯವಿದೆ' : 'Needs Optimization')}
          </div>
        </div>

        {/* SEO Score */}
        <div style={{
          textAlign: 'center',
          padding: '24px',
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
        }}>
          <div style={{ fontSize: '0.85rem', color: '#818cf8', marginBottom: '10px', fontWeight: 600 }}>
            Google SEO
          </div>
          <div style={{
            fontSize: '2.8rem',
            fontWeight: 800,
            lineHeight: 1,
            color: getScoreColor(audit.seo.score),
            marginBottom: '8px',
          }}>
            {audit.seo.score}
            <span style={{ fontSize: '1.2rem', color: 'var(--text-dim)' }}>%</span>
          </div>
          <span className={`badge ${audit.seo.score >= 80 ? 'badge-good' : 'badge-warning'}`}>
            {audit.seo.score >= 80 ? 'On-Page Strong' : 'Review Elements'}
          </span>
        </div>

        {/* GEO (AI Search) Score */}
        <div style={{
          textAlign: 'center',
          padding: '24px',
          background: 'rgba(99, 102, 241, 0.05)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
        }}>
          <div style={{ fontSize: '0.85rem', color: '#38bdf8', marginBottom: '10px', fontWeight: 600 }}>
            GEO (AI Citation)
          </div>
          <div style={{
            fontSize: '2.8rem',
            fontWeight: 800,
            lineHeight: 1,
            color: getScoreColor(audit.geo.score),
            marginBottom: '8px',
          }}>
            {audit.geo.score}
            <span style={{ fontSize: '1.2rem', color: 'var(--text-dim)' }}>%</span>
          </div>
          <span className={`badge ${audit.geo.score >= 80 ? 'badge-good' : 'badge-warning'}`}>
            {audit.geo.score >= 80 ? 'AI Bot Ready' : 'AI Blind Spot'}
          </span>
        </div>

        {/* Speed & Performance Score */}
        <div style={{
          textAlign: 'center',
          padding: '24px',
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
        }}>
          <div style={{ fontSize: '0.85rem', color: '#34d399', marginBottom: '10px', fontWeight: 600 }}>
            PageSpeed & Core Vitals
          </div>
          <div style={{
            fontSize: '2.8rem',
            fontWeight: 800,
            lineHeight: 1,
            color: getScoreColor(audit.performance.score),
            marginBottom: '8px',
          }}>
            {audit.performance.score}
            <span style={{ fontSize: '1.2rem', color: 'var(--text-dim)' }}>%</span>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
            TTFB: {audit.performance.serverResponseTimeMs}ms
          </div>
        </div>

        {/* Insider Secrets Score */}
        {audit.insider && (
          <div style={{
            textAlign: 'center',
            padding: '24px',
            background: 'rgba(236, 72, 153, 0.05)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(236, 72, 153, 0.25)',
          }}>
            <div style={{ fontSize: '0.85rem', color: '#ec4899', marginBottom: '10px', fontWeight: 600 }}>
              Insider Pro Secrets
            </div>
            <div style={{
              fontSize: '2.8rem',
              fontWeight: 800,
              lineHeight: 1,
              color: getScoreColor(audit.insider.score),
              marginBottom: '8px',
            }}>
              {audit.insider.score}
              <span style={{ fontSize: '1.2rem', color: 'var(--text-dim)' }}>%</span>
            </div>
            <span className={`badge ${audit.insider.score >= 80 ? 'badge-good' : 'badge-warning'}`}>
              {audit.insider.informationGain.wordCount} words • {audit.insider.aiHallucinationRisk.riskLevel} Risk
            </span>
          </div>
        )}
      </div>

      {/* Issues Breakdown Strip */}
      <div style={{
        marginTop: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        flexWrap: 'wrap',
        background: 'rgba(0, 0, 0, 0.25)',
        padding: '12px 20px',
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.88rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171' }}>
          <XCircle size={18} />
          <strong>{criticalCount}</strong> {lang === 'kn' ? 'ತುರ್ತು ಸಮಸ್ಯೆಗಳು' : 'Critical Issues'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24' }}>
          <AlertTriangle size={18} />
          <strong>{warningCount}</strong> {lang === 'kn' ? 'ಸುಧಾರಣೆ ಎಚ್ಚರಿಕೆಗಳು' : 'Warnings'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399' }}>
          <CheckCircle2 size={18} />
          <strong>{audit.seo.title.status === 'good' ? 1 : 0}</strong> {lang === 'kn' ? 'ಉತ್ತಮ ಅಂಶಗಳು' : 'Passing Audits'}
        </div>
      </div>
    </div>
  );
};
