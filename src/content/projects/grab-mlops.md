---
title: "MLOps Platform Work at Grab"
slug: "grab-mlops"
summary: "Fixed a critical MLflow access control bug, deployed OIDC-based auth with LDAP group access, and built endpoints for a central API gateway serving 100+ data scientists."
role: "Full Stack Engineer, Internship · MyTeksi Sdn Bhd (Grab)"
tech: ["Go", "Python", "Kubernetes", "AWS", "MLflow", "OIDC", "LDAP"]
period: "Aug 2024 – Feb 2025"
featured: true
order: 2
ogImage: "/og/grab-mlops.jpg"
---

![What's Grab without a Car](/og/grab-mlops.jpg)

I completed a six-month long internship at Grab Holdings Inc. in Malaysia during my final year of university. I was a full stack engineering intern at Grab's data technology team. This team was eventually reorganized into Grab's AI Core team. I worked alongside very talented ML and AI engineers during my internship. Our goal was to build, maintain and improve all tech infrastructure used by our AI/data teams. 

## What I worked on

Grab's AI Infrastructure team supports 100+ data scientists across the company. During my internship, I worked on three key projects.

### Fixing MLflow's Auth Integration and Implementing OIDC + LDAP Based Auth

A bug in MLflow's access control was preventing password synchronization with the central identity management system. The practical effect: every day, 10+ data scientists and engineers needed manual password resets to access experiment tracking. Multiply that by a year and you'll see it was taking days out of our on-call engineers' lives.

I traced it through the auth handler, identified the synchronization gap, and shipped a fix that eliminated the daily reset entirely. 

After that, I implemented an OIDC and LDAP group based authentication on MLFlow to integrate MLFlow with our central auth service. I had to create a MLFlow plugin to add on top of our MLFlow instance. After the implementation, users were able to allocate user permissions based on LDAP groups instead of having to change permissions one user at a time. Experiment tracking and downstream service integrations both got cleaner. This plugin also readied MLFlow for a future plan of creating a central auth gateway for all AI/data services.  

### Central API Gateway and Feature-Serving Endpoints

My team built a gateway that consolidates ML pipeline data access behind a single boundary. We also built a Feature-Serving tool to deliver refreshed data to production ML pipelines. On both projects, I used GoLang and the Echo framework to build endpoints for various tasks.

### Airflow Documentation

We built many custom Airflow classes and services to integrate Apache Airflow with various services and tools we built in-house. I documented all these classes for all of Grab's data scientists to use as reference.
