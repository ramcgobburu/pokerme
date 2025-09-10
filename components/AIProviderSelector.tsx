'use client'

import { useState, useEffect } from 'react'
import { getAvailableProviders } from '@/lib/ai-providers'

interface AIProviderSelectorProps {
  onProviderChange: (providerName: string) => void
}

export default function AIProviderSelector({ onProviderChange }: AIProviderSelectorProps) {
  const [providers, setProviders] = useState<string[]>([])
  const [selectedProvider, setSelectedProvider] = useState<string>('')

  useEffect(() => {
    const availableProviders = getAvailableProviders()
    const providerNames = availableProviders.map(p => p.name)
    setProviders(providerNames)
    
    if (providerNames.length > 0) {
      setSelectedProvider(providerNames[0])
      onProviderChange(providerNames[0])
    }
  }, [onProviderChange])

  const handleProviderChange = (providerName: string) => {
    setSelectedProvider(providerName)
    onProviderChange(providerName)
  }

  if (providers.length === 0) {
    return (
      <div className="text-center p-4 bg-yellow-500/20 rounded-lg mb-4">
        <p className="text-yellow-200">
          No AI providers configured. Please set up API keys in your environment variables.
        </p>
      </div>
    )
  }

  return (
    <div className="text-center p-4 bg-white/10 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-white mb-2">AI Provider</h3>
      <div className="flex flex-wrap justify-center gap-2">
        {providers.map((provider) => (
          <button
            key={provider}
            onClick={() => handleProviderChange(provider)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              selectedProvider === provider
                ? 'bg-green-600 text-white'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            {provider}
          </button>
        ))}
      </div>
      <p className="text-green-100 text-sm mt-2">
        Using: <span className="font-semibold">{selectedProvider}</span>
      </p>
    </div>
  )
}
