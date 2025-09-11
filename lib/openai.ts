import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function analyzePokerHand(holeCards: string[], communityCards: string[]) {
  console.log('🎯 Starting AI analysis...')
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

    console.log('📝 Sending request to OpenAI...')
    console.log('🤖 Model: gpt-4o-mini')
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Free GPT-4 model
      messages: [
        {
          role: "system",
          content: "You are an expert poker analyst with deep knowledge of Texas Hold'em strategy. Always respond with valid JSON format. Provide detailed reasoning for your recommendations based on hand strength, position, and game theory."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 600
    })

    console.log('✅ OpenAI response received')
    console.log('📄 Response object:', completion)
    
    const response = completion.choices[0]?.message?.content
    console.log('📄 Response content:', response)
    
    if (!response) {
      console.error('❌ No response content from OpenAI')
      throw new Error('No response from OpenAI')
    }

    console.log('🔄 Parsing JSON response...')
    
    // Clean the response by removing markdown code blocks if present
    let cleanResponse = response.trim()
    if (cleanResponse.startsWith('```json')) {
      cleanResponse = cleanResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '')
    } else if (cleanResponse.startsWith('```')) {
      cleanResponse = cleanResponse.replace(/^```\s*/, '').replace(/\s*```$/, '')
    }
    
    console.log('🧹 Cleaned response:', cleanResponse)
    const parsedResponse = JSON.parse(cleanResponse)
    console.log('✅ Successfully parsed AI response:', parsedResponse)
    
    return parsedResponse
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
