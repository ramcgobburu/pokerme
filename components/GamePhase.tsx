'use client'

import { useState } from 'react'
import { Card, CardColor, Suit, CardValue, GamePhase as PhaseType } from '@/types/poker'
import ColorSelection from './ColorSelection'
import SuitSelection from './SuitSelection'
import ValueSelection from './ValueSelection'
import CardDisplay from './CardDisplay'

interface GamePhaseProps {
  phase: PhaseType
  holeCards: Card[]
  communityCards: Card[]
  onCardAdd: (card: Card) => void
  onNextPhase: () => void
  onReset: () => void
}

export default function GamePhase({ phase, holeCards, communityCards, onCardAdd, onNextPhase, onReset }: GamePhaseProps) {
  const [currentSelection, setCurrentSelection] = useState<{
    color: CardColor | null
    suit: Suit | null
    value: CardValue | null
  }>({
    color: null,
    suit: null,
    value: null
  })

  const handleColorSelect = (color: CardColor) => {
    setCurrentSelection(prev => ({ ...prev, color, suit: null, value: null }))
  }

  const handleSuitSelect = (suit: Suit) => {
    setCurrentSelection(prev => ({ ...prev, suit, value: null }))
  }

  const handleValueSelect = (value: CardValue) => {
    if (currentSelection.color && currentSelection.suit) {
      const newCard: Card = {
        suit: currentSelection.suit,
        value,
        color: currentSelection.color
      }
      onCardAdd(newCard)
      setCurrentSelection({ color: null, suit: null, value: null })
    }
  }

  const getPhaseTitle = () => {
    switch (phase) {
      case 'flop': return 'Flop - Select 3 Community Cards'
      case 'turn': return 'Turn - Select 1 Community Card'
      case 'river': return 'River - Select 1 Community Card'
      default: return 'Community Cards'
    }
  }

  const getRequiredCards = () => {
    switch (phase) {
      case 'flop': return 3
      case 'turn': return 1
      case 'river': return 1
      default: return 0
    }
  }

  const requiredCards = getRequiredCards()
  const cardsNeeded = requiredCards - communityCards.length

  const renderCardSelection = () => {
    if (cardsNeeded <= 0) {
      return (
        <div className="text-center">
          <button onClick={onNextPhase} className="poker-button text-xl px-8 py-4">
            Continue to {phase === 'flop' ? 'Turn' : phase === 'turn' ? 'River' : 'Analysis'}
          </button>
        </div>
      )
    }

    if (!currentSelection.color) {
      return <ColorSelection onColorSelect={handleColorSelect} />
    }

    if (!currentSelection.suit) {
      return (
        <SuitSelection 
          color={currentSelection.color} 
          onSuitSelect={handleSuitSelect}
          onBack={() => setCurrentSelection(prev => ({ ...prev, color: null }))}
        />
      )
    }

    return (
      <ValueSelection 
        suit={currentSelection.suit}
        color={currentSelection.color}
        onValueSelect={handleValueSelect}
        onBack={() => setCurrentSelection(prev => ({ ...prev, suit: null }))}
      />
    )
  }

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-white mb-8">{getPhaseTitle()}</h2>
      
      {/* Hole Cards */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Your Hole Cards</h3>
        <div className="flex justify-center gap-4">
          {holeCards.map((card, index) => (
            <CardDisplay key={index} card={card} />
          ))}
        </div>
      </div>

      {/* Community Cards */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Community Cards</h3>
        <div className="flex justify-center gap-4">
          {communityCards.map((card, index) => (
            <CardDisplay key={index} card={card} />
          ))}
          {cardsNeeded > 0 && (
            <div className="card bg-gray-200 border-dashed border-2 border-gray-400 flex items-center justify-center">
              <span className="text-gray-500 text-sm">?</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Selection */}
      {renderCardSelection()}

      {/* Reset Button */}
      <div className="mt-8">
        <button 
          onClick={onReset}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Reset Game
        </button>
      </div>
    </div>
  )
}
