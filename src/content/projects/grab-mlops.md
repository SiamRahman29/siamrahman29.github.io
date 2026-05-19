---
title: "MLOps Platform Work at Grab"
slug: "grab-mlops"
summary: "Fixed a critical MLflow access control bug, deployed OIDC-based auth with LDAP group access, and built a central API gateway serving 100+ data scientists."
role: "Full Stack Engineer, Internship · MyTeksi Sdn Bhd (Grab)"
tech: ["Go", "Python", "Kubernetes", "AWS", "MLflow", "OIDC", "LDAP"]
period: "Aug 2024 – Feb 2025"
featured: true
order: 2
ogImage: "/og/grab-mlops.png"
---

## What I worked on

Grab's AI Infrastructure team supports 100+ data scientists across the company. The internship spanned three pieces of work, all in service of making that platform easier to use and harder to break.

### Fixing MLflow's auth integration

A bug in MLflow's access control was preventing password synchronization with the central identity management system. The practical effect: every day, 150+ data scientists and engineers needed manual password resets to access experiment tracking. Multiply that by a year and the lost engineering time becomes a real number.

I traced it through the auth handler, identified the synchronization gap, and shipped a fix that eliminated the daily reset entirely. Productivity win that nobody had to talk about, which is the best kind.

### OIDC + LDAP for MLflow

Replaced ad-hoc credential management with proper OIDC authentication backed by LDAP group-based access control. Teams get access by being in the right LDAP group; permissions follow employees through team moves automatically. Experiment tracking and downstream service integrations both got cleaner.

### Central API gateway and feature-serving endpoints

Built a gateway that consolidates ML pipeline data access behind a single boundary, plus feature-serving endpoints that deliver refreshed data to production ML pipelines. The gateway pattern meant adding new data sources stopped requiring custom integration work for every team.

## Why it mattered

The work was platform engineering in the boring, important sense: nobody outside the AI Infrastructure team knew the names of the systems, but everyone outside the team noticed when they worked. The MLflow fix in particular was the kind of thing that would be invisible if you hadn't seen the "anyone able to log into MLflow?" Slack messages every morning.
