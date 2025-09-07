# Poker Assistant 🃏

An AI-powered poker assistant for 5-card poker games. This app helps you make informed decisions during poker games by analyzing your hand strength and providing strategic recommendations.

## Features

- **Interactive Card Selection**: Choose your hole cards through an intuitive UI
- **Game Flow Management**: Handles the complete poker game flow (hole cards, flop, turn, river)
- **Visual Card Representation**: Beautiful card displays with proper suits and colors
- **AI Analysis**: Get hand strength analysis and betting recommendations
- **Responsive Design**: Works on desktop and mobile devices

## Game Flow

1. **Hole Cards**: Select your two hole cards by choosing color, suit, and value
2. **Flop**: Select 3 community cards
3. **Turn**: Select 1 additional community card
4. **River**: Select the final community card
5. **Analysis**: Get AI-powered analysis of your hand strength and recommendations

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI Integration**: Ready for LLM API integration (DeepSeek model)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── PokerGame.tsx      # Main game component
│   ├── ColorSelection.tsx # Color selection phase
│   ├── SuitSelection.tsx  # Suit selection phase
│   ├── ValueSelection.tsx # Value selection phase
│   ├── CardDisplay.tsx    # Card visualization
│   ├── GamePhase.tsx      # Community cards phase
│   └── AnalysisDisplay.tsx # AI analysis display
├── types/                 # TypeScript type definitions
│   └── poker.ts          # Poker-related types
├── utils/                 # Utility functions
│   └── cardUtils.ts      # Card manipulation utilities
└── package.json          # Dependencies and scripts
```

## Next Steps

- [ ] Integrate with DeepSeek API for real hand analysis
- [ ] Add more sophisticated poker hand evaluation
- [ ] Implement betting strategy recommendations
- [ ] Add game history and statistics
- [ ] Support for different poker variants

## Contributing

Feel free to submit issues and enhancement requests!
