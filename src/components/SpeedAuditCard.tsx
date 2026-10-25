import React from 'react';
import type { PerformanceMetrics } from '../types/audit';
import { Zap, Clock, Smartphone, Monitor } from 'lucide-react';

interface SpeedAuditCardProps {
  performance: PerformanceMetrics;
  lang: 'kn' | 'en';
}

export const SpeedAuditCard: React.FC<SpeedAuditCardProps> = ({ performance, lang }) => {
  return (
    <div className="glass-panel" style={{ padding: '28px', marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Zap size={20} color="#34d399" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              {lang === 'kn' ? 'ವೇಗ ಮತ್ತು Core Web Vitals' : 'Speed & Core Web Vitals'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
              Lighthouse Performance, TTFB & Security Check
            </p>
          </div>
        </div>
        <span className={`badge ${performance.score >= 85 ? 'badge-good' : 'badge-warning'}`} style={{ fontSize: '0.85rem' }}>
          {performance.score}% Score
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
      }}>
        {/* Mobile Score */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          textAlign: 'center',
        }}>
          <Smartphone size={20} color="#818cf8" style={{ margin: '0 auto 8px' }} />
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mobile Performance</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f1f5f9' }}>
            {performance.mobileScore}
          </div>
        </div>

        {/* Desktop Score */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          textAlign: 'center',
        }}>
          <Monitor size={20} color="#38bdf8" style={{ margin: '0 auto 8px' }} />
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Desktop Performance</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f1f5f9' }}>
            {performance.desktopScore}
          </div>
        </div>

        {/* FCP */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          textAlign: 'center',
        }}>
          <Clock size={20} color="#34d399" style={{ margin: '0 auto 8px' }} />
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>First Contentful Paint</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399' }}>
            {performance.fcp}
          </div>
        </div>

        {/* LCP */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          textAlign: 'center',
        }}>
          <Zap size={20} color="#fbbf24" style={{ margin: '0 auto 8px' }} />
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Largest Contentful Paint</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24' }}>
            {performance.lcp}
          </div>
        </div>
      </div>
    </div>
  );
};
