# bison-sdk-docs

Visual documentation and live playground for [`bison-jib-sdk`](../bison-sdk).

Every component demo runs against the SDK's in-browser **mock transport** — no backend
needed. The event ledger at the bottom streams the real `bison-*` events as you drive the
components, so the docs show the contract executing.

## Run

```sh
bun install      # or npm install
bun run dev      # vite dev server
bun run build    # production build → dist/
```

The app imports the SDK straight from source via a Vite alias
(`../bison-sdk/src` — see `vite.config.ts`), so changes to the SDK show up live. To test the
published package instead, set `"bison-jib-sdk": "file:../bison-sdk"` in `package.json` and
drop the alias.

## What's in it

- **Overview** — install, the transport seam, the scope model.
- **Live · Onboarding / Partial onboarding / Bank CRUD** — the three real web components,
  mock-driven, with a shared client so completing onboarding unlocks banking (the real gating).
- **Reference · Functions / Validation / Styling / Backend contract** — tables generated from
  the SDK surface, a live ABA-routing validator, the full class/slot/token/event maps, and the
  backend coordination checklist.

## Structure

```
src/
  main.ts     nav shell, routing, theme, ledger init
  pages.ts    every page + the live playground widgets
  data.ts     reference tables (routes, functions, validation, styling contract)
  ledger.ts   the live bison-* event ledger
  ui.ts       tiny render helpers (h, table, code, pre)
  app.css     the docs theme
```
