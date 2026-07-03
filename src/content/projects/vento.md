---
title: "Vento — Inventory & Manufacturing System"
slug: "vento"
summary: "A full-stack inventory and manufacturing system: raw materials, products with recipes, manufacturing runs with history, and a role-aware admin panel. FastAPI + PostgreSQL backend, React + TypeScript frontend."
role: "Solo build"
tech: ["Python", "FastAPI", "PostgreSQL", "Alembic", "React", "TypeScript", "Tailwind CSS", "Docker"]
period: "May 2026 – Present"
links:
  - label: "Backend source"
    href: "https://github.com/SiamRahman29/vento-backend"
  - label: "Frontend source"
    href: "https://github.com/SiamRahman29/vento-frontend"
featured: true
order: 5
---

## What it does

Vento tracks the full path from raw materials to finished goods. You register raw materials, define products as recipes over those materials, run manufacturing jobs that consume inventory, and review the history of every run. It's the kind of small-manufacturing back office that usually lives in a spreadsheet until the spreadsheet becomes the bottleneck.

The whole thing is **role-aware**: viewers read, managers write and manufacture, admins delete and manage users. Signup is invite-gated — invites only come from an admin — so there's no open registration to lock down after the fact.

## How it's built

**Backend — FastAPI + PostgreSQL.** Async Postgres via psycopg, migrations with Alembic, and PostgreSQL runs in Docker Compose while the app runs locally against it. Bootstrapping is handled through CLI scripts (`create_admin`, `promote_admin`) so a fresh database can mint its first admin without a chicken-and-egg invite problem.

**Frontend — Vite + React + TypeScript.** It covers the entire backend surface: auth, raw materials, products and recipes, manufacturing with run history, profile, and an admin panel for invites, users, and roles. Tailwind CSS v4 with the design palette expressed as `@theme` tokens.

## Details worth calling out

- **Decimals stay strings end-to-end.** Quantities map to the backend's `Numeric(12,3)` and are kept as strings through the whole client, formatted only for display, to avoid floating-point drift on inventory weights.
- **Items track by units, weight, or both**, and the forms adapt to whichever scale an item uses.
- **Recipes are set at registration** and read-only afterward, matching the backend's update semantics rather than pretending the UI can do more than the API allows.
- Component tests with Vitest + Testing Library on the frontend.

## Why I built it

I wanted a complete, honest full-stack system rather than a toy CRUD app: a real permission model, real migrations, real bootstrapping, and a data model with enough shape (recipes, runs, scales) that the design decisions actually matter. End-to-end ownership from the Postgres schema to the role-gated button — the muscle that transfers to whatever ships next.
