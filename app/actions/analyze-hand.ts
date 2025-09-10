'use server'

import { Card } from '@/types/poker'
import { analyzePokerHand } from '@/lib/openai'
import { evaluateHandStrength, convertCardToEvaluatorFormat } from '@/lib/poker-evaluator'

export async function analyzeHandAction(holeCards: Card[], communityCards: Card[]) {
  try {
    // Validate input
    if (!holeCards || holeCards.length < 2) {
      return {
        success: false,
        error: 'At least 2 hole cards are required for analysis'
      }
    }

    if (holeCards.length > 2) {
      return {
        success: false,
        error: 'Maximum 2 hole cards allowed'
      }
    }

    if (communityCards && communityCards.length > 5) {
      return {
        success: false,
        error: 'Maximum 5 community cards allowed'
      }
    }

    // Convert cards to string format for AI analysis
    const holeCardsStr = holeCards.map(convertCardToEvaluatorFormat)
    const communityCardsStr = communityCards.map(convertCardToEvaluatorFormat)
    
    // Get basic hand evaluation first
    const handEvaluation = evaluateHandStrength(holeCards, communityCards)
    
    // Try to get AI analysis, fallback to basic evaluation if API fails
    let aiAnalysis
    try {
      aiAnalysis = await analyzePokerHand(holeCardsStr, communityCardsStr)
      
      // Validate AI response
      if (!aiAnalysis || typeof aiAnalysis !== 'object') {
        throw new Error('Invalid AI response format')
      }
      
      // Ensure required fields exist
      if (!aiAnalysis.handStrength || !aiAnalysis.recommendation) {
        throw new Error('Incomplete AI response')
      }
      
    } catch (error) {
      console.warn('AI analysis failed, using basic evaluation:', error)
      // Fallback to basic evaluation
      aiAnalysis = {
        handStrength: handEvaluation.handStrength,
        recommendation: getRecommendationFromRank(handEvaluation.handRank),
        confidence: Math.min(handEvaluation.handRank * 10 + 20, 85),
        winProbability: handEvaluation.winProbability,
        reasoning: `Based on hand strength analysis: ${handEvaluation.handStrength}. This is a basic evaluation without AI enhancement.`
      }
    }
    
    return {
      success: true,
      analysis: {
        handStrength: aiAnalysis.handStrength || 'Unknown',
        recommendation: aiAnalysis.recommendation || 'call',
        confidence: Math.max(0, Math.min(100, aiAnalysis.confidence || 50)),
        winProbability: Math.max(0, Math.min(100, aiAnalysis.winProbability || handEvaluation.winProbability)),
        reasoning: aiAnalysis.reasoning || 'Analysis completed with basic evaluation.'
      }
    }
  } catch (error) {
    console.error('Error in analyzeHandAction:', error)
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
