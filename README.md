# Yadegar — Frontend

Persian memory-journaling app. Users can record and share memories with text, photo, audio, and video.

## Tech Stack

- **Next.js 16** + React 19
- **TypeScript**
- **Tailwind CSS v4** + shadcn/ui
- **Docker**

## Requirements

- Docker + Docker Compose
- A shared external Docker network named `shared_net`

```bash
docker network create shared_net
```

## Setup

```bash
# Development (port 3002)
docker compose up frontend -d

# Production (port 3003)
docker compose --profile prod up frontend-prod -d --build
```

Or run locally:

```bash
npm install
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `API_URL` | Backend API base URL |
| `NODE_ENV` | `development` or `production` |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## License

MIT
