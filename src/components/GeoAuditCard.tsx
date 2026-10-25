import React from 'react';
import type { GeoMetrics } from '../types/audit';
import { Bot, CheckCircle, XCircle, Layers, FileCode2, Sparkles } from 'lucide-react';

interface GeoAuditCardProps {
  geo: GeoMetrics;
  lang: 'kn' | 'en';
  onOpenFix: (issueId: string) => void;
}

export const GeoAuditCard: React.FC<GeoAuditCardProps> = ({ geo, lang, onOpenFix }) => {
  return (
    <div className="glass-panel" style={{ padding: '28px', marginBottom: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Bot size={20} color="#38bdf8" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              {lang === 'kn' ? 'GEO (AI Search ವಿಸಿಬಿಲಿಟಿ ಆಡಿಟ್)' : 'GEO (Generative Engine Optimization)'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
              ChatGPT, Perplexity, Google Gemini & Claude Citation Readiness
            </p>
          </div>
        </div>
        <span className={`badge ${geo.score >= 80 ? 'badge-good' : 'badge-warning'}`} style={{ fontSize: '0.85rem' }}>
          {geo.score}% Ready
        </span>
      </div>

      {/* AI Recommendation Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(56, 189, 248, 0.1) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
      }}>
        <Sparkles size={20} color="#818cf8" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#c7d2fe', marginBottom: '4px' }}>
            {lang === 'kn' ? 'AI ಸರ್ಚ್ ಎಂಜಿನ್ ಶಿಫಾರಸು' : 'AI Search Recommendation'}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {geo.aiRecommendation}
          </div>
        </div>
      </div>

      {/* 3 Pillars of GEO */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
      }}>
        {/* 1. AI Crawlers Access */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.92rem' }}>
              <Bot size={16} color="#818cf8" />
              <span>AI Crawlers in Robots.txt</span>
            </div>
            <span className={`badge ${geo.aiBotAccess.status === 'good' ? 'badge-good' : 'badge-warning'}`}>
              {geo.aiBotAccess.score}%
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {geo.aiBotAccess.bots.map((bot) => (
              <div
                key={bot.botName}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(0, 0, 0, 0.2)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                }}
              >
                <div>
                  <span style={{ fontWeight: 600, color: '#f1f5f9' }}>{bot.botName}</span>
                  <span style={{ color: 'var(--text-dim)', marginLeft: '8px' }}>({bot.aiEngine})</span>
                </div>
                {bot.allowed ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#34d399' }}>
                    <CheckCircle size={14} /> Allowed
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f87171' }}>
                    <XCircle size={14} /> Blocked
                  </span>
                )}
              </div>
            ))}
          </div>

          {geo.aiBotAccess.status !== 'good' && (
            <button
              onClick={() => onOpenFix('blocked-ai-bots')}
              className="btn btn-secondary"
              style={{ width: '100%', marginTop: '12px', padding: '8px', fontSize: '0.82rem' }}
            >
              <FileCode2 size={14} /> {lang === 'kn' ? 'Robots.txt ಕೋಡ್ ಪಡೆಯಿರಿ' : 'Get Robots.txt Fix'}
            </button>
          )}
        </div>

        {/* 2. Structured Knowledge Graph (Schema.org) */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.92rem' }}>
              <Layers size={16} color="#38bdf8" />
              <span>Knowledge Graph (Schema)</span>
            </div>
            <span className={`badge ${geo.structuredData.status === 'good' ? 'badge-good' : 'badge-critical'}`}>
              {geo.structuredData.score}%
            </span>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
            {geo.structuredData.feedback}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
            {geo.structuredData.schemasFound.length > 0 ? (
              geo.structuredData.schemasFound.map((sc, idx) => (
                <span key={idx} className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                  {sc}
                </span>
              ))
            ) : (
              <span style={{ fontSize: '0.82rem', color: '#f87171' }}>
                ❌ {lang === 'kn' ? 'ಯಾವುದೇ Schema ಪತ್ತೆಯಾಗಿಲ್ಲ' : 'No Schema detected'}
              </span>
            )}
          </div>

          {geo.structuredData.status !== 'good' && (
            <button
              onClick={() => onOpenFix('missing-json-ld-schema')}
              className="btn btn-secondary"
              style={{ width: '100%', padding: '8px', fontSize: '0.82rem' }}
            >
              <FileCode2 size={14} /> {lang === 'kn' ? 'Schema JSON-LD ಜನರೇಟ್ ಮಾಡಿ' : 'Generate Schema JSON-LD'}
            </button>
          )}
        </div>

        {/* 3. Citation Readiness */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.92rem' }}>
              <Sparkles size={16} color="#34d399" />
              <span>Citation Extractability</span>
            </div>
            <span className="badge badge-primary">
              {geo.citationReadiness.score}%
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Direct Answer / TL;DR:</span>
              <span style={{ color: geo.citationReadiness.directAnswerBlocksFound ? '#34d399' : '#f87171' }}>
                {geo.citationReadiness.directAnswerBlocksFound ? 'Present' : 'Missing'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Conversational Q&A Headings:</span>
              <span style={{ color: geo.citationReadiness.faqOrQaFormatFound ? '#34d399' : '#fbbf24' }}>
                {geo.citationReadiness.faqOrQaFormatFound ? 'Detected' : 'Recommended'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span style={{ color: 'var(--text-muted)' }}>Data Tables & Lists:</span>
              <span style={{ color: '#38bdf8' }}>
                {geo.citationReadiness.listsCount} Lists {geo.citationReadiness.tabularDataFound ? '+ Tables' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
