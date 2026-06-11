# Yadegar — Frontend

Persian memory-journaling app built with Next.js 16. Designed primarily for elderly users with a focus on simplicity, large touch targets, and clear visual hierarchy.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 + React 19 |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 + shadcn/ui (new-york style) |
| State | Redux Toolkit — auth slice only |
| Forms | react-hook-form + Zod |
| Icons | Lucide React |
| Toasts | Sonner |
| Theme | next-themes (dark mode) |
| Font | Vazirmatn |
| Direction | RTL (Persian) |

---

## Project Structure

```
yadegar-front/
├── app/
│   ├── (auth)/          Login and join screens
│   ├── (panel)/         Authenticated area — TopBar + BottomNav layout
│   │   └── panel/       Memories, family, profile pages
│   └── (public)/        Public feeds — Explore and Friends
├── actions/             Server actions — one file per domain
│   ├── auth.ts
│   ├── memory.ts
│   ├── family.ts
│   ├── user.ts
│   └── explore.ts
├── components/
│   ├── auth/
│   ├── explore/
│   ├── join/
│   ├── layout/
│   ├── panel/
│   │   ├── memories/
│   │   ├── family/
│   │   └── profile/
│   └── ui/              shadcn components — do not edit
├── lib/
│   └── redux/           store, hooks, auth slice
├── types/               {domain}Type.ts — interfaces + Zod schemas
├── next.config.ts
└── docker-compose.yml
```

---

## Key Conventions

### Pages

All pages are React Server Components by default. Client Components add `'use client'` only when browser APIs or interactivity are needed.

| Route group | Layout | Purpose |
|-------------|--------|---------|
| `(auth)` | Minimal | Login, join flows |
| `(panel)` | TopBar + `max-w-lg` + BottomNav | Authenticated user area |
| `(public)` | Public header | Explore, friends feed |

### Server Actions

Every action file starts with `'use server'`. Actions communicate with the backend and return a typed result:

```ts
// Return shape for all actions
{ success?: true; error?: string; data?: T }
```

Auth token is read from an httpOnly cookie:

```ts
cookies().get('auth_token')?.value
```

Mutations call `revalidateTag` to invalidate cached data:

```ts
revalidateTag('memories')
```

### Forms

All forms use `react-hook-form` with a Zod schema resolver:

```ts
const form = useForm<FormData>({ resolver: zodResolver(schema) })
```

Error messages are always in Persian. On success, show `toast.success(...)`. On failure, show `toast.error(result.error)`.

### API Response Shape

```ts
// List endpoint
response.data.items: T[]

// Single item endpoint
response.data.item: T

// Error
response.message: string
```

The `API_URL` environment variable is always used — URLs are never hardcoded.

---

## Design System

The app uses a warm amber/saffron primary color with full dark mode support.

| Token | Light | Dark |
|-------|-------|------|
| Primary | `oklch(0.71 0.17 72)` | `oklch(0.83 0.16 74)` |
| Background | `oklch(0.99 0.005 80)` | `oklch(0.15 0.022 55)` |
| Border radius | `0.75rem` | — |

**Senior-friendly rules:**

- Body text minimum `text-base` (16px)
- Interactive elements minimum `min-h-12` (48px) touch target
- Use `ms-` / `me-` for directional spacing (RTL-safe)

---

## Getting Started

### Local Development

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

### Docker

A shared external network named `shared_net` is required:

```bash
docker network create shared_net
```

```bash
# Start development container (hot reload, port 3002)
docker compose up frontend -d

# Start production container (port 3003)
docker compose --profile prod up frontend-prod -d --build
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `API_URL` | Backend API base URL (e.g. `http://yadegar_machine`) |
| `NODE_ENV` | `development` or `production` |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## License

MIT
