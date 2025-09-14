'use client'

import { useState } from 'react'
import { GameState, CardColor, Suit, CardValue, Card } from '@/types/poker'
import { isCardDuplicate } from '@/utils/cardUtils'
import { useToast } from './ToastProvider'
import ColorSelection from './ColorSelection'
import SuitSelection from './SuitSelection'
import ValueSelection from './ValueSelection'
import CardDisplay from './CardDisplay'
import GamePhase from './GamePhase'
import AnalysisDisplay from './AnalysisDisplay'

const initialGameState: GameState = {
  phase: 'color-selection',
  selectedColor: null,
  selectedSuit: null,
  selectedValue: null,
  holeCards: [],
  communityCards: [],
  currentCardIndex: 0
}

export default function PokerGame() {
  const [gameState, setGameState] = useState<GameState>(initialGameState)
  const { showToast } = useToast()

  const handleColorSelect = (color: CardColor) => {
    setGameState(prev => ({
      ...prev,
      selectedColor: color,
      phase: 'suit-selection'
    }))
  }

  const handleSuitSelect = (suit: Suit) => {
    setGameState(prev => ({
      ...prev,
      selectedSuit: suit,
      phase: 'value-selection'
    }))
  }

  const handleValueSelect = (value: CardValue) => {
    const newCard: Card = {
      suit: gameState.selectedSuit!,
      value,
      color: gameState.selectedColor!
    }

    // Check for duplicate cards
    const allExistingCards = [...gameState.holeCards, ...gameState.communityCards]
    if (isCardDuplicate(newCard, allExistingCards)) {
      showToast('This card has already been selected. Please choose a different card.', 'warning')
      return
    }

    const newHoleCards = [...gameState.holeCards, newCard]
    const isLastHoleCard = newHoleCards.length === 2

    setGameState(prev => ({
      ...prev,
      holeCards: newHoleCards,
      phase: isLastHoleCard ? 'hole-cards-complete' : 'color-selection',
      selectedColor: null,
      selectedSuit: null,
      selectedValue: null,
      currentCardIndex: isLastHoleCard ? 0 : prev.currentCardIndex + 1
    }))
  }

  const handleNextPhase = () => {
    setGameState(prev => {
      switch (prev.phase) {
        case 'hole-cards-complete':
          return { ...prev, phase: 'flop' }
        case 'flop':
          return { ...prev, phase: 'turn' }
        case 'turn':
          return { ...prev, phase: 'river' }
        case 'river':
          return { ...prev, phase: 'analysis' }
        default:
          return prev
      }
    })
  }

  const handleReset = () => {
    setGameState(initialGameState)
  }

  const renderCurrentPhase = () => {
    switch (gameState.phase) {
      case 'color-selection':
        return <ColorSelection onColorSelect={handleColorSelect} />
      
      case 'suit-selection':
        return (
          <SuitSelection 
            color={gameState.selectedColor!} 
            onSuitSelect={handleSuitSelect}
            onBack={() => setGameState(prev => ({ ...prev, phase: 'color-selection', selectedColor: null }))}
          />
        )
      
      case 'value-selection':
        return (
          <ValueSelection 
            suit={gameState.selectedSuit!}
            color={gameState.selectedColor!}
            cardNumber={gameState.holeCards.length + 1}
            onValueSelect={handleValueSelect}
            onBack={() => setGameState(prev => ({ ...prev, phase: 'suit-selection', selectedSuit: null }))}
          />
        )
      
      case 'hole-cards-complete':
        return (
          <AnalysisDisplay 
            holeCards={gameState.holeCards}
            communityCards={[]}
            onReset={handleReset}
            onContinue={() => setGameState(prev => ({ ...prev, phase: 'flop' }))}
            showContinueButton={true}
            continueButtonText="Continue to Flop"
          />
        )
      
      case 'flop':
      case 'turn':
      case 'river':
        return (
          <GamePhase 
            phase={gameState.phase}
            holeCards={gameState.holeCards}
            communityCards={gameState.communityCards}
            onCardAdd={(card) => setGameState(prev => {
              const newCommunityCards = [...prev.communityCards, card]
              let newPhase = prev.phase
              
              // Correct poker flow logic - show analysis after each stage
              if (prev.phase === 'flop' && newCommunityCards.length === 3) {
                newPhase = 'flop-analysis'
              } else if (prev.phase === 'turn' && newCommunityCards.length === 4) {
                newPhase = 'turn-analysis'
              } else if (prev.phase === 'river' && newCommunityCards.length === 5) {
                newPhase = 'river-analysis'
              }
              
              return {
                ...prev,
                communityCards: newCommunityCards,
                phase: newPhase
              }
            })}
            onNextPhase={() => {}} // Disabled - phases transition automatically
            onReset={handleReset}
          />
        )
      
      case 'flop-analysis':
        return (
          <AnalysisDisplay 
            holeCards={gameState.holeCards}
            communityCards={gameState.communityCards}
            onReset={handleReset}
            onContinue={() => setGameState(prev => ({ ...prev, phase: 'turn' }))}
            showContinueButton={true}
            continueButtonText="Continue to Turn"
          />
        )
      
      case 'turn-analysis':
        return (
          <AnalysisDisplay 
            holeCards={gameState.holeCards}
            communityCards={gameState.communityCards}
            onReset={handleReset}
            onContinue={() => setGameState(prev => ({ ...prev, phase: 'river' }))}
            showContinueButton={true}
            continueButtonText="Continue to River"
          />
        )
      
      case 'river-analysis':
        return (
          <AnalysisDisplay 
            holeCards={gameState.holeCards}
            communityCards={gameState.communityCards}
            onReset={handleReset}
            showContinueButton={false}
          />
        )
      
      case 'analysis':
        return (
          <AnalysisDisplay 
            holeCards={gameState.holeCards}
            communityCards={gameState.communityCards}
            onReset={handleReset}
          />
        )
      
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-2xl">
        {renderCurrentPhase()}
      </div>
    </div>
  )
}
