# bison-sdk-docs

Documentation for [`bison-jib-sdk`](https://www.npmjs.com/package/bison-jib-sdk).

## Run

```sh
bun install      # or npm install
bun run dev      # vite dev server
bun run build    # production build → dist/
```

The app uses the published `bison-jib-sdk` package.

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
