---
title: "RAG Ingestion Reliability at AskTuring"
slug: "askturing-reliability"
summary: "Redesigned a production RAG file ingestion pipeline from 70% to 99.95%+ success rate using Dramatiq-based distributed workflows with retries and reconciler workers."
role: "Full Stack Engineer · AskTuring.ai"
tech: ["Python", "Dramatiq", "Azure", "Docker", "LangChain", "CrewAI", "LGTM Stack"]
period: "Feb 2025 – May 2026"
featured: true
order: 1
ogImage: "/og/askturing-reliability.jpg"
---

![Hero image](/og/askturing-reliability.jpg)

AskTuring AI is a RAG based AI application. We enabled users to create knowledge bases. Users can upload files and images to this knowledge, which we would ingest for our RAG pipeline. This, in turn, allowed users to chat with their whole knowledge base at once.

## The problem

The platform's file upload and ingestion path sat at roughly 70% success. For various reasons, we were getting upload and ingestion failures. Each failure mode looked different, which made the root cause feel diffuse. It wasn't. It was a system that treated transient failures as terminal ones, with no retry boundary and no way to reconcile partial state.

## What I changed

The redesign pulled three levers at the same time.

**Code Modularization.** 

The upload router was a disorganized monolithic file. I started by breaking the whole route into services making the code readable. Then I added logging and optimized file batching. 

**Distributed workflows via Dramatiq** 

I broke down the whole ingestion process into a sequence of independently retryable tasks: save, convert, dispatch, parse, receive JSON chunk, embed, persist. After my changes, the flow looked like this:

1. User uploads a file
2. Save to S3 and update the database with file records
3. Create a Dramatiq task ID and enqueue it in Redis
4. Dispatch worker picks up the task and converts the file to PDF if needed
5. File is dispatched to the parser on a GPU server
6. Parser calls back to a callback endpoint with parsed JSON
7. Text content is extracted from the JSON and sent for embedding generation
8. Embeddings are saved in the vector store

**Reconciler Workers** 

I also created a reconciler that periodically checked for orphaned files and tasks to retry. Every part of the flow included multiple retries to make the whole process much more robust.

**An OCR Parser** 

Previously, we depended solely on a parser that extracted text from PDFs. We struggled with complex layouts, especially image heavy PDFs. I tested various OCR parsers and integrated the docling parser from IBM.

**Memory Optimization and Layered Fallback** 

Under heavy loads, our parser would often consume all of the GPU's memory. To solve this problem, I enforced aggressive garbage collection, memory monitoring and pipeline optimization, and layered fallbacks (if the server was nearing heavy memory consumption, we would fallback to lower pipeline specs). 

## The result

Success rate moved from ~70% to 99.95%+. Customer complaints about "missing files" dropped to near-zero. Fault tolerance became a property of the system, not an aspiration.

## What I'd do differently

Our file conversion was done by a self-hosted Gotenberg instance. This instance was error-prone that opened us up to failures when working with a lot of non-pdf files at once. I would avoid this Gotenberg issue and try using Python based document loaders. 
