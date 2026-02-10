#!/usr/bin/env tsx

import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';

config({ path: '.env' });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not set');
  process.exit(1);
}

async function checkTemplates() {
  const sql = neon(DATABASE_URL!);

  console.log('🔍 Checking templates in database...\n');

  try {
    const templates = await sql`SELECT id, title, type, category, is_system FROM templates ORDER BY created_at`;

    console.log(`Found ${templates.length} templates:\n`);

    templates.forEach((t: any, i: number) => {
      console.log(`${i + 1}. ${t.title}`);
      console.log(`   Type: ${t.type}, Category: ${t.category}, System: ${t.is_system}`);
      console.log(`   ID: ${t.id}\n`);
    });

    if (templates.length === 0) {
      console.log('⚠️  No templates found! Run: npx tsx scripts/seed-templates.ts');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkTemplates();
