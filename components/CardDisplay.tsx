'use client'

import { Card } from '@/types/poker'
import { getSuitSymbol, getCardDisplayValue } from '@/utils/cardUtils'

interface CardDisplayProps {
  card: Card
  size?: 'small' | 'medium' | 'large'
}

export default function CardDisplay({ card, size = 'medium' }: CardDisplayProps) {
  const sizeClasses = {
    small: 'w-12 h-16 text-xs',
    medium: 'w-20 h-28 text-sm',
    large: 'w-24 h-32 text-base'
  }

  return (
    <div className={`card ${card.color === 'red' ? 'card-red' : 'card-black'} ${sizeClasses[size]}`}>
      <div className="card-suit text-2xl">{getSuitSymbol(card.suit)}</div>
      <div className="card-number text-lg font-bold">{getCardDisplayValue(card.value)}</div>
    </div>
  )
}
