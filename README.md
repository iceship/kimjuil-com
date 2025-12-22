# kimjuil-com

A personal website and playground built with [Nuxt 4](https://nuxt.com) and [NuxtHub](https://hub.nuxt.com), deployed on Cloudflare.

## Features

- **Blog**: Markdown-based blog powered by [Nuxt Content v3](https://content.nuxt.com).
- **Chess**: Interactive chess board using `chess.js` and [`@lichess-org/chessground`](https://github.com/lichess-org/chessground).
- **Todos**: Personal task manager with GitHub authentication.
- **Image Gallery**: Image upload and management using [NuxtHub Blob](https://hub.nuxt.com/docs/features/blob).
- **Guestbook**: Leave messages saved in [NuxtHub Database](https://hub.nuxt.com/docs/features/database) (SQLite).
- **Redirects**: Dynamic redirect management using [NuxtHub KV](https://hub.nuxt.com/docs/features/kv).
- **Authentication**: Secure login via GitHub using `nuxt-auth-utils`.

## Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com) (App directory structure)
- **Platform**: [NuxtHub](https://hub.nuxt.com)
- **Database**: SQLite (Cloudflare D1) with [Drizzle ORM](https://orm.drizzle.team)
- **State Management**: [Pinia](https://pinia.vuejs.org) & [Pinia Colada](https://pinia-colada.esm.is)
- **UI Component**: [Nuxt UI](https://ui.nuxt.com) & Nuxt Fonts

## Setup

Make sure to install the dependencies with [pnpm](https://pnpm.io).

```bash
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Database Migrations

This project uses Drizzle ORM for database management.

```bash
# Generate migrations
pnpm db:generate

# Apply migrations locally
pnpm db:migrate
```

## Production

Build the application for production:

```bash
pnpm build
```

## Deploy

### Cloudflare

Deploy the application to Cloudflare Pages with full NuxtHub support.

```bash
pnpm deploy-cloudflare
```

This command will also handle database migrations on the remote D1 database.

## License

[GPL-3.0](./LICENSE)

This project uses [`@lichess-org/chessground`](https://github.com/lichess-org/chessground) which is licensed under GPL-3.0. Consequently, this project is also licensed under GPL-3.0.