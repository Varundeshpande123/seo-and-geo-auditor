import React from 'react';
import type { SeoMetrics } from '../types/audit';
import { Search, FileCode2, Image, Link2 } from 'lucide-react';

interface SeoAuditCardProps {
  seo: SeoMetrics;
  lang: 'kn' | 'en';
  onOpenFix: (issueId: string) => void;
}

export const SeoAuditCard: React.FC<SeoAuditCardProps> = ({ seo, lang, onOpenFix }) => {
  const getBadgeClass = (status: 'good' | 'warning' | 'critical') => {
    if (status === 'good') return 'badge-good';
    if (status === 'warning') return 'badge-warning';
    return 'badge-critical';
  };

  return (
    <div className="glass-panel" style={{ padding: '28px', marginBottom: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Search size={20} color="#818cf8" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              {lang === 'kn' ? 'Google ಆನ್-ಪೇಜ್ ಮತ್ತು ತಾಂತ್ರಿಕ SEO' : 'On-Page & Technical SEO'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
              Meta Tags, Content Hierarchy, OpenGraph & Search Indexability
            </p>
          </div>
        </div>
        <span className={`badge ${seo.score >= 80 ? 'badge-good' : 'badge-warning'}`} style={{ fontSize: '0.85rem' }}>
          {seo.score}% Passed
        </span>
      </div>

      {/* Grid of SEO Checks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Title */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontWeight: 600, fontSize: '0.92rem', color: '#f1f5f9' }}>
              Page Title ({seo.title.length} characters)
            </span>
            <span className={`badge ${getBadgeClass(seo.title.status)}`}>
              {seo.title.status}
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            {seo.title.feedback}
          </p>
          {seo.title.content ? (
            <div className="code-preview" style={{ padding: '8px 12px', fontSize: '0.82rem' }}>
              &lt;title&gt;{seo.title.content}&lt;/title&gt;
            </div>
          ) : (
            <button
              onClick={() => onOpenFix('missing-title')}
              className="btn btn-secondary"
              style={{ padding: '6px 14px', fontSize: '0.82rem' }}
            >
              <FileCode2 size={14} /> {lang === 'kn' ? 'Title ಕೋಡ್ ಸೇರಿಸಿ' : 'Add Title Tag'}
            </button>
          )}
        </div>

        {/* Meta Description */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontWeight: 600, fontSize: '0.92rem', color: '#f1f5f9' }}>
              Meta Description ({seo.description.length} characters)
            </span>
            <span className={`badge ${getBadgeClass(seo.description.status)}`}>
              {seo.description.status}
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            {seo.description.feedback}
          </p>
          {seo.description.content ? (
            <div className="code-preview" style={{ padding: '8px 12px', fontSize: '0.82rem' }}>
              {seo.description.content}
            </div>
          ) : (
            <button
              onClick={() => onOpenFix('missing-meta-description')}
              className="btn btn-secondary"
              style={{ padding: '6px 14px', fontSize: '0.82rem' }}
            >
              <FileCode2 size={14} /> {lang === 'kn' ? 'Description ಕೋಡ್ ಸೇರಿಸಿ' : 'Generate Description'}
            </button>
          )}
        </div>

        {/* Headings Hierarchy */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontWeight: 600, fontSize: '0.92rem', color: '#f1f5f9' }}>
              Heading Hierarchy ({seo.headings.h1Count} H1, {seo.headings.h2Count} H2, {seo.headings.h3Count} H3)
            </span>
            <span className={`badge ${getBadgeClass(seo.headings.status)}`}>
              {seo.headings.status}
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            {seo.headings.feedback}
          </p>
          {seo.headings.h1Tags.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {seo.headings.h1Tags.map((h1, i) => (
                <div key={i} className="code-preview" style={{ padding: '6px 10px', fontSize: '0.8rem' }}>
                  &lt;h1&gt;{h1}&lt;/h1&gt;
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2-Column: Canonical & Images */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
        }}>
          {/* Canonical */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Link2 size={16} color="#818cf8" /> Canonical Link
              </span>
              <span className={`badge ${getBadgeClass(seo.canonical.status)}`}>
                {seo.canonical.status}
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {seo.canonical.feedback}
            </p>
          </div>

          {/* Image Alt */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Image size={16} color="#34d399" /> Image Alt Tags
              </span>
              <span className={`badge ${seo.images.missingAlt === 0 ? 'badge-good' : 'badge-warning'}`}>
                {seo.images.missingAlt === 0 ? 'All Good' : `${seo.images.missingAlt} Missing`}
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Scanned {seo.images.total} images. {seo.images.missingAlt} images lack alt attributes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
