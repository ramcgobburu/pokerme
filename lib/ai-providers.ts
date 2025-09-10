export interface AIProvider {
  name: string
  analyzePokerHand: (holeCards: string[], communityCards: string[]) => Promise<{
    handStrength: string
    recommendation: 'fold' | 'call' | 'raise' | 'all-in'
    confidence: number
    winProbability: number
    reasoning: string
  }>
}

// OpenAI Provider
export class OpenAIProvider implements AIProvider {
  name = 'OpenAI'
  
  async analyzePokerHand(holeCards: string[], communityCards: string[]) {
    const OpenAI = (await import('openai')).default
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

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

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert poker analyst. Always respond with valid JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      })

      const response = completion.choices[0]?.message?.content
      if (!response) {
        throw new Error('No response from OpenAI')
      }

      return JSON.parse(response)
    } catch (error) {
      console.error('OpenAI error:', error)
      throw new Error('OpenAI analysis failed')
    }
  }
}

// DeepSeek Provider
export class DeepSeekProvider implements AIProvider {
  name = 'DeepSeek'
  
  async analyzePokerHand(holeCards: string[], communityCards: string[]) {
    const prompt = `You are an expert poker analyst with advanced reasoning capabilities. Analyze this poker hand and provide a detailed assessment.

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

    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'You are an expert poker analyst with advanced reasoning capabilities. Always respond with valid JSON format.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.2,
          max_tokens: 800
        })
      })

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status}`)
      }

      const data = await response.json()
      const content = data.choices[0]?.message?.content
      
      if (!content) {
        throw new Error('No response from DeepSeek')
      }

      return JSON.parse(content)
    } catch (error) {
      console.error('DeepSeek error:', error)
      throw new Error('DeepSeek analysis failed')
    }
  }
}

// Anthropic Claude Provider
export class ClaudeProvider implements AIProvider {
  name = 'Claude'
  
  async analyzePokerHand(holeCards: string[], communityCards: string[]) {
    const prompt = `You are an expert poker analyst with advanced reasoning capabilities. Analyze this poker hand and provide a detailed assessment.

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

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY!,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 800,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      })

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status}`)
      }

      const data = await response.json()
      const content = data.content[0]?.text
      
      if (!content) {
        throw new Error('No response from Claude')
      }

      return JSON.parse(content)
    } catch (error) {
      console.error('Claude error:', error)
      throw new Error('Claude analysis failed')
    }
  }
}

// Local Ollama Provider (for Llama models)
export class OllamaProvider implements AIProvider {
  name = 'Ollama (Llama)'
  
  async analyzePokerHand(holeCards: string[], communityCards: string[]) {
    const prompt = `You are an expert poker analyst with advanced reasoning capabilities. Analyze this poker hand and provide a detailed assessment.

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

    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama3.1:70b', // or llama3.1:8b for smaller model
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.2,
            top_p: 0.9
          }
        })
      })

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`)
      }

      const data = await response.json()
      const content = data.response
      
      if (!content) {
        throw new Error('No response from Ollama')
      }

      return JSON.parse(content)
    } catch (error) {
      console.error('Ollama error:', error)
      throw new Error('Ollama analysis failed')
    }
  }
}

// Provider selection logic
export function getAvailableProviders(): AIProvider[] {
  const providers: AIProvider[] = []
  
  if (process.env.OPENAI_API_KEY) {
    providers.push(new OpenAIProvider())
  }
  
  if (process.env.DEEPSEEK_API_KEY) {
    providers.push(new DeepSeekProvider())
  }
  
  if (process.env.ANTHROPIC_API_KEY) {
    providers.push(new ClaudeProvider())
  }
  
  // Ollama is always available if running locally
  providers.push(new OllamaProvider())
  
  return providers
}

export function getBestProvider(): AIProvider {
  const providers = getAvailableProviders()
  
  // Priority order: DeepSeek > Claude > OpenAI > Ollama
  const priorityOrder = [
    DeepSeekProvider,
    ClaudeProvider,
    OpenAIProvider,
    OllamaProvider
  ]
  
  for (const ProviderClass of priorityOrder) {
    const provider = providers.find(p => p instanceof ProviderClass)
    if (provider) {
      return provider
    }
  }
  
  // Fallback to first available
  return providers[0] || new OpenAIProvider()
}
