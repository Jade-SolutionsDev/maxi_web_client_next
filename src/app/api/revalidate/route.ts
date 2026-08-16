import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

const ALLOWED_TAGS = new Set([
  'taxonomy',
  'taxonomy-tree',
  'location-catalog',
  'product-list',
  'cms',
]);

export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret || request.headers.get('x-revalidate-secret') !== secret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    tags?: unknown;
  } | null;

  const revalidated = (Array.isArray(body?.tags) ? body.tags : []).filter(
    (tag): tag is string => typeof tag === 'string' && ALLOWED_TAGS.has(tag),
  );

  for (const tag of revalidated) {
    revalidateTag(tag, 'max');
  }

  return NextResponse.json({ revalidated });
}
