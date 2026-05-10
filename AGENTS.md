# Project Notes

## Overview

This is a Vite + React + TypeScript site for the Rea11y Annoying Bots (RAB) cybersecurity/CTF team. The UI is a dark cyber-themed single-page app with React Router routes for home, about, achievements, gallery, services, projects, team, and connect.

## Commands

- Install dependencies: `npm install`
- Start local development server: `npm run dev`
- Type-check/lint: `npm run lint`
- Production build: `npm run build`
- Preview production build: `npm run preview`
- Clean build output: `npm run clean`

`npm run dev` starts `server.ts`, which serves Vite middleware and exposes `/api/team-stats/:id` on port `3000`.

## Structure

- `src/App.tsx`: main app, routing, page components, markdown collection loading, and most UI.
- `src/main.tsx`: React entrypoint, theme provider, and browser `Buffer` polyfill for `gray-matter`.
- `src/index.css`: Tailwind v4 import, theme tokens, global theme variables, and cyber effects CSS.
- `src/context/ThemeContext.tsx`: persisted `dark` / `light` / `glass` theme state.
- `src/components/CyberEffects.tsx`: animated visual effects used by the app shell.
- `src/lib/utils.ts`: `cn()` helper built from `clsx` and `tailwind-merge`.
- `src/content/**/*.md`: content collections loaded with `import.meta.glob` and parsed by `gray-matter`.
- `src/content/attachments/`: Obsidian paste target for local images used by markdown/front matter.
- `server.ts`: Express wrapper around Vite plus the CTFtime API proxy.

## Content Conventions

Content is markdown with YAML front matter. Keep field names consistent with the page code:

- `src/content/services/*.md`: `title`, `description`, `icon`
- `src/content/achievements/*.md`: `name`, `rank`, `year`, `category`, `points`, `globalRank`, `issuedBy`
- `src/content/team/*.md`: `name`, `fullname`, `role`, `category`, `username`, `image`, optional `github`, `linkedin`
- `src/content/projects/*.md`: `title`, `subtitle`, `description`, `heroImage`, `category`, `date`, `status`, `tags`
- `src/content/gallery/*.md`: `event`, `date`, `description`, `images` as a YAML list or comma-separated string
- `src/content/connect/*.md`: `label`, `description`, `icon`, `url`

Local image fields can use full URLs, paths under `src/content`, plain filenames in `attachments`, or Obsidian embeds such as `![[attachments/example.png]]`. Markdown bodies can also use Obsidian image embeds, including aliases like `![[attachments/example.png|Alt text]]`.

Content collection filenames are numbered per folder, for example `001-example.md`, `002-example.md`. Keep the three-digit prefix when adding or reordering files; the app sorts collections by filename.

Routes for project and gallery detail pages are generated from the lowercased title/event with spaces replaced by hyphens.

## Implementation Notes

- Follow the existing visual language: cyber red accent, Orbitron headings, skewed panel layers, `glass-morphism`, and motion animations.
- Prefer adding/updating markdown content before hard-coding new content in `App.tsx`.
- When editing content in Obsidian, open `src/content` as the vault. Pasted images should land in `src/content/attachments`.
- In Obsidian, use the numeric filename prefixes to keep each folder ordered from first to last.
- Use `lucide-react` icons already imported in `App.tsx` when adding controls or service icons.
- Keep theme colors routed through CSS variables in `src/index.css` where practical.
- The CTFtime team ID is extracted from `src/content/hero.md`; changes to that link affect the home page stats card.
- This directory is not currently a Git repository, so check file changes directly rather than relying on `git status`.

## Environment

Use `.env.local` for local secrets. `.env.example` documents:

- `GEMINI_API_KEY`
- `APP_URL`

The current code defines `process.env.GEMINI_API_KEY` in Vite config, but the app does not appear to call Gemini directly yet.
