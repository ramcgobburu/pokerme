import { Card, Suit, CardValue } from '@/types/poker'

// Convert our card format to the format expected by the poker evaluator
export function convertCardToEvaluatorFormat(card: Card): string {
  const suitMap: { [key in Suit]: string } = {
    'hearts': 'h',
    'diamonds': 'd', 
    'clubs': 'c',
    'spades': 's'
  }
  
  const valueMap: { [key in CardValue]: string } = {
    'A': 'A',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9',
    '10': 'T',
    'J': 'J',
    'Q': 'Q',
    'K': 'K'
  }
  
  return valueMap[card.value] + suitMap[card.suit]
}

// Evaluate hand strength using basic poker logic
export function evaluateHandStrength(holeCards: Card[], communityCards: Card[]): {
  handStrength: string
  handRank: number
  winProbability: number
} {
  const allCards = [...holeCards, ...communityCards]
  
  if (allCards.length < 2) {
    return {
      handStrength: "Insufficient cards",
      handRank: 0,
      winProbability: 0
    }
  }

  // Basic hand evaluation logic
  const handAnalysis = analyzeHand(allCards)
  
  return {
    handStrength: handAnalysis.description,
    handRank: handAnalysis.rank,
    winProbability: calculateWinProbability(handAnalysis.rank, allCards.length)
  }
}

interface HandAnalysis {
  description: string
  rank: number
  isFlush: boolean
  isStraight: boolean
  pairs: number
  threeOfAKind: boolean
  fourOfAKind: boolean
}

function analyzeHand(cards: Card[]): HandAnalysis {
  const values = cards.map(card => card.value)
  const suits = cards.map(card => card.suit)
  
  // Count occurrences of each value
  const valueCounts: { [key: string]: number } = {}
  values.forEach(value => {
    valueCounts[value] = (valueCounts[value] || 0) + 1
  })
  
  // Count occurrences of each suit
  const suitCounts: { [key: string]: number } = {}
  suits.forEach(suit => {
    suitCounts[suit] = (suitCounts[suit] || 0) + 1
  })
  
  const counts = Object.values(valueCounts).sort((a, b) => b - a)
  const maxSuitCount = Math.max(...Object.values(suitCounts))
  
  const isFlush = maxSuitCount >= 5
  const isStraight = checkStraight(values)
  const pairs = counts.filter(count => count === 2).length
  const threeOfAKind = counts.includes(3)
  const fourOfAKind = counts.includes(4)
  
  let description = "High card"
  let rank = 1
  
  if (fourOfAKind) {
    description = "Four of a kind"
    rank = 8
  } else if (threeOfAKind && pairs > 0) {
    description = "Full house"
    rank = 7
  } else if (isFlush) {
    description = "Flush"
    rank = 6
  } else if (isStraight) {
    description = "Straight"
    rank = 5
  } else if (threeOfAKind) {
    description = "Three of a kind"
    rank = 4
  } else if (pairs === 2) {
    description = "Two pair"
    rank = 3
  } else if (pairs === 1) {
    description = "Pair"
    rank = 2
  }
  
  return {
    description,
    rank,
    isFlush,
    isStraight,
    pairs,
    threeOfAKind,
    fourOfAKind
  }
}

function checkStraight(values: CardValue[]): boolean {
  const valueOrder = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
  const numericValues = values.map(value => valueOrder.indexOf(value)).sort((a, b) => a - b)
  
  // Check for consecutive values
  for (let i = 0; i <= numericValues.length - 5; i++) {
    let consecutive = true
    for (let j = 1; j < 5; j++) {
      if (numericValues[i + j] !== numericValues[i] + j) {
        consecutive = false
        break
      }
    }
    if (consecutive) return true
  }
  
  // Check for A-2-3-4-5 straight (low ace)
  const lowAceStraight = ['A', '2', '3', '4', '5']
  const hasLowAceStraight = lowAceStraight.every(val => values.includes(val as CardValue))
  if (hasLowAceStraight) return true
  
  return false
}

function calculateWinProbability(handRank: number, totalCards: number): number {
  // Base win probability based on hand rank
  const baseProbabilities = {
    1: 5,   // High card
    2: 15,  // Pair
    3: 25,  // Two pair
    4: 35,  // Three of a kind
    5: 45,  // Straight
    6: 55,  // Flush
    7: 70,  // Full house
    8: 85   // Four of a kind
  }
  
  let baseProbability = baseProbabilities[handRank as keyof typeof baseProbabilities] || 5
  
  // Adjust based on number of cards (more cards = more information)
  if (totalCards >= 7) {
    baseProbability += 10
  } else if (totalCards >= 5) {
    baseProbability += 5
  }
  
  return Math.min(baseProbability, 95) // Cap at 95%
}
