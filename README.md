# 🃏 Ram's Poker Assistant (Pokerme)

An AI-powered poker assistant for 5-card poker games built with Next.js 14, TypeScript, and OpenAI GPT-4o-mini.

## Features

- **Interactive Card Selection**: Choose hole cards and community cards through an intuitive UI
- **Real-time AI Analysis**: Get expert poker analysis powered by OpenAI GPT-4o-mini with advanced reasoning
- **Hand Strength Evaluation**: Built-in poker hand ranking and probability calculations
- **Duplicate Prevention**: Smart validation prevents selecting the same card twice
- **Toast Notifications**: Beautiful, non-intrusive feedback for user actions
- **Progressive Web App**: Installable on mobile and desktop devices
- **Responsive Design**: Beautiful UI that works on all screen sizes
- **Error Handling**: Graceful fallback when AI is unavailable
- **Performance Optimized**: Memoized components for smooth interactions

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure OpenAI API

1. Get your OpenAI API key from [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create a `.env.local` file in the project root:
```bash
# Copy this to .env.local and replace with your actual API key
OPENAI_API_KEY=your_openai_api_key_here
```

**Note**: The app uses OpenAI GPT-4o-mini for cost-effective AI analysis. The multi-provider system is available for future use with advanced models like DeepSeek, Claude, and local Llama models.

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

1. **Select Hole Cards**: Choose your 2 hole cards by selecting color, suit, and value
2. **Community Cards**: Add flop (3 cards), turn (1 card), and river (1 card)
3. **AI Analysis**: Get expert analysis including:
   - Hand strength evaluation
   - Betting recommendation (fold/call/raise/all-in)
   - Win probability
   - Detailed reasoning

## AI Integration

The app uses a hybrid approach:

- **Primary**: OpenAI GPT-4o-mini for expert poker analysis and strategic recommendations
- **Fallback**: Built-in poker hand evaluator for basic hand strength assessment
- **Real-time**: Hand analysis updates automatically as you add cards
- **Validation**: Duplicate card prevention and input validation
- **Error Handling**: Graceful fallback when AI is unavailable

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4o-mini with fallback to built-in evaluator
- **PWA**: Next-PWA for offline support
- **Icons**: Lucide React

## Project Structure

```
├── app/
│   ├── actions/          # Server actions for AI analysis
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
├── lib/                  # Utility libraries
├── types/                # TypeScript type definitions
└── utils/                # Helper functions
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT License - feel free to use this project for learning and personal use.