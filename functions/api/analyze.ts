import { analyzeSeo } from '../services/seoEngine';
import { analyzeGeo } from '../services/geoEngine';
import { analyzeSpeed } from '../services/speedEngine';
import { analyzeInsiderMetrics } from '../services/insiderEngine';
import type { FullAuditResult } from '../types/audit';

export async function onRequest(context: any): Promise<Response> {
  const { request, env } = context;

  // Handle CORS Preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  const url = new URL(request.url);
  let targetUrlParam = url.searchParams.get('url');

  if (!targetUrlParam && request.method === 'POST') {
    try {
      const body = await request.json();
      targetUrlParam = body.url;
    } catch {
      // Ignored
    }
  }

  if (!targetUrlParam) {
    return new Response(
      JSON.stringify({ error: 'Missing "url" query parameter or JSON body property' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    );
  }

  // Normalize URL
  let targetUrl = targetUrlParam.trim();
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = 'https://' + targetUrl;
  }

  let domain = '';
  try {
    const parsed = new URL(targetUrl);
    domain = parsed.hostname;
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid URL provided. Please enter a valid web address.' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    );
  }

  try {
    const startTime = Date.now();

    // 1. Fetch Target Webpage HTML
    const pageResponse = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Googlebot/2.1 (+http://www.google.com/bot.html)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    });

    if (!pageResponse.ok) {
      return new Response(
        JSON.stringify({
          error: `Could not fetch website (Status code: ${pageResponse.status} ${pageResponse.statusText}). Make sure the URL is publicly reachable.`,
        }),
        {
          status: 502,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        }
      );
    }

    const html = await pageResponse.text();

    // 2. Fetch Robots.txt, llms.txt, and client bundle in parallel for GEO checks
    let robotsTxt = '';
    let llmsTxt = '';
    let jsBundle = '';
    const originUrl = new URL(targetUrl).origin;

    const scriptMatch = html.match(/<script[^>]+src=["'](\/assets\/index-[^"']+\.js|[^\s"']+\/index-[^"']+\.js)["']/i);
    const bundleUrl = scriptMatch ? `${originUrl}${scriptMatch[1].startsWith('/') ? '' : '/'}${scriptMatch[1]}` : null;

    await Promise.allSettled([
      (async () => {
        try {
          const robotsRes = await fetch(`${originUrl}/robots.txt`, {
            headers: { 'User-Agent': 'Mozilla/5.0 SEO-GEO-Auditor' },
          });
          if (robotsRes.ok) {
            robotsTxt = await robotsRes.text();
          }
        } catch {}
      })(),
      (async () => {
        try {
          const llmsRes = await fetch(`${originUrl}/llms.txt`, {
            headers: { 'User-Agent': 'Mozilla/5.0 SEO-GEO-Auditor' },
          });
          if (llmsRes.ok) {
            llmsTxt = await llmsRes.text();
          }
        } catch {}
      })(),
      (async () => {
        if (!bundleUrl) return;
        try {
          const bundleRes = await fetch(bundleUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 SEO-GEO-Auditor' },
          });
          if (bundleRes.ok) {
            jsBundle = await bundleRes.text();
          }
        } catch {}
      })(),
    ]);

    // Extract response headers
    const headersMap: Record<string, string> = {};
    pageResponse.headers.forEach((val: string, key: string) => {
      headersMap[key] = val;
    });

    // 3. Run Analysis Engines in Parallel
    const seoResult = analyzeSeo(html, targetUrl, robotsTxt);
    const geoResult = analyzeGeo({ html, robotsTxt, llmsTxt, jsBundle, targetUrl });
    const speedResult = await analyzeSpeed(targetUrl, startTime, html.length, env?.GOOGLE_PAGESPEED_API_KEY);
    const insiderResult = analyzeInsiderMetrics({ html, targetUrl, responseHeaders: headersMap });

    // 4. Calculate Master Overall Score & Grade
    const allIssues = [
      ...seoResult.issues,
      ...geoResult.issues,
      ...speedResult.issues,
      ...insiderResult.issues,
    ].sort((a, b) => b.impactScore - a.impactScore);

    // Weighted average: 30% SEO, 30% GEO, 20% Performance, 20% Insider
    const overallScore = Math.round(
      seoResult.seo.score * 0.30 +
      geoResult.geo.score * 0.30 +
      speedResult.performance.score * 0.20 +
      insiderResult.insider.score * 0.20
    );

    let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'C';
    if (overallScore >= 95) grade = 'A+';
    else if (overallScore >= 85) grade = 'A';
    else if (overallScore >= 75) grade = 'B';
    else if (overallScore >= 60) grade = 'C';
    else if (overallScore >= 45) grade = 'D';
    else grade = 'F';

    const fullResult: FullAuditResult = {
      url: targetUrl,
      domain,
      timestamp: new Date().toISOString(),
      overallScore,
      grade,
      seo: seoResult.seo,
      geo: geoResult.geo,
      performance: speedResult.performance,
      insider: insiderResult.insider,
      issues: allIssues,
    };

    return new Response(JSON.stringify(fullResult), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=60', // Edge caching for 1 min
      },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: `Failed to analyze site: ${err.message || 'Unknown network error'}`,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    );
  }
}
