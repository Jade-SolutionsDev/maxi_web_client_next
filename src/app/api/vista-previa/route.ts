import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import { verifyPreviewToken } from '@/lib/preview-token';

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token') ?? '';

  if (!verifyPreviewToken(process.env.REVALIDATE_SECRET ?? '', token)) {
    return NextResponse.json(
      { error: 'El enlace de vista previa no es válido o ya caducó.' },
      { status: 401 },
    );
  }

  (await draftMode()).enable();
  redirect('/');
}
