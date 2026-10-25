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
    <section style={{ padding: '60px 0 40px', textAlign: 'center' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        {/* Mode Switcher Toggle */}
        <div style={{
          display: 'inline-flex',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '4px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '20px',
        }}>
          <button
            type="button"
            onClick={() => setMode('single')}
            style={{
              border: 'none',
              background: mode === 'single' ? 'var(--primary)' : 'transparent',
              color: mode === 'single' ? '#ffffff' : 'var(--text-muted)',
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
              background: mode === 'compare' ? 'linear-gradient(135deg, #f59e0b, #ef4444)' : 'transparent',
              color: mode === 'compare' ? '#ffffff' : 'var(--text-muted)',
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
          fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
          fontWeight: 800,
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          marginBottom: '20px',
        }}>
          {lang === 'kn' ? (
            <>
              ನಿಮ್ಮ ವೆಬ್‌ಸೈಟ್‌ನ <span style={{
                background: 'linear-gradient(135deg, #818cf8 0%, #38bdf8 50%, #34d399 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>SEO ಮತ್ತು GEO (AI Search)</span> ಪರೀಕ್ಷಿಸಿ
            </>
          ) : (
            <>
              Audit Your Website for <span style={{
                background: 'linear-gradient(135deg, #818cf8 0%, #38bdf8 50%, #34d399 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>Google SEO & Generative AI</span>
            </>
          )}
        </h1>

        <p style={{
          fontSize: '1.1rem',
          color: 'var(--text-muted)',
          maxWidth: '680px',
          margin: '0 auto 36px',
        }}>
          {lang === 'kn'
            ? 'Google ಸರ್ಚ್ ಜೊತೆಗೆ ChatGPT, Perplexity ಮತ್ತು Gemini AI ಗಳು ನಿಮ್ಮ ವೆಬ್‌ಸೈಟ್ ಅನ್ನು ಹೇಗೆ ಗುರುತಿಸುತ್ತವೆ ಎಂದು ಆಳವಾಗಿ ತಿಳಿಯಿರಿ.'
            : 'Find out how Google ranks your page and whether ChatGPT, Perplexity, and Gemini cite your brand.'}
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
              background: 'rgba(255, 255, 255, 0.05)',
              border: '2px solid rgba(99, 102, 241, 0.4)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 8px 6px 18px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
            }}>
              <Search size={20} color="var(--text-muted)" style={{ flexShrink: 0, marginRight: '10px' }} />
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
                  color: '#ffffff',
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
                    {lang === 'kn' ? 'ಆಡಿಟ್ ಮಾಡಿ' : 'Analyze Now'}
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
              background: 'rgba(255, 255, 255, 0.03)',
              border: '2px solid rgba(245, 158, 11, 0.4)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  gap: '8px',
                }}>
                  <span style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 700 }}>URL 1:</span>
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
                      color: '#ffffff',
                      fontSize: '0.95rem',
                    }}
                  />
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  gap: '8px',
                }}>
                  <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 700 }}>URL 2:</span>
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
                      color: '#ffffff',
                      fontSize: '0.95rem',
                    }}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading || !urlInput.trim() || !competitorInput.trim()}
                className="btn btn-primary"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                  padding: '14px',
                  fontSize: '1rem',
                  boxShadow: '0 4px 20px rgba(245, 158, 11, 0.35)',
                }}
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
              color: 'var(--text-dim)',
              marginTop: '8px',
            }}>
              <span>{lang === 'kn' ? 'ಉಚಿತ ಟೆಸ್ಟ್ ಮಾಡಿ:' : 'Try instant demo:'}</span>
              {['somashekhar.in', 'google.com', 'github.com'].map((domain) => (
                <button
                  key={domain}
                  type="button"
                  onClick={() => handleChipClick(domain)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-full)',
                    padding: '3px 12px',
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
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
            marginTop: '28px',
            background: 'rgba(18, 25, 38, 0.8)',
            border: '1px solid var(--border-focus)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 24px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <span className="pulse-dot"></span>
            <span style={{ fontSize: '0.95rem', color: '#e0e7ff', fontWeight: 500 }}>
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
