'use client'

import { Suit, CardColor } from '@/types/poker'
import { getSuitSymbol, getCardsByColor } from '@/utils/cardUtils'

interface SuitSelectionProps {
  color: CardColor
  onSuitSelect: (suit: Suit) => void
  onBack: () => void
}

export default function SuitSelection({ color, onSuitSelect, onBack }: SuitSelectionProps) {
  // Filter suits based on selected color
  const getSuitsByColor = (selectedColor: CardColor): Suit[] => {
    if (selectedColor === 'red') {
      return ['hearts', 'diamonds'] // Only red suits
    } else {
      return ['clubs', 'spades'] // Only black suits
    }
  }

  const availableSuits = getSuitsByColor(color)

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-white mb-8">
        Select Suit
      </h2>
      <div className="flex justify-center gap-6 mb-6">
        {availableSuits.map((suit) => (
          <button
            key={suit}
            onClick={() => onSuitSelect(suit)}
            className={`suit-button ${color}`}
          >
            {getSuitSymbol(suit)}
          </button>
        ))}
      </div>
      <div className="flex justify-center gap-4">
        <button
          onClick={onBack}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
        >
          ← Back
        </button>
      </div>
      <p className="text-green-100 mt-4 text-lg">
        Choose the {color} suit for your hole card
      </p>
    </div>
  )
}
