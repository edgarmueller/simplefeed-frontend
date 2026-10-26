# simplefeed-frontend

The web client for [simplefeed-backend](https://github.com/edgarmueller/simplefeed-backend), a news reader with AI curation.

You subscribe to **channels** on the Channels page: Hacker News, or any RSS or Atom feed you add by its address or its website's. Each channel picks stories for you, and they show up in your feed:
- The feed shows unread stories by default, or all of them, plus a Saved view and "mark all as read".
- Opening a story marks it read.
- Liking a story tells its channel to pick more like it.
- On a channel's page you see what it picked and tune it in a chat ("mute crypto", "more rust", "max 5 per day").

Every reader has their own preferences per channel. The channels themselves run in the backend repository.

## Stack

- React 19 with React Router 7, built with Vite
- [Chakra UI](https://chakra-ui.com) v3 for components
- TanStack Query for server state, zustand for the current user
- Vitest and Testing Library for unit tests, Playwright for end-to-end tests

## Getting started

You need Node 22 and a running backend. See the backend's README; by default it listens on port 5001.

```sh
npm install
npm run dev        # http://localhost:5173
```

To point the app at a different backend, copy `.env.example` to `.env.local` and change the URLs.

## Checks

```sh
npm run typecheck
npm run lint
npm test           # unit tests
npm run test:e2e   # end-to-end tests, needs the backend on port 5001 and its channels worker
```

The end-to-end tests start Vite themselves. Run `npx playwright install chromium` once before the first run.

## Layout

| Folder           | Contents                                                              |
| ---------------- | --------------------------------------------------------------------- |
| `src/api`        | HTTP calls to the backend                                             |
| `src/hooks`      | Providers for auth and the current user, and the subscriptions query  |
| `src/stores`     | the zustand store for the current user                                |
| `src/components` | UI, grouped by feature; `ui/` holds shared building blocks            |
| `src/pages`      | One component per route                                               |
| `e2e`            | Playwright tests                                                      |

## Deployment

`npm run build` writes a static site to `build/`, which any static host can serve (the live demo runs on Vercel). Set `VITE_API_URL` at build time, and route unknown paths to `index.html`.

## Status

This is a demo project, not a finished product. The auth and user providers still synchronize state through effects, which the React Compiler lint rules flag as warnings.
