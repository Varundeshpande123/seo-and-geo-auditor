import React from 'react';
import { Globe, Sparkles, LogOut, UserCheck } from 'lucide-react';

interface NavbarProps {
  lang?: 'kn' | 'en';
  setLang?: (lang: 'kn' | 'en') => void;
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isAuthenticated = false,
  onLogout,
}) => {
  return (
    <header style={{
      borderBottom: '1px solid #dadce0',
      background: '#ffffff',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '14px 0',
      boxShadow: '0 1px 2px 0 rgba(60, 64, 67, 0.1)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #1a73e8, #137333)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(26, 115, 232, 0.3)',
          }}>
            <Sparkles size={20} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#202124' }}>
                SEO & GEO <span style={{ color: '#1a73e8' }}>Auditor</span>
              </span>
              <span className="badge badge-primary" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                Edge 2.0
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#5f6368', display: 'flex', alignItems: 'center', gap: '6px' }}>
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
              background: '#e6f4ea',
              border: '1px solid #ceead6',
              padding: '5px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              color: '#137333',
              fontWeight: 500,
            }}>
              <UserCheck size={14} />
              <span>somu1008</span>
            </div>
          )}


          {/* Logout Button */}
          {isAuthenticated && onLogout && (
            <button
              onClick={onLogout}
              className="btn btn-secondary"
              title="Logout"
              style={{ padding: '6px 12px', fontSize: '0.82rem', gap: '6px' }}
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
