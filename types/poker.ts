export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades'
export type CardValue = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'
export type CardColor = 'red' | 'black'

export interface Card {
  suit: Suit
  value: CardValue
  color: CardColor
}

export interface PokerHand {
  holeCards: Card[]
  communityCards: Card[]
  handStrength: string
  recommendation: 'fold' | 'call' | 'raise' | 'all-in'
  confidence: number
  reasoning: string
}

export type GamePhase = 'color-selection' | 'suit-selection' | 'value-selection' | 'hole-cards-complete' | 'flop' | 'turn' | 'river' | 'flop-analysis' | 'turn-analysis' | 'river-analysis' | 'analysis'

export interface GameState {
  phase: GamePhase
  selectedColor: CardColor | null
  selectedSuit: Suit | null
  selectedValue: CardValue | null
  holeCards: Card[]
  communityCards: Card[]
  currentCardIndex: number
}
