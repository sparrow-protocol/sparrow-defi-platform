# Sparrow DeFi Platform

Sparrow is a Solana-based decentralized finance platform with advanced token swapping features powered by Jupiter and Raydium aggregators. The platform is built with Next.js, Tailwind CSS, and full TypeScript support. It integrates Solana wallet adapters, price feeds, and RPC fallback for reliable performance.

---

## 🚀 Features

### Core

* 🪙 Instant Token Swaps (Jupiter Aggregator)
* 🔁 Trigger & Recurring Orders (via webhooks)
* 📱 Solana Pay QR generation
* 🔐 Wallet integration with `@solana/wallet-adapter`
* 🔄 Auto RPC fallback (Helius, Serum, Ankr, Alchemy)

### Advanced

* 📊 Raydium Liquidity Pools integration
* 🏷️ Token Metadata Mapping from Jupiter, Birdeye, Solana Token List
* 📈 Token price feed using Birdeye, CoinGecko, Pump.fun
* 📬 Email alerts via Resend
* 🧪 Environment validation with Zod
* 📦 Redis KV cache with Upstash

---

## 🧱 Tech Stack

### Frontend

* **Next.js 14** with App Router
* **Tailwind CSS**
* **TypeScript**
* **ShadCN UI**
* **Framer Motion**

### Blockchain & Web3

* **Solana Web3.js**
* **Jupiter Aggregator API**
* **Raydium API & AMM SDK**
* **Solana Token List Registry**
* **Birdeye & CoinGecko APIs**
* **Pump.fun API**
* **Helius / Alchemy / Serum RPC** (fallback logic)

### Backend & Database

* **Neon PostgreSQL** (via Prisma ORM)
* **Resend Email API**
* **Upstash Redis**
* **Zod** for `.env` validation
* **CRON + Webhooks** for recurring swaps

---

## 🪄 Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Copy `.env.example`:

```bash
cp .env.example .env.local
```

Fill in your API keys and wallet addresses.

### 3. Run the Dev Server

```bash
pnpm dev
```

---

## 🧩 Environment Variables

Key `.env` variables:

* `NEXT_PUBLIC_JUPITER_API_URL`
* `NEXT_PUBLIC_RAYDIUM_API_URL`
* `NEXT_PUBLIC_HELIUS_RPC_URL` + fallback RPCs
* `NEXT_PUBLIC_SPL_TOKEN_PROGRAM_ID`
* `NEXT_PUBLIC_JUPITER_TOKEN_LIST_URL`
* `NEXT_PUBLIC_BIRDEYE_API_KEY`
* `DATABASE_URL`
* `RESEND_API_KEY`

Environment is validated using `zod` on app startup.

---

## 📚 API Routes

* `/api/price/[symbol]`
* `/api/swap/instant`
* `/api/swap/recurring`
* `/api/raydium/pools`
* `/api/token/metadata`
* `/api/rpc/status`

---

## 🔐 Security & Production

* ✅ `.env` variables validated using Zod
* ✅ RPC fallback for improved uptime
* ✅ Redis caching to reduce API calls
* ✅ Use Doppler or `envault` to encrypt secrets in production

---

## 📦 Deployment

Deploy via [Vercel](https://vercel.com/) or your own VPS:

```bash
pnpm build
pnpm start
```

---

## 🤝 Contributing

PRs and issues are welcome! Help improve Solana DeFi UX and add new swap strategies.

---

## 📜 License

MIT © 2025 Sparrow Protocol
