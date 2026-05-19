---
title: "RAG Ingestion Reliability at AskTuring"
slug: "asketuring-reliability"
summary: "Redesigned a production RAG file ingestion pipeline from 70% to 99.95%+ success rate using Dramatiq-based distributed workflows with retries and reconciler workers."
role: "Full Stack Engineer · AskTuring.ai"
tech: ["Python", "Dramatiq", "Azure", "Docker", "LangChain", "CrewAI", "LGTM Stack"]
period: "Feb 2025 – Present"
featured: true
order: 1
ogImage: "/og/asketuring-reliability.png"
---

## The problem

The chatbot's file upload and ingestion path sat at roughly 70% success. Customer complaints were the kind that erode trust fastest: "I uploaded this file and the assistant doesn't know about it." Each failure mode looked different, which made the root cause feel diffuse. It wasn't. It was a system that treated transient failures as terminal ones, with no retry boundary and no way to reconcile partial state.

## What I changed

The redesign pulled three levers at the same time.

**Distributed workflows via Dramatiq.** Ingestion became a sequence of independently retryable tasks: fetch, parse, chunk, embed, persist. Each step has its own failure semantics. A transient embedding API timeout no longer kills the whole upload.

**Reconciler workers.** A background process periodically scans for ingestion jobs in inconsistent states (parsed but not embedded, embedded but not persisted) and either advances them or marks them for manual review. This is the unglamorous piece that turns 99% into 99.95%.

**Observability before optimization.** Before tuning anything, I instrumented every stage with structured logs and metrics so we could see exactly which step was failing and why. The LGTM stack (covered separately) made this cheap.

## The result

Success rate moved from ~70% to 99.95%+. Customer complaints about "missing files" dropped to near-zero. Fault tolerance is now a property of the system, not an aspiration.

## What I'd do differently

The reconciler logic accreted complexity faster than I expected. If I were starting over I'd reach for a workflow orchestration library (Temporal, Restate) earlier rather than building reconciler patterns on top of a task queue. Dramatiq is excellent for what it is, but at the point where you're writing reconciler workers, you're rebuilding workflow primitives.
