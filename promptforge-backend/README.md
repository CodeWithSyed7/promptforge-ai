# PromptForge Backend

Express API for PromptForge's React client.

## Setup

```bash
npm install
cp .env.example .env
# Add GEMINI_API_KEY to .env
npm run dev
```

Health: `GET /health`

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

## Authentication modes

For local UI development only, `ALLOW_DEMO_AUTH=true` accepts `x-user-id`. This is spoofable and must never be enabled in production.

For production, set `ALLOW_DEMO_AUTH=false` and configure Firebase Admin credentials. Send `Authorization: Bearer <Firebase ID token>`; the middleware verifies the token and derives the user ID from its verified UID.

## Storage limitation

The bundled JSON-file store is only a local prototype. Use Firestore or another managed database for production. Do not deploy the JSON store to serverless/ephemeral hosting.

## Secrets

Keep `.env` out of Git. Use the hosting provider's secret manager in deployed environments.
