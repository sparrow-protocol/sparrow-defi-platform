export default function FAQPage() {
  return (
    <div className="flex flex-1 flex-col items-center py-12 md:py-24 lg:py-32 bg-medium-gray dark:bg-black text-black dark:text-white px-4">
      <h1 className="text-4xl font-bold mb-8 text-gold">Frequently Asked Questions</h1>
      <div className="w-full max-w-3xl space-y-8">
        {/* FAQ Item 1 */}
        <div className="bg-white dark:bg-dark-gray p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-black dark:text-white mb-3">What is Sparrow Protocol?</h2>
          <p className="text-black/70 dark:text-light-gray">
            Sparrow Protocol is a decentralized exchange (DEX) aggregator built on the Solana blockchain. It allows
            users to swap tokens seamlessly and efficiently by aggregating liquidity from various DEXes, ensuring you
            get the best possible rates.
          </p>
        </div>

        {/* FAQ Item 2 */}
        <div className="bg-white dark:bg-dark-gray p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-black dark:text-white mb-3">How do I connect my wallet?</h2>
          <p className="text-black/70 dark:text-light-gray">
            To connect your wallet, click the "Connect Wallet" button in the top right corner of the interface. You will
            be prompted to choose from supported Solana wallets like Phantom or Solflare. Follow the instructions in
            your wallet to approve the connection.
          </p>
        </div>

        {/* FAQ Item 3 */}
        <div className="bg-white dark:bg-dark-gray p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-black dark:text-white mb-3">What is slippage tolerance?</h2>
          <p className="text-black/70 dark:text-light-gray">
            Slippage tolerance is the maximum percentage difference you are willing to accept between the quoted price
            and the executed price of your swap. If the price moves beyond your set slippage tolerance during the
            transaction, the swap will fail to protect you from unfavorable price changes. You can adjust this in the
            "Settings" tab.
          </p>
        </div>

        {/* FAQ Item 4 */}
        <div className="bg-white dark:bg-dark-gray p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-black dark:text-white mb-3">
            How does the "Pay & Receive" (Exact Out) feature work?
          </h2>
          <p className="text-black/70 dark:text-light-gray">
            The "Pay & Receive" feature allows a merchant to specify an exact amount of a specific token they wish to
            receive. The customer can then pay with any other supported token, and the system will calculate the exact
            amount of the input token required to fulfill the merchant's request. This is powered by Jupiter's ExactOut
            swap mode.
          </p>
        </div>

        {/* FAQ Item 5 */}
        <div className="bg-white dark:bg-dark-gray p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-black dark:text-white mb-3">
            Where can I view my transaction history?
          </h2>
          <p className="text-black/70 dark:text-light-gray">
            You can view your past swap and payment transactions on the "Portfolio" page. This page provides a detailed
            history, including transaction type, amounts, status, and links to Solana explorers.
          </p>
        </div>

        {/* FAQ Item 6 */}
        <div className="bg-white dark:bg-dark-gray p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-black dark:text-white mb-3">Is Sparrow Protocol secure?</h2>
          <p className="text-black/70 dark:text-light-gray">
            Yes, Sparrow Protocol is non-custodial, meaning we never hold your funds. All transactions are executed
            directly on the Solana blockchain via smart contracts. We leverage established and audited protocols like
            Jupiter Aggregator for swap execution. However, interacting with any DeFi application carries inherent
            risks, which users should understand.
          </p>
        </div>
      </div>
    </div>
  )
}
