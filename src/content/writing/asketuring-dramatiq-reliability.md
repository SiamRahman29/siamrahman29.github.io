---
title: "How we hit 99.95% reliability on RAG ingestion with Dramatiq"
summary: "The architecture, the reconciler pattern, and the unglamorous work that turns 99% into 99.95%."
date: 2026-05-20
draft: true
tags: ["rag", "reliability", "dramatiq", "ai-infrastructure"]
ogImage: "/og/writing-dramatiq-reliability.png"
---

> Draft. The full post is in progress.

## What we started with

Our chatbot's file upload and ingestion path was sitting at roughly 70% success. The failure modes looked different from each other, which made the root cause feel diffuse. It wasn't.

It was a system that treated transient failures as terminal ones, with no retry boundary and no way to reconcile partial state. An embedding API timeout on chunk 4 of 12 left the whole document in an unrecoverable in-between, and we had no way to find or advance those documents after the fact.

## The three changes that mattered

1. **Distributed workflows via Dramatiq.** Each ingestion step (fetch, parse, chunk, embed, persist) became an independently retryable task with its own failure semantics. A transient embedding-API timeout no longer kills the whole upload.
2. **Reconciler workers.** A background process scans for jobs in inconsistent states and either advances them or marks them for manual review. This is the boring piece that turns 99% into 99.95%.
3. **Observability before optimization.** Structured logs and metrics on every stage, so we could see exactly which step was failing and why before changing any code.

## What the reconciler actually does

[TODO: pseudocode showing the reconciler scan loop, the state transitions it can perform, and the "give up and escalate" exit.]

## What I'd do differently

The reconciler pattern accreted complexity faster than I expected. If I were starting over I'd reach for a real workflow orchestration library (Temporal, Restate) earlier. Dramatiq is excellent for what it is, but at the point where you're writing reconcilers on top of a task queue, you're rebuilding workflow primitives.

## Numbers that moved

| Metric | Before | After |
|---|---|---|
| Ingestion success rate | ~70% | 99.95%+ |
| Customer "missing file" complaints | several per week | near-zero |
| Mean time to detect ingestion failure | hours | seconds |

[TODO: chart of weekly success rate over time]
