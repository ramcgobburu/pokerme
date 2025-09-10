import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function analyzePokerHand(holeCards: string[], communityCards: string[]) {
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

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    return JSON.parse(response)
  } catch (error) {
    console.error('Error analyzing poker hand:', error)
    throw new Error('Failed to analyze poker hand')
  }
}
