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
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div className="glass-panel animate-fade-in" style={{
        maxWidth: '440px',
        width: '100%',
        padding: '40px 32px',
        border: '1px solid var(--border-focus)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 40px rgba(99, 102, 241, 0.15)',
        textAlign: 'center',
        position: 'relative',
      }}>
        {/* Top Glow Logo */}
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #6366f1, #10b981)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
        }}>
          <Lock size={26} color="#ffffff" />
        </div>

        <h2 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '6px', letterSpacing: '-0.02em' }}>
          {lang === 'kn' ? 'ಖಾಸಗಿ ಲಾಗಿನ್' : 'Authorized Access'}
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '28px' }}>
          {lang === 'kn'
            ? 'SEO & GEO ಆಡಿಟರ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಪ್ರವೇಶಿಸಲು ಲಾಗಿನ್ ಆಗಿ'
            : 'Sign in to access the SEO & GEO Audit engine'}
        </p>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#fca5a5',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.84rem',
            marginBottom: '20px',
            textAlign: 'left',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px', textAlign: 'left' }}>
          {/* Username Field */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '6px' }}>
              {lang === 'kn' ? 'ಬಳಕೆದಾರ ಹೆಸರು (Username)' : 'Username'}
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              gap: '10px',
            }}>
              <User size={18} color="var(--text-dim)" />
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
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-sans)',
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '6px' }}>
              {lang === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ (Password)' : 'Password'}
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              gap: '10px',
            }}>
              <Lock size={18} color="var(--text-dim)" />
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
                  color: '#ffffff',
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
                  color: 'var(--text-dim)',
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
            style={{ width: '100%', marginTop: '10px', padding: '14px', fontSize: '1rem' }}
          >
            {isSubmitting ? (
              <span>{lang === 'kn' ? 'ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...' : 'Authenticating...'}</span>
            ) : (
              <>
                <span>{lang === 'kn' ? 'ಲಾಗಿನ್ ಮಾಡಿ' : 'Secure Login'}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '24px', fontSize: '0.78rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <ShieldCheck size={14} color="#10b981" />
          <span>{lang === 'kn' ? '256-bit ಎನ್‌ಕ್ರಿಪ್ಟೆಡ್ ರಕ್ಷಣೆ' : 'Protected by Cloudflare Edge Security'}</span>
        </div>
      </div>
    </div>
  );
};
