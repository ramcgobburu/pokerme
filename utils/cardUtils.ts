import { Card, Suit, CardValue, CardColor } from '@/types/poker'

export const SUITS: { [key in Suit]: { symbol: string; color: CardColor } } = {
  hearts: { symbol: '♥', color: 'red' },
  diamonds: { symbol: '♦', color: 'red' },
  clubs: { symbol: '♣', color: 'black' },
  spades: { symbol: '♠', color: 'black' }
}

export const CARD_VALUES: CardValue[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

export const createCard = (suit: Suit, value: CardValue): Card => ({
  suit,
  value,
  color: SUITS[suit].color
})

export const getSuitSymbol = (suit: Suit): string => SUITS[suit].symbol

export const getCardDisplayValue = (value: CardValue): string => {
  switch (value) {
    case 'A': return 'A'
    case 'J': return 'J'
    case 'Q': return 'Q'
    case 'K': return 'K'
    default: return value
  }
}

export const getCardsByColor = (color: CardColor): Suit[] => {
  return Object.entries(SUITS)
    .filter(([_, data]) => data.color === color)
    .map(([suit, _]) => suit as Suit)
}

export const isCardDuplicate = (newCard: Card, existingCards: Card[]): boolean => {
  return existingCards.some(card => 
    card.suit === newCard.suit && card.value === newCard.value
  )
}

export const getAvailableCards = (allCards: Card[]): Card[] => {
  const availableCards: Card[] = []
  
  for (const suit of Object.keys(SUITS) as Suit[]) {
    for (const value of CARD_VALUES) {
      const card = createCard(suit, value)
      if (!isCardDuplicate(card, allCards)) {
        availableCards.push(card)
      }
    }
  }
  
  return availableCards
}
