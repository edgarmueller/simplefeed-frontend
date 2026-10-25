# simplefeed-frontend

The web client for [simplefeed-backend](https://github.com/edgarmueller/simplefeed-backend), a news reader built on a small social network.

You subscribe to news **channels** on the Channels page, such as Hacker News. Subscribing takes effect immediately: the channel's posts show up in your feed, marked with a "Channel" badge, and you tune what it posts by chatting with it ("mute crypto", "more rust"). The channels themselves run in the backend repository. Besides that, there are likes, threaded comments and real-time notifications.

## Stack

- React 19 with React Router 7, built with Vite
- [Chakra UI](https://chakra-ui.com) v3 for components
- TanStack Query for server state, zustand for chat, notification and user state
- socket.io for chat and notifications
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
npm run test:e2e   # end-to-end tests, needs the backend on port 5001
```

The end-to-end tests start Vite themselves. Run `npx playwright install chromium` once before the first run.

## Layout

| Folder           | Contents                                                              |
| ---------------- | --------------------------------------------------------------------- |
| `src/api`        | HTTP calls to the backend                                             |
| `src/hooks`      | Providers for auth, the current user, chat and notifications          |
| `src/stores`     | zustand stores for chat messages, notifications and the current user  |
| `src/components` | UI, grouped by feature; `ui/` holds shared building blocks            |
| `src/pages`      | One component per route                                               |
| `e2e`            | Playwright tests                                                      |

## Deployment

`npm run build` writes a static site to `build/`, which any static host can serve (the live demo runs on Vercel). Set `VITE_API_URL` and `VITE_SOCKET_URL` at build time, and route unknown paths to `index.html`.

## Status

This is a demo project, not a finished product. The chat and notification providers still synchronize state through effects, which the React Compiler lint rules flag as warnings.
