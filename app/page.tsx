'use client'

import { useState } from 'react'
import PokerGame from '@/components/PokerGame'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          🃏 Ram's Poker Assistant
        </h1>
        <p className="text-xl text-green-100">
          Ram's AI-powered companion for 5-card poker
        </p>
      </div>
      
      <PokerGame />
    </main>
  )
}
