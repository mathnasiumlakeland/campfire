# Campfire

A minimal static page that displays the visitor's current public IP address. The
lookup runs in the browser using [ipify](https://www.ipify.org/); no application
server is involved.

## Run locally

```sh
bun install
bun run dev
```

## Build

```sh
bun run build
bun run preview
```

The production site is written to `dist/`. Set `BASE_PATH` when building for a
site hosted below a subpath:

```sh
BASE_PATH=/campfire/ bun run build
```

## Deploy

The GitHub Actions workflow in `.github/workflows/deploy-pages.yml` builds and
publishes the site on every push to `main`. In the repository's GitHub Pages
settings, choose **GitHub Actions** as the source.
