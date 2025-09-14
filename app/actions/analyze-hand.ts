'use server'

import { Card } from '@/types/poker'
import { analyzePokerHand, analyzePreFlop, analyzeFlop, analyzeTurn, analyzeRiver } from '@/lib/openai'
import { evaluateHandStrength, convertCardToEvaluatorFormat } from '@/lib/poker-evaluator'

// Progressive analysis functions for each betting round
export async function analyzePreFlopAction(holeCards: Card[]) {
  console.log('🚀 Starting pre-flop analysis...')
  console.log('📊 Input - Hole Cards:', holeCards)
  
  try {
    if (!holeCards || holeCards.length !== 2) {
      return {
        success: false,
        error: 'Exactly 2 hole cards are required for pre-flop analysis'
      }
    }

    const holeCardsStr = holeCards.map(convertCardToEvaluatorFormat)
    console.log('🔄 Converted hole cards:', holeCardsStr)
    
    let aiAnalysis
    try {
      console.log('🤖 Attempting pre-flop AI analysis...')
      aiAnalysis = await analyzePreFlop(holeCardsStr)
      console.log('✅ Pre-flop AI analysis successful:', aiAnalysis)
      
      if (!aiAnalysis || typeof aiAnalysis !== 'object' || !aiAnalysis.handStrength || !aiAnalysis.recommendation) {
        throw new Error('Invalid AI response format')
      }
      
    } catch (error) {
      console.warn('⚠️ Pre-flop AI analysis failed, using basic evaluation:', error)
      
      const handEvaluation = evaluateHandStrength(holeCards, [])
      aiAnalysis = {
        handStrength: `Pre-flop: ${handEvaluation.handStrength}`,
        recommendation: getRecommendationFromRank(handEvaluation.handRank),
        confidence: Math.min(handEvaluation.handRank * 10 + 20, 85),
        winProbability: handEvaluation.winProbability,
        reasoning: `Pre-flop analysis based on starting hand strength: ${handEvaluation.handStrength}. This is a basic evaluation without AI enhancement.`
      }
    }
    
    return {
      success: true,
      analysis: {
        handStrength: aiAnalysis.handStrength || 'Unknown',
        recommendation: aiAnalysis.recommendation || 'call',
        confidence: Math.max(0, Math.min(100, aiAnalysis.confidence || 50)),
        winProbability: Math.max(0, Math.min(100, aiAnalysis.winProbability || 50)),
        reasoning: aiAnalysis.reasoning || 'Pre-flop analysis completed with basic evaluation.',
        stage: 'pre-flop'
      }
    }
  } catch (error) {
    console.error('❌ Error in pre-flop analysis:', error)
    return {
      success: false,
      error: 'An unexpected error occurred during pre-flop analysis. Please try again.'
    }
  }
}

export async function analyzeFlopAction(holeCards: Card[], flopCards: Card[]) {
  console.log('🚀 Starting flop analysis...')
  console.log('📊 Input - Hole Cards:', holeCards)
  console.log('📊 Input - Flop Cards:', flopCards)
  
  try {
    if (!holeCards || holeCards.length !== 2) {
      return {
        success: false,
        error: 'Exactly 2 hole cards are required for flop analysis'
      }
    }

    if (!flopCards || flopCards.length !== 3) {
      return {
        success: false,
        error: 'Exactly 3 flop cards are required for flop analysis'
      }
    }

    const holeCardsStr = holeCards.map(convertCardToEvaluatorFormat)
    const flopCardsStr = flopCards.map(convertCardToEvaluatorFormat)
    console.log('🔄 Converted cards - Hole:', holeCardsStr, 'Flop:', flopCardsStr)
    
    let aiAnalysis
    try {
      console.log('🤖 Attempting flop AI analysis...')
      aiAnalysis = await analyzeFlop(holeCardsStr, flopCardsStr)
      console.log('✅ Flop AI analysis successful:', aiAnalysis)
      
      if (!aiAnalysis || typeof aiAnalysis !== 'object' || !aiAnalysis.handStrength || !aiAnalysis.recommendation) {
        throw new Error('Invalid AI response format')
      }
      
    } catch (error) {
      console.warn('⚠️ Flop AI analysis failed, using basic evaluation:', error)
      
      const handEvaluation = evaluateHandStrength(holeCards, flopCards)
      aiAnalysis = {
        handStrength: `Flop: ${handEvaluation.handStrength}`,
        recommendation: getRecommendationFromRank(handEvaluation.handRank),
        confidence: Math.min(handEvaluation.handRank * 10 + 20, 85),
        winProbability: handEvaluation.winProbability,
        reasoning: `Flop analysis based on hand strength: ${handEvaluation.handStrength}. This is a basic evaluation without AI enhancement.`
      }
    }
    
    return {
      success: true,
      analysis: {
        handStrength: aiAnalysis.handStrength || 'Unknown',
        recommendation: aiAnalysis.recommendation || 'call',
        confidence: Math.max(0, Math.min(100, aiAnalysis.confidence || 50)),
        winProbability: Math.max(0, Math.min(100, aiAnalysis.winProbability || 50)),
        reasoning: aiAnalysis.reasoning || 'Flop analysis completed with basic evaluation.',
        stage: 'flop'
      }
    }
  } catch (error) {
    console.error('❌ Error in flop analysis:', error)
    return {
      success: false,
      error: 'An unexpected error occurred during flop analysis. Please try again.'
    }
  }
}

export async function analyzeTurnAction(holeCards: Card[], communityCards: Card[]) {
  console.log('🚀 Starting turn analysis...')
  console.log('📊 Input - Hole Cards:', holeCards)
  console.log('📊 Input - Community Cards:', communityCards)
  
  try {
    if (!holeCards || holeCards.length !== 2) {
      return {
        success: false,
        error: 'Exactly 2 hole cards are required for turn analysis'
      }
    }

    if (!communityCards || communityCards.length !== 4) {
      return {
        success: false,
        error: 'Exactly 4 community cards are required for turn analysis'
      }
    }

    const holeCardsStr = holeCards.map(convertCardToEvaluatorFormat)
    const communityCardsStr = communityCards.map(convertCardToEvaluatorFormat)
    console.log('🔄 Converted cards - Hole:', holeCardsStr, 'Community:', communityCardsStr)
    
    let aiAnalysis
    try {
      console.log('🤖 Attempting turn AI analysis...')
      aiAnalysis = await analyzeTurn(holeCardsStr, communityCardsStr)
      console.log('✅ Turn AI analysis successful:', aiAnalysis)
      
      if (!aiAnalysis || typeof aiAnalysis !== 'object' || !aiAnalysis.handStrength || !aiAnalysis.recommendation) {
        throw new Error('Invalid AI response format')
      }
      
    } catch (error) {
      console.warn('⚠️ Turn AI analysis failed, using basic evaluation:', error)
      
      const handEvaluation = evaluateHandStrength(holeCards, communityCards)
      aiAnalysis = {
        handStrength: `Turn: ${handEvaluation.handStrength}`,
        recommendation: getRecommendationFromRank(handEvaluation.handRank),
        confidence: Math.min(handEvaluation.handRank * 10 + 20, 85),
        winProbability: handEvaluation.winProbability,
        reasoning: `Turn analysis based on hand strength: ${handEvaluation.handStrength}. This is a basic evaluation without AI enhancement.`
      }
    }
    
    return {
      success: true,
      analysis: {
        handStrength: aiAnalysis.handStrength || 'Unknown',
        recommendation: aiAnalysis.recommendation || 'call',
        confidence: Math.max(0, Math.min(100, aiAnalysis.confidence || 50)),
        winProbability: Math.max(0, Math.min(100, aiAnalysis.winProbability || 50)),
        reasoning: aiAnalysis.reasoning || 'Turn analysis completed with basic evaluation.',
        stage: 'turn'
      }
    }
  } catch (error) {
    console.error('❌ Error in turn analysis:', error)
    return {
      success: false,
      error: 'An unexpected error occurred during turn analysis. Please try again.'
    }
  }
}

export async function analyzeRiverAction(holeCards: Card[], communityCards: Card[]) {
  console.log('🚀 Starting river analysis...')
  console.log('📊 Input - Hole Cards:', holeCards)
  console.log('📊 Input - Community Cards:', communityCards)
  
  try {
    if (!holeCards || holeCards.length !== 2) {
      return {
        success: false,
        error: 'Exactly 2 hole cards are required for river analysis'
      }
    }

    if (!communityCards || communityCards.length !== 5) {
      return {
        success: false,
        error: 'Exactly 5 community cards are required for river analysis'
      }
    }

    const holeCardsStr = holeCards.map(convertCardToEvaluatorFormat)
    const communityCardsStr = communityCards.map(convertCardToEvaluatorFormat)
    console.log('🔄 Converted cards - Hole:', holeCardsStr, 'Community:', communityCardsStr)
    
    let aiAnalysis
    try {
      console.log('🤖 Attempting river AI analysis...')
      aiAnalysis = await analyzeRiver(holeCardsStr, communityCardsStr)
      console.log('✅ River AI analysis successful:', aiAnalysis)
      
      if (!aiAnalysis || typeof aiAnalysis !== 'object' || !aiAnalysis.handStrength || !aiAnalysis.recommendation) {
        throw new Error('Invalid AI response format')
      }
      
    } catch (error) {
      console.warn('⚠️ River AI analysis failed, using basic evaluation:', error)
      
      const handEvaluation = evaluateHandStrength(holeCards, communityCards)
      aiAnalysis = {
        handStrength: `River: ${handEvaluation.handStrength}`,
        recommendation: getRecommendationFromRank(handEvaluation.handRank),
        confidence: Math.min(handEvaluation.handRank * 10 + 20, 85),
        winProbability: handEvaluation.winProbability,
        reasoning: `River analysis based on hand strength: ${handEvaluation.handStrength}. This is a basic evaluation without AI enhancement.`
      }
    }
    
    return {
      success: true,
      analysis: {
        handStrength: aiAnalysis.handStrength || 'Unknown',
        recommendation: aiAnalysis.recommendation || 'call',
        confidence: Math.max(0, Math.min(100, aiAnalysis.confidence || 50)),
        winProbability: Math.max(0, Math.min(100, aiAnalysis.winProbability || 50)),
        reasoning: aiAnalysis.reasoning || 'River analysis completed with basic evaluation.',
        stage: 'river'
      }
    }
  } catch (error) {
    console.error('❌ Error in river analysis:', error)
    return {
      success: false,
      error: 'An unexpected error occurred during river analysis. Please try again.'
    }
  }
}

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
