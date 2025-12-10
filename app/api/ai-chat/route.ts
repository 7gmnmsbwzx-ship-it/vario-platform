// AI Chat API Route - Using OpenRouter with X.AI Grok
// Handles AI chat conversations for creator profiles

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { messages, userId, visitorId, systemPrompt } = await request.json()

    // Validate required fields
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Check if OpenRouter API key is configured
    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI chat is not configured. Please add OPENROUTER_API_KEY to environment variables.' },
        { status: 503 }
      )
    }

    // Default system prompt for creator's AI assistant
    const defaultSystemPrompt = `You are a helpful AI assistant representing this creator. 
Be friendly, informative, and helpful. Answer questions about their content, products, 
and how to connect with them. Keep responses concise and engaging.`

    // Prepare messages for OpenRouter
    const chatMessages = [
      {
        role: 'system',
        content: systemPrompt || defaultSystemPrompt,
      },
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
    ]

    // Call OpenRouter API (OpenAI-compatible)
    const model = process.env.OPENROUTER_MODEL || 'x-ai/grok-2-1212:free'
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Vario Link-in-Bio',
      },
      body: JSON.stringify({
        model,
        messages: chatMessages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('OpenRouter API error:', error)
      return NextResponse.json(
        { error: 'Failed to get AI response' },
        { status: 500 }
      )
    }

    const data = await response.json()
    const aiMessage = data.choices[0]?.message?.content

    if (!aiMessage) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      )
    }

    // Calculate tokens used (approximate)
    const tokensUsed = data.usage?.total_tokens || 0

    // Save conversation to database
    const supabase = await createServerClient()
    
    // Check if conversation exists
    const { data: existingConv } = await supabase
      .from('ai_conversations')
      .select('id, messages, tokens_used')
      .eq('user_id', userId)
      .eq('visitor_id', visitorId || 'anonymous')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    const updatedMessages = [
      ...(existingConv?.messages as any[] || []),
      ...messages,
      {
        role: 'assistant',
        content: aiMessage,
        timestamp: new Date().toISOString(),
      },
    ]

    if (existingConv) {
      // Update existing conversation
      await supabase
        .from('ai_conversations')
        .update({
          messages: updatedMessages,
          tokens_used: (existingConv.tokens_used || 0) + tokensUsed,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingConv.id)
    } else {
      // Create new conversation
      await supabase
        .from('ai_conversations')
        .insert({
          user_id: userId,
          visitor_id: visitorId || 'anonymous',
          messages: updatedMessages,
          tokens_used: tokensUsed,
        })
    }

    // Track analytics
    await supabase
      .from('page_analytics')
      .insert({
        user_id: userId,
        event_type: 'ai_chat_message',
        event_data: {
          message_length: messages[messages.length - 1]?.content?.length || 0,
          response_length: aiMessage.length,
          tokens_used: tokensUsed,
        },
        visitor_id: visitorId || 'anonymous',
      })

    return NextResponse.json({
      message: aiMessage,
      tokensUsed,
      model,
    })

  } catch (error) {
    console.error('AI Chat API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  const apiKey = process.env.OPENROUTER_API_KEY
  const model = process.env.OPENROUTER_MODEL || 'x-ai/grok-2-1212:free'
  
  return NextResponse.json({
    status: 'ok',
    configured: !!apiKey,
    model: model,
    provider: 'OpenRouter (X.AI Grok)',
  })
}
