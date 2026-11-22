# PromptForge AI

PromptForge is a mobile-first AI prompt engineering studio. This repository contains the Express API, a compiled React web-app bundle, and selected reusable React UI components.

## Repository layout

- `promptforge-backend/`: Express API and Gemini integration.
- `promptforge-backend/public/`: compiled web build served by the API on the same origin.
- `app/src/components/ui/`: the six reusable UI component files supplied for this update.
- `PROJECT_AUDIT.md`: source/build and release-readiness audit.

## Run locally

Requires Node.js 20 or newer.

```bash
cd promptforge-backend
npm install
cp .env.example .env
# Set GEMINI_API_KEY in .env
npm run dev
```

Open http://localhost:5000. API health: http://localhost:5000/health.

The compiled client uses same-origin `/api` routes. Keep the UI and API on the same origin unless you rebuild/configure the API base URL and CORS.

## Environment

- `GEMINI_API_KEY`: server-side Gemini API key; never expose it in browser code.
- `GEMINI_MODEL`: optional model override; defaults to `gemini-2.5-flash`.
- `FIREBASE_PROJECT_ID` and `FIREBASE_SERVICE_ACCOUNT_JSON`: production Firebase Admin credentials.
- `ALLOW_DEMO_AUTH=true`: local development only, with `NODE_ENV=development`.

## Release limitations

The supplied files did not include the complete editable React/Vite application source. The six TSX files are reusable components, not a complete source tree. The UI is currently supplied as a compiled bundle.

The compiled UI sends a demo `x-user-id` header, while production backend middleware requires a verified Firebase ID token. Production AI/history/settings requests therefore need Firebase client authentication integrated into the frontend and a rebuilt bundle.

The backend currently stores history/settings/usage in local JSON files. Replace this with Firestore or another managed database before multi-instance/serverless production.

## PWA

The web build includes a web manifest, the existing 192px/512px icons, and a service worker for app-shell caching. Installability requires HTTPS (or localhost).
