#!/usr/bin/env tsx

import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';
import { systemTemplates } from '../src/lib/templates/seed-templates';

// Load environment variables
config({ path: '.env' });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

async function seedTemplates() {
  const sql = neon(DATABASE_URL!);

  console.log('🌱 Seeding system templates...');

  try {
    // Check if templates already exist
    const existing = await sql`SELECT COUNT(*) as count FROM templates WHERE is_system = true`;
    const count = parseInt(existing[0].count as string);

    if (count > 0) {
      console.log(`⚠️  Found ${count} existing system templates. Clearing old templates...`);
      await sql`DELETE FROM templates WHERE is_system = true`;
    }

    // Insert system templates
    for (const template of systemTemplates) {
      await sql`
        INSERT INTO templates (title, type, category, description, content, is_system, user_id)
        VALUES (
          ${template.title},
          ${template.type},
          ${template.category},
          ${template.description},
          ${template.content},
          ${template.isSystem},
          NULL
        )
      `;
      console.log(`✅ Inserted: ${template.title} (${template.type})`);
    }

    console.log(`\n🎉 Successfully seeded ${systemTemplates.length} system templates!`);
    console.log('\nTemplates by category:');

    const categories = systemTemplates.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(categories).forEach(([category, count]) => {
      console.log(`  - ${category}: ${count} templates`);
    });

    console.log('\nTemplates by type:');
    const types = systemTemplates.reduce((acc, t) => {
      acc[t.type] = (acc[t.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(types).forEach(([type, count]) => {
      console.log(`  - ${type}: ${count} templates`);
    });

  } catch (error) {
    console.error('❌ Error seeding templates:', error);
    process.exit(1);
  }
}

seedTemplates();
