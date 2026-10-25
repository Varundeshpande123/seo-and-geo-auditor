import React, { useState } from 'react';
import type { FullAuditResult } from '../types/audit';
import { AlertTriangle, CheckCircle2, XCircle, Printer, Check, Sparkles } from 'lucide-react';

interface ScoreOverviewProps {
  audit: FullAuditResult;
  lang: 'kn' | 'en';
}

export const ScoreOverview: React.FC<ScoreOverviewProps> = ({ audit, lang }) => {
  const criticalCount = audit.issues.filter((i) => i.severity === 'critical').length;
  const warningCount = audit.issues.filter((i) => i.severity === 'warning').length;

  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 85) return '#0f9d58'; // Google Green
    if (score >= 60) return '#b06000'; // Google Orange/Amber
    return '#d93025'; // Google Red
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyAiPrompt = () => {
    const issuesFormatted = audit.issues.map((issue, idx) => {
      let targetFile = 'index.html or relevant component';
      if (issue.id.includes('robot') || issue.id.includes('bot')) targetFile = 'public/robots.txt (or root robots.txt)';
      else if (issue.id.includes('llms')) targetFile = 'public/llms.txt (create new file)';
      else if (issue.id.includes('schema') || issue.id.includes('title') || issue.id.includes('meta') || issue.id.includes('h1') || issue.id.includes('canonical')) targetFile = 'index.html (in <head> or <body>)';
      else if (issue.id.includes('image') || issue.id.includes('alt') || issue.id.includes('dimension')) targetFile = 'Relevant JSX/HTML components with <img> tags';
      else if (issue.id.includes('privacy') || issue.id.includes('terms') || issue.id.includes('legal')) targetFile = 'Footer component (plus static fallback in index.html)';

      return `### ACTION ${idx + 1}: ${issue.title}
- **Category:** ${issue.category.toUpperCase()} | **Severity:** ${issue.severity.toUpperCase()}
- **Target File:** \`${targetFile}\`
- **Problem Statement:** ${issue.description}
- **Required Action:** ${issue.recommendation}
${issue.codeSnippet ? `- **Exact Code To Insert / Replace:**\n\`\`\`\n${issue.codeSnippet}\n\`\`\`\n` : ''}`;
    }).join('\n\n');

    const promptText = `# TECHNICAL SEO & GEO (AI SEARCH) CODEBASE FIX SPECIFICATION
**Target Website:** ${audit.url}
**Audit Date:** ${new Date(audit.timestamp).toLocaleDateString()}
**Current Overall Score:** ${audit.overallScore}/100 (Grade ${audit.grade})
- Google SEO Score: ${audit.seo.score}/100
- AI Search (GEO) Score: ${audit.geo.score}/100
- Core Web Vitals & Speed: ${audit.performance.score}/100
- Security & Trust: ${audit.insider.score}/100

---

## 🎯 OBJECTIVE FOR AI CODING AGENT:
You are an expert Senior Full-Stack Engineer and Technical SEO/GEO Specialist. Inspect my repository and modify the exact codebase files to resolve every issue below so my website scores 100/100 on Google and AI search engines (ChatGPT, Claude, Gemini, Perplexity).

## ⚠️ STRICT IMPLEMENTATION RULES:
1. **Preserve Functionality:** Keep all existing UI branding, styling, forms, and business logic intact.
2. **No Hallucinations:** Do not fabricate unverified reviews, fake certifications, fake addresses, or unverified claims.
3. **SPA / SSR Consideration:** If this is a client-rendered SPA (React/Vite/Next), ensure critical metadata, schema, and legal footer links are also present in the initial static \`index.html\` shell so non-JavaScript AI bots (GPTBot, ClaudeBot) can crawl them directly.
4. **Clean Code:** Avoid unnecessary external libraries; use standard semantic HTML, CSS, and clean JSON-LD.

---

## 📋 EXACT STEP-BY-STEP ACTIONS TO IMPLEMENT:

${issuesFormatted}

---

## 🏁 FINAL VERIFICATION STEP:
After applying the changes:
1. Run your build tool (\`npm run build\` or equivalent) to confirm zero syntax or TypeScript errors.
2. Verify that JSON-LD blocks are valid JSON without trailing commas.
3. Report a summary of all modified files.`;

    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 3000);
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '32px', marginBottom: '28px', background: '#ffffff' }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        borderBottom: '1px solid #dadce0',
        paddingBottom: '20px',
        marginBottom: '24px',
      }}>
        {/* Domain & URL */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#202124' }}>{audit.domain}</h2>
            <span className="badge badge-primary" style={{ fontSize: '0.8rem' }}>
              Grade {audit.grade}
            </span>
          </div>
          <p style={{ color: '#5f6368', fontSize: '0.9rem', wordBreak: 'break-all' }}>
            {audit.url} • {new Date(audit.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Action Buttons: 1-Click Copy AI Prompt & Print */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleCopyAiPrompt}
            className="btn btn-primary"
            style={{
              padding: '8px 18px',
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#1a73e8',
              color: '#ffffff',
              border: 'none',
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            }}
          >
            {copiedPrompt ? <Check size={16} /> : <Sparkles size={16} />}
            {copiedPrompt
              ? (lang === 'kn' ? 'ಪ್ರಾಂಪ್ಟ್ ಕಾಪಿ ಆಗಿದೆ!' : 'Prompt Copied!')
              : (lang === 'kn' ? 'AI ಪ್ರಾಂಪ್ಟ್ ಕಾಪಿ (1-Click)' : 'Copy AI Fix Prompt')}
          </button>

          <button
            onClick={handlePrint}
            className="btn btn-secondary"
            style={{ padding: '8px 18px', fontSize: '0.88rem' }}
          >
            <Printer size={16} />
            {lang === 'kn' ? 'ವರದಿ ಪ್ರಿಂಟ್ / PDF' : 'Print / Save PDF'}
          </button>
        </div>
      </div>

      {/* Grid of Scores */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '16px',
        alignItems: 'center',
      }}>
        {/* Overall Master Score */}
        <div style={{
          textAlign: 'center',
          padding: '24px 16px',
          background: '#f8f9fa',
          borderRadius: 'var(--radius-md)',
          border: '1px solid #dadce0',
        }}>
          <div style={{ fontSize: '0.85rem', color: '#5f6368', marginBottom: '8px', fontWeight: 600 }}>
            {lang === 'kn' ? 'ಒಟ್ಟಾರೆ ಹೆಲ್ತ್ ಸ್ಕೋರ್' : 'Overall Performance'}
          </div>
          <div style={{
            fontSize: '3.6rem',
            fontWeight: 700,
            lineHeight: 1,
            color: getScoreColor(audit.overallScore),
            marginBottom: '6px',
          }}>
            {audit.overallScore}
            <span style={{ fontSize: '1.4rem', color: '#70757a' }}>/100</span>
          </div>
          <div style={{ fontSize: '0.82rem', color: '#5f6368' }}>
            {audit.overallScore >= 80
              ? (lang === 'kn' ? 'ಉತ್ತಮ ಸ್ಥಿತಿಯಲ್ಲಿದೆ' : 'Optimal Condition')
              : (lang === 'kn' ? 'ಸುಧಾರಣೆ ಅಗತ್ಯವಿದೆ' : 'Needs Optimization')}
          </div>
        </div>

        {/* SEO Score */}
        <div style={{
          textAlign: 'center',
          padding: '24px 16px',
          background: '#f8f9fa',
          borderRadius: 'var(--radius-md)',
          border: '1px solid #dadce0',
        }}>
          <div style={{ fontSize: '0.85rem', color: '#1a73e8', marginBottom: '8px', fontWeight: 600 }}>
            Google SEO
          </div>
          <div style={{
            fontSize: '2.8rem',
            fontWeight: 700,
            lineHeight: 1,
            color: getScoreColor(audit.seo.score),
            marginBottom: '6px',
          }}>
            {audit.seo.score}
            <span style={{ fontSize: '1.2rem', color: '#70757a' }}>%</span>
          </div>
          <span className={`badge ${audit.seo.score >= 80 ? 'badge-good' : 'badge-warning'}`}>
            {audit.seo.score >= 80 ? 'On-Page Strong' : 'Review Elements'}
          </span>
        </div>

        {/* GEO (AI Search) Score */}
        <div style={{
          textAlign: 'center',
          padding: '24px 16px',
          background: '#f8f9fa',
          borderRadius: 'var(--radius-md)',
          border: '1px solid #dadce0',
        }}>
          <div style={{ fontSize: '0.85rem', color: '#1a73e8', marginBottom: '8px', fontWeight: 600 }}>
            GEO (AI Citation)
          </div>
          <div style={{
            fontSize: '2.8rem',
            fontWeight: 700,
            lineHeight: 1,
            color: getScoreColor(audit.geo.score),
            marginBottom: '6px',
          }}>
            {audit.geo.score}
            <span style={{ fontSize: '1.2rem', color: '#70757a' }}>%</span>
          </div>
          <span className={`badge ${audit.geo.score >= 80 ? 'badge-good' : 'badge-warning'}`}>
            {audit.geo.score >= 80 ? 'AI Bot Ready' : 'AI Blind Spot'}
          </span>
        </div>

        {/* Speed & Performance Score */}
        <div style={{
          textAlign: 'center',
          padding: '24px 16px',
          background: '#f8f9fa',
          borderRadius: 'var(--radius-md)',
          border: '1px solid #dadce0',
        }}>
          <div style={{ fontSize: '0.85rem', color: '#137333', marginBottom: '8px', fontWeight: 600 }}>
            Core Web Vitals
          </div>
          <div style={{
            fontSize: '2.8rem',
            fontWeight: 700,
            lineHeight: 1,
            color: getScoreColor(audit.performance.score),
            marginBottom: '6px',
          }}>
            {audit.performance.score}
            <span style={{ fontSize: '1.2rem', color: '#70757a' }}>%</span>
          </div>
          <div style={{ fontSize: '0.82rem', color: '#5f6368' }}>
            TTFB: {audit.performance.serverResponseTimeMs}ms
          </div>
        </div>

        {/* Insider Secrets Score */}
        {audit.insider && (
          <div style={{
            textAlign: 'center',
            padding: '24px 16px',
            background: '#f8f9fa',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #dadce0',
          }}>
            <div style={{ fontSize: '0.85rem', color: '#681da8', marginBottom: '8px', fontWeight: 600 }}>
              Insider Pro Secrets
            </div>
            <div style={{
              fontSize: '2.8rem',
              fontWeight: 700,
              lineHeight: 1,
              color: getScoreColor(audit.insider.score),
              marginBottom: '6px',
            }}>
              {audit.insider.score}
              <span style={{ fontSize: '1.2rem', color: '#70757a' }}>%</span>
            </div>
            <span className={`badge ${audit.insider.score >= 80 ? 'badge-good' : 'badge-warning'}`}>
              {audit.insider.informationGain.wordCount} words
            </span>
          </div>
        )}
      </div>

      {/* Issues Breakdown Strip */}
      <div style={{
        marginTop: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        flexWrap: 'wrap',
        background: '#f1f3f4',
        padding: '12px 18px',
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.88rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c5221f' }}>
          <XCircle size={18} />
          <strong>{criticalCount}</strong> {lang === 'kn' ? 'ತುರ್ತು ಸಮಸ್ಯೆಗಳು' : 'Critical Issues'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b06000' }}>
          <AlertTriangle size={18} />
          <strong>{warningCount}</strong> {lang === 'kn' ? 'ಸುಧಾರಣೆ ಎಚ್ಚರಿಕೆಗಳು' : 'Warnings'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#137333' }}>
          <CheckCircle2 size={18} />
          <strong>{audit.seo.title.status === 'good' ? 1 : 0}</strong> {lang === 'kn' ? 'ಉತ್ತಮ ಅಂಶಗಳು' : 'Passing Audits'}
        </div>
      </div>
    </div>
  );
};
