'use client'

import { Suit, CardColor, CardValue } from '@/types/poker'
import { getSuitSymbol, CARD_VALUES } from '@/utils/cardUtils'

interface ValueSelectionProps {
  suit: Suit
  color: CardColor
  onValueSelect: (value: CardValue) => void
  onBack: () => void
}

export default function ValueSelection({ suit, color, onValueSelect, onBack }: ValueSelectionProps) {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-white mb-8">
        Select Card Value
      </h2>
      <div className="mb-6">
        <div className={`card ${color === 'red' ? 'card-red' : 'card-black'} inline-block`}>
          <div className="card-suit">{getSuitSymbol(suit)}</div>
          <div className="card-number">?</div>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-3 max-w-md mx-auto mb-6">
        {CARD_VALUES.map((value) => (
          <button
            key={value}
            onClick={() => onValueSelect(value)}
            className={`poker-button text-lg ${
              color === 'red' ? 'poker-button-red' : 'poker-button-black'
            }`}
          >
            {value}
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
        Choose the value for your {1}st hole card
      </p>
    </div>
  )
}
