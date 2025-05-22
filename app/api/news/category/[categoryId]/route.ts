import { NextRequest, NextResponse } from 'next/server';
import { getTopHeadlines } from '@/lib/newsapi';

export async function GET(
  request: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  const { categoryId } = params;
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10');

  try {
    const newsData = await getTopHeadlines({
      category: categoryId,
      page,
      pageSize,
    });

    return NextResponse.json(newsData);
  } catch (error: any) {
    console.error('News API error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch news', error: error.message || error.toString() },
      { status: 500 }
    );
  }
}
