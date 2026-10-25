import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LoginPage } from './components/LoginPage';
import { HeroSearch } from './components/HeroSearch';
import { ScoreOverview } from './components/ScoreOverview';
import { GeoAuditCard } from './components/GeoAuditCard';
import { SeoAuditCard } from './components/SeoAuditCard';
import { SpeedAuditCard } from './components/SpeedAuditCard';
import { IssuesList } from './components/IssuesList';
import { CodeModal } from './components/CodeModal';
import { Footer } from './components/Footer';
import { runWebsiteAudit } from './services/apiClient';
import type { FullAuditResult, AuditIssue } from './types/audit';

export function App() {
  const [lang, setLang] = useState<'kn' | 'en'>('kn');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<FullAuditResult | null>(null);
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

  const handleAnalyze = async (url: string) => {
    setIsLoading(true);

    const steps = lang === 'kn' ? [
      'ಹೋಸ್ಟ್ ಜೊತೆ ಸಂಪರ್ಕ ಸಾಧಿಸಲಾಗುತ್ತಿದೆ (DNS & SSL)...',
      'AI ಕ್ರಾಲರ್‌ಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ (GPTBot, PerplexityBot, Claude)...',
      'Schema.org Knowledge Graph ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...',
      'Core Web Vitals ಮತ್ತು ಲೋಡ್ ಸ್ಪೀಡ್ ಲೆಕ್ಕಾಚಾರ...'
    ] : [
      'Establishing secure connection (DNS & SSL)...',
      'Auditing AI Crawlers (GPTBot, PerplexityBot, Claude)...',
      'Parsing Schema.org Knowledge Graph...',
      'Evaluating Core Web Vitals and PageSpeed...'
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
      const result = await runWebsiteAudit(url);
      clearInterval(stepInterval);
      setAuditResult(result);
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
                <ScoreOverview audit={auditResult} lang={lang} />

                {/* GEO AI Search Card - Key Differentiator */}
                <GeoAuditCard
                  geo={auditResult.geo}
                  lang={lang}
                  onOpenFix={handleOpenFixById}
                />

                {/* Traditional SEO Card */}
                <SeoAuditCard
                  seo={auditResult.seo}
                  lang={lang}
                  onOpenFix={handleOpenFixById}
                />

                {/* Performance & Core Web Vitals */}
                <SpeedAuditCard
                  performance={auditResult.performance}
                  lang={lang}
                />

                {/* Master Actionable Issues List */}
                <IssuesList
                  issues={auditResult.issues}
                  lang={lang}
                  onSelectIssue={(issue) => setSelectedIssue(issue)}
                />
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
