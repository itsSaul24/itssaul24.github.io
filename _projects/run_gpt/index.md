---
layout: post
title: AI Running Agent
published: true
order: 0
description:
  A serverless AI-powered running coach that generates a personalized two‑month rolling training plan, adapts weekly based on performance and feedback, and answers training questions in real-time. Built on modern web + AI patterns with cost-aware rate management.
skills:
  - Next.js (React)
  - Vercel Serverless
  - PostgreSQL (Supabase)
  - NextAuth.js
  - Tailwind CSS
  - LLM Orchestration
  - Cron Jobs
main-image: /rungpt_cover.png
---

## 🚀 Overview
RunGPT is my AI running coach. It maintains a two‑month rolling training plan, updates it weekly based on your performance, and provides coaching guidance via chat. It’s optimized for free/low‑cost hosting and intelligent LLM usage.

- Two‑month forward plan with weekly cascade updates
- Chat interface for questions, plan changes, and profile updates
- Tracks assumptions vs reality (when no device data is uploaded)
- Cost-aware LLM rate management with graceful fallbacks

Live app: https://run-gpt.vercel.app

> Note: The code is private for now; work cannot be tracked on GitHub. The architecture below summarizes how it’s built.

## 🧩 How It Works (High Level)

- Weekly refresh job (Sunday 11pm) analyzes last week’s planned vs actual runs, updates the fitness profile, and regenerates the two‑month plan while preserving structure.
- Assumption vs reality handling: if device data isn’t uploaded, the system assumes planned runs were completed, then retroactively reconciles when data arrives.
- The chat endpoint bundles relevant context (profile, current plan, methodology) and calls the LLM with priority-based model selection and rate-aware fallbacks.

### Key Entities
- Users, Garmin Activities (CSV import), Run Feedback (subjective), Current Fitness Profile (calculated), Fitness Snapshots (monthly), Two‑Month Plans (rolling), Chat History, API Usage Tracking.

### API Highlights
- REST for CRUD, RPC for complex operations (chat, plan regeneration, imports)
- Stateless requests with context assembly per call
- Priority-based model selection (high → medium → small) with caching/fallbacks

### Automated Jobs
- Vercel Cron (or GitHub Actions) for weekly refresh + maintenance
- Logs metrics + failure reasons; resilient to LLM/API hiccups

## 🛠️ Tech Stack
- Frontend: Next.js (React), Tailwind CSS
- Backend/API: Next.js serverless routes on Vercel
- Database: PostgreSQL (Supabase) with RLS and migrations
- Auth: NextAuth.js (JWT sessions)
- Ops: Vercel env vars, preview deployments, basic analytics/logging

## 🎯 Why I’m Building This
I left my running coach and wanted a system that blends solid training methodology with the database + AI agent skills I developed in my first year at BNY. This is my current passion project—focused on practical, personalized coaching.

## 📈 Status
- In active development; features are rolling out iteratively
- Architecture is stable; UI/UX and methodology libraries continue to evolve
- Public live site is available; codebase is private for now

