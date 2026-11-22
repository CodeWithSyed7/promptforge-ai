# PromptForge Source Archive Audit

Reviewed the two supplied Kimi ZIP exports on 22 November 2026.

## Which archive contains the source?

### `Kimi_Agent_PromptForge Mobile App.zip`

This is the full editable project export: 106 files, approximately 3.11 MiB uncompressed.

It contains:
- `app/`: React 19 + TypeScript + Vite frontend source, screens, contexts, API client, UI components, assets, and npm lockfile.
- `promptforge-backend/`: Express API source, controllers, middleware, routes, Gemini service, prompt-engine service, and JSON-file data service.

### `Kimi_Agent_Deployment_PromptForge Mobile App_v4.zip`

This is a deployment/build export: 6 files, approximately 1.44 MiB uncompressed. It contains the compiled HTML/CSS/JavaScript bundle, icons, and web manifest. It does not contain the editable React/TypeScript source or backend source.

## Source architecture

- Frontend: React 19, TypeScript, Vite 7, Tailwind CSS, Radix UI.
- Backend: Node.js, Express, Gemini SDK.
- Frontend API client: `app/src/services/apiService.ts`.
- Backend API prefixes: `/api/ai`, `/api/history`, `/api/settings`.
- Health check: `/health`.

## Integration issues found in the source archive

1. The frontend API client sends a fixed `x-user-id: default` header. The supplied backend middleware trusts this header and does not verify a user token. This is demo-only authentication, not production authentication.
2. The backend stores users, history, and settings in local JSON files. This is not a safe multi-instance production database.
3. The Gemini service uses a hard-coded `gemini-pro` model and initializes the SDK at module load. The model should be configurable and initialization should fail gracefully when the key is absent.
4. The original history delete controller calls the data service without a user ID, so ownership is not enforced at deletion time.
5. The frontend's API response types and backend response envelopes need a full contract check before release, especially history, usage, chat, and video-script responses.
6. The frontend source archive is not the same thing as the compiled deployment bundle. Keep the editable source under `app/` and the build output separate.

## Repository state note

The root currently contains the deployment bundle and a separately added backend implementation. The backend currently in the repository is not a byte-for-byte copy of the backend in the supplied source ZIP. Do not assume it is already the fully integrated original project.

## Recommended next steps

1. Add the complete `app/` source tree from the first ZIP.
2. Restore and review the original backend controllers and service files from the same ZIP, then apply security and compatibility fixes deliberately.
3. Update the frontend API client to obtain and send verified Firebase ID tokens before enabling production auth.
4. Replace JSON-file persistence with Firestore or another managed database before production deployment.
5. Run frontend build/lint and backend API tests, then verify all screens against the deployed API.
