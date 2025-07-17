# Sparrow - DeFi Platform

A comprehensive decentralized finance (DeFi) platform built on Solana, offering token swaps, payments, portfolio management, and advanced trading features.

## 🚀 Features

### Core Features
- **Token Swaps**: Seamless token swapping powered by Jupiter aggregator
- **Solana Pay**: QR code-based payments and transactions
- **Portfolio Management**: Track your token balances and transaction history
- **Real-time Charts**: Live price charts and market data
- **Multi-wallet Support**: Support for Phantom, Solflare, Backpack, and more
- **Embedded Wallets**: Privy-powered embedded wallet solution

### Advanced Features
- **Exact Output Swaps**: Specify exact output amounts for swaps
- **Slippage Protection**: Customizable slippage tolerance
- **Transaction History**: Complete transaction tracking and history
- **Price Alerts**: Real-time price monitoring and alerts
- **Dark/Light Mode**: Full theme support
- **Responsive Design**: Mobile-first responsive interface

## 🛠 Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern UI component library
- **Recharts**: Data visualization and charts

### Backend & Database
- **Neon Database**: Serverless PostgreSQL database
- **Prisma**: Database ORM and migrations
- **Server Actions**: Next.js server-side functions
- **Upstash Redis**: Caching and rate limiting

### Blockchain & Web3
- **Solana Web3.js**: Solana blockchain interaction
- **Jupiter API**: Token swap aggregation
- **Raydium API**: Liquidity pool data
- **Helius RPC**: Enhanced Solana RPC services
- **Privy**: Embedded wallet infrastructure

### APIs & Services
- **Birdeye API**: Token price and market data
- **CoinMarketCap API**: Cryptocurrency data
- **Dexscreener API**: DEX trading data
- **OpenAI API**: AI-powered features

## 📦 Installation

### Prerequisites
- Node.js 18+ and pnpm
- PostgreSQL database (Neon recommended)
- Solana wallet for testing

### Environment Setup

1. Clone the repository:
\`\`\`bash
git clone https://github.com/your-username/sparrow-defi-platform.git
cd sparrow-defi-platform
\`\`\`

2. Install dependencies:
\`\`\`bash
pnpm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Configure your `.env.local` file with the required API keys and database URL:

\`\`\`env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"
POSTGRES_URL="postgresql://username:password@host:port/database"

# Solana RPC URLs
NEXT_PUBLIC_HELIUS_RPC_URL="https://rpc.helius.xyz/?api-key=YOUR_KEY"
NEXT_PUBLIC_SOLANA_RPC_1="https://api.mainnet-beta.solana.com"

# API Keys
NEXT_PUBLIC_BIRDEYE_API_KEY="your_birdeye_api_key"
NEXT_PUBLIC_CMC_API_KEY="your_coinmarketcap_api_key"
HELIUS_API_KEY="your_helius_api_key"
OPENAI_API_KEY="your_openai_api_key"

# Privy Configuration
NEXT_PUBLIC_PRIVY_APP_ID="your_privy_app_id"
APP_SECRET="your_privy_app_secret"

# Platform Configuration
NEXT_PUBLIC_PLATFORM_FEE_ACCOUNT="your_fee_account_address"
NEXT_PUBLIC_SPRW_MINT="your_token_mint_address"
\`\`\`

5. Set up the database:
\`\`\`bash
pnpm db:setup
\`\`\`

6. Run database migrations:
\`\`\`bash
pnpm db:migrate
\`\`\`

### Development

Start the development server:
\`\`\`bash
pnpm dev
\`\`\`

The application will be available at `http://localhost:3000`.

### Building for Production

1. Build the application:
\`\`\`bash
pnpm build
\`\`\`

2. Start the production server:
\`\`\`bash
pnpm start
\`\`\`

## 🗄 Database Schema

### Tables

#### `transactions`
- Transaction history and status tracking
- Supports swaps, payments, and transfers
- Includes fee tracking and metadata

#### `payment_requests`
- Solana Pay payment request management
- QR code generation and status tracking
- Support for SPL tokens and SOL

#### `users` (Optional)
- User profile and wallet management
- Preferences and settings storage

### Migrations

Database migrations are located in the `scripts/` directory:
- `001_create_transactions_table.sql`: Initial transaction table
- `002_add_transaction_type_and_payment_fields.sql`: Payment features

## 🔧 Configuration

### Solana Network
The platform supports both mainnet and devnet configurations. Update the RPC URLs in your environment variables to switch networks.

### Token Lists
Token information is fetched from:
- Jupiter Token List (strict)
- Solana Labs Token List
- Custom Sparrow token metadata

### Fee Configuration
Platform fees are configurable via environment variables:
- `PLATFORM_FEE_BPS`: Basis points for platform fees (default: 20 = 0.2%)
- `PLATFORM_FEE_ACCOUNT`: Solana address to receive fees

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy with automatic CI/CD

### Manual Deployment

1. Build the application:
\`\`\`bash
pnpm build
\`\`\`

2. Deploy to your hosting provider of choice

### Database Setup

1. Create a Neon database instance
2. Run migrations using the provided SQL scripts
3. Update connection strings in environment variables

## 📱 API Routes

### Public APIs
- `/api/tokens` - Token list and metadata
- `/api/price` - Real-time token prices
- `/api/chart-data` - Historical price data

### Transaction APIs
- `/api/jupiter-exact-out-swap` - Jupiter swap execution
- `/api/solana-pay` - Solana Pay request handling
- `/api/transactions` - Transaction history

## 🔐 Security

### Best Practices
- All private keys remain client-side
- Server-side validation for all transactions
- Rate limiting on API endpoints
- Input sanitization and validation

### Environment Security
- Never commit `.env` files
- Use secure RPC endpoints
- Rotate API keys regularly
- Monitor for suspicious activity

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Join our Discord community
- Check the documentation wiki

## 🗺 Roadmap

### Phase 1 (Current)
- ✅ Basic token swaps
- ✅ Solana Pay integration
- ✅ Portfolio tracking
- ✅ Multi-wallet support

### Phase 2 (In Progress)
- 🔄 Advanced trading features
- 🔄 Liquidity pool management
- 🔄 Yield farming integration
- 🔄 Mobile app development

### Phase 3 (Planned)
- 📋 NFT marketplace integration
- 📋 Cross-chain bridge support
- 📋 Advanced analytics dashboard
- 📋 Social trading features

## 🙏 Acknowledgments

- [Jupiter](https://jup.ag) for swap aggregation
- [Solana](https://solana.com) for the blockchain infrastructure
- [Privy](https://privy.io) for embedded wallet solutions
- [Helius](https://helius.xyz) for enhanced RPC services
- [shadcn/ui](https://ui.shadcn.com) for the component library

---

Built with ❤️ by the Sparrow team
