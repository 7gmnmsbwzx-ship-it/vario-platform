// Analytics API Route
// Tracks user interactions and page views

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      eventType,
      eventData = {},
      visitorId,
    } = body

    // Validate required fields
    if (!userId || !eventType) {
      return NextResponse.json(
        { error: 'userId and eventType are required' },
        { status: 400 }
      )
    }

    // Get request metadata
    const referrer = request.headers.get('referer') || null
    const userAgent = request.headers.get('user-agent') || null
    const forwardedFor = request.headers.get('x-forwarded-for')
    const ipAddress = forwardedFor 
      ? forwardedFor.split(',')[0].trim() 
      : request.headers.get('x-real-ip') || null

    // Save to database
    const supabase = await createServerClient()
    
    const { error } = await (supabase as any)
      .from('page_analytics')
      .insert({
        user_id: userId,
        event_type: eventType,
        event_data: eventData,
        visitor_id: visitorId || `anon-${Date.now()}`,
        referrer,
        user_agent: userAgent,
        ip_address: ipAddress,
      })

    if (error) {
      console.error('Analytics insert error:', error)
      return NextResponse.json(
        { error: 'Failed to save analytics' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Analytics API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint for retrieving analytics
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const timeRange = searchParams.get('range') || '7d' // 7d, 30d, 90d, all
    const eventType = searchParams.get('type') // optional filter

    // Calculate date range
    let startDate: Date | null = null
    const now = new Date()
    
    switch (timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      // 'all' - no date filter
    }

    // Build query
    let query = supabase
      .from('page_analytics')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (startDate) {
      query = query.gte('created_at', startDate.toISOString())
    }

    if (eventType) {
      query = query.eq('event_type', eventType)
    }

    const { data: analytics, error } = await query

    if (error) {
      console.error('Analytics fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch analytics' },
        { status: 500 }
      )
    }

    // Get summary stats from view
    const { data: summary } = await supabase
      .from('user_analytics_summary')
      .select('*')
      .eq('user_id', user.id)
      .single()

    return NextResponse.json({
      analytics: analytics || [],
      summary: summary || {
        total_page_views: 0,
        total_block_clicks: 0,
        total_ai_chats: 0,
        unique_visitors: 0,
        active_days: 0,
      },
      timeRange,
    })

  } catch (error) {
    console.error('Analytics GET API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
