'use client'

import { CardColor } from '@/types/poker'

interface ColorSelectionProps {
  onColorSelect: (color: CardColor) => void
}

export default function ColorSelection({ onColorSelect }: ColorSelectionProps) {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-white mb-8">Select Card Color</h2>
      <div className="flex justify-center gap-8">
        <button
          onClick={() => onColorSelect('red')}
          className="poker-button-red text-2xl px-8 py-4"
        >
          ♥♦ RED ♥♦
        </button>
        <button
          onClick={() => onColorSelect('black')}
          className="poker-button-black text-2xl px-8 py-4"
        >
          ♣♠ BLACK ♣♠
        </button>
      </div>
      <p className="text-green-100 mt-6 text-lg">
        Choose the color for your {1}st hole card
      </p>
    </div>
  )
}
