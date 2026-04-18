# SalesCRM Dashboard

A production-quality Sales CRM built with **Next.js 14**, **Supabase**, **TailwindCSS**, and **Recharts**.

![Stack](https://img.shields.io/badge/Next.js-14-black) ![Stack](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ecf8e) ![Stack](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8) ![Stack](https://img.shields.io/badge/Recharts-2.15-8884d8)

---

## Features

| Module              | What it does                                                                 |
|---------------------|-----------------------------------------------------------------------------|
| **Lead Management** | Add, edit, delete leads with contact details, company, source, owner        |
| **Sales Pipeline**  | Kanban board with 7 stages (New Lead → Closed Won/Lost)                    |
| **Analytics**       | Stat cards, pipeline funnel, source pie chart, monthly trend area chart     |
| **Follow-ups**      | Reminder system with overdue tracking, completion toggle, due dates         |
| **Activity Notes**  | Timeline of calls, emails, meetings, demos with type tagging               |
| **Authentication**  | Email/password signup + login, protected routes via Supabase Auth           |

---

## Folder Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── auth/
│   │   ├── login/page.tsx        # Login page
│   │   ├── signup/page.tsx       # Signup page
│   │   └── callback/route.ts    # Supabase email confirmation
│   ├── dashboard/
│   │   ├── page.tsx              # Overview dashboard
│   │   ├── layout.tsx            # Dashboard shell with sidebar
│   │   ├── leads/page.tsx        # Lead management
│   │   ├── pipeline/page.tsx     # Kanban pipeline
│   │   ├── followups/page.tsx    # Follow-up reminders
│   │   ├── notes/page.tsx        # Activity timeline
│   │   └── analytics/page.tsx    # Full analytics view
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Redirect to /dashboard
├── components/
│   ├── ui/                       # Reusable primitives (Button, Input, Modal, etc.)
│   ├── layout/                   # Sidebar, DashboardLayout
│   ├── leads/                    # LeadForm, LeadTable
│   ├── pipeline/                 # KanbanBoard
│   ├── analytics/                # AnalyticsDashboard (Recharts)
│   ├── followups/                # FollowupList
│   ├── notes/                    # ActivityTimeline
│   └── auth/                     # AuthForm
├── hooks/                        # useLeads, useActivities, useFollowups
├── context/                      # AuthContext (user session provider)
├── lib/                          # Supabase clients, utility helpers
├── types/                        # TypeScript interfaces, stage/source configs
└── styles/                       # globals.css (Tailwind + fonts)
```

---

## Setup (Step by Step)

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free project.
2. In the dashboard, go to **Settings → API** and copy:
   - `Project URL` (e.g., `https://abc123.supabase.co`)
   - `anon public` key

### 2. Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**.
2. Paste the entire contents of `supabase-schema.sql` and click **Run**.
3. This creates all tables (profiles, leads, activities, followups), RLS policies, indexes, and triggers.

### 3. Configure Authentication

1. In Supabase dashboard → **Authentication → URL Configuration**.
2. Set the **Site URL** to `http://localhost:3000`.
3. Add `http://localhost:3000/auth/callback` to **Redirect URLs**.

### 4. Clone and Install

```bash
git clone <your-repo-url>
cd sales-crm

# Install dependencies
npm install
```

### 5. Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and paste your Supabase URL and anon key:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up, confirm your email, and start using the CRM.

---

## Architecture Decisions

**Why App Router?** — Next.js 14 App Router gives us server components by default, layout nesting, and middleware-based auth protection with zero config.

**Why Supabase?** — Gives us Postgres, Auth, Row-Level Security, and real-time subscriptions from a single service. No backend to build or deploy.

**Why custom hooks?** — Each entity (leads, activities, followups) has its own hook with CRUD operations. Components stay thin, logic stays reusable.

**Why no drag-and-drop?** — We use click-to-move in the Kanban board instead. This keeps the bundle tiny and works perfectly on mobile. If you need drag-and-drop later, add `@dnd-kit/core`.

**Why no state library?** — React Context + custom hooks are sufficient for this scale. Each hook manages its own state and Supabase queries. If you grow past 50 components, consider Zustand.

---

## Customization

**Currency:** Change `formatCurrency` in `src/lib/utils.ts` (currently INR).  
**Pipeline stages:** Edit the `lead_stage` enum in `supabase-schema.sql` and `STAGE_CONFIG` in `src/types/index.ts`.  
**Lead sources:** Edit the `lead_source` enum and `SOURCE_OPTIONS` similarly.  
**Colors/fonts:** All in `tailwind.config.js` under `theme.extend`.  

---

## Production Deployment

1. Push to GitHub.
2. Deploy on [Vercel](https://vercel.com) — it auto-detects Next.js.
3. Add your `.env.local` variables to Vercel's Environment Variables.
4. Update your Supabase **Site URL** and **Redirect URLs** to your production domain.

---

## License

MIT — use it, fork it, ship it.
