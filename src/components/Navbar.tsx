import React from 'react';
import { Globe, Sparkles, LogOut, UserCheck } from 'lucide-react';

interface NavbarProps {
  lang: 'kn' | 'en';
  setLang: (lang: 'kn' | 'en') => void;
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  setLang,
  isAuthenticated = false,
  onLogout,
}) => {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(10, 13, 20, 0.75)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '16px 0',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1, #10b981)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)',
          }}>
            <Sparkles size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
                SEO & GEO <span style={{ color: '#38bdf8' }}>Auditor</span>
              </span>
              <span className="badge badge-primary" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                Edge 2.0
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={12} />
              <span>seo.somashekhar.in</span>
            </div>
          </div>
        </div>

        {/* Right Info, User & Lang */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isAuthenticated && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              padding: '5px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              color: '#34d399',
            }}>
              <UserCheck size={14} />
              <span>somu1008</span>
            </div>
          )}

          {/* Language Switcher */}
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.06)',
            borderRadius: 'var(--radius-md)',
            padding: '3px',
            border: '1px solid var(--border-subtle)',
          }}>
            <button
              onClick={() => setLang('kn')}
              style={{
                border: 'none',
                background: lang === 'kn' ? 'var(--primary)' : 'transparent',
                color: lang === 'kn' ? '#ffffff' : 'var(--text-muted)',
                padding: '4px 12px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              ಕನ್ನಡ
            </button>
            <button
              onClick={() => setLang('en')}
              style={{
                border: 'none',
                background: lang === 'en' ? 'var(--primary)' : 'transparent',
                color: lang === 'en' ? '#ffffff' : 'var(--text-muted)',
                padding: '4px 12px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              English
            </button>
          </div>

          {/* Logout Button */}
          {isAuthenticated && onLogout && (
            <button
              onClick={onLogout}
              className="btn btn-secondary"
              title={lang === 'kn' ? 'ಲಾಗ್‌ಔಟ್' : 'Logout'}
              style={{ padding: '6px 12px', fontSize: '0.82rem', gap: '6px' }}
            >
              <LogOut size={14} />
              <span>{lang === 'kn' ? 'ಲಾಗ್‌ಔಟ್' : 'Logout'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
