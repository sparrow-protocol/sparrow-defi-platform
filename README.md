# Sparrow - DeFI Platform

Sparrow**Swap** is a decentralized exchange (DEX) aggregator built on the **Solana blockchain**, designed to offer users fast, secure, and efficient token swaps. It aggregates liquidity from various DEXes to deliver the best swap rates, with features like wallet integration, swap customization, Solana Pay support, and transaction history.

---

## 🚀 Features

- ⚡ **Instant Token Swaps**  
  Fast, efficient SPL token exchanges using Jupiter Aggregator’s ExactIn mode.

- 💸 **Pay & Receive (ExactOut)**  
  Merchants can specify the exact token/amount to receive; users can pay with any supported token.

- 🔐 **Wallet Integration**  
  Connect with popular wallets like **Phantom** and **Solflare** via Solana Wallet Adapter.

- ⚙️ **Customizable Swap Settings**  
  Set slippage, transaction speed, MEV protection, and custom platform fees.

- 🔍 **Dynamic Token Selection**  
  Pulls token lists from Jupiter and Solana Labs with a reliable fallback system.

- 📜 **Transaction History**  
  View, sort, and paginate past swaps and payments with detailed insights.

- 📱 **Solana Pay Integration**  
  Generate QR codes for Solana Pay on-ramp transactions.

- 📈 **Token Price Charts**  
  Historical price visualization powered by CoinGecko.

- 💻 **Responsive UI**  
  Optimized for mobile and desktop experiences.

- 🌓 **Theme Toggle**  
  Light and dark mode support.

---

## 🧰 Tech Stack

| Tech                  | Description                                              |
|-----------------------|----------------------------------------------------------|
| **Next.js**           | React framework using App Router                         |
| **React**             | Core frontend library                                    |
| **Tailwind CSS**      | Utility-first CSS framework                              |
| **shadcn/ui**         | Prebuilt UI components (Radix + Tailwind)                |
| **Solana Web3.js**    | Solana blockchain interaction                            |
| **Jupiter Aggregator API** | Fetches best swap routes (ExactIn / ExactOut)       |
| **CoinGecko API**     | Historical token price data                              |
| **Neon Database**     | PostgreSQL database for transaction storage              |
| **Solana Wallet Adapter** | Wallet connection (Phantom, Solflare, etc.)         |
| **date-fns**          | Date/time formatting utilities                           |
| **qrcode**            | Generate Solana Pay QR codes                             |

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/sparrow-protocol/sparrow-defi-platform
cd sparrow-defi-platform
````

### 2. Install Dependencies

Using your preferred package manager:

```bash
pnpm install
# or
yarn install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory and add the following:

```env
# === Aggregators ===

# Jupiter Aggregator API
NEXT_PUBLIC_JUPITER_API_URL=https://quote-api.jup.ag/v6

# Raydium Aggregator API (Optional)
NEXT_PUBLIC_RAYDIUM_API_URL=https://api.raydium.io/v2

# === Solana Configuration ===

# Main Solana RPC (Helius)
NEXT_PUBLIC_HELIUS_RPC_URL=https://api.mainnet-beta.solana.com

# Additional Solana RPCs
NEXT_PUBLIC_SOLANA_RPC_1=https://solana-api.projectserum.com
NEXT_PUBLIC_SOLANA_RPC_2=https://rpc.ankr.com/solana
NEXT_PUBLIC_SOLANA_RPC_3=https://solana-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY

# Sparrow platform fee token account (Optional)
NEXT_PUBLIC_PLATFORM_FEE_ACCOUNT=SPARROW_PLATFORM_FEE_TOKEN_ACCOUNT_ADDRESS

# Sparrow Token (SPRW) - Solana Token-2022 standard
NEXT_PUBLIC_SPRW_MINT=YOUR_SPRW_TOKEN_MINT_ADDRESS

# === Market Data Providers ===

# Birdeye API
NEXT_PUBLIC_BIRDEYE_API_URL=https://public-api.birdeye.so/public
NEXT_PUBLIC_BIRDEYE_API_KEY=your-birdeye-api-key

# CoinMarketCap API
NEXT_PUBLIC_CMC_API_URL=https://pro-api.coinmarketcap.com/v1
NEXT_PUBLIC_CMC_API_KEY=your-coinmarketcap-api-key

# Dexscreener API
NEXT_PUBLIC_DEXSCREENER_API_URL=https://api.dexscreener.com/latest/dex/pairs/solana

# Pump.fun API
NEXT_PUBLIC_PUMPFUN_API_URL=https://pump.fun/api

# === OpenAI Integration ===

OPENAI_API_KEY=your-openai-api-key
NEXT_PUBLIC_OPENAI_API_URL=https://api.openai.com/v1

# === Neon Database ===

DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
DATABASE_URL_UNPOOLED==

# === Auth & Identity ===

NEXT_PUBLIC_PRIVY_APP_ID=
APP_SECRET=

# === Resend Email Service ===

# Resend API key for transactional email (https://resend.com)
RESEND_API_KEY=your-resend-api-key

# Default sender email (must be verified with Resend)
EMAIL_FROM=

# Optional: Support email or contact address
EMAIL_SUPPORT=
```

---

## 🧪 Development

To start the local development server:

```bash
pnpm dev
# or
yarn dev
```

---

## 📦 Build for Production

```bash
pnpm build
pnpm start
# or
yarn build
yarn start
```

---

## ✅ Roadmap & Contributions

Planned improvements include:

* Enhanced token analytics
* Notifications for swap success/failure
* Mobile-native PWA support

Want to contribute? Feel free to fork the repo, create a branch, and submit a PR. Be sure to follow best practices and include tests when possible.

---

## 📄 License

MIT License. See [LICENSE](./LICENSE) for details.

---

## 🌐 Live Demo

* SparrowSwap Application: [sparrowswap.com](https://)

---

## 💬 Connect

* Official Website: [sparrowprotocol.net](https://sparrowprotocol.net)
* Twitter: [@SparrowProtocol](https://twitter.com/SparrowProtocol)
* Discord: [Join our community](https://discord.gg/SparrowProtocol)