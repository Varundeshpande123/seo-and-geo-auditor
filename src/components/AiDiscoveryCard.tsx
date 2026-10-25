import React, { useState } from 'react';
import type { GeoMetrics } from '../types/audit';
import { HelpCircle, Copy, Check, PieChart, Sparkles } from 'lucide-react';

interface AiDiscoveryCardProps {
  geo: GeoMetrics;
  lang: 'kn' | 'en';
}

export const AiDiscoveryCard: React.FC<AiDiscoveryCardProps> = ({ geo, lang }) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = (prompt: string, idx: number) => {
    navigator.clipboard.writeText(prompt);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const getSovColor = (percentage: number) => {
    if (percentage >= 75) return '#10b981';
    if (percentage >= 55) return '#38bdf8';
    if (percentage >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const getIntentBadgeClass = (intent: string) => {
    if (intent === 'Informational') return 'badge-primary';
    if (intent === 'Commercial') return 'badge-good';
    return 'badge-warning';
  };

  return (
    <div className="glass-panel" style={{ padding: '28px', marginBottom: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(6, 182, 212, 0.35)',
          }}>
            <Sparkles size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                {lang === 'kn' ? 'AI Share of Voice & ಪ್ರಾಂಪ್ಟ್ ಡಿಸ್ಕವರಿ' : 'AI Share of Voice & Prompt Discovery'}
              </h3>
              <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>NEW ENTERPRISE GEO</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
              {lang === 'kn'
                ? 'ChatGPT, Perplexity & Gemini ನಲ್ಲಿ ಜನರು ನಿಮ್ಮ ಬ್ರ್ಯಾಂಡ್ ಬಗ್ಗೆ ಹುಡುಕುವ ನೈಜ ಪ್ರಶ್ನೆಗಳು'
                : 'Real questions and prompts users ask Generative AI models where your brand can be cited'}
            </p>
          </div>
        </div>

        {/* Share of Voice Badge */}
        {geo.shareOfVoice && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-subtle)',
          }}>
            <PieChart size={18} color={getSovColor(geo.shareOfVoice.percentage)} />
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                AI Share of Voice:
              </span>
              <strong style={{ color: getSovColor(geo.shareOfVoice.percentage), marginLeft: '6px' }}>
                {geo.shareOfVoice.percentage}% ({geo.shareOfVoice.rating})
              </strong>
            </div>
          </div>
        )}
      </div>

      {/* Share of Voice Progress Bar */}
      {geo.shareOfVoice && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          marginBottom: '22px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '8px' }}>
            <span style={{ color: 'var(--text-muted)' }}>{geo.shareOfVoice.summary}</span>
            <strong style={{ color: getSovColor(geo.shareOfVoice.percentage) }}>{geo.shareOfVoice.percentage}% Share</strong>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '9999px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${geo.shareOfVoice.percentage}%`,
              height: '100%',
              background: `linear-gradient(90deg, #6366f1, ${getSovColor(geo.shareOfVoice.percentage)})`,
              borderRadius: '9999px',
              transition: 'width 0.8s ease',
            }} />
          </div>
        </div>
      )}

      {/* Prompt Discovery List */}
      <div>
        <div style={{
          fontSize: '0.92rem',
          fontWeight: 700,
          color: '#f1f5f9',
          marginBottom: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <HelpCircle size={18} color="#38bdf8" />
          <span>{lang === 'kn' ? 'AI ಸರ್ಚ್ ಎಂಜಿನ್‌ಗಳಲ್ಲಿ ಜನರು ಕೇಳುವ ಪ್ರಮುಖ ಪ್ರಶ್ನೆಗಳು:' : 'Discovered AI Prompts & Questions:'}</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '14px',
        }}>
          {geo.promptDiscovery && geo.promptDiscovery.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <span className={`badge ${getIntentBadgeClass(item.intent)}`} style={{ fontSize: '0.72rem' }}>
                  {item.intent}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', background: 'rgba(0, 0, 0, 0.25)', padding: '2px 8px', borderRadius: '4px' }}>
                  🎯 {item.suggestedEngine}
                </span>
              </div>

              <div style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 500, lineHeight: 1.4 }}>
                "{item.prompt}"
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => handleCopy(item.prompt, idx)}
                  className="btn btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.78rem', gap: '6px' }}
                >
                  {copiedIdx === idx ? (
                    <>
                      <Check size={14} color="#34d399" />
                      <span style={{ color: '#34d399' }}>{lang === 'kn' ? 'ಕಾಪಿ ಮಾಡಲಾಗಿದೆ!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>{lang === 'kn' ? 'ಪ್ರಾಂಪ್ಟ್ ಕಾಪಿ ಮಾಡಿ' : 'Copy Prompt'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
