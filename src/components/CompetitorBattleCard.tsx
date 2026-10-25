import React from 'react';
import type { FullAuditResult } from '../types/audit';
import { Trophy, Swords, ArrowUpRight } from 'lucide-react';

interface CompetitorBattleCardProps {
  audit1: FullAuditResult;
  audit2: FullAuditResult;
  lang: 'kn' | 'en';
}

export const CompetitorBattleCard: React.FC<CompetitorBattleCardProps> = ({ audit1, audit2, lang }) => {
  const winner = audit1.overallScore >= audit2.overallScore ? audit1 : audit2;
  const scoreDiff = Math.abs(audit1.overallScore - audit2.overallScore);

  const metrics = [
    {
      title: 'Overall Health Score',
      val1: `${audit1.overallScore}/100`,
      val2: `${audit2.overallScore}/100`,
      win1: audit1.overallScore >= audit2.overallScore,
    },
    {
      title: 'Google SEO Score',
      val1: `${audit1.seo.score}%`,
      val2: `${audit2.seo.score}%`,
      win1: audit1.seo.score >= audit2.seo.score,
    },
    {
      title: 'GEO (AI Citation Readiness)',
      val1: `${audit1.geo.score}%`,
      val2: `${audit2.geo.score}%`,
      win1: audit1.geo.score >= audit2.geo.score,
    },
    {
      title: 'AI Share of Voice (SOV)',
      val1: `${audit1.geo.shareOfVoice?.percentage || audit1.geo.score}%`,
      val2: `${audit2.geo.shareOfVoice?.percentage || audit2.geo.score}%`,
      win1: (audit1.geo.shareOfVoice?.percentage || audit1.geo.score) >= (audit2.geo.shareOfVoice?.percentage || audit2.geo.score),
    },
    {
      title: 'PageSpeed & Performance',
      val1: `${audit1.performance.score}%`,
      val2: `${audit2.performance.score}%`,
      win1: audit1.performance.score >= audit2.performance.score,
    },
    {
      title: 'Word Count (Information Gain)',
      val1: `${audit1.insider?.informationGain.wordCount || 0} words`,
      val2: `${audit2.insider?.informationGain.wordCount || 0} words`,
      win1: (audit1.insider?.informationGain.wordCount || 0) >= (audit2.insider?.informationGain.wordCount || 0),
    },
    {
      title: 'AI Crawlers in Robots.txt',
      val1: `${audit1.geo.aiBotAccess.bots.filter((b) => b.allowed).length}/6 Allowed`,
      val2: `${audit2.geo.aiBotAccess.bots.filter((b) => b.allowed).length}/6 Allowed`,
      win1: audit1.geo.aiBotAccess.bots.filter((b) => b.allowed).length >= audit2.geo.aiBotAccess.bots.filter((b) => b.allowed).length,
    },
    {
      title: 'Knowledge Graph Schemas',
      val1: `${audit1.geo.structuredData.schemasFound.length} Types`,
      val2: `${audit2.geo.structuredData.schemasFound.length} Types`,
      win1: audit1.geo.structuredData.schemasFound.length >= audit2.geo.structuredData.schemasFound.length,
    },
  ];

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '32px', marginBottom: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
          }}>
            <Swords size={22} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>
              {lang === 'kn' ? 'ಪ್ರತಿಸ್ಪರ್ಧಿ ಮುಖಾಮುಖಿ (Competitor Battle)' : 'Head-to-Head Competitor Battle'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
              {audit1.domain} vs {audit2.domain}
            </p>
          </div>
        </div>

        {/* Winner Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          padding: '8px 18px',
          borderRadius: 'var(--radius-full)',
        }}>
          <Trophy size={20} color="#10b981" />
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              {lang === 'kn' ? 'ಗೆದ್ದ ಸೈಟ್:' : 'Winner:'}
            </span>
            <div style={{ fontWeight: 800, color: '#34d399', fontSize: '0.95rem' }}>
              {winner.domain} (+{scoreDiff} pts)
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Grid Table */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1.5fr 1.5fr',
          padding: '14px 20px',
          background: 'rgba(0, 0, 0, 0.35)',
          borderBottom: '1px solid var(--border-subtle)',
          fontSize: '0.85rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
        }}>
          <div>{lang === 'kn' ? 'ಪರೀಕ್ಷಾ ಅಂಶ (Metric)' : 'Audit Factor'}</div>
          <div style={{ color: '#818cf8', textAlign: 'center' }}>{audit1.domain}</div>
          <div style={{ color: '#38bdf8', textAlign: 'center' }}>{audit2.domain}</div>
        </div>

        {/* Rows */}
        {metrics.map((m, idx) => (
          <div
            key={idx}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1.5fr 1.5fr',
              padding: '12px 20px',
              borderBottom: idx < metrics.length - 1 ? '1px solid var(--border-subtle)' : 'none',
              fontSize: '0.88rem',
              alignItems: 'center',
            }}
          >
            <div style={{ fontWeight: 600, color: '#f1f5f9' }}>{m.title}</div>
            <div style={{
              textAlign: 'center',
              fontWeight: 700,
              color: m.win1 ? '#34d399' : '#e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}>
              <span>{m.val1}</span>
              {m.win1 && <ArrowUpRight size={14} color="#34d399" />}
            </div>
            <div style={{
              textAlign: 'center',
              fontWeight: 700,
              color: !m.win1 ? '#34d399' : '#e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}>
              <span>{m.val2}</span>
              {!m.win1 && <ArrowUpRight size={14} color="#34d399" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
