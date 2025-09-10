# AI Provider Setup Guide

This poker assistant supports multiple AI providers for enhanced reasoning capabilities. Choose the provider that best fits your needs and budget.

## 🚀 Quick Setup

### Option 1: DeepSeek (Recommended for Reasoning)
DeepSeek offers excellent reasoning capabilities at competitive prices.

1. **Get API Key**: Visit [DeepSeek Platform](https://platform.deepseek.com/)
2. **Add to Environment**: Create/update `.env.local`:
   ```bash
   DEEPSEEK_API_KEY=your_deepseek_api_key_here
   ```

### Option 2: Anthropic Claude
Claude provides excellent reasoning and is very reliable.

1. **Get API Key**: Visit [Anthropic Console](https://console.anthropic.com/)
2. **Add to Environment**: Create/update `.env.local`:
   ```bash
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```

### Option 3: OpenAI
Standard option with good performance.

1. **Get API Key**: Visit [OpenAI Platform](https://platform.openai.com/)
2. **Add to Environment**: Create/update `.env.local`:
   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   ```

### Option 4: Local Ollama (Free)
Run powerful models locally with Ollama.

1. **Install Ollama**: Visit [Ollama.ai](https://ollama.ai/)
2. **Install Llama Model**:
   ```bash
   ollama pull llama3.1:70b
   # or for smaller model:
   ollama pull llama3.1:8b
   ```
3. **Start Ollama**: The app will automatically connect to `localhost:11434`

## 🎯 Provider Comparison

| Provider | Reasoning Quality | Cost | Speed | Setup |
|----------|------------------|------|-------|-------|
| **DeepSeek** | ⭐⭐⭐⭐⭐ | 💰💰 | ⚡⚡⚡ | Easy |
| **Claude** | ⭐⭐⭐⭐⭐ | 💰💰💰 | ⚡⚡ | Easy |
| **OpenAI** | ⭐⭐⭐⭐ | 💰💰💰 | ⚡⚡⚡ | Easy |
| **Ollama** | ⭐⭐⭐⭐⭐ | Free | ⚡ | Medium |

## 🔧 Advanced Configuration

### Multiple Providers
You can configure multiple providers. The app will automatically select the best available one in this priority order:
1. DeepSeek
2. Claude
3. OpenAI
4. Ollama

### Custom Ollama Models
To use different Llama models, edit `lib/ai-providers.ts`:
```typescript
model: 'llama3.1:70b', // Change to your preferred model
```

### Environment Variables
Create a `.env.local` file with your preferred providers:
```bash
# Primary choice
DEEPSEEK_API_KEY=your_key_here

# Backup options
ANTHROPIC_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
```

## 🎮 Usage

1. **Start the app**: `npm run dev`
2. **Select cards**: Choose your hole cards and community cards
3. **Choose provider**: The app will show available AI providers
4. **Get analysis**: Receive expert poker analysis with detailed reasoning

## 🆘 Troubleshooting

### No Providers Available
- Check your `.env.local` file has valid API keys
- Ensure Ollama is running if using local models
- Verify API key permissions

### API Errors
- Check your API key is valid and has credits
- Verify the model is available in your region
- Check rate limits and usage quotas

### Poor Analysis Quality
- Try a different provider
- Ensure you have enough community cards for analysis
- Check the console for error messages

## 💡 Tips

- **DeepSeek** is recommended for the best reasoning at good prices
- **Claude** is excellent for detailed explanations
- **Ollama** is perfect for privacy and offline use
- **OpenAI** is reliable and widely supported

The app will automatically fall back to the built-in poker evaluator if all AI providers fail.
