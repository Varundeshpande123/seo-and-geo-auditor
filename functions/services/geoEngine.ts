import type { GeoMetrics, AuditIssue } from '../types/audit';

export interface GeoOptions {
  html: string;
  robotsTxt?: string;
  llmsTxt?: string;
  jsBundle?: string;
  targetUrl: string;
}

export function analyzeGeo({ html, robotsTxt = '', llmsTxt = '', jsBundle = '', targetUrl }: GeoOptions): { geo: GeoMetrics; issues: AuditIssue[] } {
  const issues: AuditIssue[] = [];
  let geoScore = 100;

  // 1. AI Bot Access Check via Robots.txt
  const targetBots = [
    { botName: 'GPTBot', aiEngine: 'ChatGPT / OpenAI Search' },
    { botName: 'ChatGPT-User', aiEngine: 'ChatGPT Browsing Mode' },
    { botName: 'PerplexityBot', aiEngine: 'Perplexity AI Search' },
    { botName: 'ClaudeBot', aiEngine: 'Anthropic Claude' },
    { botName: 'Google-Extended', aiEngine: 'Google Gemini & Vertex' },
    { botName: 'Bytespider', aiEngine: 'TikTok / ByteDance AI' }
  ];

  const lowerRobots = robotsTxt.toLowerCase();
  const botResults = targetBots.map(bot => {
    // Check if specifically Disallowed
    const botPattern = new RegExp(`user-agent:\\s*${bot.botName.toLowerCase()}[\\s\\S]*?disallow:\\s*\\/`, 'i');
    const isExplicitlyBlocked = botPattern.test(lowerRobots);
    
    // Also check wildcard disallow: User-agent: * \n Disallow: /
    const wildcardBlocked = /user-agent:\s*\*\s*[\r\n]+(?:[^\r\n]*[\r\n]+)*?disallow:\s*\/(?:\s|$)/i.test(lowerRobots);
    
    const allowed = !(isExplicitlyBlocked || wildcardBlocked);
    return {
      botName: bot.botName,
      aiEngine: bot.aiEngine,
      allowed
    };
  });

  const blockedBots = botResults.filter(b => !b.allowed);
  let botScore = 100;
  let botStatus: 'good' | 'warning' | 'critical' = 'good';
  let botFeedback = 'All major AI Search Bots have crawl access to index and cite your content.';

  if (blockedBots.length > 0) {
    botScore = Math.max(0, 100 - (blockedBots.length * 20));
    botStatus = blockedBots.length >= 3 ? 'critical' : 'warning';
    botFeedback = `${blockedBots.length} AI Search Bots (including ${blockedBots.map(b => b.botName).join(', ')}) are blocked from crawling your site.`;
    
    geoScore -= Math.min(35, blockedBots.length * 10);
    issues.push({
      id: 'blocked-ai-bots',
      category: 'geo',
      severity: blockedBots.length >= 2 ? 'critical' : 'warning',
      title: `${blockedBots.length} AI Crawler(s) Blocked in Robots.txt`,
      description: `Your robots.txt restricts AI search engines like ${blockedBots.map(b => b.aiEngine).join(', ')}. If they cannot crawl, they will not synthesize or cite your website in generative AI responses.`,
      recommendation: 'Allow access to GPTBot, PerplexityBot, and Google-Extended in your robots.txt unless you have sensitive copyrighted content.',
      codeSnippet: `# Allow Generative AI Search engines\nUser-agent: GPTBot\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\nUser-agent: Google-Extended\nAllow: /`,
      impactScore: 9
    });
  }

  // 2. Structured Data (Schema.org JSON-LD) Richness
  const jsonLdMatches = Array.from(html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi));
  const schemasFound: string[] = [];
  let hasOrganizationOrPerson = false;
  let hasKnowledgeGraphEntities = false;
  let hasIncompleteSchema = false;

  for (const match of jsonLdMatches) {
    try {
      const parsed = JSON.parse(match[1]);
      const extractTypes = (obj: any) => {
        if (!obj) return;
        if (Array.isArray(obj)) {
          obj.forEach(extractTypes);
        } else if (typeof obj === 'object') {
          if (obj['@type']) {
            const types = Array.isArray(obj['@type']) ? obj['@type'] : [obj['@type']];
            schemasFound.push(...types);
            if (types.some((t: string) => /Organization|Person|LocalBusiness/i.test(t))) {
              hasOrganizationOrPerson = true;
            }
            if (obj['sameAs'] || obj['@id'] || obj['knowsAbout']) {
              hasKnowledgeGraphEntities = true;
            } else {
              hasIncompleteSchema = true;
            }
          }
          if (obj['@graph'] && Array.isArray(obj['@graph'])) {
            obj['@graph'].forEach(extractTypes);
          }
        }
      };
      extractTypes(parsed);
    } catch {
      // JSON parse error in schema
    }
  }

  let structuredScore = 100;
  let schemaStatus: 'good' | 'warning' | 'critical' = 'good';
  let schemaFeedback = `Rich Schema.org markup detected (${schemasFound.join(', ')}). Excellent for Knowledge Graphs.`;

  if (schemasFound.length === 0) {
    structuredScore = 20;
    schemaStatus = 'critical';
    schemaFeedback = 'No JSON-LD Schema markup found! AI models struggle to extract clear entity relationships without Schema.';

    const hostname = targetUrl.replace(/^https?:\/\//i, '').split('/')[0];
    issues.push({
      id: 'missing-json-ld-schema',
      category: 'geo',
      severity: 'critical',
      title: 'Missing Schema.org JSON-LD Structured Data',
      description: 'Generative Search Engines (ChatGPT, Perplexity, Gemini) heavily rely on structured data to verify company facts, services, FAQs, and product details.',
      recommendation: 'Add Organization and WebSite schema markup to your home page and Article/FAQ schema to your content pages.',
      codeSnippet: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "${hostname}",\n  "url": "${targetUrl}",\n  "sameAs": [\n    "https://twitter.com/yourhandle",\n    "https://linkedin.com/company/yourhandle"\n  ]\n}\n<\/script>`,
      impactScore: 10
    });
  } else if (!hasOrganizationOrPerson || hasIncompleteSchema) {
    structuredScore = 80;
    schemaStatus = 'warning';
    schemaFeedback = `Found schemas: ${schemasFound.slice(0, 5).join(', ')}, but entity properties could be more complete.`;

    issues.push({
      id: 'schema-incomplete-or-disagrees',
      category: 'geo',
      severity: 'warning',
      title: 'Schema is incomplete or disagrees with the page',
      description: 'Structured data is present, but lacks complete contextual properties such as "sameAs" links to verified social profiles, explicit contact points, or entity relationships.',
      recommendation: 'Ensure your Organization schema contains complete sameAs profiles and verified business details.',
      impactScore: 5
    });
  }

  // 3. Extractability & Client-Side JavaScript Dependency Check (GeoTest High Impact Issue)
  const cleanHtml = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, '');
  const rawText = cleanHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = rawText.split(/\s+/).filter(Boolean).length;

  const hasEmptySpaRoot = /<div\s+id=["'](?:root|__next|app)["']\s*>\s*<\/div>/i.test(html);
  const isJsDependent = Boolean(hasEmptySpaRoot || (html.length > 8000 && wordCount < 300));

  let extractabilityScore = 100;
  if (isJsDependent) {
    extractabilityScore = 55;
    issues.push({
      id: 'content-depends-on-javascript',
      category: 'geo',
      severity: 'critical', // HIGH priority in GeoTest (+3.1 to +6.0 pts)
      title: 'Content depends on JavaScript to appear',
      description: 'AI Search crawlers (GPTBot, ClaudeBot, PerplexityBot) typically do not execute client-side JavaScript. If your content is rendered dynamically via React/Vue without SSR, AI models may see an empty or incomplete page.',
      recommendation: 'Implement Server-Side Rendering (SSR), Static Site Generation (SSG), or Pre-rendering (e.g., Next.js, Astro, or Cloudflare edge HTML caching) so raw HTML contains the full text.',
      impactScore: 9
    });
  }

  // 4. Answer Structure & Inverted Pyramid (GeoTest High Impact Issue)
  // Check if sections open with direct answers
  const headingSections = Array.from(html.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>[\s\r\n]*([\s\S]*?)(?:<h[23]|$)/gi));
  let sectionsOpeningWithAnswerCount = 0;
  for (const sec of headingSections) {
    const secBody = (sec[2] || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    // Check if body starts with direct informative statement vs introductory filler
    if (/^(?:[A-Z][a-zA-Z0-9\s,-]+ (?:is|are|provides|features|offers|was|were|helps|allows|enables|delivers|costs|measures|includes)|\d+)/i.test(secBody) &&
        !/^(?:Welcome|In today|In a world|As we know|We are proud|Our story|Click here|Read on)/i.test(secBody)) {
      sectionsOpeningWithAnswerCount++;
    }
  }

  const sectionsDoNotOpenWithAnswer = headingSections.length >= 2 && (sectionsOpeningWithAnswerCount < Math.max(1, Math.floor(headingSections.length * 0.4)));

  if (sectionsDoNotOpenWithAnswer) {
    issues.push({
      id: 'sections-do-not-open-with-answer',
      category: 'geo',
      severity: 'critical', // HIGH priority in GeoTest (+6.2 to score)
      title: 'Sections do not open with the answer',
      description: 'Generative AI search engines extract 40-60 word direct quotations from the immediate start of sections. Sections that begin with marketing filler, narrative build-up, or greetings fail AI direct citation selection.',
      recommendation: 'Adopt the Inverted Pyramid journalism style: Place the definitive answer, core statistic, or primary definition in the very first sentence under each H2/H3.',
      codeSnippet: `<h2>What is our core capability?</h2>\n<p>Our platform is an enterprise-grade AI audit solution that delivers sub-second automated compliance across 5 major AI models.</p>`,
      impactScore: 9
    });
  }

  // 5. Citation Worthiness & Fact Density (GeoTest Medium Impact Issue)
  // Count concrete facts: numbers, percentages, dates, currency, data specs
  const factMatches = rawText.match(/\b(?:\d+(?:\.\d+)?%?|\$\d+(?:\.\d+)?|€\d+|£\d+|₹\d+|(?:19|20)\d{2}|\d+\s*(?:gb|mb|px|kg|users|clients|years|days|hours|ms|sec|reviews|stars))\b/gi) || [];
  const factCount = factMatches.length;
  const factDensityRatio = wordCount > 0 ? (factCount / (wordCount / 100)) : 0;
  const isLowFactDensity = wordCount >= 100 && factDensityRatio < 1.8;

  if (isLowFactDensity) {
    issues.push({
      id: 'low-fact-density',
      category: 'geo',
      severity: 'warning', // MEDIUM in GeoTest (+1.6 to score)
      title: 'Low fact density',
      description: 'Your page contains mostly generic descriptive phrasing. Generative AI models prioritize content with verifiable facts, statistics, benchmarks, dates, and quantitative evidence.',
      recommendation: 'Incorporate concrete figures, benchmark metrics, exact timelines, and verifiable statistics throughout your body paragraphs.',
      impactScore: 6
    });
  }

  // 6. Authority and Trust (GeoTest Medium Impact Issues)
  // Check for Privacy Policy & Terms of Service links in HTML and Client JS bundle
  const hasPrivacyInHtml = /<a\b[^>]*href=["'][^"']*(?:privacy|privacy-policy)[^"']*["']/i.test(html) || /privacy\s+policy/i.test(html);
  const hasPrivacyInBundle = /privacy\s*(?:policy|&\s*cookies)/i.test(jsBundle || '');
  const hasPrivacyPolicy = hasPrivacyInHtml || hasPrivacyInBundle;
  const privacyStatus = hasPrivacyInHtml
    ? 'Found in static HTML'
    : hasPrivacyInBundle
    ? 'Found in client bundle (JS)'
    : 'Not found in footer';

  const hasTermsInHtml = /<a\b[^>]*href=["'][^"']*(?:terms|tender-terms|tos|conditions)[^"']*["']/i.test(html) || /(?:terms\s+of\s+service|terms\s*(?:&|and)\s*conditions|tender\s+terms|terms\s+of\s+use)/i.test(html);
  const hasTermsInBundle = /(?:terms\s+of\s+service|terms\s*(?:&|and)\s*conditions|tender\s+terms|terms\s+of\s+use)/i.test(jsBundle || '');
  const hasTerms = hasTermsInHtml || hasTermsInBundle;
  const termsStatus = hasTermsInHtml
    ? 'Found in static HTML'
    : hasTermsInBundle
    ? 'Found in client bundle (JS)'
    : 'Not found in footer';

  const hasPrivacyAndTerms = hasPrivacyPolicy && hasTerms;

  if (!hasPrivacyPolicy && !hasTerms) {
    issues.push({
      id: 'privacy-and-terms-missing',
      category: 'geo',
      severity: 'warning', // MEDIUM in GeoTest (+3.1 to score)
      title: 'Privacy and Terms links not found',
      description: 'Generative search engines (especially Google Gemini and Perplexity) verify organizational credibility and E-E-A-T trustworthiness by confirming the presence of accessible Privacy Policy and Terms of Service links.',
      recommendation: 'Ensure your footer contains clear, direct links to your Privacy Policy and Terms of Service pages.',
      impactScore: 5
    });
  } else if (!hasPrivacyPolicy) {
    issues.push({
      id: 'privacy-missing',
      category: 'geo',
      severity: 'warning',
      title: 'Privacy Policy link not found',
      description: 'A verified Privacy Policy link in your footer is essential for AI search crawlers to establish trust and legal transparency.',
      recommendation: 'Add a visible Privacy Policy link in your site footer.',
      impactScore: 4
    });
  } else if (!hasTerms) {
    issues.push({
      id: 'terms-missing',
      category: 'geo',
      severity: 'info',
      title: 'Terms of Service / Tender Terms not detected',
      description: 'Having explicit Terms of Service, Tender Terms, or Conditions in your footer strengthens institutional authority for corporate and government tenders.',
      recommendation: 'Ensure terms links (like Tender Terms or Terms of Service) are prominently linked in your footer.',
      impactScore: 3
    });
  } else if ((hasPrivacyInBundle && !hasPrivacyInHtml) || (hasTermsInBundle && !hasTermsInHtml)) {
    // Both are present, but rendered via client JavaScript
    issues.push({
      id: 'legal-links-in-js-bundle',
      category: 'geo',
      severity: 'info',
      title: 'Privacy Policy & Terms rendered in Client JavaScript',
      description: 'Privacy Policy and Terms links were detected in your client-side JavaScript bundle. However, raw AI bots (like GPTBot, ClaudeBot, and GeoTest) do not execute JavaScript and only inspect raw initial HTML.',
      recommendation: 'Place static fallback <a> links in your root HTML footer (or enable SSR/prerendering) so non-JS AI search crawlers can index them directly.',
      impactScore: 2
    });
  }

  // Check for contextual internal links inside <p> paragraphs
  let targetHostname = '';
  try {
    targetHostname = new URL(targetUrl).hostname.replace(/^www\./, '');
  } catch {}

  const paragraphs = html.match(/<p\b[^>]*>([\s\S]*?)<\/p>/gi) || [];
  let contextualInternalLinksCount = 0;
  const escapedHostname = targetHostname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const internalLinkRegex = new RegExp(`<a\\b[^>]*href=["'](?:(?![a-z]+:)[^"']+|https?:\\/\\/(?:www\\.)?${escapedHostname}[^"']*)["']`, 'gi');
  for (const p of paragraphs) {
    const internalLinks = p.match(internalLinkRegex) || [];
    contextualInternalLinksCount += internalLinks.length;
  }

  const isFewContextualInternalLinks = contextualInternalLinksCount < 2;
  if (isFewContextualInternalLinks) {
    issues.push({
      id: 'few-contextual-internal-links',
      category: 'geo',
      severity: 'warning', // MEDIUM in GeoTest (+4.7 to score)
      title: 'Few contextual internal links',
      description: 'Your body paragraphs have very few inline links to related topics. AI engines map internal semantic graphs to determine topic depth, citation authority, and navigational hierarchy.',
      recommendation: 'Add 2-4 contextual in-text links within body paragraphs connecting to your key service, case study, or documentation pages.',
      impactScore: 6
    });
  }

  // 7. Citation Readiness & Format Check
  const qaHeadingMatch = html.match(/<h[23][^>]*>\s*(?:what|how|why|when|where|who|is|can|do|does|which)[^<]*\?*<\/h[23]>/gi);
  const faqOrQaFormatFound = Boolean(qaHeadingMatch && qaHeadingMatch.length >= 2);

  const directAnswerBlocksFound = /class=["'][^"']*(?:tldr|summary|quick-answer|key-takeaways|direct-answer|lead)[^"']*["']/i.test(html) ||
                                  /<p\b[^>]*>(?:In summary|To summarize|Key Takeaway|Quick answer|The short answer is):?/i.test(html);

  const tabularDataFound = /<table\b/i.test(html);
  const listMatches = html.match(/<[uo]l\b/gi) || [];
  const listsCount = listMatches.length;

  let citationScore = 60;
  if (faqOrQaFormatFound) citationScore += 15;
  if (directAnswerBlocksFound) citationScore += 15;
  if (tabularDataFound) citationScore += 10;
  if (listsCount >= 3) citationScore += 10;
  if (isLowFactDensity) citationScore -= 15;
  citationScore = Math.max(20, Math.min(100, citationScore));

  // Heading hierarchy check
  const h1Matches = html.match(/<h1\b/gi) || [];
  const isWeakHeadingHierarchy = h1Matches.length !== 1 || headingSections.length < 2;
  if (isWeakHeadingHierarchy) {
    issues.push({
      id: 'heading-hierarchy-is-weak',
      category: 'geo',
      severity: 'warning', // MEDIUM in GeoTest (+1.6 to score)
      title: 'Heading hierarchy is weak',
      description: 'Heading levels are unstructured or lack clear question-answer progression. AI models rely on orderly H1 -> H2 -> H3 outlines to parse document semantics.',
      recommendation: 'Ensure a single H1 introduces the main topic, with logical H2 subheadings grouping key concepts.',
      impactScore: 5
    });
  }

  // 8. Business Entity Clarity & NAP (Name, Address, Phone) Verification
  const hasPhone = /tel:[^"'>]+|(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+91[-.\s]?\d{10}/i.test(html) || /(?:call|phone|contact)\s*:\s*\+?\d+/i.test(jsBundle || '');
  const hasEmail = /mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i.test(html) || /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(html) || /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(jsBundle || '');
  const hasPhysicalAddress = /(?:address|pin\s*code|postal\s*code|pincode|industrial\s*area|state|karnataka|india|bangalore|bengaluru)/i.test(html) || /(?:karnataka|india|bangalore|pincode)/i.test(jsBundle || '');
  const hasVerifiedNAP = (hasPhone || hasEmail) && hasPhysicalAddress;

  if (!hasVerifiedNAP) {
    issues.push({
      id: 'business-entity-unverified',
      category: 'geo',
      severity: 'warning',
      title: 'Business Entity Contact & Location Unverified',
      description: 'Generative search engines (ChatGPT, Perplexity, Gemini) require verified Name, Address, and Phone (NAP) details in visible HTML and Organization Schema to reliably cite your business for local and commercial queries.',
      recommendation: 'Ensure your official business name, registered address/service area, phone number, and support email are clearly visible in the footer and encoded in Organization schema.',
      impactScore: 6
    });
  }

  // 9. Technical Specifications & Measurable Units Check
  const unitMatches = html.match(/\b(?:\d+(?:\.\d+)?\s*(?:mm|cm|meters|m|kg|tons|kW|volts|rpm|fps|years\s*warranty|warranty|tested|certified))\b/gi) || [];
  const standardsMatches = html.match(/\b(?:ISO[\s-]?\d+|ASTM[\s-]?\d+|BIS|EN1176|RoHS|CE\s*certified)\b/gi) || [];
  const detectedUnits = Array.from(new Set([...unitMatches, ...standardsMatches])).slice(0, 5);
  const hasMeasurementsOrUnits = detectedUnits.length >= 2;

  if (!hasMeasurementsOrUnits) {
    issues.push({
      id: 'sparse-technical-specs',
      category: 'geo',
      severity: 'info',
      title: 'Sparse Technical Specifications & Physical Metrics',
      description: 'Generative AI search models prioritize product and service pages that state concrete dimensions, engineering standards, warranty terms, and physical specifications over generic marketing copy.',
      recommendation: 'Incorporate technical specification tables with exact units (e.g. dimensions in mm, load capacity in kg, compliance standards like ISO/ASTM/EN1176).',
      impactScore: 4
    });
  }

  // Final GeoTest-Calibrated Strict Score Calculation
  // Breakdown matching GeoTest's published rubric (out of 100):
  // 1. Answer Structure: 20 pts max
  let answerStructurePts = 20;
  if (sectionsDoNotOpenWithAnswer) answerStructurePts -= 6.2;
  if (isWeakHeadingHierarchy) answerStructurePts -= 1.6;

  // 2. Extractability: 18 pts max
  let extractabilityPts = 18;
  if (isJsDependent) extractabilityPts -= 6.5;

  // 3. Authority & Trust: 18 pts max
  let authorityTrustPts = 18;
  if (!hasPrivacyAndTerms) authorityTrustPts -= 3.1;
  if (isFewContextualInternalLinks) authorityTrustPts -= 4.7;

  // 4. Citation Worthiness: 16 pts max
  let citationWorthinessPts = 16;
  if (isLowFactDensity) citationWorthinessPts -= 3.5;
  if (!directAnswerBlocksFound) citationWorthinessPts -= 3.0;

  // 5. Structured Data: 14 pts max
  let structuredDataPts = 14;
  if (schemasFound.length === 0) structuredDataPts -= 8.0;
  else if (hasIncompleteSchema) structuredDataPts -= 2.0;

  // 6. AI Bot Access (Robots.txt): 14 pts max
  let botAccessPts = (botScore / 100) * 14;

  const rawCalculatedScore = Math.round(
    answerStructurePts +
    extractabilityPts +
    authorityTrustPts +
    citationWorthinessPts +
    structuredDataPts +
    botAccessPts
  );

  const calculatedGeoScore = Math.max(15, Math.min(100, rawCalculatedScore));

  let geoGrade: 'A' | 'B' | 'C' | 'D' | 'F' = 'C';
  if (calculatedGeoScore >= 85) geoGrade = 'A';
  else if (calculatedGeoScore >= 75) geoGrade = 'B';
  else if (calculatedGeoScore >= 60) geoGrade = 'C';
  else if (calculatedGeoScore >= 45) geoGrade = 'D';
  else geoGrade = 'F';

  let aiRecommendation = 'Your website is well primed for AI Search engines. Continue building external entity mentions.';
  if (calculatedGeoScore < 65) {
    aiRecommendation = 'Fair (Grade C): Content relies on JavaScript, sections lack direct answers, or trust links are missing. Fix high-priority items to reach 85+ Ready.';
  } else if (calculatedGeoScore < 80) {
    aiRecommendation = 'Moderate (Grade B): Good baseline, but needs inverted pyramid answers and contextual links to compete for top generative AI citations.';
  }

  // Calculate AI Share of Voice (SOV) aligned with calibrated score
  const sovPercentage = Math.round(calculatedGeoScore * 0.9);
  let sovRating: 'Dominant' | 'Competitive' | 'Moderate' | 'Low' = 'Moderate';
  if (sovPercentage >= 80) sovRating = 'Dominant';
  else if (sovPercentage >= 65) sovRating = 'Competitive';
  else if (sovPercentage < 50) sovRating = 'Low';

  const sovSummary = sovRating === 'Dominant'
    ? 'High brand visibility across generative search engines with strong citation probability.'
    : sovRating === 'Competitive'
    ? 'Good visibility, competing strongly for top generative search citations.'
    : 'Limited visibility in AI search. Risk of competitors dominating generative answers.';

  // Dynamic Prompt & Question Discovery
  let brandTopic = 'your brand';
  try {
    brandTopic = new URL(targetUrl).hostname.replace(/^www\./, '').split('.')[0];
    brandTopic = brandTopic.charAt(0).toUpperCase() + brandTopic.slice(1);
  } catch {
    brandTopic = 'this domain';
  }

  const promptDiscovery = [
    {
      prompt: `What are the core solutions, features, and expertise offered by ${brandTopic}?`,
      intent: 'Informational' as const,
      suggestedEngine: 'ChatGPT' as const,
    },
    {
      prompt: `Is ${brandTopic} reliable and what do verified customer reviews say about it?`,
      intent: 'Commercial' as const,
      suggestedEngine: 'Perplexity' as const,
    },
    {
      prompt: `Top alternatives and competitors to ${brandTopic} in 2026`,
      intent: 'Comparative' as const,
      suggestedEngine: 'Gemini' as const,
    },
    {
      prompt: `How does ${brandTopic} help businesses optimize performance and achieve growth?`,
      intent: 'Informational' as const,
      suggestedEngine: 'ChatGPT' as const,
    },
    {
      prompt: `Pricing, contact details, and service offerings for ${brandTopic}`,
      intent: 'Commercial' as const,
      suggestedEngine: 'Perplexity' as const,
    },
    {
      prompt: `Step-by-step implementation guide and case studies from ${brandTopic}`,
      intent: 'Comparative' as const,
      suggestedEngine: 'Gemini' as const,
    },
  ];

  // 4. Emerging 2025-2026 AI Standard: /llms.txt
  const llmsTxtClean = llmsTxt.trim();
  const isHtml = /<!DOCTYPE|<html|<body/i.test(llmsTxtClean);
  const llmsTxtExists = llmsTxtClean.length > 20 && !isHtml;
  const hasLlmsTitle = /^#\s+.+/m.test(llmsTxtClean);
  const hasLlmsSummary = />\s+.+/m.test(llmsTxtClean) || /description|summary|overview/i.test(llmsTxtClean);

  let llmsTxtStatus: 'good' | 'warning' | 'critical' = 'warning';
  let llmsTxtFeedback = '';
  const originUrl = new URL(targetUrl).origin;
  const llmsFileUrl = `${originUrl}/llms.txt`;

  if (llmsTxtExists) {
    llmsTxtStatus = 'good';
    llmsTxtFeedback = 'Valid /llms.txt file detected. Leading AI agents (Anthropic Claude, OpenAI) can ingest structured markdown context directly.';
  } else {
    llmsTxtStatus = 'warning';
    llmsTxtFeedback = 'No /llms.txt found. Having an /llms.txt gives AI models (Claude, ChatGPT, Perplexity) a clean, low-token overview of your brand and documentation.';
    
    issues.push({
      id: 'missing-llms-txt',
      category: 'geo',
      severity: 'info',
      title: 'Missing /llms.txt (Modern AI Context Protocol)',
      description: 'The /llms.txt standard allows AI systems and large language models to quickly understand what your site does, key endpoints, and APIs without parsing bloated HTML.',
      recommendation: 'Place an llms.txt file in your public root directory containing a markdown summary and key page links.',
      codeSnippet: `# ${brandTopic}\n\n> Comprehensive overview and verified solutions by ${brandTopic}.\n\n## Main Resources\n- [Home](${originUrl}): Official portal\n- [Services](${originUrl}/#services): Core offerings\n- [Contact](${originUrl}/#contact): Inquiries & verified details`,
      impactScore: 6,
    });
  }

  return {
    geo: {
      score: calculatedGeoScore,
      grade: geoGrade,
      extractability: {
        score: extractabilityScore,
        jsDependent: isJsDependent,
        rawTextLength: rawText.length,
        feedback: isJsDependent
          ? 'Content relies heavily on client-side JavaScript to render.'
          : 'Content is directly accessible in static raw HTML.',
        status: isJsDependent ? 'critical' : 'good',
      },
      authorityTrust: {
        score: Math.round(
          ((hasPrivacyPolicy ? (hasPrivacyInHtml ? 25 : 22) : 5) +
           (hasTerms ? (hasTermsInHtml ? 25 : 22) : 5) +
           (!isFewContextualInternalLinks ? 50 : 20))
        ),
        hasPrivacyAndTerms,
        hasPrivacyPolicy,
        privacyStatus,
        hasTerms,
        termsStatus,
        contextualInternalLinks: contextualInternalLinksCount,
        feedback: hasPrivacyPolicy && hasTerms
          ? `Found verified trust links (${hasPrivacyInHtml && hasTermsInHtml ? 'Static HTML' : 'Client JS Bundle'}) and ${contextualInternalLinksCount} contextual link${contextualInternalLinksCount === 1 ? '' : 's'}.`
          : 'Missing Privacy Policy or Terms of Service links in footer.',
        status: hasPrivacyPolicy && hasTerms && !isFewContextualInternalLinks ? 'good' : 'warning',
      },
      aiBotAccess: {
        score: botScore,
        bots: botResults,
        status: botStatus,
        feedback: botFeedback,
      },
      structuredData: {
        score: structuredScore,
        schemasFound,
        hasOrganizationOrPerson,
        hasKnowledgeGraphEntities,
        status: schemaStatus,
        feedback: schemaFeedback,
      },
      citationReadiness: {
        score: citationScore,
        directAnswerBlocksFound,
        faqOrQaFormatFound,
        tabularDataFound,
        listsCount,
        feedback: `Found ${listsCount} structured lists, ${tabularDataFound ? 'data tables' : 'no tables'}, and ${faqOrQaFormatFound ? 'conversational Q&A headers' : 'standard headers'}.`,
      },
      llmsTxt: {
        exists: llmsTxtExists,
        hasTitle: hasLlmsTitle,
        hasSummary: hasLlmsSummary,
        fileUrl: llmsFileUrl,
        status: llmsTxtStatus,
        feedback: llmsTxtFeedback,
        contentSnippet: llmsTxtExists ? llmsTxtClean.slice(0, 300) : undefined,
      },
      aiRecommendation,
      shareOfVoice: {
        percentage: sovPercentage,
        rating: sovRating,
        summary: sovSummary,
      },
      promptDiscovery,
      businessEntityClarity: {
        hasPhone,
        hasEmail,
        hasPhysicalAddress,
        hasVerifiedNAP,
        status: hasVerifiedNAP ? 'good' : (hasPhone || hasEmail || hasPhysicalAddress ? 'warning' : 'critical'),
        feedback: hasVerifiedNAP
          ? 'Verified entity contact and location signals detected.'
          : 'Missing explicit phone, email, or physical address signals.',
      },
      technicalSpecifications: {
        hasMeasurementsOrUnits,
        hasSafetyOrWarrantyClaims: Boolean(html.match(/warranty|certified|safety/i)),
        detectedUnits,
        status: hasMeasurementsOrUnits ? 'good' : 'warning',
        feedback: hasMeasurementsOrUnits
          ? `Detected verifiable technical metrics: ${detectedUnits.join(', ')}`
          : 'No concrete engineering units or measurement standards detected.',
      },
      directAnswerOptimization: {
        hasQuestionHeadings: faqOrQaFormatFound,
        hasConciseAnswers: directAnswerBlocksFound,
        answerSnippetCount: qaHeadingMatch ? qaHeadingMatch.length : 0,
        status: (faqOrQaFormatFound && directAnswerBlocksFound) ? 'good' : 'warning',
        feedback: faqOrQaFormatFound && directAnswerBlocksFound
          ? 'Optimal direct Q&A inverted pyramid structure found.'
          : 'Consider structuring sections with question headings and concise 40-60 word introductory answers.',
      },
    },
    issues,
  };
}
