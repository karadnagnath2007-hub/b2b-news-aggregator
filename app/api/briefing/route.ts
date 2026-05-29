import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const sector = (body.sector as string)?.toLowerCase().trim()
  
  return NextResponse.json({ 
    success: true, 
    sector,
    message: 'Route is working' 
  })
}
