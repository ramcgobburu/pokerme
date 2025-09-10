'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/types/poker'
import CardDisplay from './CardDisplay'
import { analyzeHandAction } from '@/app/actions/analyze-hand'

interface AnalysisDisplayProps {
  holeCards: Card[]
  communityCards: Card[]
  onReset: () => void
}

interface HandAnalysis {
  handStrength: string
  recommendation: 'fold' | 'call' | 'raise' | 'all-in'
  confidence: number
  reasoning: string
  winProbability: number
}

export default function AnalysisDisplay({ holeCards, communityCards, onReset }: AnalysisDisplayProps) {
  const [analysis, setAnalysis] = useState<HandAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const analyzeHand = async () => {
      console.log('🎯 [CLIENT] Starting hand analysis...')
      console.log('📊 [CLIENT] Hole Cards:', holeCards)
      console.log('📊 [CLIENT] Community Cards:', communityCards)
      
      setLoading(true)
      setError(null)
      
      try {
        // Validate that we have enough cards for analysis
        if (holeCards.length < 2) {
          console.log('❌ [CLIENT] Not enough hole cards')
          setError('Please select at least 2 hole cards before analysis')
          return
        }
        
        console.log('🚀 [CLIENT] Calling analyzeHandAction...')
        const result = await analyzeHandAction(holeCards, communityCards)
        console.log('📄 [CLIENT] Received result:', result)
        
        if (result.success) {
          console.log('✅ [CLIENT] Analysis successful, setting analysis data')
          // Type guard: if success is true, result must have analysis property
          const successResult = result as { success: true; analysis: HandAnalysis }
          setAnalysis(successResult.analysis)
        } else {
          console.log('❌ [CLIENT] Analysis failed:', result)
          // Type guard: if success is false, result must have error property
          const errorResult = result as { success: false; error: string }
          setError(errorResult.error || 'Failed to analyze hand. Please try again.')
        }
      } catch (err) {
        console.error('❌ [CLIENT] Error analyzing hand:', err)
        setError('An unexpected error occurred. Please check your internet connection and try again.')
      } finally {
        console.log('🏁 [CLIENT] Analysis complete, setting loading to false')
        setLoading(false)
      }
    }

    analyzeHand()
  }, [holeCards, communityCards])

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'fold': return 'text-red-500'
      case 'call': return 'text-yellow-500'
      case 'raise': return 'text-green-500'
      case 'all-in': return 'text-purple-500'
      default: return 'text-gray-500'
    }
  }

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'fold': return '❌'
      case 'call': return '✅'
      case 'raise': return '📈'
      case 'all-in': return '🚀'
      default: return '❓'
    }
  }

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-white mb-8">Hand Analysis</h2>
      
      {/* Cards Display */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Your Hole Cards</h3>
        <div className="flex justify-center gap-4 mb-6">
          {holeCards.map((card, index) => (
            <CardDisplay key={index} card={card} />
          ))}
        </div>
        
        <h3 className="text-xl font-semibold text-white mb-4">Community Cards</h3>
        <div className="flex justify-center gap-4">
          {communityCards.map((card, index) => (
            <CardDisplay key={index} card={card} />
          ))}
        </div>
      </div>

      {/* Analysis Results */}
      {loading ? (
        <div className="bg-white/10 rounded-lg p-8 mb-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Analyzing your hand...</p>
        </div>
      ) : analysis ? (
        <div className="bg-white/10 rounded-lg p-8 mb-8 text-left">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xl font-bold text-white mb-4">Hand Strength</h4>
              <p className="text-green-100 text-lg mb-4">{analysis.handStrength}</p>
              
              <h4 className="text-xl font-bold text-white mb-4">Recommendation</h4>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{getRecommendationIcon(analysis.recommendation)}</span>
                <span className={`text-2xl font-bold ${getRecommendationColor(analysis.recommendation)}`}>
                  {analysis.recommendation.toUpperCase()}
                </span>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-white mb-2">
                  <span>Confidence</span>
                  <span>{analysis.confidence}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${analysis.confidence}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-xl font-bold text-white mb-4">Win Probability</h4>
              <div className="text-4xl font-bold text-green-400 mb-4">
                {analysis.winProbability}%
              </div>
              
              <h4 className="text-xl font-bold text-white mb-4">Reasoning</h4>
              <p className="text-green-100 text-sm leading-relaxed">
                {analysis.reasoning}
              </p>
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-500/20 rounded-lg p-8 mb-8">
          <p className="text-red-200 text-lg mb-4">Failed to analyze hand: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="bg-red-500/20 rounded-lg p-8 mb-8">
          <p className="text-red-200 text-lg">Failed to analyze hand. Please try again.</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <button 
          onClick={onReset}
          className="poker-button text-lg px-8 py-4"
        >
          New Game
        </button>
        {analysis && (
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
          >
            Analyze Again
          </button>
        )}
      </div>
    </div>
  )
}
