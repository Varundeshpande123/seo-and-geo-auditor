import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LoginPage } from './components/LoginPage';
import { HeroSearch } from './components/HeroSearch';
import { ScoreOverview } from './components/ScoreOverview';
import { CompetitorBattleCard } from './components/CompetitorBattleCard';
import { GeoAuditCard } from './components/GeoAuditCard';
import { AiDiscoveryCard } from './components/AiDiscoveryCard';
import { SeoAuditCard } from './components/SeoAuditCard';
import { SpeedAuditCard } from './components/SpeedAuditCard';
import { InsiderAuditCard } from './components/InsiderAuditCard';
import { IssuesList } from './components/IssuesList';
import { QuickFixGenerator } from './components/QuickFixGenerator';
import { CodeModal } from './components/CodeModal';
import { Footer } from './components/Footer';
import { runWebsiteAudit } from './services/apiClient';
import type { FullAuditResult, AuditIssue } from './types/audit';

export function App() {
  const [lang, setLang] = useState<'kn' | 'en'>('kn');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<FullAuditResult | null>(null);
  const [competitorResult, setCompetitorResult] = useState<FullAuditResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [selectedIssue, setSelectedIssue] = useState<AuditIssue | null>(null);

  // Check auth session on mount
  useEffect(() => {
    const token = localStorage.getItem('seo_geo_auth_token');
    if (token === 'authenticated_somu1008') {
      setIsAuthenticated(true);
      handleAnalyze('somashekhar.in');
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    if (!auditResult) {
      handleAnalyze('somashekhar.in');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('seo_geo_auth_token');
    setIsAuthenticated(false);
  };

  const handleAnalyze = async (url: string, competitorUrl?: string) => {
    setIsLoading(true);

    const steps = lang === 'kn' ? [
      'ಹೋಸ್ಟ್ ಜೊತೆ ಸಂಪರ್ಕ ಸಾಧಿಸಲಾಗುತ್ತಿದೆ (DNS & SSL)...',
      'AI ಕ್ರಾಲರ್‌ಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ (GPTBot, PerplexityBot, Claude)...',
      'Schema.org Knowledge Graph ಮತ್ತು ಪದಗಳ ಎಣಿಕೆ...',
      'Core Web Vitals ಮತ್ತು ಪ್ರತಿಸ್ಪರ್ಧಿ ಹೋಲಿಕೆ ಲೆಕ್ಕಾಚಾರ...'
    ] : [
      'Establishing secure connection (DNS & SSL)...',
      'Auditing AI Crawlers (GPTBot, PerplexityBot, Claude)...',
      'Parsing Schema.org Knowledge Graph & Keywords...',
      'Evaluating Core Web Vitals and Performance...'
    ];

    let currentStep = 0;
    setScanStep(steps[currentStep]);
    const stepInterval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setScanStep(steps[currentStep]);
      }
    }, 450);

    try {
      if (competitorUrl) {
        const [res1, res2] = await Promise.all([
          runWebsiteAudit(url),
          runWebsiteAudit(competitorUrl),
        ]);
        clearInterval(stepInterval);
        setAuditResult(res1);
        setCompetitorResult(res2);
      } else {
        const result = await runWebsiteAudit(url);
        clearInterval(stepInterval);
        setAuditResult(result);
        setCompetitorResult(null);
      }
    } catch (err) {
      console.error(err);
      clearInterval(stepInterval);
    } finally {
      setIsLoading(false);
      setScanStep('');
    }
  };

  const handleOpenFixById = (issueId: string) => {
    if (!auditResult) return;
    const found = auditResult.issues.find((i) => i.id === issueId);
    if (found) {
      setSelectedIssue(found);
    }
  };

  const [activeTab, setActiveTab] = useState<'overview' | 'seo' | 'geo' | 'insider' | 'fixes' | 'battle'>('overview');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        lang={lang}
        setLang={setLang}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />

      <main style={{ flex: 1 }}>
        {!isAuthenticated ? (
          <LoginPage onLoginSuccess={handleLoginSuccess} lang={lang} />
        ) : (
          <>
            <HeroSearch
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              scanStep={scanStep}
              lang={lang}
            />

            {auditResult && (
              <div className="container" style={{ paddingBottom: '60px' }}>
                {/* Google PageSpeed Insights Style Tabs Navigation */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#ffffff',
                  border: '1px solid #dadce0',
                  borderRadius: 'var(--radius-md)',
                  padding: '6px',
                  marginBottom: '24px',
                  boxShadow: '0 1px 3px rgba(60,64,67,0.1)',
                  gap: '6px',
                  overflowX: 'auto',
                }}>
                  {/* Overview Tab */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('overview')}
                    style={{
                      border: 'none',
                      background: activeTab === 'overview' ? '#e8f0fe' : 'transparent',
                      color: activeTab === 'overview' ? '#1a73e8' : '#3c4043',
                      padding: '10px 18px',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span>📊 {lang === 'kn' ? 'ಎಲ್ಲವೂ (Overview)' : 'Overview'}</span>
                    <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                      {auditResult.overallScore}%
                    </span>
                  </button>

                  {/* SEO Tab */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('seo')}
                    style={{
                      border: 'none',
                      background: activeTab === 'seo' ? '#e8f0fe' : 'transparent',
                      color: activeTab === 'seo' ? '#1a73e8' : '#3c4043',
                      padding: '10px 18px',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span>🔍 Google SEO</span>
                    <span className={`badge ${auditResult.seo.score >= 80 ? 'badge-good' : 'badge-warning'}`} style={{ fontSize: '0.72rem' }}>
                      {auditResult.seo.score}%
                    </span>
                  </button>

                  {/* GEO (AI Search) Tab */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('geo')}
                    style={{
                      border: 'none',
                      background: activeTab === 'geo' ? '#e8f0fe' : 'transparent',
                      color: activeTab === 'geo' ? '#1a73e8' : '#3c4043',
                      padding: '10px 18px',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span>🤖 GEO & AI Search</span>
                    <span className={`badge ${auditResult.geo.score >= 80 ? 'badge-good' : 'badge-warning'}`} style={{ fontSize: '0.72rem' }}>
                      {auditResult.geo.score}%
                    </span>
                  </button>

                  {/* Insider Secrets Tab */}
                  {auditResult.insider && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('insider')}
                      style={{
                        border: 'none',
                        background: activeTab === 'insider' ? '#e8f0fe' : 'transparent',
                        color: activeTab === 'insider' ? '#1a73e8' : '#3c4043',
                        padding: '10px 18px',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s',
                      }}
                    >
                      <span>🕵️‍♂️ {lang === 'kn' ? 'ಸೀಕ್ರೆಟ್ ಮೆಟ್ರಿಕ್ಸ್' : 'Insider Secrets'}</span>
                      <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                        {auditResult.insider.score}%
                      </span>
                    </button>
                  )}

                  {/* 1-Click AI Fixes Generator Tab */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('fixes')}
                    style={{
                      border: 'none',
                      background: activeTab === 'fixes' ? '#e8f0fe' : 'transparent',
                      color: activeTab === 'fixes' ? '#1a73e8' : '#3c4043',
                      padding: '10px 18px',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span>⚡ {lang === 'kn' ? '1-ಕ್ಲಿಕ್ AI ಕೋಡ್' : '1-Click AI Fixes'}</span>
                    <span className="badge badge-good" style={{ fontSize: '0.72rem' }}>
                      Ready
                    </span>
                  </button>

                  {/* Competitor Battle Tab (if scanned or enabled) */}
                  {competitorResult && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('battle')}
                      style={{
                        border: 'none',
                        background: activeTab === 'battle' ? '#e8f0fe' : 'transparent',
                        color: activeTab === 'battle' ? '#1a73e8' : '#3c4043',
                        padding: '10px 18px',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s',
                      }}
                    >
                      <span>⚔️ {lang === 'kn' ? 'ಮುಖಾಮುಖಿ ಹೋಲಿಕೆ' : 'Competitor Battle'}</span>
                    </button>
                  )}
                </div>

                {/* TAB 1: OVERVIEW */}
                {activeTab === 'overview' && (
                  <div className="animate-fade-in">
                    {competitorResult && (
                      <CompetitorBattleCard
                        audit1={auditResult}
                        audit2={competitorResult}
                        lang={lang}
                      />
                    )}

                    <ScoreOverview audit={auditResult} lang={lang} />

                    {/* Quick 1-Click Code Exporter */}
                    <QuickFixGenerator audit={auditResult} lang={lang} />

                    {/* Full Actionable Issues Table */}
                    <IssuesList
                      issues={auditResult.issues}
                      lang={lang}
                      onSelectIssue={(issue) => setSelectedIssue(issue)}
                    />
                  </div>
                )}

                {/* TAB 2: GOOGLE SEO & SPEED */}
                {activeTab === 'seo' && (
                  <div className="animate-fade-in">
                    <SeoAuditCard
                      seo={auditResult.seo}
                      lang={lang}
                      onOpenFix={handleOpenFixById}
                    />

                    <SpeedAuditCard
                      performance={auditResult.performance}
                      lang={lang}
                    />

                    <IssuesList
                      issues={auditResult.issues.filter((i) => i.category === 'seo' || i.category === 'performance')}
                      lang={lang}
                      onSelectIssue={(issue) => setSelectedIssue(issue)}
                    />
                  </div>
                )}

                {/* TAB 3: GEO & AI SEARCH */}
                {activeTab === 'geo' && (
                  <div className="animate-fade-in">
                    <GeoAuditCard
                      geo={auditResult.geo}
                      lang={lang}
                      onOpenFix={handleOpenFixById}
                    />

                    <AiDiscoveryCard
                      geo={auditResult.geo}
                      lang={lang}
                    />

                    <IssuesList
                      issues={auditResult.issues.filter((i) => i.category === 'geo')}
                      lang={lang}
                      onSelectIssue={(issue) => setSelectedIssue(issue)}
                    />
                  </div>
                )}

                {/* TAB 4: INSIDER PRO SECRETS */}
                {activeTab === 'insider' && auditResult.insider && (
                  <div className="animate-fade-in">
                    <InsiderAuditCard
                      insider={auditResult.insider}
                      lang={lang}
                      onOpenFix={handleOpenFixById}
                    />

                    <IssuesList
                      issues={auditResult.issues.filter((i) => i.category === 'insider' || i.category === 'security')}
                      lang={lang}
                      onSelectIssue={(issue) => setSelectedIssue(issue)}
                    />
                  </div>
                )}

                {/* TAB 5: 1-CLICK AI FIXES */}
                {activeTab === 'fixes' && (
                  <div className="animate-fade-in">
                    <QuickFixGenerator audit={auditResult} lang={lang} />
                  </div>
                )}

                {/* TAB 6: COMPETITOR BATTLE */}
                {activeTab === 'battle' && competitorResult && (
                  <div className="animate-fade-in">
                    <CompetitorBattleCard
                      audit1={auditResult}
                      audit2={competitorResult}
                      lang={lang}
                    />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      <Footer lang={lang} />

      {/* Code Snippet Modal */}
      <CodeModal
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
        lang={lang}
      />
    </div>
  );
}

export default App;
