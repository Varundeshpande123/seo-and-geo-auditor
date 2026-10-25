import type { InsiderMetrics, AuditIssue } from '../types/audit';

export interface InsiderOptions {
  html: string;
  targetUrl: string;
  responseHeaders?: Record<string, string>;
}

export function analyzeInsiderMetrics({ html, targetUrl, responseHeaders = {} }: InsiderOptions): {
  insider: InsiderMetrics;
  issues: AuditIssue[];
} {
  const issues: AuditIssue[] = [];
  let insiderScore = 100;

  // 1. Text Extraction & Information Gain
  // Strip script, style, comments
  const cleanHtml = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');

  const rawText = cleanHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = rawText.match(/\b[A-Za-z0-9\u0C80-\u0CFF]{2,}\b/g) || [];
  const wordCount = words.length;

  const uniqueWords = new Set(words.map((w) => w.toLowerCase()));
  const lexicalRichnessPercent = wordCount > 0 ? Math.round((uniqueWords.size / wordCount) * 100) : 0;
  const readingTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  let infoStatus: 'good' | 'warning' | 'critical' = 'good';
  let infoFeedback = `Solid content depth (${wordCount} words, ~${readingTimeMin} min read) with ${lexicalRichnessPercent}% vocabulary variety.`;

  if (wordCount < 300) {
    infoStatus = 'critical';
    infoFeedback = `Thin content detected (${wordCount} words). Google and ChatGPT penalize pages with <300 words as 'Low Information Gain'.`;
    insiderScore -= 25;
    issues.push({
      id: 'thin-content-information-gain',
      category: 'insider',
      severity: 'critical',
      title: 'Thin Content (Low Information Gain)',
      description: `Your page has only ${wordCount} words. Modern search algorithms favor comprehensive pages that thoroughly answer user questions.`,
      recommendation: 'Expand content to at least 600-1,000 words with unique case studies, data points, or step-by-step guides.',
      impactScore: 9,
    });
  } else if (wordCount < 600) {
    infoStatus = 'warning';
    infoFeedback = `Moderate content (${wordCount} words). Recommended: 800+ words for competitive topics.`;
    insiderScore -= 10;
  }

  // 2. DOM Architecture & Crawl Budget Waste
  const allTagMatches = html.match(/<[a-z0-9]+/gi) || [];
  const totalElements = allTagMatches.length;
  const textLength = rawText.length;
  const htmlLength = html.length;
  const textToHtmlRatio = htmlLength > 0 ? Math.round((textLength / htmlLength) * 100) : 0;

  let crawlEfficiency: 'Optimal' | 'Heavy' | 'Bloated' = 'Optimal';
  let domFeedback = `Efficient DOM structure (${totalElements} nodes, ${textToHtmlRatio}% text ratio). Fast crawler parsing.`;

  if (totalElements > 2000 || textToHtmlRatio < 6) {
    crawlEfficiency = 'Bloated';
    domFeedback = `DOM is heavily bloated (${totalElements} nodes, only ${textToHtmlRatio}% text). Wastes Google crawl budget.`;
    insiderScore -= 15;
    issues.push({
      id: 'bloated-dom-crawl-budget',
      category: 'insider',
      severity: 'warning',
      title: 'Excessive DOM Complexity (Crawl Budget Drain)',
      description: `Found ${totalElements} DOM tags with an excessively low text ratio (${textToHtmlRatio}%). Crawlers spend too much CPU parsing wrapper divs instead of indexing content.`,
      recommendation: 'Flatten nested divs, purge unused JavaScript components, and keep total DOM nodes below 1,200.',
      impactScore: 6,
    });
  } else if (totalElements > 1200) {
    crawlEfficiency = 'Heavy';
    domFeedback = `DOM size is on the higher side (${totalElements} elements).`;
    insiderScore -= 5;
  }

  // 3. Secret Security & Server Headers (HSTS, CSP, X-Frame)
  const headerKeys = Object.keys(responseHeaders).map((k) => k.toLowerCase());
  const hasHsts = headerKeys.includes('strict-transport-security') || targetUrl.startsWith('https://');
  const hasCsp = headerKeys.includes('content-security-policy');
  const hasXFrame = headerKeys.includes('x-frame-options');
  const hasContentType = headerKeys.includes('x-content-type-options');

  let securityHeadersCount = 0;
  if (hasHsts) securityHeadersCount++;
  if (hasCsp) securityHeadersCount++;
  if (hasXFrame) securityHeadersCount++;
  if (hasContentType) securityHeadersCount++;

  const secScore = Math.round((securityHeadersCount / 4) * 100);
  let secFeedback = 'Key HTTP security headers verified.';

  if (!hasHsts) {
    insiderScore -= 10;
    issues.push({
      id: 'missing-hsts',
      category: 'insider',
      severity: 'warning',
      title: 'Missing HTTP Strict Transport Security (HSTS)',
      description: 'HSTS forces all browsers to communicate strictly over HTTPS, preventing SSL-stripping man-in-the-middle attacks.',
      recommendation: 'Enable HSTS in Cloudflare under SSL/TLS -> Edge Certificates -> Enable HSTS.',
      codeSnippet: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`,
      impactScore: 7,
    });
  }

  // 4. AI Hallucination Risk Assessment
  // Checks if content contains specific figures, structured lists, and explicit definitions
  const hasNumbersOrStats = (rawText.match(/\b\d+(?:\.\d+)?%?\b/g) || []).length > 5;
  const hasDefinitions = /is defined as|refers to|means that|specifically/i.test(rawText);

  let riskLevel: 'Low' | 'Moderate' | 'High' = 'Low';
  let factScore = 80;
  if (hasDefinitions) factScore += 10;
  if (hasNumbersOrStats) factScore += 10;
  factScore = Math.min(100, factScore);
  let hallFeedback = 'Content is well-structured with clear facts, numbers, and definitions. Low AI hallucination risk.';

  if (wordCount < 400 || !hasNumbersOrStats) {
    riskLevel = 'Moderate';
    factScore = 60;
    hallFeedback = 'Moderate risk: Content lacks concrete statistics and explicit definitions. AI models may summarize with generic assumptions.';
    insiderScore -= 10;
  }

  if (wordCount < 200) {
    riskLevel = 'High';
    factScore = 30;
    hallFeedback = 'High risk: Too little text for LLMs to ground facts. High chance of AI models guessing or hallucinating details.';
    insiderScore -= 20;
    issues.push({
      id: 'high-ai-hallucination-risk',
      category: 'insider',
      severity: 'warning',
      title: 'High AI Hallucination & Fact Distortion Risk',
      description: 'Generative AI models hallucinate when websites do not provide explicit factual definitions, statistics, and verifiable credentials.',
      recommendation: 'Add clear company data, founding year, founders, contact info, and verifiable service bullet points.',
      impactScore: 8,
    });
  }

  insiderScore = Math.max(20, Math.min(100, insiderScore));

  return {
    insider: {
      score: insiderScore,
      informationGain: {
        wordCount,
        readingTimeMin,
        lexicalRichnessPercent,
        status: infoStatus,
        feedback: infoFeedback,
      },
      domArchitecture: {
        totalElements,
        textToHtmlRatio,
        crawlBudgetEfficiency: crawlEfficiency,
        feedback: domFeedback,
      },
      securityHeaders: {
        hsts: hasHsts,
        csp: hasCsp,
        xFrameOptions: hasXFrame,
        xContentTypeOptions: hasContentType,
        score: secScore,
        feedback: secFeedback,
      },
      aiHallucinationRisk: {
        riskLevel,
        factDensityScore: factScore,
        feedback: hallFeedback,
      },
    },
    issues,
  };
}
