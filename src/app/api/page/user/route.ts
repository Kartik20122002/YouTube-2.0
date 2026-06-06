import { NextRequest, NextResponse } from 'next/server'

// Personalized feed via ytdl-core was removed (unreliable, high memory cost).
// Returns empty so the UI falls back to the popular feed.
export async function POST(req: NextRequest) {
    return NextResponse.json({ videoItems: [] });
}
