'use server'

import { Card } from '@/types/poker'
import { analyzePokerHand } from '@/lib/openai'
import { evaluateHandStrength, convertCardToEvaluatorFormat } from '@/lib/poker-evaluator'

export async function analyzeHandAction(holeCards: Card[], communityCards: Card[]) {
  console.log('🚀 Starting analyzeHandAction...')
  console.log('📊 Input - Hole Cards:', holeCards)
  console.log('📊 Input - Community Cards:', communityCards)
  
  try {
    // Validate input
    if (!holeCards || holeCards.length < 2) {
      console.log('❌ Validation failed: Not enough hole cards')
      return {
        success: false,
        error: 'At least 2 hole cards are required for analysis'
      }
    }

    if (holeCards.length > 2) {
      console.log('❌ Validation failed: Too many hole cards')
      return {
        success: false,
        error: 'Maximum 2 hole cards allowed'
      }
    }

    if (communityCards && communityCards.length > 5) {
      console.log('❌ Validation failed: Too many community cards')
      return {
        success: false,
        error: 'Maximum 5 community cards allowed'
      }
    }

    // Convert cards to string format for AI analysis
    const holeCardsStr = holeCards.map(convertCardToEvaluatorFormat)
    const communityCardsStr = communityCards.map(convertCardToEvaluatorFormat)
    console.log('🔄 Converted cards - Hole:', holeCardsStr, 'Community:', communityCardsStr)
    
    // Get basic hand evaluation first
    console.log('📊 Getting basic hand evaluation...')
    const handEvaluation = evaluateHandStrength(holeCards, communityCards)
    console.log('📊 Basic evaluation result:', handEvaluation)
    
    // Try to get AI analysis, fallback to basic evaluation if API fails
    let aiAnalysis
    try {
      console.log('🤖 Attempting AI analysis...')
      aiAnalysis = await analyzePokerHand(holeCardsStr, communityCardsStr)
      console.log('✅ AI analysis successful:', aiAnalysis)
      
      // Validate AI response
      if (!aiAnalysis || typeof aiAnalysis !== 'object') {
        throw new Error('Invalid AI response format')
      }
      
      // Ensure required fields exist
      if (!aiAnalysis.handStrength || !aiAnalysis.recommendation) {
        throw new Error('Incomplete AI response')
      }
      
    } catch (error) {
      console.warn('⚠️ AI analysis failed, using basic evaluation:', error)
      console.warn('⚠️ Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      })
      
      // Fallback to basic evaluation
      aiAnalysis = {
        handStrength: handEvaluation.handStrength,
        recommendation: getRecommendationFromRank(handEvaluation.handRank),
        confidence: Math.min(handEvaluation.handRank * 10 + 20, 85),
        winProbability: handEvaluation.winProbability,
        reasoning: `Based on hand strength analysis: ${handEvaluation.handStrength}. This is a basic evaluation without AI enhancement.`
      }
      console.log('🔄 Using fallback analysis:', aiAnalysis)
    }
    
    const finalResult = {
      success: true,
      analysis: {
        handStrength: aiAnalysis.handStrength || 'Unknown',
        recommendation: aiAnalysis.recommendation || 'call',
        confidence: Math.max(0, Math.min(100, aiAnalysis.confidence || 50)),
        winProbability: Math.max(0, Math.min(100, aiAnalysis.winProbability || handEvaluation.winProbability)),
        reasoning: aiAnalysis.reasoning || 'Analysis completed with basic evaluation.'
      }
    }
    
    console.log('✅ Final result:', finalResult)
    return finalResult
  } catch (error) {
    console.error('❌ Error in analyzeHandAction:', error)
    console.error('❌ Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    })
    return {
      success: false,
      error: 'An unexpected error occurred while analyzing the hand. Please try again.'
    }
  }
}

function getRecommendationFromRank(rank: number): 'fold' | 'call' | 'raise' | 'all-in' {
  if (rank >= 7) return 'all-in'      // Four of a kind, Full house
  if (rank >= 5) return 'raise'       // Straight, Flush
  if (rank >= 3) return 'call'        // Three of a kind, Two pair
  if (rank >= 2) return 'call'        // Pair
  return 'fold'                       // High card
}
