# Development Guide

## Getting started

```bash
npm install
npm run dev      # http://localhost:4321
npm run check    # typecheck
npm run build    # outputs to /dist
npm run preview  # preview built site
```

## Project structure

```
src/
  components/   # Astro components (Hero, Header, ProjectCard, etc.)
  content/      # Markdown content (projects, writing)
    projects/   # One markdown file per project
    writing/    # One markdown file per blog post
  layouts/      # Page layouts (BaseLayout, ProjectLayout, WritingLayout)
  pages/        # Route pages (Astro file-based routing)
  styles/       # Global CSS (theme tokens, prose styles)
  config.ts     # Site config, nav, experience data
  content.config.ts  # Content collection schemas (Zod)
public/         # Static assets (favicon, resume PDF, OG images)
```

## Writing a new post

1. Create `src/content/writing/your-slug.md`.
2. Frontmatter:
   ```yaml
   ---
   title: "Post title"
   summary: "One-line summary that shows in the index and OG card."
   date: 2026-05-20
   draft: false        # set to true to hide from production
   tags: ["tag1"]
   ogImage: "/og/your-slug.png"   # 1200x630 PNG in /public/og/
   ---
   ```
3. Body in markdown.

## Adding a project

Same shape, in `src/content/projects/your-slug.md`. See the existing files for the full schema.

## Deploy

Pushes to `main` trigger `.github/workflows/deploy.yml`:

1. `astro check` (typecheck)
2. `astro build`
3. `lychee` link check on `/dist`
4. Lighthouse CI (perf, a11y, best-practices, SEO ≥ 95)
5. Deploy to GitHub Pages

## Pre-launch checklist

- [ ] Rename the GitHub repo from `dev-portfolio` to `siamrahman29.github.io`
- [ ] In repo Settings → Pages, set source to "GitHub Actions"
- [ ] Update `bookingUrl` in `src/config.ts` with your actual Cal.com link
- [ ] Design OG images (1200x630 PNG) for each project + the site default. Save to `/public/og/`
      - `/public/og/default.png` (site-wide fallback)
      - `/public/og/askturing-reliability.png`
      - `/public/og/grab-mlops.png`
      - `/public/og/july-revolution.png`
      - `/public/og/opportunity-octopus.png`
      - `/public/og/writing-dramatiq-reliability.png` (when ready to publish)
- [ ] Replace `src/content/writing/askturing-dramatiq-reliability.md` with the finished post, then set `draft: false`
- [ ] Export July Revolution slides to PDF, save to `/public/projects/july-revolution-slides.pdf`
- [ ] Verify all external links work (`npm run build` then visit a few)
