# PromptForge Backend

Express API and same-origin static web host for PromptForge.

## Setup

```bash
npm install
cp .env.example .env
# Set GEMINI_API_KEY
npm run dev
```

Open http://localhost:5000. The compiled frontend is served from `public/`; API health is `GET /health`.

## API

- `POST /api/ai/generate-prompt`
- `POST /api/ai/generate-with-agent`
- `POST /api/ai/generate-video`
- `POST /api/ai/chat`
- `GET /api/ai/agents`
- `GET /api/history`
- `DELETE /api/history/:id`
- `GET /api/history/export?format=json|txt`
- `GET /api/history/usage`
- `GET /api/settings`
- `PUT /api/settings`
- `POST /api/settings/reset`

## Authentication

For local testing only, use `NODE_ENV=development` and `ALLOW_DEMO_AUTH=true`. This accepts the demo `x-user-id` header and is not secure.

Production requires Firebase Admin credentials and a frontend that sends `Authorization: Bearer <Firebase ID token>`. The supplied compiled UI still sends the demo header, so Firebase client authentication must be integrated before production API access.

## Storage

The JSON-file store is for local development or a single persistent server only. Use Firestore or another managed database for multi-instance/serverless production.

Keep `.env` out of Git and configure secrets in your hosting provider.
