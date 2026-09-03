import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({
    status: 'online',
    message: 'SocialFlow Post Queue API is active',
    timestamp: new Date().toISOString()
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { caption, targets, scheduledFor } = body;

    if (!caption || !targets || targets.length === 0) {
      return NextResponse.json(
        { error: 'Caption and at least one publish target are required.' },
        { status: 400 }
      );
    }

    const createdPost = {
      id: `api-post-${Date.now()}`,
      caption,
      targets,
      scheduledFor: scheduledFor || new Date().toISOString(),
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      post: createdPost,
      message: `Post successfully queued for ${targets.length} channels.`
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
