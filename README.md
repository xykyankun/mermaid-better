# Neon App Template

A production-ready full-stack application template built with **Neon**, **Next.js 15**, **Drizzle ORM**, and **Tailwind CSS**. Supports deployment to **Cloudflare Workers** via OpenNext.

## Features

- **Authentication** - Email/password auth powered by Neon Auth
- **Database** - PostgreSQL with Neon serverless driver
- **Row Level Security** - Built-in RLS policies via Drizzle ORM
- **Type Safety** - Full TypeScript support with inferred types
- **Modern UI** - Tailwind CSS with reusable components
- **Edge Deployment** - Ready for Cloudflare Workers

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router) |
| Auth & Data | Neon JS SDK (`@neondatabase/neon-js`) |
| Database | PostgreSQL (Neon) |
| ORM | Drizzle ORM |
| Styling | Tailwind CSS |
| Deployment | Cloudflare Workers (OpenNext) |

## Quick Start

### 1. Clone and Install

```bash
# Clone this template
npx degit your-username/neon-app-template my-app
cd my-app

# Install dependencies
pnpm install
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your Neon credentials
# Get these from https://console.neon.tech
```

### 3. Setup Database

```bash
# Push schema to database
pnpm db:push

# Or generate and run migrations
pnpm db:generate
pnpm db:migrate
```

### 4. Start Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home (auth redirect)
│   ├── login/page.tsx     # Login page
│   ├── register/page.tsx  # Register page
│   └── dashboard/page.tsx # Protected dashboard
├── components/            # Reusable components
│   ├── ui/               # UI primitives (Button, Input, Card, etc.)
│   └── error-boundary.tsx
└── lib/
    └── neon/
        ├── client.ts      # Neon JS client configuration
        └── schema.ts      # Drizzle schema with RLS policies
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_NEON_AUTH_URL` | Neon Auth endpoint URL | Yes |
| `NEXT_PUBLIC_NEON_DATA_API_URL` | Neon Data API endpoint URL | Yes |
| `DATABASE_URL` | PostgreSQL connection string (for migrations) | Yes |
| `NEXT_PUBLIC_APP_URL` | Your app's public URL | Yes |
| `NEXT_PUBLIC_APP_NAME` | App name for metadata | No |
| `NEXT_PUBLIC_APP_DESCRIPTION` | App description for metadata | No |

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format code with Prettier |
| `pnpm format:check` | Check code formatting |
| `pnpm db:push` | Push schema changes to database |
| `pnpm db:generate` | Generate migration files |
| `pnpm db:migrate` | Run pending migrations |
| `pnpm db:studio` | Open Drizzle Studio |
| `pnpm build:worker` | Build for Cloudflare Workers |
| `pnpm deploy:worker` | Deploy to Cloudflare Workers |

## Usage Examples

### Authentication

```typescript
import { neonClient } from '@/lib/neon/client';

// Get current session (React hook)
const { data: session, isPending } = neonClient.auth.useSession();

// Sign up
await neonClient.auth.signUp.email({ email, password, name });

// Sign in
await neonClient.auth.signIn.email({ email, password });

// Sign out
await neonClient.auth.signOut();
```

### Database Queries

```typescript
import { neonClient } from '@/lib/neon/client';

// Select all
const { data, error } = await neonClient.from('todos').select('*');

// Select with filter
const { data } = await neonClient
  .from('todos')
  .select('*')
  .eq('completed', false);

// Insert
const { data } = await neonClient
  .from('todos')
  .insert({ title: 'New todo' })
  .select()
  .single();

// Update
const { data } = await neonClient
  .from('todos')
  .update({ completed: true })
  .eq('id', todoId);

// Delete
await neonClient.from('todos').delete().eq('id', todoId);
```

### Drizzle Schema with RLS

```typescript
// src/lib/neon/schema.ts
import { pgTable, uuid, text, boolean } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { authenticatedRole, authUid, crudPolicy } from 'drizzle-orm/neon';

export const todos = pgTable(
  'todos',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id').notNull().default(sql`auth.user_id()`),
    title: varchar('title', { length: 255 }).notNull(),
    completed: boolean('completed').notNull().default(false),
  },
  (table) => [
    crudPolicy({
      role: authenticatedRole,
      read: authUid(table.userId),
      modify: authUid(table.userId),
    }),
  ]
);

// Infer types from schema
export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;
```

## UI Components

The template includes a set of reusable UI components:

```typescript
import { Button, Input, Card, CardContent, Spinner } from '@/components/ui';

// Button variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Danger</Button>
<Button isLoading>Loading...</Button>

// Input with label and error
<Input label="Email" error="Invalid email" />

// Card
<Card>
  <CardContent>Content here</CardContent>
</Card>
```

## Deployment

### Cloudflare Workers

```bash
# Build for Cloudflare Workers
pnpm build:worker

# Deploy
pnpm deploy:worker
```

### Vercel

This template also works with Vercel out of the box:

```bash
vercel deploy
```

## Customization

### Adding New Database Tables

1. Add schema in `src/lib/neon/schema.ts`
2. Run `pnpm db:push` or `pnpm db:generate && pnpm db:migrate`

### Adding New Pages

Create files in `src/app/` following Next.js App Router conventions.

### Modifying UI Components

Edit components in `src/components/ui/` to match your design system.

## License

MIT
