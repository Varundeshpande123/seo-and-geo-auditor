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
    <div className="glass-panel" style={{ padding: '28px', marginBottom: '28px', background: '#ffffff' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
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
            <Bot size={20} color="#1a73e8" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#202124' }}>
              {lang === 'kn' ? 'GEO (AI Search ವಿಸಿಬಿಲಿಟಿ ಆಡಿಟ್)' : 'GEO (Generative Engine Optimization)'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#5f6368' }}>
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
        background: '#e8f0fe',
        border: '1px solid #d2e3fc',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
      }}>
        <Sparkles size={20} color="#1a73e8" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#174ea6', marginBottom: '4px' }}>
            {lang === 'kn' ? 'AI ಸರ್ಚ್ ಎಂಜಿನ್ ಶಿಫಾರಸು' : 'AI Search Recommendation'}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#3c4043' }}>
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
          background: '#f8f9fa',
          border: '1px solid #dadce0',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.92rem', color: '#202124' }}>
              <Bot size={16} color="#1a73e8" />
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
                  background: '#ffffff',
                  border: '1px solid #e8eaed',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                }}
              >
                <div>
                  <span style={{ fontWeight: 600, color: '#202124' }}>{bot.botName}</span>
                  <span style={{ color: '#5f6368', marginLeft: '8px' }}>({bot.aiEngine})</span>
                </div>
                {bot.allowed ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#137333', fontWeight: 600 }}>
                    <CheckCircle size={14} /> Allowed
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#c5221f', fontWeight: 600 }}>
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
          background: '#f8f9fa',
          border: '1px solid #dadce0',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.92rem', color: '#202124' }}>
              <Layers size={16} color="#1a73e8" />
              <span>Knowledge Graph (Schema)</span>
            </div>
            <span className={`badge ${geo.structuredData.status === 'good' ? 'badge-good' : 'badge-critical'}`}>
              {geo.structuredData.score}%
            </span>
          </div>

          <p style={{ fontSize: '0.82rem', color: '#5f6368', marginBottom: '12px' }}>
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
              <span style={{ fontSize: '0.82rem', color: '#c5221f' }}>
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
          background: '#f8f9fa',
          border: '1px solid #dadce0',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.92rem', color: '#202124' }}>
              <Sparkles size={16} color="#137333" />
              <span>Citation Extractability</span>
            </div>
            <span className="badge badge-primary">
              {geo.citationReadiness.score}%
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #dadce0' }}>
              <span style={{ color: '#5f6368' }}>Direct Answer / TL;DR:</span>
              <span style={{ color: geo.citationReadiness.directAnswerBlocksFound ? '#137333' : '#c5221f', fontWeight: 600 }}>
                {geo.citationReadiness.directAnswerBlocksFound ? 'Present' : 'Missing'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #dadce0' }}>
              <span style={{ color: '#5f6368' }}>Conversational Q&A Headings:</span>
              <span style={{ color: geo.citationReadiness.faqOrQaFormatFound ? '#137333' : '#b06000', fontWeight: 600 }}>
                {geo.citationReadiness.faqOrQaFormatFound ? 'Detected' : 'Recommended'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span style={{ color: '#5f6368' }}>Data Tables & Lists:</span>
              <span style={{ color: '#1a73e8', fontWeight: 600 }}>
                {geo.citationReadiness.listsCount} Lists {geo.citationReadiness.tabularDataFound ? '+ Tables' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Modern llms.txt AI Protocol */}
        <div style={{
          background: '#f8f9fa',
          border: '1px solid #dadce0',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.92rem', color: '#202124' }}>
              <Bot size={16} color="#681da8" />
              <span>/llms.txt AI Protocol</span>
            </div>
            <span className={`badge ${geo.llmsTxt?.exists ? 'badge-good' : 'badge-warning'}`}>
              {geo.llmsTxt?.exists ? 'Active' : 'Missing'}
            </span>
          </div>

          <p style={{ fontSize: '0.82rem', color: '#5f6368', marginBottom: '12px' }}>
            {geo.llmsTxt?.feedback || 'Standard markdown context file for AI agents (OpenAI, Claude, Perplexity).'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem', marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#5f6368' }}>
              <span>Target URL:</span>
              <span style={{ color: '#1a73e8', wordBreak: 'break-all' }}>/llms.txt</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#5f6368' }}>
              <span>AI Ingestion:</span>
              <span style={{ color: geo.llmsTxt?.exists ? '#137333' : '#b06000', fontWeight: 600 }}>
                {geo.llmsTxt?.exists ? 'Instant Markdown' : 'Fallback to HTML'}
              </span>
            </div>
          </div>

          {!geo.llmsTxt?.exists && (
            <button
              onClick={() => onOpenFix('missing-llms-txt')}
              className="btn btn-secondary"
              style={{ width: '100%', padding: '8px', fontSize: '0.82rem' }}
            >
              <FileCode2 size={14} /> {lang === 'kn' ? 'llms.txt ಕೋಡ್ ಪಡೆಯಿರಿ' : 'Generate llms.txt'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
