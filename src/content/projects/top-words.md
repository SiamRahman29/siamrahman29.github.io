---
title: "Top Words: Trending Bengali Language Analysis"
slug: "top-words"
summary: "A full-stack system that extracts and ranks trending Bengali words and phrases from news and social media using N-gram frequency, TF-IDF, and a multi-factor scoring algorithm. Built in collaboration with the International Mother Language Institute and BARTA lab."
role: "Full-stack build · International Mother Language Institute + BARTA lab collaboration"
tech: ["Python", "FastAPI", "SQLAlchemy", "Alembic", "NLP", "React", "Material UI"]
period: "Aug 2025 – Nov 2025"
links:
  - label: "Live demo"
    href: "https://top-words-frontend-production-64d2.up.railway.app/"
  - label: "Frontend source"
    href: "https://github.com/SiamRahman29/Top-Words-Frontend"
  - label: "Backend source"
    href: "https://github.com/SiamRahman29/Top-Words-Backend"
featured: true
order: 6
ogImage: "/og/top-words-home.png"
---

![Top Words Dashboard](/og/top-words-home.png)

## What it does

Top Words answers the question: *what words are trending in Bengali right now?* It scrapes Bengali news and social sources, runs them through a Bengali-aware NLP pipeline, and surfaces trending single words and multi-word phrases, date by date, so you can explore how language shifts over time.

I built it in collaboration with the **International Mother Language Institute (IMLI)** and the **BARTA lab**, which is what pushed it from a scraping toy toward something that has to be correct for a language most off-the-shelf NLP tooling treats as an afterthought. It is currently being used by the **International Mother Language Institute**. 

![Top Words Trending Page](/og/trending-words.png)

## How it works

**Multi-source ingestion.** Bengali news via RSS and NewsData.io, plus Selenium-based social scraping (gated off by default for safety, so it degrades to info messages rather than errors when disabled).

**Bengali NLP.** Cleaning, tokenization, and stop-word removal tuned for Bengali, supporting both single words and phrases.

**Trend detection.** N-gram frequency and TF-IDF feed a multi-factor scoring algorithm that ranks candidates, with an LLM step (via Groq) for AI-assisted candidate generation. Results are stored date-wise so historical trends are first-class, not an afterthought.

**API-first.** A FastAPI and SQLAlchemy backend with Alembic migrations exposes REST endpoints (`generate_candidates`, `trending-phrases`, word-of-the-day), consumed by a responsive React and Material UI frontend with Bengali-friendly typography.

## Why it's interesting

Most trending-word systems assume English. Bengali morphology, tokenization, and the scarcity of clean sources make the same problem meaningfully harder, and doing it *for* the institute chartered to steward the language raised the bar on getting the linguistics right rather than just shipping a word cloud. The result is a genuinely full-stack system: scraping, NLP, scoring, storage, API, and a real UI on top.

![Top Words Generate Words Page](/og/generate-words.png)