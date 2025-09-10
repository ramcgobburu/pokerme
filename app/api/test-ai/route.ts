import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  console.log('🧪 [API] Testing AI configuration...')
  
  const apiKey = process.env.OPENAI_API_KEY
  console.log('🔑 [API] API Key exists:', !!apiKey)
  console.log('🔑 [API] API Key length:', apiKey?.length || 0)
  console.log('🔑 [API] API Key starts with:', apiKey?.substring(0, 10) || 'N/A')
  
  return NextResponse.json({
    apiKeyExists: !!apiKey,
    apiKeyLength: apiKey?.length || 0,
    apiKeyPrefix: apiKey?.substring(0, 10) || 'N/A',
    message: apiKey ? 'API key is configured' : 'API key is missing'
  })
}
