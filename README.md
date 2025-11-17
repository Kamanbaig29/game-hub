# Cryptoverse - Web3 Gaming Platform

Cryptoverse is a cutting-edge Web3 gaming platform where players can enjoy games online while earning Solana cryptocurrency rewards. Built with React, TypeScript, and Vite for optimal performance.

## Features

- **Web3 Gaming**: Play games and earn real cryptocurrency rewards
- **Solana Integration**: Fast, low-cost transactions powered by Solana blockchain
- **NFT Rewards**: Earn unique digital collectibles while playing
- **Wallet Integration**: Connect your Solana wallet to own your gaming assets
- **Play-to-Earn**: Revolutionary gaming economy where skills translate to earnings
- **Cross-Platform Assets**: Use your NFTs and tokens across multiple games

## Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Blockchain**: Solana
- **Styling**: CSS Modules with 3D animations
- **Web3**: Wallet integration for decentralized gaming

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Connect your Solana wallet to start playing

## Web3 Integration

Cryptoverse integrates with popular Solana wallets including:
- Phantom
- Solflare
- Backpack
- And more...

## Game Economy

Our platform features a sustainable play-to-earn economy:
- Earn SOL tokens for gameplay achievements
- Collect rare NFTs as rewards
- Trade assets on secondary markets
- Stake tokens for additional rewards

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
