import type { GeoMetrics, AuditIssue } from '../types/audit';

export interface GeoOptions {
  html: string;
  robotsTxt?: string;
  targetUrl: string;
}

export function analyzeGeo({ html, robotsTxt = '', targetUrl }: GeoOptions): { geo: GeoMetrics; issues: AuditIssue[] } {
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
    geoScore -= 30;

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
  } else if (!hasOrganizationOrPerson) {
    structuredScore = 60;
    schemaStatus = 'warning';
    schemaFeedback = `Found schemas: ${schemasFound.join(', ')}, but missing Organization/Person entity schema.`;
    geoScore -= 10;

    issues.push({
      id: 'missing-entity-schema',
      category: 'geo',
      severity: 'warning',
      title: 'Missing Organization or Author Entity Schema',
      description: 'AI engines prioritize sources with clear authorship and organization entities for E-E-A-T (Experience, Expertise, Authoritativeness, and Trustworthiness).',
      recommendation: 'Add an Organization or Person schema containing "sameAs" links to verified social and Wikipedia profiles.',
      impactScore: 7
    });
  }

  // 3. Citation Readiness (LLM-friendly content structure)
  // Check for Q&A / FAQ heading structures
  const qaHeadingMatch = html.match(/<h[23][^>]*>\s*(?:what|how|why|when|where|who|is|can|do|does|which)[^<]*\?*<\/h[23]>/gi);
  const faqOrQaFormatFound = Boolean(qaHeadingMatch && qaHeadingMatch.length >= 2);

  // Check for direct summary / answer blocks (e.g. class or id containing summary, tldr, or lead paragraph)
  const directAnswerBlocksFound = /class=["'][^"']*(?:tldr|summary|quick-answer|key-takeaways|direct-answer|lead)[^"']*["']/i.test(html) ||
                                  /<p\b[^>]*>(?:In summary|To summarize|Key Takeaway|Quick answer|The short answer is):?/i.test(html);

  // Check for tables and lists (AI citation love tables for fact comparison)
  const tabularDataFound = /<table\b/i.test(html);
  const listMatches = html.match(/<[uo]l\b/gi) || [];
  const listsCount = listMatches.length;

  let citationScore = 50;
  if (faqOrQaFormatFound) citationScore += 20;
  if (directAnswerBlocksFound) citationScore += 15;
  if (tabularDataFound) citationScore += 15;
  if (listsCount >= 3) citationScore += 10;
  citationScore = Math.min(100, citationScore);

  if (!faqOrQaFormatFound) {
    issues.push({
      id: 'missing-qa-headings',
      category: 'geo',
      severity: 'info',
      title: 'Add Conversational Q&A Format Headings',
      description: 'Users query AI engines with conversational questions (e.g., "How does...", "What is the best..."). Structuring H2/H3 headers as direct questions helps AI select your page as a direct citation.',
      recommendation: 'Format at least 2 subheadings as direct questions followed by concise, factual 2-3 sentence answers.',
      impactScore: 6
    });
  }

  if (!directAnswerBlocksFound) {
    issues.push({
      id: 'missing-tldr-direct-answer',
      category: 'geo',
      severity: 'info',
      title: 'Add a "Key Takeaways" or "TL;DR" Block',
      description: 'Generative AI search synthesizers extract 40-60 word concise summary snippets. Placing a clear summary block near the top drastically increases citation frequency.',
      recommendation: 'Add a summary block right below your hero or introduction paragraph.',
      codeSnippet: `<div class="key-takeaways">\n  <h3>Key Takeaways</h3>\n  <ul>\n    <li>Concise fact 1</li>\n    <li>Concise fact 2</li>\n  </ul>\n</div>`,
      impactScore: 7
    });
  }

  // Final GEO overall score calculation
  const calculatedGeoScore = Math.round((botScore * 0.35) + (structuredScore * 0.40) + (citationScore * 0.25));

  let aiRecommendation = 'Your website is well primed for AI Search engines. Continue building external entity mentions.';
  if (calculatedGeoScore < 60) {
    aiRecommendation = 'Critical: Your website is at risk of being invisible to ChatGPT and Perplexity. Implement Schema JSON-LD and allow AI bots in robots.txt immediately.';
  } else if (calculatedGeoScore < 80) {
    aiRecommendation = 'Moderate: Your site can be cited, but needs clearer entity schemas and question-answer formatting to win top generative citations.';
  }

  return {
    geo: {
      score: calculatedGeoScore,
      aiBotAccess: {
        score: botScore,
        bots: botResults,
        status: botStatus,
        feedback: botFeedback
      },
      structuredData: {
        score: structuredScore,
        schemasFound,
        hasOrganizationOrPerson,
        hasKnowledgeGraphEntities,
        status: schemaStatus,
        feedback: schemaFeedback
      },
      citationReadiness: {
        score: citationScore,
        directAnswerBlocksFound,
        faqOrQaFormatFound,
        tabularDataFound,
        listsCount,
        feedback: `Found ${listsCount} structured lists, ${tabularDataFound ? 'data tables' : 'no tables'}, and ${faqOrQaFormatFound ? 'conversational Q&A headers' : 'standard headers'}.`
      },
      aiRecommendation
    },
    issues
  };
}
