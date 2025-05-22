// app/api/news/headlines/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTopHeadlines } from '@/lib/newsapi';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const query = searchParams.get('q');
  const pageSize = searchParams.get('pageSize') ? parseInt(searchParams.get('pageSize')!) : 20;
  const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
  
  try {
    const newsData = await getTopHeadlines({
      category: category || undefined,
      q: query || undefined,
      pageSize,
      page,
    });
    
    return NextResponse.json(newsData);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}