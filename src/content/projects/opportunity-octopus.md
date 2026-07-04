---
title: "Opportunity Octopus"
slug: "opportunity-octopus"
summary: "A full-stack web application centralizing curated opportunities for students and early-career professionals. Built with Django and Tailwind, containerized with Docker, deployed to AWS EC2."
role: "Solo build"
tech: ["Python", "Django", "Tailwind CSS", "SQLite", "Docker", "AWS"]
period: "Apr 2024 – Jun 2024"
featured: true
order: 4
ogImage: "/og/opportunity-octopus.png"
---

![Opportunity Octopus](/public/og/opportunity-octopus.png)

## What it does

Opportunity Octopus centralizes opportunities (internships, scholarships, programs, competitions) that are otherwise scattered across dozens of sources. The UI is dynamic enough to browse and filter the catalog without round-tripping for every interaction. The target audience is students and early-career professionals who don't have time to scrape ten different sites every week.

## How it's built

- **Django** for the application and admin layer.
- **Tailwind CSS** for styling. I built this before Tailwind v4, so the original setup uses the PostCSS plugin.
- **SQLite** for storage. The dataset isn't large enough to need anything heavier, and SQLite means zero ops cost.
- **Docker** to make the deployment reproducible.
- **AWS EC2** as the host.

## Why I built it

I noticed I was personally losing opportunities to "I forgot to check that site this month." If I was losing them, my classmates were too. So I built it.

The full-stack range here is the point: data model, admin UX, server-side rendering, styling, container build, cloud deploy. It's end-to-end ownership of a small product, which is the muscle that matters for whatever you build next.
