# bison-sdk-docs

Documentation for [`bison-jib-sdk`](../bison-sdk).

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

- **Quickstart** — install, connect the client, set the scope.
- **Web components · Onboarding / Partial onboarding / Bank accounts** — usage, behavior,
  public API, and an exclusive styling journey for each component.
- **Reference · Functions / Validation** — static API, schema, and route references.

## Structure

```
src/
  main.ts     nav shell and routing
  pages.ts    documentation pages + per-component styling journeys
  data.ts     reference tables (routes, functions, validation, styling contract)
  ui.ts       tiny render helpers (h, table, code, pre)
  app.css     the docs theme
```
