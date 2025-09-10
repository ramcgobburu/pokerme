'use client'

import { memo } from 'react'
import { Card } from '@/types/poker'
import { getSuitSymbol, getCardDisplayValue } from '@/utils/cardUtils'

interface CardDisplayProps {
  card: Card
  size?: 'small' | 'medium' | 'large'
}

const CardDisplay = memo(function CardDisplay({ card, size = 'medium' }: CardDisplayProps) {
  const sizeClasses = {
    small: 'w-12 h-16 text-xs',
    medium: 'w-20 h-28 text-sm',
    large: 'w-24 h-32 text-base'
  }

  return (
    <div className={`card ${card.color} ${sizeClasses[size]}`}>
      <div className="text-2xl">{getSuitSymbol(card.suit)}</div>
      <div className="text-lg font-bold">{getCardDisplayValue(card.value)}</div>
    </div>
  )
})

export default CardDisplay
