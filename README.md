# SpudBros Feedback

A customer feedback system built for SpudBros Express — a fast-food chain serving loaded baked potatoes across the UK.

This started as a simple need: we wanted to know what customers actually thought, right after they ate. No surveys sent days later, no incentivised reviews. Just a QR code on the table, a quick rating, and an optional note.

---

## The Problem

Hospitality feedback is broken. Review platforms are gamed. Paper comment cards go unread. And by the time an owner hears about a bad experience, it's too late to do anything about it.

SpudBros needed a way to capture feedback at the moment it happens — location-specific, frictionless, and actionable. The result lands directly in the owner's inbox within seconds of submission.

---

## What It Does (Right Now)

- Customers scan a QR code at their table
- They're asked "How was your spud?" and tap a reaction
- If they loved it: quick star rating and done
- If something was off: a short form to explain what happened
- Owner gets an email notification instantly with the rating, location, and feedback
- All submissions stored in Supabase

That's it. Simple, because it needs to work for every customer regardless of tech comfort level.

---

## Live Locations

The system is currently running at two SpudBros Express sites:

| Location | QR Entry Point |
|----------|----------------|
| SpudBros Liverpool | `kombaq.com/spudbrosexpressliverpool` |
| SpudBros London | `kombaq.com/spudbrosexpresslondon` |

Both locations have physical QR codes placed at the point of sale. Scanning logs the visit and routes the customer to their location-specific feedback page.

---

## Tech Stack

This is an early MVP. The stack reflects that — chosen for speed, not scale.

- **Node.js + Express** — server and routing
- **Supabase** — PostgreSQL database for feedback and scan logs
- **Resend** — transactional email for owner notifications
- **Vanilla HTML/CSS/JS** — no frontend framework; keeps it fast and simple
- **qrcode** — generates PNG QR codes for printing

No auth, no dashboard, no multi-tenancy yet. Just a working feedback loop.

---

## Roadmap

This is where we're going. In rough priority order:

### 1. Supabase Auth
Lock down the admin side. Right now there's no login — fixing that is the foundation everything else builds on.

### 2. Multi-Tenant Data Model
Restructure the database so the system can serve multiple restaurant brands, not just SpudBros. Each brand gets their own isolated data.

### 3. Dynamic Page Generation
Replace the hand-coded HTML pages per location with server-rendered pages generated from the database. Adding a new location should take 30 seconds, not 30 minutes.

### 4. Location Management UI + QR Generation
A simple admin interface to create and manage locations, with one-click QR code generation and download. No code changes needed to onboard a new site.

### 5. Analytics Dashboard
Aggregate feedback by location, time period, and rating. Surface trends so owners can act on patterns, not just individual submissions.

### 6. Stripe Billing — £15/location/month
The commercial model. Each location is billed monthly. Simple pricing, no annual contracts, cancel anytime. At this price point it pays for itself if it saves one bad review from going public.

---

## Running Locally

```bash
npm install
```

Create a `.env` file with:

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
NOTIFICATION_EMAIL=where_you_want_alerts
FROM_EMAIL=your_verified_sender
PORT=3000
```

```bash
npm start
```

To regenerate QR codes:

```bash
npm run generate-qr
```

---

## Status

Early MVP. Live with real customers. Not pretty under the hood, but it works and it's shipping feedback to the inbox daily.

Built by [Nikolai](https://github.com/NikolaiRegehr).
