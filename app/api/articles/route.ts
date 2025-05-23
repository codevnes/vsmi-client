import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Parse query parameters from the request URL
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('pageSize') || '15';
    
    // Call the external API from the server side
    const response = await fetch(
      `http://103.162.21.193:4000/api/articles/processed?page=${page}&pageSize=${pageSize}`,
      { next: { revalidate: 300 } } // Cache for 5 minutes
    );
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch market news data' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error proxying market news API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 