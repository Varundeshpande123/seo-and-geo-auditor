export interface AuditIssue {
  id: string;
  category: 'seo' | 'geo' | 'performance' | 'security' | 'insider';
  severity: 'critical' | 'warning' | 'good' | 'info';
  title: string;
  description: string;
  recommendation: string;
  codeSnippet?: string;
  impactScore: number; // 1-10
}

export interface KeywordDensityItem {
  word: string;
  count: number;
  densityPercent: number;
  isOverOptimized: boolean; // >5% is keyword stuffing
}

export interface SeoMetrics {
  score: number; // 0-100
  title: {
    content: string | null;
    length: number;
    status: 'good' | 'warning' | 'critical';
    feedback: string;
  };
  description: {
    content: string | null;
    length: number;
    status: 'good' | 'warning' | 'critical';
    feedback: string;
  };
  headings: {
    h1Count: number;
    h1Tags: string[];
    h2Count: number;
    h3Count: number;
    isHierarchyValid: boolean;
    status: 'good' | 'warning' | 'critical';
    feedback: string;
  };
  canonical: {
    url: string | null;
    status: 'good' | 'warning' | 'critical';
    feedback: string;
  };
  openGraph: {
    hasTitle: boolean;
    hasDescription: boolean;
    hasImage: boolean;
    imageCount: number;
    status: 'good' | 'warning';
  };
  images: {
    total: number;
    missingAlt: number;
    missingDimensions?: number;
    nextGenFormatCount?: number;
    sampleMissingAlt: string[];
    status: 'good' | 'warning' | 'critical';
  };
  sitemap?: {
    referencedInRobots: boolean;
    sitemapUrl?: string;
    status: 'good' | 'warning';
    feedback: string;
  };
  links: {
    total: number;
    internal: number;
    external: number;
    secureExternal: number;
    brokenOrNoHref: number;
    status: 'good' | 'warning' | 'critical';
    feedback: string;
  };
  mobileViewport: {
    hasViewport: boolean;
    isResponsive: boolean;
    userScalableAllowed: boolean;
    status: 'good' | 'warning' | 'critical';
    feedback: string;
  };
}

export interface GeoMetrics {
  score: number; // 0-100 (GeoTest Calibrated Strict Score)
  grade?: 'A' | 'B' | 'C' | 'D' | 'F'; // Grade e.g. C Fair (65)
  categoryBreakdown?: {
    citationWorthiness: { score: number; maxScore: number; factDensity: number; status: 'good' | 'warning' | 'critical' };
    answerStructure: { score: number; maxScore: number; opensWithAnswer: boolean; status: 'good' | 'warning' | 'critical' };
    authorityTrust: { score: number; maxScore: number; hasPrivacyAndTerms: boolean; contextualLinksCount: number; status: 'good' | 'warning' | 'critical' };
    structuredData: { score: number; maxScore: number; status: 'good' | 'warning' | 'critical' };
    extractability: { score: number; maxScore: number; jsDependent: boolean; status: 'good' | 'warning' | 'critical' };
  };
  aiBotAccess: {
    score: number;
    bots: {
      botName: string;
      aiEngine: string;
      allowed: boolean;
    }[];
    status: 'good' | 'warning' | 'critical';
    feedback: string;
  };
  structuredData: {
    score: number;
    schemasFound: string[];
    hasOrganizationOrPerson: boolean;
    hasKnowledgeGraphEntities: boolean;
    status: 'good' | 'warning' | 'critical';
    feedback: string;
  };
  citationReadiness: {
    score: number;
    directAnswerBlocksFound: boolean;
    faqOrQaFormatFound: boolean;
    tabularDataFound: boolean;
    listsCount: number;
    feedback: string;
  };
  extractability?: {
    score: number;
    jsDependent: boolean;
    rawTextLength: number;
    feedback: string;
    status: 'good' | 'warning' | 'critical';
  };
  authorityTrust?: {
    score: number;
    hasPrivacyAndTerms: boolean;
    hasPrivacyPolicy: boolean;
    privacyStatus: string;
    hasTerms: boolean;
    termsStatus: string;
    contextualInternalLinks: number;
    feedback: string;
    status: 'good' | 'warning' | 'critical';
  };
  aiRecommendation: string;
  shareOfVoice: {
    percentage: number; // 0-100%
    rating: 'Dominant' | 'Competitive' | 'Moderate' | 'Low';
    summary: string;
  };
  llmsTxt?: {
    exists: boolean;
    hasTitle: boolean;
    hasSummary: boolean;
    fileUrl: string;
    status: 'good' | 'warning' | 'critical';
    feedback: string;
    contentSnippet?: string;
  };
  promptDiscovery: {
    prompt: string;
    intent: 'Informational' | 'Commercial' | 'Comparative';
    suggestedEngine: 'ChatGPT' | 'Perplexity' | 'Gemini';
  }[];
  businessEntityClarity?: {
    hasPhone: boolean;
    hasEmail: boolean;
    hasPhysicalAddress: boolean;
    hasVerifiedNAP: boolean;
    status: 'good' | 'warning' | 'critical';
    feedback: string;
  };
  technicalSpecifications?: {
    hasMeasurementsOrUnits: boolean;
    hasSafetyOrWarrantyClaims: boolean;
    detectedUnits: string[];
    status: 'good' | 'warning';
    feedback: string;
  };
  directAnswerOptimization?: {
    hasQuestionHeadings: boolean;
    hasConciseAnswers: boolean;
    answerSnippetCount: number;
    status: 'good' | 'warning';
    feedback: string;
  };
}

export interface PerformanceMetrics {
  score: number; // 0-100
  mobileScore: number;
  desktopScore: number;
  fcp: string; // First Contentful Paint
  lcp: string; // Largest Contentful Paint
  cls: string; // Cumulative Layout Shift
  serverResponseTimeMs: number;
  isHttps: boolean;
}

export interface InsiderMetrics {
  score: number; // 0-100 (Secret & Deep Technical Metrics)
  informationGain: {
    wordCount: number;
    readingTimeMin: number;
    lexicalRichnessPercent: number;
    status: 'good' | 'warning' | 'critical';
    feedback: string;
  };
  keywords: KeywordDensityItem[];
  domArchitecture: {
    totalElements: number;
    textToHtmlRatio: number; // percentage
    crawlBudgetEfficiency: 'Optimal' | 'Heavy' | 'Bloated';
    feedback: string;
  };
  securityHeaders: {
    hsts: boolean;
    csp: boolean;
    xFrameOptions: boolean;
    xContentTypeOptions: boolean;
    score: number;
    feedback: string;
  };
  aiHallucinationRisk: {
    riskLevel: 'Low' | 'Moderate' | 'High';
    factDensityScore: number;
    feedback: string;
  };
}

export interface FullAuditResult {
  url: string;
  domain: string;
  timestamp: string;
  overallScore: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  seo: SeoMetrics;
  geo: GeoMetrics;
  performance: PerformanceMetrics;
  insider: InsiderMetrics;
  issues: AuditIssue[];
}
