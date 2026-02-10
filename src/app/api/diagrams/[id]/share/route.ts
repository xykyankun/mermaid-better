import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const sql = neon(DATABASE_URL);

/**
 * POST /api/diagrams/[id]/share
 * Enable/disable sharing for a diagram
 * Request body: { isPublic: boolean, userId: string }
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { isPublic, userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      );
    }

    // Verify ownership
    const diagrams = await sql`
      SELECT id, user_id FROM diagrams
      WHERE id = ${id}
    `;

    if (diagrams.length === 0) {
      return NextResponse.json(
        { error: 'Diagram not found' },
        { status: 404 }
      );
    }

    if (diagrams[0].user_id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Generate share token if enabling sharing and token doesn't exist
    let shareToken = null;
    if (isPublic) {
      const existing = await sql`
        SELECT share_token FROM diagrams WHERE id = ${id}
      `;

      if (existing[0].share_token) {
        shareToken = existing[0].share_token;
      } else {
        // Generate unique token
        shareToken = randomBytes(32).toString('hex');
      }
    }

    // Update diagram
    const updated = await sql`
      UPDATE diagrams
      SET
        is_public = ${isPublic},
        share_token = ${shareToken},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, is_public, share_token, view_count
    `;

    return NextResponse.json(updated[0]);
  } catch (error: any) {
    console.error('Error toggling share:', error);
    return NextResponse.json(
      { error: 'Failed to update sharing settings', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/diagrams/[id]/share
 * Get sharing status of a diagram
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      );
    }

    const diagrams = await sql`
      SELECT id, is_public, share_token, view_count
      FROM diagrams
      WHERE id = ${id} AND user_id = ${userId}
    `;

    if (diagrams.length === 0) {
      return NextResponse.json(
        { error: 'Diagram not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(diagrams[0]);
  } catch (error: any) {
    console.error('Error getting share status:', error);
    return NextResponse.json(
      { error: 'Failed to get sharing status', details: error.message },
      { status: 500 }
    );
  }
}
