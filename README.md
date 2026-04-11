# 答案之书 | Book of Answers

> 每个问题都有答案 | Every question has an answer

A mystical bilingual (Chinese/English) fortune-telling web app inspired by Eastern philosophy. Silently think of your question, press start, and receive wisdom from Buddhist, Confucian, Taoist, or Mystical traditions.

## Tech Stack

- **Next.js 16** with Turbopack
- **TypeScript**
- **Tailwind CSS v4**
- **Vitest** + React Testing Library

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## How It Works

1. **Start** - A glowing round button cycles through four philosophical styles (Buddhist, Confucian, Taoist, Mystical), each with its own color and hint text
2. **Reveal** - Matrix-rain style text falls across the screen as the answer materializes (~2 seconds)
3. **Read** - The answer appears centered with its interpretation, displayed in both Chinese and English
4. **Ask Again** - A time-reverse animation resets to the start (~1 second)

## Answer Categories

| Category | Chinese | Color | Style |
|----------|---------|-------|-------|
| Buddhist | 佛风 | Gold `#d4a849` | Buddhist sutras, Zen wisdom |
| Confucian | 儒风 | Brown `#8b4513` | Confucian classics, moral philosophy |
| Taoist | 道风 | Green `#2e8b57` | Tao Te Ching, natural harmony |
| Mystical | 玄学风 | Purple `#6a0dad` | I Ching, cosmic wisdom |

Each answer includes a short response and an interpretation drawn from classical Chinese philosophy.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Main page with phase management
│   └── globals.css         # Animations and global styles
├── components/
│   ├── StartButton.tsx     # Glowing round start button
│   ├── MatrixRain.tsx      # Falling text animation
│   └── AnswerDisplay.tsx   # Revealed answer with interpretation
├── lib/
│   └── answers.ts          # Answer loading, validation, selection logic
├── types/
│   └── answer.ts           # TypeScript type definitions
└── test/
    └── setup.ts            # Vitest test setup
public/
└── answers/                # JSON answer files per category
    ├── buddhist.json
    ├── confucian.json
    ├── taoist.json
    └── metaphysical.json
```

## License

ISC
