---
title: "Resume Buddy"
slug: "resume-buddy"
summary: "A Claude Code plugin that turns resume editing into a conversation. It bundles a local LaTeX MCP server so the AI can create, edit, validate, and compile your resume as a real .tex file, no LaTeX knowledge required."
role: "Solo build"
tech: ["Claude Code Plugin", "MCP", "Python", "LaTeX", "uv"]
period: "Jun 2026"
links:
  - label: "Source"
    href: "https://github.com/SiamRahman29/resume-buddy"
order: 3
---

## What it does

Resume Buddy makes editing a LaTeX resume feel like talking to someone who happens to be excellent at LaTeX. You bring your resume (or start from a template) and say what you want, like *"add my new job at Acme," "tighten the summary," "tailor this for a senior backend role,"* and it edits the underlying `.tex` and hands back a recompiled PDF.

The point is that you never touch LaTeX. You get LaTeX-quality typesetting with a conversational interface over the top.

## How it's built

It's packaged as a **Claude Code plugin** with two moving parts:

- **A bundled local LaTeX MCP server** that gives the AI real tools (create, edit, validate, and compile `.tex` files) instead of guessing at markup. Compilation runs against any distribution with `pdflatex` on the path (TinyTeX, MiKTeX, MacTeX, TeX Live).
- **Skills that drive the workflow end to end:** init a starter resume, import an existing one, tailor to a job description, and build the PDF.

Install is two commands inside Claude Code (`/plugin marketplace add`, `/plugin install`) once `uv` and a LaTeX engine are present.

## The opinionated part

It isn't a blank LaTeX editor. The plugin bakes in resume principles distilled from the **Dartmouth College CPD Resume Guide** and techniques from career coach [@jerryjhlee](https://www.instagram.com/jerryjhlee), so the AI isn't just formatting text. It nudges toward resumes that actually read well to recruiters.

## Why I built it

LaTeX produces the best-looking resumes and is the most annoying way to iterate on one. The bottleneck is never the typesetting engine, it's the edit-compile-eyeball loop and remembering the syntax. Giving an AI genuine LaTeX tooling (not just a text box) plus a point of view on what makes a resume good removes both frustrations at once.
