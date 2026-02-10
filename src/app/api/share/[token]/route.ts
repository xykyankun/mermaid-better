import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const sql = neon(DATABASE_URL);

/**
 * GET /api/share/[token]
 * Get a public diagram by share token
 * Also increments view count
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    // Find diagram by share token
    const diagrams = await sql`
      SELECT
        id,
        title,
        content,
        type,
        description,
        view_count,
        created_at,
        updated_at
      FROM diagrams
      WHERE share_token = ${token} AND is_public = true
    `;

    if (diagrams.length === 0) {
      return NextResponse.json(
        { error: 'Shared diagram not found or not public' },
        { status: 404 }
      );
    }

    const diagram = diagrams[0];

    // Increment view count
    await sql`
      UPDATE diagrams
      SET view_count = view_count + 1
      WHERE share_token = ${token}
    `;

    return NextResponse.json({
      ...diagram,
      view_count: (diagram.view_count as number) + 1,
    });
  } catch (error: any) {
    console.error('Error fetching shared diagram:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shared diagram', details: error.message },
      { status: 500 }
    );
  }
}
