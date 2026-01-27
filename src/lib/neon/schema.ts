import { pgTable, uuid, text, boolean, timestamp, varchar } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { authenticatedRole, authUid, crudPolicy } from 'drizzle-orm/neon';

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
