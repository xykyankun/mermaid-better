import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const sql = neon(DATABASE_URL);

/**
 * GET /api/templates/[id]
 * Returns a single system template by ID (publicly accessible)
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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
      WHERE id = ${id} AND is_system = true
    `;

    if (templates.length === 0) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(templates[0]);
  } catch (error: any) {
    console.error('Error fetching template:', error);
    return NextResponse.json(
      { error: 'Failed to fetch template', details: error.message },
      { status: 500 }
    );
  }
}
