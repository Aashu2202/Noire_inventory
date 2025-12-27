<!-- Auto-generated guidance for AI coding agents working on this repo. -->
# Copilot instructions — Noire_inventory

This project contains a small React + Vite frontend and a minimal backend placeholder. The intent of these instructions is to help AI coding agents be productive quickly by highlighting the repo's structure, concrete commands, and recurring patterns.

 **Primary UI:** `frontend/` — a Vite React app. Key files:
   - [frontend/package.json](../frontend/package.json) — dev/build/lint scripts.
   - [frontend/src/main.jsx](../frontend/src/main.jsx) and [frontend/src/App.jsx](../frontend/src/App.jsx) — app entry and top-level component.
   - [frontend/vite.config.js](../frontend/vite.config.js) and [frontend/index.html](../frontend/index.html) — build config / HTML shell.
   - [frontend/eslint.config.js](../frontend/eslint.config.js) — linting rules used across the codebase.
 **Backend:** `backend/` — currently a minimal Node package (see [backend/package.json](../backend/package.json)). There is no active server code in the repository root; treat backend as a placeholder until more files are added.
 - Update build config: modify [frontend/vite.config.js](../frontend/vite.config.js) and ensure `npm run build` still completes.

What to assume and prioritize
- The frontend is the actively configured, runnable part of the project. If a change affects UI behavior, focus on the `frontend/src` files and the Vite dev workflow.
- Changes to the backend require verification that new files are added to `backend/`. Do not assume an API exists unless you can find concrete route files.

Concrete developer workflows (how to run & verify)
- Install deps and run frontend dev server:

```bash
cd frontend
npm install
npm run dev
```

- Build frontend for production:

```bash
cd frontend
npm run build
```

- Lint frontend code:

```bash
cd frontend
npm run lint
```

Patterns and project conventions (discoverable)
- Project uses React 19 + Vite (see [frontend/package.json](frontend/package.json)). Prefer editing modern JSX and ESM imports.
- ESLint config is centralized in `frontend/eslint.config.js`. Respect existing rules when applying autofixes or refactors.
- Static assets follow the Vite conventions: `frontend/public/` and `frontend/src/assets/`.

Integration and boundaries
- There is no configured full-stack integration in the repo (no API routes discovered). Treat frontend changes as independent unless a new `backend/` server file appears.
- If adding an API, place server code under `backend/` and update `backend/package.json` scripts to expose start/dev commands. Document any cross-origin requirements in the top-level README.

Helpful examples for common edits
- Add a React page/component: follow patterns in `frontend/src` (single-file components with local CSS or `assets/` imports). Use `main.jsx` for route registration or mounting changes.
- Update build config: modify [frontend/vite.config.js](frontend/vite.config.js) and ensure `npm run build` still completes.

Limitations and what is NOT assumed
- There are no test commands or CI workflows present — do not invent test runners or CI steps without adding accompanying config files.
- Do not modify backend behavior unless new server files or explicit requirements are added.

If you (the human) want more in-depth guidance to be included here, tell me which files or workflows to document next (for example: API design, auth, or deployment).

-- End of instructions
