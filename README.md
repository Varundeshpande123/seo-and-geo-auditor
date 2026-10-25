# SEO & GEO Auditor (Edge 2.0)

> Next-Generation Web Audit Platform for Google SEO and Generative AI Search Engines (ChatGPT, Perplexity, Gemini, Claude).

[![Build and Verify CI](https://github.com/Varundeshpande123/seo-and-geo-auditor/actions/workflows/deploy.yml/badge.svg)](https://github.com/Varundeshpande123/seo-and-geo-auditor/actions/workflows/deploy.yml)

## 🌟 Overview
Built for **somashekhar.in** and deployable on **Cloudflare Pages & Workers**.

Unlike legacy SEO checkers that only test standard HTML meta tags, this tool introduces **GEO (Generative Engine Optimization)**:
1. **AI Crawler Readiness:** Checks `robots.txt` access for `GPTBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended`, `Bytespider`.
2. **Knowledge Graph Entities:** Validates Schema.org JSON-LD structured data.
3. **Citation Extractability:** Analyzes conversational Q&A heading formats and direct summary blocks.
4. **Google SEO & Core Web Vitals:** On-page structure, canonicals, image alt tags, TTFB, and speed.

---

## 🚀 Live Subdomain Setup on Cloudflare
1. Open [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**
3. Select repo: `Varundeshpande123/seo-and-geo-auditor`
4. Build Settings:
   - **Framework:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Click **Save and Deploy**.
6. Under **Custom domains**, click **Set up a custom domain** and enter:
   `seo.somashekhar.in`

---

## 🛠️ Local Development
```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173).
