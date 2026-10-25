export interface AuditIssue {
  id: string;
  category: 'seo' | 'geo' | 'performance' | 'security';
  severity: 'critical' | 'warning' | 'good' | 'info';
  title: string;
  description: string;
  recommendation: string;
  codeSnippet?: string;
  impactScore: number; // 1-10
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
    sampleMissingAlt: string[];
    status: 'good' | 'warning' | 'critical';
  };
  links: {
    total: number;
    internal: number;
    external: number;
    brokenOrNoHref: number;
  };
}

export interface GeoMetrics {
  score: number; // 0-100 (Generative Engine Optimization Score)
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
  aiRecommendation: string;
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

export interface FullAuditResult {
  url: string;
  domain: string;
  timestamp: string;
  overallScore: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  seo: SeoMetrics;
  geo: GeoMetrics;
  performance: PerformanceMetrics;
  issues: AuditIssue[];
}
