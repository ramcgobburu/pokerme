'use client'

import { useState } from 'react'
import { Card, CardColor, Suit, CardValue, GamePhase as PhaseType } from '@/types/poker'
import { isCardDuplicate } from '@/utils/cardUtils'
import { useToast } from './ToastProvider'
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
  const { showToast } = useToast()
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
      
      // Check for duplicate cards
      const allExistingCards = [...holeCards, ...communityCards]
      if (isCardDuplicate(newCard, allExistingCards)) {
        showToast('This card has already been selected. Please choose a different card.', 'warning')
        return
      }
      
      onCardAdd(newCard)
      setCurrentSelection({ color: null, suit: null, value: null })
    }
  }

  const getPhaseTitle = () => {
    switch (phase) {
      case 'flop': return `Flop - Select 3 Community Cards (${communityCards.length}/3)`
      case 'turn': return `Turn - Select 1 More Community Card (${communityCards.length}/4 total)`
      case 'river': return `River - Select Final Community Card (${communityCards.length}/5 total)`
      default: return 'Community Cards'
    }
  }

  const getRequiredCards = () => {
    switch (phase) {
      case 'flop': return 3  // Need 3 cards for flop
      case 'turn': return 4  // Need 4 cards total (3 flop + 1 turn)
      case 'river': return 5 // Need 5 cards total (3 flop + 1 turn + 1 river)
      default: return 0
    }
  }

  const requiredCards = getRequiredCards()
  const cardsNeeded = requiredCards - communityCards.length

  const renderCardSelection = () => {
    if (cardsNeeded <= 0) {
      return (
        <div className="text-center">
          <div className="text-green-200 text-lg mb-4">
            {phase === 'flop' ? 'Flop complete! Moving to Turn...' : 
             phase === 'turn' ? 'Turn complete! Moving to River...' : 
             'River complete! Analyzing hand...'}
          </div>
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
        cardNumber={communityCards.length + 1}
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
