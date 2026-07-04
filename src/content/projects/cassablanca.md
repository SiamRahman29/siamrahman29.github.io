---
title: "Cassablanca: Online Marketplace"
slug: "cassablanca"
summary: "A full-stack online marketplace built from the ground up with Django: user accounts, item listings with images and categories, keyword search with filtering, buyer–seller messaging, and a seller dashboard."
role: "Solo build"
tech: ["Python", "Django", "Tailwind CSS", "SQLite", "Pillow"]
period: "Mar 2024 – 2025"
links:
  - label: "Source"
    href: "https://github.com/SiamRahman29/OnlineMarketplace-Cassablanca"
order: 9
ogImage: "/public/og/cassablanca.png/"
---

![Cassablanca](/public/og/cassablanca.png)

## What it does

Cassablanca is a classifieds-style marketplace: users sign up, list items for sale with images, prices, and categories, browse and search what everyone else has listed, and message a seller directly to start a conversation. Sellers get a dashboard to manage their own listings in one place, and each listing surfaces related items from the same category.

It's a complete transactional product, with accounts, listings, search, and messaging, rather than a single-feature demo.

## How it's built

The interesting decision here was **app decomposition**. Rather than one sprawling Django app, I split the project into focused ones, each owning a slice of the domain:

- **`core`:** authentication and landing/contact pages.
- **`item`:** listings, categories, keyword search, and filtering.
- **`dashboard`:** a seller's view of their own items.
- **`conversation`:** the buyer-seller messaging inbox.

Django 5 handles the application and admin layers, Django templates plus Tailwind CSS give a responsive UI, Pillow handles image uploads, and SQLite handles storage, which is zero-ops persistence that's more than enough for the dataset size. Secrets stay out of the repo via `python-dotenv`.

## Why it matters

Search and messaging are the two features that separate a marketplace from a list of things. Search means a real query path over listings, with keyword matching across name and description, narrowed by category. Messaging means modeling conversations and inboxes between two users, not just a contact form. Wiring both into a clean multi-app Django structure is the exercise: the boundaries between `item`, `conversation`, and `dashboard` are where the design actually lives.
