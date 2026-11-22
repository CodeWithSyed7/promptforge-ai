# PromptForge AI

**An AI-powered workspace for prompt engineering, intelligent chat, specialized agents, and creative workflows.**

PromptForge brings prompt creation, AI conversations, agent-assisted tasks, and video-script workflows into one focused interface.

## Source archive audit

See [PROJECT_AUDIT.md](PROJECT_AUDIT.md) for the analysis of both supplied ZIP exports, the actual source/build distinction, and the integration issues that must be addressed before production.

## Repository contents

- Root-level HTML, CSS, JavaScript bundle, icons, and web-app manifest: the exported frontend build.
- `promptforge-backend/`: Node.js + Express API source, middleware, routes, AI services, and setup documentation.
- `LICENSE`: MIT.

The original Kimi ZIP also contained the editable React + TypeScript frontend source. That source folder is not currently tracked in this repository; only the built frontend files are present. The backend source has been added from the project export and reorganized with safer authentication and API configuration.

## Backend capabilities

- AI prompt generation
- Specialized AI agents
- AI chat
- Video script generation
- User-scoped history and settings endpoints
- Gemini API integration
- Rate limiting and security headers
- Firebase ID-token verification support

## Requirements

- Node.js 20 or newer
- npm
- Google Gemini API key

## Run the backend

```bash
cd promptforge-backend
npm install
cp .env.example .env
```

Add your Gemini API key to `promptforge-backend/.env`, then run:

```bash
npm run dev
```

Health endpoint: `http://localhost:5000/health`.

For local frontend development, configure `VITE_API_URL=http://localhost:5000/api` in the frontend environment.

## Authentication

In local development only, `ALLOW_DEMO_AUTH=true` accepts the legacy `x-user-id` header used by the exported frontend. This header is spoofable and is not secure authentication.

For production, set `ALLOW_DEMO_AUTH=false`, configure Firebase Admin credentials using the backend environment variables, and send a verified Firebase ID token in the `Authorization: Bearer <token>` header. The current exported frontend still needs its auth client updated to send Firebase ID tokens before this production mode can be used.

## Storage and production readiness

The included JSON-file storage is a local prototype. It is not suitable for concurrent production workloads or ephemeral/serverless hosting. Migrate the data service to Firestore or another managed database before production. Also configure HTTPS, strict CORS origins, monitoring, backups, and provider quotas.

Do not commit real API keys, Firebase service-account JSON, or production secrets. Never expose provider keys through `VITE_*` variables.

## Technology

- Frontend build: HTML, CSS, JavaScript bundle
- Backend: Node.js, Express
- AI: Google Gemini API
- Authentication integration: Firebase Admin token verification (server-side)

## License

MIT. See [LICENSE](LICENSE).

## Maintainer

[CodeWithSyed7](https://github.com/CodeWithSyed7)
