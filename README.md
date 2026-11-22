# PromptForge AI

**An AI-powered workspace for prompt engineering, intelligent chat, specialized agents, and creative workflows.**

PromptForge brings prompt creation, AI conversations, agent-assisted tasks, and video-script workflows into one focused interface.

> **Repository status:** The original Kimi export contains a React + TypeScript + Vite frontend and an Express backend. The backend is a starter implementation, not a production-ready service. Authentication, persistent cloud storage, provider management, and deployment configuration must be completed and verified before public production use.

## Project structure

```text
.
├── app/                    # React + TypeScript + Vite frontend source
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── promptforge-backend/    # Node.js + Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── services/
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── README.md
```

## Main capabilities in the supplied frontend/backend export

- AI prompt generation
- Specialized AI agents
- AI chat
- Video script generation
- Conversation and generation history
- User settings and usage tracking
- Gemini API integration
- Responsive React interface

Feature availability depends on frontend wiring and valid backend configuration. Some account and storage flows in the supplied frontend are local/demo flows.

## Requirements

- Node.js 20 or newer
- npm
- A Google Gemini API key for AI generation

## Run locally

### 1. Frontend

```bash
cd app
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_URL=http://localhost:5000/api` in `app/.env`.

### 2. Backend

```bash
cd promptforge-backend
npm install
cp .env.example .env
```

Add your Gemini API key to `promptforge-backend/.env`, then run:

```bash
npm run dev
```

The API health endpoint is `http://localhost:5000/health`.

## Environment variables

See [promptforge-backend/.env.example](promptforge-backend/.env.example). Never commit real API keys, Firebase service-account JSON, or production secrets.

## Important security and deployment notes

- Do not expose Gemini or other provider API keys in browser code.
- The original frontend uses a demo/local identity header. That is not secure authentication. Production deployments must use verified Firebase ID tokens (or another trusted identity provider).
- The supplied JSON-file data service is for local development only. It is not safe for concurrent production workloads or ephemeral hosting. Use Firestore or another managed database before production.
- Configure a strict `FRONTEND_URL`, HTTPS, rate limits, request validation, logging, and backups before launch.
- Do not advertise authentication, cloud sync, subscriptions, or multi-provider support as complete until those flows are implemented and tested.

## Technology

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express
- AI: Google Gemini API
- UI: Radix UI and Lucide React

## License

MIT. See [LICENSE](LICENSE).

## Maintainer

Built and maintained by [CodeWithSyed7](https://github.com/CodeWithSyed7).
