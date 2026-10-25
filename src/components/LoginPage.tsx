import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
  lang: 'kn' | 'en';
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, lang }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      // Validate credentials
      if (username.trim() === 'somu1008' && password === 'somu1008@@') {
        localStorage.setItem('seo_geo_auth_token', 'authenticated_somu1008');
        onLoginSuccess();
      } else {
        setError(
          lang === 'kn'
            ? 'ತಪ್ಪಾದ ಬಳಕೆದಾರ ಹೆಸರು ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್! ದಯವಿಟ್ಟು ಸರಿಯಾದ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ.'
            : 'Invalid username or password. Access is restricted to authorized personnel.'
        );
      }
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div className="glass-panel animate-fade-in" style={{
        maxWidth: '440px',
        width: '100%',
        padding: '40px 32px',
        background: '#ffffff',
        border: '1px solid #dadce0',
        boxShadow: '0 2px 6px 0 rgba(60, 64, 67, 0.15), 0 8px 16px 2px rgba(60, 64, 67, 0.08)',
        textAlign: 'center',
        position: 'relative',
      }}>
        {/* Top Logo */}
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #1a73e8, #137333)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          boxShadow: '0 4px 12px rgba(26, 115, 232, 0.25)',
        }}>
          <Lock size={24} color="#ffffff" />
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#202124', marginBottom: '6px' }}>
          {lang === 'kn' ? 'ಖಾಸಗಿ ಲಾಗಿನ್' : 'Authorized Sign In'}
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#5f6368', marginBottom: '24px' }}>
          {lang === 'kn'
            ? 'SEO & GEO ಆಡಿಟರ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಪ್ರವೇಶಿಸಲು ಲಾಗಿನ್ ಆಗಿ'
            : 'Sign in to access the SEO & GEO Audit engine'}
        </p>

        {error && (
          <div style={{
            background: '#fce8e6',
            border: '1px solid #fad2cf',
            color: '#c5221f',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.84rem',
            marginBottom: '20px',
            textAlign: 'left',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
          {/* Username Field */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#3c4043', marginBottom: '6px' }}>
              {lang === 'kn' ? 'ಬಳಕೆದಾರ ಹೆಸರು (Username)' : 'Username'}
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#ffffff',
              border: '1px solid #dadce0',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              gap: '10px',
            }}>
              <User size={18} color="#5f6368" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="somu1008"
                required
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#202124',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-sans)',
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#3c4043', marginBottom: '6px' }}>
              {lang === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ (Password)' : 'Password'}
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#ffffff',
              border: '1px solid #dadce0',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              gap: '10px',
            }}>
              <Lock size={18} color="#5f6368" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                required
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#202124',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-sans)',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#5f6368',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px', padding: '12px', fontSize: '0.95rem' }}
          >
            {isSubmitting ? (
              <span>{lang === 'kn' ? 'ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...' : 'Authenticating...'}</span>
            ) : (
              <>
                <span>{lang === 'kn' ? 'ಲಾಗಿನ್ ಮಾಡಿ' : 'Sign in'}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '20px', fontSize: '0.78rem', color: '#5f6368', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <ShieldCheck size={14} color="#137333" />
          <span>{lang === 'kn' ? '256-bit ಎನ್‌ಕ್ರಿಪ್ಟೆಡ್ ರಕ್ಷಣೆ' : 'Protected by Cloudflare Edge Security'}</span>
        </div>
      </div>
    </div>
  );
};
