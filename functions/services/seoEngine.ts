import type { SeoMetrics, AuditIssue } from '../types/audit';

export function analyzeSeo(html: string, targetUrl: string): { seo: SeoMetrics; issues: AuditIssue[] } {
  const issues: AuditIssue[] = [];

  // 1. Title Analysis
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : null;
  const titleLength = title ? title.length : 0;
  let titleStatus: 'good' | 'warning' | 'critical' = 'good';
  let titleFeedback = 'Title length is optimal.';

  if (!title) {
    titleStatus = 'critical';
    titleFeedback = 'Missing <title> tag. Search engines cannot index your page effectively.';
    issues.push({
      id: 'missing-title',
      category: 'seo',
      severity: 'critical',
      title: 'Missing <title> tag',
      description: 'Your webpage does not specify a page title in the <head> tag.',
      recommendation: 'Add a concise and descriptive <title> (between 50 and 60 characters).',
      codeSnippet: `<title>Your Brand - Main Keyword or Service</title>`,
      impactScore: 10
    });
  } else if (titleLength < 30) {
    titleStatus = 'warning';
    titleFeedback = `Title is too short (${titleLength} chars). Optimal length is 50-60 characters.`;
    issues.push({
      id: 'short-title',
      category: 'seo',
      severity: 'warning',
      title: 'Page title is too short',
      description: `Current title is only ${titleLength} characters. You are missing keyword opportunities.`,
      recommendation: 'Expand your title to between 50 and 60 characters to include relevant keywords and brand name.',
      impactScore: 5
    });
  } else if (titleLength > 65) {
    titleStatus = 'warning';
    titleFeedback = `Title is too long (${titleLength} chars) and may be truncated in search results.`;
    issues.push({
      id: 'long-title',
      category: 'seo',
      severity: 'warning',
      title: 'Page title exceeds 65 characters',
      description: `Title is ${titleLength} characters and will be cut off with an ellipsis in Google SERPs.`,
      recommendation: 'Keep title under 60 characters to prevent truncation on mobile and desktop results.',
      impactScore: 4
    });
  }

  // 2. Meta Description Analysis
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i) ||
                    html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i);
  const description = descMatch ? descMatch[1].trim() : null;
  const descLength = description ? description.length : 0;
  let descStatus: 'good' | 'warning' | 'critical' = 'good';
  let descFeedback = 'Meta description is well configured.';

  if (!description) {
    descStatus = 'critical';
    descFeedback = 'Missing meta description. Search engines will generate random snippets.';
    issues.push({
      id: 'missing-meta-description',
      category: 'seo',
      severity: 'critical',
      title: 'Missing Meta Description',
      description: 'Search engines use meta description for snippets in search listings.',
      recommendation: 'Add a compelling meta description of 120-160 characters describing your page.',
      codeSnippet: `<meta name="description" content="Discover professional services and insights from somashekhar.in. Learn more today!">`,
      impactScore: 8
    });
  } else if (descLength < 70) {
    descStatus = 'warning';
    descFeedback = `Description is short (${descLength} chars). Recommended: 120-160 characters.`;
    issues.push({
      id: 'short-meta-description',
      category: 'seo',
      severity: 'warning',
      title: 'Meta description is too brief',
      description: `Description is only ${descLength} characters. Provide more context to improve click-through rates.`,
      recommendation: 'Expand to 120-160 characters highlighting unique value propositions and a clear call-to-action.',
      impactScore: 4
    });
  } else if (descLength > 165) {
    descStatus = 'warning';
    descFeedback = `Description is long (${descLength} chars) and will be truncated on mobile.`;
  }

  // 3. Headings Analysis
  const h1Matches = Array.from(html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi));
  const h1Tags = h1Matches.map(m => m[1].replace(/<[^>]+>/g, '').trim()).filter(Boolean);
  const h2Count = (html.match(/<h2[^>]*>/gi) || []).length;
  const h3Count = (html.match(/<h3[^>]*>/gi) || []).length;

  let headingStatus: 'good' | 'warning' | 'critical' = 'good';
  let headingFeedback = `Found 1 H1 tag and ${h2Count} H2 tags. Structured nicely.`;

  if (h1Tags.length === 0) {
    headingStatus = 'critical';
    headingFeedback = 'No <h1> tag found! Every page should have exactly one primary H1.';
    issues.push({
      id: 'missing-h1',
      category: 'seo',
      severity: 'critical',
      title: 'Missing primary <h1> heading',
      description: 'The <h1> tag represents the primary topic of the page for search engines and screen readers.',
      recommendation: 'Wrap your main headline in a single <h1> tag.',
      codeSnippet: `<h1>Your Primary Page Topic Here</h1>`,
      impactScore: 9
    });
  } else if (h1Tags.length > 1) {
    headingStatus = 'warning';
    headingFeedback = `Multiple <h1> tags found (${h1Tags.length}). Best practice is to have 1 main H1 per page.`;
    issues.push({
      id: 'multiple-h1',
      category: 'seo',
      severity: 'warning',
      title: `Found ${h1Tags.length} <h1> tags`,
      description: 'Multiple H1 tags dilute keyword focus. Use H2 and H3 for sub-headings.',
      recommendation: 'Keep one main <h1> and convert secondary headers into <h2>.',
      impactScore: 5
    });
  }

  // 4. Canonical Tag Analysis
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/i) ||
                         html.match(/<link[^>]*href=["']([^"']*)["'][^>]*rel=["']canonical["'][^>]*>/i);
  const canonicalUrl = canonicalMatch ? canonicalMatch[1].trim() : null;
  let canonicalStatus: 'good' | 'warning' | 'critical' = 'good';
  let canonicalFeedback = 'Canonical link is specified properly.';

  if (!canonicalUrl) {
    canonicalStatus = 'warning';
    canonicalFeedback = 'No canonical link found. This may lead to duplicate content issues.';
    issues.push({
      id: 'missing-canonical',
      category: 'seo',
      severity: 'warning',
      title: 'Missing canonical URL link',
      description: 'A canonical URL tells search engines which version of a page is authoritative, preventing duplicate URL penalties.',
      recommendation: 'Add a self-referencing canonical tag in the <head> section.',
      codeSnippet: `<link rel="canonical" href="${targetUrl}" />`,
      impactScore: 6
    });
  }

  // 5. OpenGraph Tags
  const ogTitle = /<meta[^>]*property=["']og:title["']/i.test(html);
  const ogDesc = /<meta[^>]*property=["']og:description["']/i.test(html);
  const ogImage = /<meta[^>]*property=["']og:image["']/i.test(html);
  const ogStatus: 'good' | 'warning' = (ogTitle && ogDesc && ogImage) ? 'good' : 'warning';

  if (!ogTitle || !ogImage) {
    issues.push({
      id: 'missing-social-meta',
      category: 'seo',
      severity: 'warning',
      title: 'Missing OpenGraph Social Meta Tags',
      description: 'Your page lacks OpenGraph (og:title or og:image) tags, meaning social platforms and AI summary cards will look plain.',
      recommendation: 'Add standard OpenGraph tags so shares on WhatsApp, LinkedIn, and Twitter have rich previews.',
      codeSnippet: `<meta property="og:title" content="${title || 'Title'}" />\n<meta property="og:description" content="${description || 'Description'}" />\n<meta property="og:image" content="${targetUrl}/og-image.jpg" />`,
      impactScore: 5
    });
  }

  // 6. Image Alt Tags
  const imgMatches = Array.from(html.matchAll(/<img\b([^>]*)>/gi));
  let missingAltCount = 0;
  const sampleMissingAlt: string[] = [];

  for (const match of imgMatches) {
    const attrs = match[1];
    const hasAlt = /\balt=["'][^"']*["']/i.test(attrs);
    if (!hasAlt) {
      missingAltCount++;
      const srcMatch = attrs.match(/src=["']([^"']*)["']/i);
      if (srcMatch && sampleMissingAlt.length < 3) {
        sampleMissingAlt.push(srcMatch[1]);
      }
    }
  }

  let imgStatus: 'good' | 'warning' | 'critical' = 'good';
  if (missingAltCount > 0) {
    imgStatus = missingAltCount > 3 ? 'warning' : 'warning';
    issues.push({
      id: 'missing-image-alt',
      category: 'seo',
      severity: 'warning',
      title: `${missingAltCount} images missing 'alt' attributes`,
      description: 'Alt attributes are essential for Google Image search ranking and accessibility for visually impaired users.',
      recommendation: 'Add descriptive alt text to all image tags.',
      codeSnippet: `<img src="example.webp" alt="Detailed description of image content" />`,
      impactScore: 5
    });
  }

  // 7. Mobile Viewport Check
  const viewportMatch = html.match(/<meta[^>]*name=["']viewport["'][^>]*content=["']([^"']*)["'][^>]*>/i) ||
                        html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']viewport["'][^>]*>/i);
  const viewportContent = viewportMatch ? viewportMatch[1].toLowerCase() : '';
  const hasViewport = Boolean(viewportMatch);
  const isResponsive = viewportContent.includes('width=device-width');
  const userScalableAllowed = !viewportContent.includes('user-scalable=no') && !viewportContent.includes('maximum-scale=1');

  let viewportStatus: 'good' | 'warning' | 'critical' = 'good';
  let viewportFeedback = 'Mobile viewport is configured with responsive width scaling.';

  if (!hasViewport) {
    viewportStatus = 'critical';
    viewportFeedback = 'Missing <meta name="viewport"> tag! Google will treat the page as non-mobile-friendly.';
    issues.push({
      id: 'missing-viewport-meta',
      category: 'seo',
      severity: 'critical',
      title: 'Missing Mobile Viewport Meta Tag',
      description: 'Without a viewport meta tag, mobile devices render the page at desktop width, hurting mobile rankings and readability.',
      recommendation: 'Add the standard responsive viewport meta tag to your <head> section.',
      codeSnippet: `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`,
      impactScore: 10,
    });
  } else if (!isResponsive) {
    viewportStatus = 'warning';
    viewportFeedback = 'Viewport tag is present but missing "width=device-width".';
  } else if (!userScalableAllowed) {
    viewportStatus = 'warning';
    viewportFeedback = 'Viewport blocks pinch-to-zoom (user-scalable=no), which hurts accessibility score.';
  }

  // 8. Link Architecture Analysis
  let domain = '';
  try {
    domain = new URL(targetUrl).hostname.replace(/^www\./, '');
  } catch {
    domain = targetUrl;
  }

  const linkMatches = Array.from(html.matchAll(/<a\b([^>]*)>/gi));
  let internalLinks = 0;
  let externalLinks = 0;
  let secureExternalLinks = 0;
  let brokenOrNoHref = 0;

  for (const match of linkMatches) {
    const attrs = match[1];
    const hrefMatch = attrs.match(/\bhref=["']([^"']*)["']/i);
    const href = hrefMatch ? hrefMatch[1].trim() : '';

    if (!href || href === '#' || href.toLowerCase().startsWith('javascript:')) {
      brokenOrNoHref++;
    } else if (href.startsWith('/') || href.startsWith('#') || href.includes(domain)) {
      internalLinks++;
    } else if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) {
      externalLinks++;
      if (/\brel=["'][^"']*(?:noopener|noreferrer)[^"']*["']/i.test(attrs)) {
        secureExternalLinks++;
      }
    } else {
      internalLinks++;
    }
  }

  let linkStatus: 'good' | 'warning' | 'critical' = 'good';
  let linkFeedback = `Found ${internalLinks} internal links and ${externalLinks} external links.`;

  if (brokenOrNoHref > 3) {
    linkStatus = 'warning';
    linkFeedback = `${brokenOrNoHref} links have empty href="#" or dead triggers.`;
    issues.push({
      id: 'dead-hash-links',
      category: 'seo',
      severity: 'warning',
      title: `${brokenOrNoHref} Dead or Empty Links Detected`,
      description: 'Found links with empty href="#" or javascript triggers. Search crawlers cannot follow these links and may flag them as broken.',
      recommendation: 'Replace placeholder href="#" with valid descriptive URLs or semantic <button> elements.',
      impactScore: 5,
    });
  }

  if (externalLinks > 0 && secureExternalLinks < externalLinks) {
    const insecureExternal = externalLinks - secureExternalLinks;
    issues.push({
      id: 'missing-noopener-external-links',
      category: 'security',
      severity: 'info',
      title: `${insecureExternal} External Link(s) Missing rel="noopener"`,
      description: 'External links without rel="noopener noreferrer" can expose your site to tabnabbing vulnerabilities and performance overhead.',
      recommendation: 'Add rel="noopener noreferrer" to external outbound links.',
      codeSnippet: `<a href="https://example.com" target="_blank" rel="noopener noreferrer">Visit Site</a>`,
      impactScore: 4,
    });
  }

  // 9. Calculate SEO Score
  let score = 100;
  if (!title) score -= 25;
  else if (titleLength < 30 || titleLength > 65) score -= 10;

  if (!description) score -= 20;
  else if (descLength < 70 || descLength > 165) score -= 8;

  if (h1Tags.length === 0) score -= 20;
  else if (h1Tags.length > 1) score -= 8;

  if (!canonicalUrl) score -= 10;
  if (!ogTitle || !ogImage) score -= 10;
  if (missingAltCount > 0) score -= Math.min(15, missingAltCount * 3);
  if (!hasViewport) score -= 20;

  score = Math.max(10, Math.min(100, score));

  return {
    seo: {
      score,
      title: { content: title, length: titleLength, status: titleStatus, feedback: titleFeedback },
      description: { content: description, length: descLength, status: descStatus, feedback: descFeedback },
      headings: {
        h1Count: h1Tags.length,
        h1Tags: h1Tags.slice(0, 3),
        h2Count,
        h3Count,
        isHierarchyValid: h1Tags.length === 1,
        status: headingStatus,
        feedback: headingFeedback,
      },
      canonical: { url: canonicalUrl, status: canonicalStatus, feedback: canonicalFeedback },
      openGraph: {
        hasTitle: ogTitle,
        hasDescription: ogDesc,
        hasImage: ogImage,
        imageCount: (html.match(/property=["']og:image["']/gi) || []).length,
        status: ogStatus,
      },
      images: {
        total: imgMatches.length,
        missingAlt: missingAltCount,
        sampleMissingAlt,
        status: imgStatus,
      },
      links: {
        total: linkMatches.length,
        internal: internalLinks,
        external: externalLinks,
        secureExternal: secureExternalLinks,
        brokenOrNoHref,
        status: linkStatus,
        feedback: linkFeedback,
      },
      mobileViewport: {
        hasViewport,
        isResponsive,
        userScalableAllowed,
        status: viewportStatus,
        feedback: viewportFeedback,
      },
    },
    issues,
  };
}
