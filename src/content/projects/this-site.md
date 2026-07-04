---
title: "This Site"
slug: "this-site"
summary: "Built with Astro v5 and Tailwind v4. Pure static, zero JS by default, 95+ Lighthouse on every metric. Self-hosted fonts, image optimization, per-page OG metadata, CI gates for typecheck, link checking, and performance regression."
role: "Solo build"
tech: ["Astro", "Tailwind", "TypeScript", "GitHub Actions"]
period: "May 2026"
links:
  - label: "Source on GitHub"
    href: "https://github.com/SiamRahman29/siamrahman29.github.io"
featured: false
order: 99
---

## Stack

- Astro v5 with Content Collections for projects and writing posts
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- Self-hosted Inter + JetBrains Mono via `@fontsource-variable`
- Zero client-side JS by default. Animations are pure CSS. The only JS is Astro's prefetch and a tiny email obfuscation snippet.
- Deployed to GitHub Pages via the official `withastro/action` workflow
- CI gates: `astro check` (typecheck), `lychee` (link check), Lighthouse CI (perf/a11y/SEO ≥ 95)

## Design intent

The aesthetic is dark minimalist (Kroszborg-school): geometric sans for body, monospace for technical accents, generous whitespace, and restrained color, with a single accent for status and links on hover.

## Why this counts as a project

It's a portfolio that proves its claims by existing. Lighthouse scores, accessibility, fast loads, a sensible build pipeline. The site itself is the smallest argument I can make for engineering taste.
