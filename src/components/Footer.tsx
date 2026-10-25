import React from 'react';

interface FooterProps {
  lang: 'kn' | 'en';
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  return (
    <footer style={{
      borderTop: '1px solid #dadce0',
      background: '#ffffff',
      padding: '32px 0',
      textAlign: 'center',
      fontSize: '0.85rem',
      color: '#5f6368',
      marginTop: 'auto',
    }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          <span>Powered by</span>
          <strong style={{ color: '#202124' }}>Cloudflare Pages & Workers</strong>
          <span>•</span>
          <a
            href="https://somashekhar.in"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#1a73e8', textDecoration: 'none', fontWeight: 600 }}
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
