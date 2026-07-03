---
title: "fast-experiment — Kaggle Tabular Toolkit"
slug: "fast-experiment"
summary: "A GPU-first Python package for fast Kaggle tabular experimentation. Every model emits the same OOFResult artifact, which makes stacking, hill climbing, and pseudo-labeling backend- and model-agnostic array math."
role: "Solo build"
tech: ["Python", "RAPIDS (cuDF/cuML)", "XGBoost", "LightGBM", "CatBoost", "Optuna"]
period: "May 2026"
links:
  - label: "Source"
    href: "https://github.com/SiamRahman29/fast-experiment"
order: 7
---

## The core idea

Kaggle tabular work is the same loop every time: load, EDA, feature engineering, baselines, ensembling, pseudo-labeling. `fast-experiment` collapses that loop into a handful of calls — but the real design decision is the contract underneath it.

**Every model emits the same artifact: an `OOFResult`** (out-of-fold predictions plus test predictions). Once everything speaks that one language, stacking, hill climbing, and pseudo-labeling stop caring what produced the numbers. They become plain array math over a shared interface. Add a new estimator and the entire ensembling stack works with it for free.

## What's inside

- **`data` / `eda`** — cuDF-aware loading with memory reduction, plus `leakage_report`, `adversarial_validation`, and PSI drift checks.
- **`features`** — out-of-fold `TargetEncoder` (leak-free by construction), count and label encoders.
- **`estimators` / `baselines`** — one `GBDTEstimator` wrapping XGBoost, LightGBM, and CatBoost with `device="auto"`; `run_baselines` sweeps them in a single call.
- **`ensemble`** — Caruana greedy `hill_climb` and a cuML/sklearn `stack` meta-learner.
- **`tuning` / `pseudo`** — Optuna search that refits into an `OOFResult`, and an iterative confident-pseudo-label loop.

## GPU-first, CPU-safe

RAPIDS (cuDF/cuML/cuPy) is used automatically when a GPU is present and falls back to CPU when it isn't — the *same code* runs on a laptop and on a Kaggle GPU kernel. No branching in user code, no separate paths to maintain.

## Why I built it

Competition iteration speed is mostly a function of how little friction sits between "I have an idea" and "I have an out-of-fold score for it." A single artifact contract plus automatic GPU acceleration removes most of that friction. It's pre-1.0 and tabular-only for now; deep-learning estimators are planned behind the same `OOFResult` contract, which is the whole point — the interface was designed to absorb them without touching the ensembling code.
