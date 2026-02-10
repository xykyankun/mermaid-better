import { pgTable, uuid, text, boolean, timestamp, varchar, integer } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { authenticatedRole, anonymousRole, authUid, crudPolicy } from 'drizzle-orm/neon';

/**
 * Todos table - User todo items
 * 
 * RLS Policy: Users can only access their own todos
 * @see https://neon.com/docs/guides/rls-tutorial
 */
export const todos = pgTable(
  'todos',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id').notNull().default(sql`auth.user_id()`),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    completed: boolean('completed').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    // RLS Policy: Only allow users to access and modify their own todos
    crudPolicy({
      role: authenticatedRole,
      read: authUid(table.userId),
      modify: authUid(table.userId),
    }),
  ]
);

// Export types
export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;

/**
 * Diagrams table - User Mermaid diagrams
 *
 * RLS Policy: Users can only access their own diagrams
 */
export const diagrams = pgTable(
  'diagrams',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id').notNull().default(sql`auth.user_id()`),
    title: varchar('title', { length: 255 }).notNull(),
    content: text('content').notNull(), // Mermaid code
    type: varchar('type', { length: 50 }).notNull(), // flowchart, sequence, class, er, gantt, etc.
    description: text('description'),
    isPublic: boolean('is_public').notNull().default(false), // Public sharing enabled
    shareToken: varchar('share_token', { length: 64 }), // Unique token for sharing
    viewCount: integer('view_count').notNull().default(0), // Number of times viewed via share link
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    // RLS Policy for anonymous users: Can read public diagrams via share token
    crudPolicy({
      role: anonymousRole,
      read: sql`${table.isPublic} = true`,
      modify: false,
    }),
    // RLS Policy for authenticated users: Can access own diagrams + public diagrams
    crudPolicy({
      role: authenticatedRole,
      read: sql`${authUid(table.userId)} OR ${table.isPublic}`,
      modify: authUid(table.userId),
    }),
  ]
);

// Export types
export type Diagram = typeof diagrams.$inferSelect;
export type NewDiagram = typeof diagrams.$inferInsert;

/**
 * Templates table - Mermaid diagram templates
 *
 * Includes both system templates and user-created templates
 * System templates are accessible to all users (is_system = true)
 * User templates follow RLS policy
 */
export const templates = pgTable(
  'templates',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id').default(sql`auth.user_id()`), // Nullable for system templates
    title: varchar('title', { length: 255 }).notNull(),
    content: text('content').notNull(), // Mermaid code
    type: varchar('type', { length: 50 }).notNull(), // flowchart, sequence, class, er, gantt, etc.
    category: varchar('category', { length: 50 }).notNull(), // basic, advanced, business, technical, etc.
    description: text('description'),
    isSystem: boolean('is_system').notNull().default(false), // System templates accessible to all
    thumbnail: text('thumbnail'), // Optional base64 or URL for preview image
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    // RLS Policy for anonymous users: Can read system templates only
    crudPolicy({
      role: anonymousRole,
      read: sql`${table.isSystem} = true`,
      modify: false,
    }),
    // RLS Policy for authenticated users: Can read all system templates + their own templates
    // Can only modify their own templates
    crudPolicy({
      role: authenticatedRole,
      read: sql`${table.isSystem} OR ${authUid(table.userId)}`,
      modify: authUid(table.userId),
    }),
  ]
);

// Export types
export type Template = typeof templates.$inferSelect;
export type NewTemplate = typeof templates.$inferInsert;
