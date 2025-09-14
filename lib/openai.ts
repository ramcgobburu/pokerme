import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Helper function to make OpenAI requests
async function makeOpenAIRequest(prompt: string, stage: string) {
  console.log(`📝 Sending ${stage} request to OpenAI...`)
  console.log('🤖 Model: gpt-4o-mini')
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are an expert poker analyst with deep knowledge of Texas Hold'em strategy. Always respond with valid JSON format. Provide detailed reasoning for your recommendations based on hand strength, position, pot odds, and game theory. Focus on ${stage} strategy.`
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.2,
    max_tokens: 600
  })

  console.log(`✅ OpenAI ${stage} response received`)
  console.log('📄 Response object:', completion)
  
  const response = completion.choices[0]?.message?.content
  console.log('📄 Response content:', response)
  
  if (!response) {
    console.error(`❌ No ${stage} response content from OpenAI`)
    throw new Error(`No response from OpenAI for ${stage}`)
  }

  console.log(`🔄 Parsing ${stage} JSON response...`)
  
  // Clean the response by removing markdown code blocks if present
  let cleanResponse = response.trim()
  if (cleanResponse.startsWith('```json')) {
    cleanResponse = cleanResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '')
  } else if (cleanResponse.startsWith('```')) {
    cleanResponse = cleanResponse.replace(/^```\s*/, '').replace(/\s*```$/, '')
  }
  
  console.log(`🧹 Cleaned ${stage} response:`, cleanResponse)
  const parsedResponse = JSON.parse(cleanResponse)
  console.log(`✅ Successfully parsed ${stage} AI response:`, parsedResponse)
  
  return parsedResponse
}

// Progressive analysis functions for each betting round
export async function analyzePreFlop(holeCards: string[]) {
  console.log('🎯 Starting PRE-FLOP analysis...')
  console.log('📊 Hole Cards:', holeCards)
  
  try {
    const prompt = `You are an expert poker analyst. Analyze this PRE-FLOP situation in Texas Hold'em.

Hole Cards: ${holeCards.join(', ')}

This is PRE-FLOP analysis - no community cards are visible yet. Consider:
1. Starting hand strength (premium, strong, marginal, weak)
2. Position implications (early, middle, late position)
3. Stack sizes and tournament vs cash game considerations
4. Opponent tendencies and table dynamics

Please provide:
1. Hand strength classification (e.g., "Premium pair", "Strong suited connectors", "Marginal hand")
2. Recommendation (fold/call/raise/3-bet/4-bet)
3. Confidence level (0-100%)
4. Win probability against random hands (0-100%)
5. Detailed reasoning including position strategy

Format your response as JSON:
{
  "handStrength": "string",
  "recommendation": "fold" | "call" | "raise" | "3-bet" | "4-bet",
  "confidence": number,
  "winProbability": number,
  "reasoning": "string"
}`

    return await makeOpenAIRequest(prompt, "PRE-FLOP")
  } catch (error) {
    console.error('❌ Pre-flop analysis failed:', error)
    throw error
  }
}

export async function analyzeFlop(holeCards: string[], flopCards: string[]) {
  console.log('🎯 Starting FLOP analysis...')
  console.log('📊 Hole Cards:', holeCards)
  console.log('📊 Flop Cards:', flopCards)
  
  try {
    const prompt = `You are an expert poker analyst. Analyze this FLOP situation in Texas Hold'em.

Hole Cards: ${holeCards.join(', ')}
Flop Cards: ${flopCards.join(', ')}

This is FLOP analysis - 3 community cards are visible. Consider:
1. Current hand strength (made hands, draws, air)
2. Draw possibilities (straight draws, flush draws, gutshots)
3. Board texture (wet/dry, coordinated/uncoordinated)
4. Potential opponent holdings
5. Betting patterns and position

Please provide:
1. Hand strength (e.g., "Top pair with good kicker", "Nut flush draw", "Bottom pair")
2. Recommendation (fold/call/raise/check-raise)
3. Confidence level (0-100%)
4. Win probability (0-100%)
5. Detailed reasoning including draw analysis

Format your response as JSON:
{
  "handStrength": "string",
  "recommendation": "fold" | "call" | "raise" | "check-raise",
  "confidence": number,
  "winProbability": number,
  "reasoning": "string"
}`

    return await makeOpenAIRequest(prompt, "FLOP")
  } catch (error) {
    console.error('❌ Flop analysis failed:', error)
    throw error
  }
}

export async function analyzeTurn(holeCards: string[], communityCards: string[]) {
  console.log('🎯 Starting TURN analysis...')
  console.log('📊 Hole Cards:', holeCards)
  console.log('📊 Community Cards:', communityCards)
  
  try {
    const prompt = `You are an expert poker analyst. Analyze this TURN situation in Texas Hold'em.

Hole Cards: ${holeCards.join(', ')}
Community Cards: ${communityCards.join(', ')}

This is TURN analysis - 4 community cards are visible. Consider:
1. Current hand strength after the turn
2. Draw possibilities that completed or improved
3. Pot odds and implied odds
4. Opponent betting patterns
5. Bluffing opportunities or calling stations

Please provide:
1. Hand strength (e.g., "Two pair", "Straight", "Flush", "Set")
2. Recommendation (fold/call/raise/check-call/check-raise)
3. Confidence level (0-100%)
4. Win probability (0-100%)
5. Detailed reasoning including pot odds analysis

Format your response as JSON:
{
  "handStrength": "string",
  "recommendation": "fold" | "call" | "raise" | "check-call" | "check-raise",
  "confidence": number,
  "winProbability": number,
  "reasoning": "string"
}`

    return await makeOpenAIRequest(prompt, "TURN")
  } catch (error) {
    console.error('❌ Turn analysis failed:', error)
    throw error
  }
}

export async function analyzeRiver(holeCards: string[], communityCards: string[]) {
  console.log('🎯 Starting RIVER analysis...')
  console.log('📊 Hole Cards:', holeCards)
  console.log('📊 Community Cards:', communityCards)
  
  try {
    const prompt = `You are an expert poker analyst. Analyze this RIVER situation in Texas Hold'em.

Hole Cards: ${holeCards.join(', ')}
Community Cards: ${communityCards.join(', ')}

This is RIVER analysis - all 5 community cards are visible. Consider:
1. Final hand strength (the nuts, strong hand, medium hand, weak hand)
2. Opponent range analysis based on betting patterns
3. Value betting vs bluffing opportunities
4. Pot size and bet sizing
5. Tournament vs cash game considerations

Please provide:
1. Final hand strength (e.g., "Nut flush", "Full house", "Two pair")
2. Recommendation (fold/call/raise/check-call/check-raise/value bet/bluff)
3. Confidence level (0-100%)
4. Win probability (0-100%)
5. Detailed reasoning including opponent range analysis

Format your response as JSON:
{
  "handStrength": "string",
  "recommendation": "fold" | "call" | "raise" | "check-call" | "check-raise" | "value-bet" | "bluff",
  "confidence": number,
  "winProbability": number,
  "reasoning": "string"
}`

    return await makeOpenAIRequest(prompt, "RIVER")
  } catch (error) {
    console.error('❌ River analysis failed:', error)
    throw error
  }
}

// Legacy function for backward compatibility
export async function analyzePokerHand(holeCards: string[], communityCards: string[]) {
  console.log('🎯 Starting legacy AI analysis...')
  console.log('📊 Hole Cards:', holeCards)
  console.log('📊 Community Cards:', communityCards)
  console.log('🔑 API Key exists:', !!process.env.OPENAI_API_KEY)
  console.log('🔑 API Key length:', process.env.OPENAI_API_KEY?.length || 0)
  
  try {
    const prompt = `You are an expert poker analyst. Analyze this poker hand and provide a detailed assessment.

Hole Cards: ${holeCards.join(', ')}
Community Cards: ${communityCards.join(', ')}

Please provide:
1. Hand strength (e.g., "Pair of Kings", "Ace-high flush", "Straight")
2. Recommendation (fold/call/raise/all-in)
3. Confidence level (0-100%)
4. Win probability (0-100%)
5. Detailed reasoning for your recommendation

Format your response as JSON:
{
  "handStrength": "string",
  "recommendation": "fold" | "call" | "raise" | "all-in",
  "confidence": number,
  "winProbability": number,
  "reasoning": "string"
}`

    return await makeOpenAIRequest(prompt, "LEGACY")
  } catch (error) {
    console.error('❌ AI Analysis Error Details:')
    console.error('Error type:', error instanceof Error ? error.constructor.name : 'Unknown')
    console.error('Error message:', error instanceof Error ? error.message : String(error))
    console.error('Error stack:', error instanceof Error ? error.stack : undefined)
    
    if (error && typeof error === 'object' && 'response' in error) {
      const apiError = error as any
      console.error('API Response status:', apiError.response?.status)
      console.error('API Response data:', apiError.response?.data)
    }
    
    throw new Error('Failed to analyze poker hand')
  }
}
