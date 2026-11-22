# PromptForge Repository Audit

Updated 22 November 2026 after inspecting the GitHub tree and the ten files supplied in this conversation.

## Repository contents

- Existing backend source: Express routes/controllers, Gemini service, JSON-file storage, Firebase Admin token-verification middleware, and rate limiting.
- Newly added compiled web bundle under `promptforge-backend/public/`, including uploaded HTML/CSS/JS, manifest, existing 192px/512px icons, and service worker.
- Newly added reusable UI components under `app/src/components/ui/`.

## Fixes applied

1. Placed the uploaded CSS and JavaScript at the exact `./assets/` paths referenced by the uploaded HTML.
2. Replaced the compiled bundle's hard-coded `http://localhost:5000/api` endpoint with same-origin `/api`.
3. Updated the manifest to reference only the two icon sizes verified in the repository.
4. Added service-worker registration and app-shell caching.
5. Updated the Express server to serve the compiled web app and API from one origin.
6. Replaced the generic starter README with actual setup and limitation notes.

## Release blockers

- The uploaded ten files did not include the complete React/Vite source tree. Six TSX files are individual reusable components only.
- The compiled frontend sends `x-user-id: default`; production middleware requires a verified Firebase ID token. Do not enable demo auth in production. Firebase client authentication must be integrated and the frontend rebuilt.
- The backend uses local JSON files. Replace with Firestore or another managed database before multi-instance/serverless production.
- No live deployment, Gemini key, Firebase credentials, or APK signing/build configuration were supplied. Those have not been tested.

## Local development

In `promptforge-backend/`, run `npm install`, set `GEMINI_API_KEY`, set `NODE_ENV=development` and `ALLOW_DEMO_AUTH=true` only for local testing, then run `npm run dev`. Open http://localhost:5000.
