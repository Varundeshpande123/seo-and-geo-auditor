import React from 'react';

interface FooterProps {
  lang: 'kn' | 'en';
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      background: 'rgba(10, 13, 20, 0.8)',
      padding: '40px 0',
      textAlign: 'center',
      fontSize: '0.85rem',
      color: 'var(--text-dim)',
    }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
          <span>Powered by</span>
          <strong style={{ color: '#ffffff' }}>Cloudflare Pages & Workers</strong>
          <span>•</span>
          <a
            href="https://somashekhar.in"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}
          >
            somashekhar.in
          </a>
        </div>
        <p>
          {lang === 'kn'
            ? 'ವಿಶ್ವಾದ್ಯಂತ AI ಮತ್ತು ಸರ್ಚ್ ಇಂಜಿನ್‌ಗಳಿಗೆ ನಿಮ್ಮ ವೆಬ್‌ಸೈಟ್ ಸಿದ್ಧಪಡಿಸುವ ಸ್ವದೇಶಿ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್.'
            : 'Next-Generation Generative Engine Optimization (GEO) & Search Engine Audit Platform.'}
        </p>
      </div>
    </footer>
  );
};
