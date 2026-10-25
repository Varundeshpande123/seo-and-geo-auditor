import React from 'react';
import type { InsiderMetrics } from '../types/audit';
import { Lock, FileText, Cpu, ShieldAlert, Sparkles } from 'lucide-react';

interface InsiderAuditCardProps {
  insider: InsiderMetrics;
  lang: 'kn' | 'en';
  onOpenFix?: (issueId: string) => void;
}

export const InsiderAuditCard: React.FC<InsiderAuditCardProps> = ({ insider, lang }) => {
  const getBadgeClass = (status: 'good' | 'warning' | 'critical') => {
    if (status === 'good') return 'badge-good';
    if (status === 'warning') return 'badge-warning';
    return 'badge-critical';
  };

  const getRiskColor = (risk: 'Low' | 'Moderate' | 'High') => {
    if (risk === 'Low') return '#10b981';
    if (risk === 'Moderate') return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="glass-panel" style={{ padding: '28px', marginBottom: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: '#e8f0fe',
            border: '1px solid #d2e3fc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Sparkles size={20} color="#1a73e8" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {lang === 'kn' ? 'Advanced Insider ಆಡಿಟ್ (ಸೀಕ್ರೆಟ್ ಮೆಟ್ರಿಕ್ಸ್)' : 'Advanced Insider & Secret Metrics'}
              </h3>
              <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>PRO INSIGHTS</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
              {lang === 'kn'
                ? 'Information Gain, Crawl Budget DOM, ಸೆಕ್ಯುರಿಟಿ ಹೆಡರ್ಸ್ ಮತ್ತು AI Hallucination Risk'
                : 'Information Gain, DOM Crawl Budget, Security Headers & AI Hallucination Risk'}
            </p>
          </div>
        </div>
        <span className={`badge ${insider.score >= 80 ? 'badge-good' : 'badge-warning'}`} style={{ fontSize: '0.85rem' }}>
          {insider.score}% Insider Score
        </span>
      </div>

      {/* 4 Secret Pillars Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '20px',
      }}>
        {/* 1. Information Gain & Content Depth */}
        <div style={{
          background: '#f8f9fa',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.92rem', color: '#202124' }}>
              <FileText size={16} color="#1a73e8" />
              <span>Information Gain</span>
            </div>
            <span className={`badge ${getBadgeClass(insider.informationGain.status)}`}>
              {insider.informationGain.wordCount} {lang === 'kn' ? 'ಪದಗಳು' : 'words'}
            </span>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
            {insider.informationGain.feedback}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem', marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)' }}>
              <span>Reading Time:</span>
              <span style={{ color: '#202124', fontWeight: 600 }}>~{insider.informationGain.readingTimeMin} min</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)' }}>
              <span>Vocabulary Variety:</span>
              <span style={{ color: '#1a73e8', fontWeight: 600 }}>{insider.informationGain.lexicalRichnessPercent}% unique</span>
            </div>
          </div>

          {/* Top Keywords Density Badges */}
          {insider.keywords && insider.keywords.length > 0 && (
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600, marginBottom: '6px' }}>
                {lang === 'kn' ? 'ಪ್ರಮುಖ ಕೀವರ್ಡ್‌ಗಳ ಡೆನ್ಸಿಟಿ:' : 'Top Recurring Keywords:'}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {insider.keywords.map((kw, i) => (
                  <span
                    key={i}
                    style={{
                      background: kw.isOverOptimized ? '#fce8e6' : '#ffffff',
                      border: kw.isOverOptimized ? '1px solid #fad2cf' : '1px solid var(--border-subtle)',
                      color: kw.isOverOptimized ? '#c5221f' : '#202124',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                    title={kw.isOverOptimized ? 'Warning: High keyword density (>4.5%)' : ''}
                  >
                    <strong>{kw.word}</strong> ({kw.count} • {kw.densityPercent}%)
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. Crawl Budget & DOM Architecture */}
        <div style={{
          background: '#f8f9fa',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.92rem', color: '#202124' }}>
              <Cpu size={16} color="#1a73e8" />
              <span>DOM & Crawl Budget</span>
            </div>
            <span className={`badge ${insider.domArchitecture.crawlBudgetEfficiency === 'Optimal' ? 'badge-good' : 'badge-warning'}`}>
              {insider.domArchitecture.crawlBudgetEfficiency}
            </span>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
            {insider.domArchitecture.feedback}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)' }}>
              <span>Total DOM Nodes:</span>
              <span style={{ color: '#202124', fontWeight: 600 }}>{insider.domArchitecture.totalElements} tags</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)' }}>
              <span>Text to HTML Ratio:</span>
              <span style={{ color: '#137333', fontWeight: 600 }}>{insider.domArchitecture.textToHtmlRatio}%</span>
            </div>
          </div>
        </div>

        {/* 3. Security Headers */}
        <div style={{
          background: '#f8f9fa',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.92rem', color: '#202124' }}>
              <Lock size={16} color="#137333" />
              <span>Security Trust Headers</span>
            </div>
            <span className="badge badge-primary">
              {insider.securityHeaders.score}%
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>HSTS (Strict HTTPS):</span>
              <span style={{ color: insider.securityHeaders.hsts ? '#137333' : '#c5221f', fontWeight: 600 }}>
                {insider.securityHeaders.hsts ? 'Active' : 'Missing'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Content-Security-Policy:</span>
              <span style={{ color: insider.securityHeaders.csp ? '#137333' : '#b06000', fontWeight: 600 }}>
                {insider.securityHeaders.csp ? 'Configured' : 'Recommended'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>X-Frame-Options:</span>
              <span style={{ color: insider.securityHeaders.xFrameOptions ? '#137333' : '#70757a', fontWeight: 600 }}>
                {insider.securityHeaders.xFrameOptions ? 'Protected' : 'Not set'}
              </span>
            </div>
          </div>
        </div>

        {/* 4. AI Hallucination Risk */}
        <div style={{
          background: '#f8f9fa',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.92rem', color: '#202124' }}>
              <ShieldAlert size={16} color={getRiskColor(insider.aiHallucinationRisk.riskLevel)} />
              <span>AI Hallucination Risk</span>
            </div>
            <span style={{
              background: `${getRiskColor(insider.aiHallucinationRisk.riskLevel)}20`,
              color: getRiskColor(insider.aiHallucinationRisk.riskLevel),
              border: `1px solid ${getRiskColor(insider.aiHallucinationRisk.riskLevel)}40`,
              padding: '2px 10px',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: 700,
            }}>
              {insider.aiHallucinationRisk.riskLevel} Risk
            </span>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
            {insider.aiHallucinationRisk.feedback}
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
            <span>Factual Grounding:</span>
            <span style={{ color: '#1a73e8', fontWeight: 600 }}>{insider.aiHallucinationRisk.factDensityScore}% Clarity</span>
          </div>
        </div>
      </div>
    </div>
  );
};
