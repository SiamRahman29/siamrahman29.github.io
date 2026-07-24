---
title: "RICO: Voice-Controlled Assistant"
slug: "rico"
summary: "A voice-controlled desktop assistant (Rather Intelligent Conversational Operator) that opens apps, fetches news, weather, and trending movies, plays YouTube videos, sends WhatsApp messages and emails, and searches Google and Wikipedia, all by voice."
role: "Solo build"
tech: ["Python", "Speech Recognition", "Text-to-Speech", "Web APIs", "Automation"]
period: "Jul 2023 – Sep 2025"
links:
  - label: "Source"
    href: "https://github.com/SiamRahman29/Rico"
order: 90
---

## What it does

RICO is a hands-free desktop operator. You talk, it acts. The command set spans three categories:

- **Launch things:** notes, Discord, calculator, VS Code, the command prompt.
- **Fetch things:** latest news headlines, weather forecasts, trending movies, plus random jokes and advice.
- **Do things:** find and play YouTube videos, search Google and Wikipedia, send WhatsApp messages, and send emails.

## How it's built

It's a Python assistant wiring speech-to-text and text-to-speech around a command router. Recognized speech is parsed into an intent, dispatched to the matching handler, and the result is spoken back. Each capability is its own integration: OS-level app launching, third-party web APIs for news, weather and movies, browser automation for YouTube and search, and messaging and email APIs for the outbound actions.

The project also grew a companion CLI (RICA-CLI) that explores the same command surface without the voice layer.

## Why I built it

RICO is a classic "make the computer feel like it's mine" project. The fun is in how many different worlds a single voice command has to reach through. Opening VS Code, scraping a weather forecast, and sending a WhatsApp message are three completely different integration problems hiding behind three nearly identical spoken sentences. Building it meant learning where each of those seams is, and how to make one intent-routing layer sit cleanly on top of all of them.
