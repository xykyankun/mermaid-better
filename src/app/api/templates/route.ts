import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const sql = neon(DATABASE_URL);

/**
 * GET /api/templates
 * Returns all system templates (publicly accessible)
 */
export async function GET() {
  try {
    const templates = await sql`
      SELECT
        id,
        title,
        content,
        type,
        category,
        description,
        is_system,
        created_at,
        updated_at
      FROM templates
      WHERE is_system = true
      ORDER BY created_at ASC
    `;

    return NextResponse.json(templates);
  } catch (error: any) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates', details: error.message },
      { status: 500 }
    );
  }
}
