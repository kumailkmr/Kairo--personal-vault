# Kairo OS — Private Executive Operating System

Kairo OS is a premium operational intelligence system and private workspace tailored for client management, project operations, analytics, revenue tracking, meetings, document systems, roadmaps, and AI operations.

Built with an Apple-level calm, luxury-minimalist aesthetic, Kairo OS focuses on visual excellence, restrained motion, clean whitespace, and operational command layouts.

---

## 🛠️ Tech Stack & Architecture

* **Framework**: Next.js 15+ (App Router, Server Components)
* **Language**: TypeScript (Strict Mode)
* **Styling**: Tailwind CSS, shadcn/ui
* **Animations**: Framer Motion
* **Visual Data**: Recharts, Lucide Icons
* **Forms & Validation**: React Hook Form, Zod
* **Data Grid**: TanStack Table v8
* **Integrations Foundation**: Prepared for future Supabase, Google Calendar, Google Meet, WhatsApp API, and automated email workflows.

---

## 📦 Directory Structure

```text
src/
├── app/                  # Route groups, page shells, layout views
├── components/
│   ├── ui/               # Custom lower-level UI primitives (buttons, cards, badges)
│   └── shared/           # Reusable layouts, charts, and operational shells
│       ├── layouts/      # Main workspace container shell
│       ├── navigation/   # Left sidebar, Top nav, mobile navigation responsive shell
│       ├── cards/        # Premium executive analytics and metrics cards
│       ├── charts/       # Minimalist data visualizers
│       └── notifications/# Activity drawer and Activity toast system
├── services/             # Clean integration layers (Supabase, Google Meet, WhatsApp, AI)
├── hooks/                # Custom React hooks (toast, local storage, device sizing)
├── lib/                  # Library setups (Recharts, tailwind-merge, Supabase client stub)
├── styles/               # Global CSS variables, custom typography setup
├── types/                # Strict TypeScript declaration types
├── utils/                # Unified date/currency formatters
├── constants/            # Navigation structure, brand tokens, limit constraints
├── mock/                 # High-fidelity mock operational datasets
├── providers/            # React providers (Toast, Tooltip, Sidebar)
└── animations/           # High-end Framer Motion animation curves and springs
```

---

## 🚀 Getting Started

First, ensure you have [pnpm](https://pnpm.io/) installed.

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Run the Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to explore the private workspace shell.

### 3. Build for Production
```bash
pnpm build
```
