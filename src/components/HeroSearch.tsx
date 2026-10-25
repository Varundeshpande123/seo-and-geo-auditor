import React, { useState } from 'react';
import { Search, Loader2, Bot, ArrowRight, Swords } from 'lucide-react';

interface HeroSearchProps {
  onAnalyze: (url: string, competitorUrl?: string) => void;
  isLoading: boolean;
  scanStep: string;
  lang: 'kn' | 'en';
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  onAnalyze,
  isLoading,
  scanStep,
  lang,
}) => {
  const [mode, setMode] = useState<'single' | 'compare'>('single');
  const [urlInput, setUrlInput] = useState('somashekhar.in');
  const [competitorInput, setCompetitorInput] = useState('google.com');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'single') {
      if (urlInput.trim()) {
        onAnalyze(urlInput.trim());
      }
    } else {
      if (urlInput.trim() && competitorInput.trim()) {
        onAnalyze(urlInput.trim(), competitorInput.trim());
      }
    }
  };

  const handleChipClick = (domain: string) => {
    setUrlInput(domain);
    onAnalyze(domain);
  };

  return (
    <section style={{ padding: '48px 0 36px', textAlign: 'center' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        {/* Mode Switcher Toggle */}
        <div style={{
          display: 'inline-flex',
          background: '#ffffff',
          padding: '4px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid #dadce0',
          marginBottom: '20px',
          boxShadow: '0 1px 3px rgba(60,64,67,0.1)',
        }}>
          <button
            type="button"
            onClick={() => setMode('single')}
            style={{
              border: 'none',
              background: mode === 'single' ? '#1a73e8' : 'transparent',
              color: mode === 'single' ? '#ffffff' : '#5f6368',
              padding: '6px 18px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <Bot size={15} />
            <span>{lang === 'kn' ? 'ಏಕೈಕ ಆಡಿಟ್ (Single Audit)' : 'Single Audit'}</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('compare')}
            style={{
              border: 'none',
              background: mode === 'compare' ? '#1a73e8' : 'transparent',
              color: mode === 'compare' ? '#ffffff' : '#5f6368',
              padding: '6px 18px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <Swords size={15} />
            <span>{lang === 'kn' ? 'ಪ್ರತಿಸ್ಪರ್ಧಿ ಮುಖಾಮುಖಿ (URL vs URL)' : 'Competitor Battle'}</span>
          </button>
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(2rem, 4.5vw, 3rem)',
          fontWeight: 700,
          lineHeight: 1.2,
          color: '#202124',
          letterSpacing: '-0.02em',
          marginBottom: '16px',
        }}>
          {lang === 'kn' ? (
            <>
              ವೆಬ್‌ಸೈಟ್‌ನ <span style={{ color: '#1a73e8' }}>Google SEO</span> ಮತ್ತು <span style={{ color: '#137333' }}>GEO (AI Search)</span> ಪರೀಕ್ಷಿಸಿ
            </>
          ) : (
            <>
              Make your web pages fast on <span style={{ color: '#1a73e8' }}>Google</span> & visible on <span style={{ color: '#137333' }}>AI Search</span>
            </>
          )}
        </h1>

        <p style={{
          fontSize: '1.05rem',
          color: '#5f6368',
          maxWidth: '680px',
          margin: '0 auto 32px',
        }}>
          {lang === 'kn'
            ? 'ಗೂಗಲ್ ಪೇಜ್‌ಸ್ಪೀಡ್ ಮಾದರಿಯಲ್ಲಿ ನಿಮ್ಮ ವೆಬ್‌ಸೈಟ್‌ನ ಆನ್-ಪೇಜ್, ತಾಂತ್ರಿಕ ಮತ್ತು AI ಸರ್ಚ್ ವಿಸಿಬಿಲಿಟಿ ಆಡಿಟ್ ಮಾಡಿ.'
            : 'PageSpeed Insights and Generative Engine Optimization audit for desktop and mobile devices.'}
        </p>

        {/* Search Bar Form */}
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          maxWidth: '720px',
          margin: '0 auto',
        }}>
          {mode === 'single' ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#ffffff',
              border: '1px solid #dadce0',
              borderRadius: 'var(--radius-md)',
              padding: '6px 8px 6px 18px',
              boxShadow: '0 1px 3px 0 rgba(60,64,67,0.2), 0 4px 8px 3px rgba(60,64,67,0.06)',
            }}>
              <Search size={20} color="#5f6368" style={{ flexShrink: 0, marginRight: '10px' }} />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="e.g. somashekhar.in"
                disabled={isLoading}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#202124',
                  fontSize: '1.05rem',
                  fontFamily: 'var(--font-sans)',
                }}
              />
              <button
                type="submit"
                disabled={isLoading || !urlInput.trim()}
                className="btn btn-primary"
                style={{ flexShrink: 0, padding: '12px 28px' }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                    {lang === 'kn' ? 'ಪರೀಕ್ಷಿಸಲಾಗುತ್ತಿದೆ...' : 'Analyzing...'}
                  </>
                ) : (
                  <>
                    {lang === 'kn' ? 'ಆಡಿಟ್ ಮಾಡಿ' : 'Analyze'}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Competitor Comparison Inputs */
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              background: '#ffffff',
              border: '1px solid #dadce0',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              boxShadow: '0 1px 3px 0 rgba(60,64,67,0.2)',
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#f8f9fa',
                  border: '1px solid #dadce0',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  gap: '8px',
                }}>
                  <span style={{ fontSize: '0.8rem', color: '#1a73e8', fontWeight: 700 }}>URL 1:</span>
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Your site (e.g. somashekhar.in)"
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#202124',
                      fontSize: '0.95rem',
                    }}
                  />
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#f8f9fa',
                  border: '1px solid #dadce0',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  gap: '8px',
                }}>
                  <span style={{ fontSize: '0.8rem', color: '#137333', fontWeight: 700 }}>URL 2:</span>
                  <input
                    type="text"
                    value={competitorInput}
                    onChange={(e) => setCompetitorInput(e.target.value)}
                    placeholder="Competitor (e.g. competitor.com)"
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#202124',
                      fontSize: '0.95rem',
                    }}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading || !urlInput.trim() || !competitorInput.trim()}
                className="btn btn-primary"
                style={{ padding: '12px', fontSize: '1rem' }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                    {lang === 'kn' ? 'ಮುಖಾಮುಖಿ ಹೋಲಿಸಲಾಗುತ್ತಿದೆ...' : 'Comparing Websites...'}
                  </>
                ) : (
                  <>
                    <Swords size={18} />
                    {lang === 'kn' ? 'ಪ್ರತಿಸ್ಪರ್ಧಿ ಹೋಲಿಕೆ ಪ್ರಾರಂಭಿಸಿ' : 'Launch Competitor Battle'}
                  </>
                )}
              </button>
            </div>
          )}

          {/* Quick Presets */}
          {mode === 'single' && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              flexWrap: 'wrap',
              fontSize: '0.85rem',
              color: '#5f6368',
              marginTop: '6px',
            }}>
              <span>{lang === 'kn' ? 'ಉಚಿತ ಟೆಸ್ಟ್ ಮಾಡಿ:' : 'Try instant demo:'}</span>
              {['somashekhar.in', 'google.com', 'github.com'].map((domain) => (
                <button
                  key={domain}
                  type="button"
                  onClick={() => handleChipClick(domain)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #dadce0',
                    borderRadius: 'var(--radius-full)',
                    padding: '3px 12px',
                    color: '#3c4043',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#1a73e8';
                    e.currentTarget.style.color = '#1a73e8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#dadce0';
                    e.currentTarget.style.color = '#3c4043';
                  }}
                >
                  {domain}
                </button>
              ))}
            </div>
          )}
        </form>

        {/* Scan Progress Status */}
        {isLoading && (
          <div className="animate-fade-in" style={{
            marginTop: '24px',
            background: '#ffffff',
            border: '1px solid #1a73e8',
            borderRadius: 'var(--radius-md)',
            padding: '14px 22px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 2px 8px rgba(26, 115, 232, 0.15)',
          }}>
            <span className="pulse-dot"></span>
            <span style={{ fontSize: '0.92rem', color: '#1a73e8', fontWeight: 500 }}>
              {scanStep}
            </span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};
