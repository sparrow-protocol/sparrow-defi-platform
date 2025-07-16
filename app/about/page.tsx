export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-12 md:py-24 lg:py-32 bg-medium-gray dark:bg-black text-black dark:text-white px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">About Sparrow Protocol</h1>
      <p className="max-w-2xl text-lg text-black/70 dark:text-light-gray">
        Sparrow Protocol is a decentralized exchange aggregator built on Solana, designed to provide seamless, secure,
        and efficient token swaps. Our mission is to empower users with the best trading experience by aggregating
        liquidity from multiple DEXes and offering advanced features.
      </p>
      <p className="max-w-2xl text-lg text-black/70 dark:text-light-gray mt-4">
        We are committed to transparency, security, and innovation in the DeFi space.
      </p>
    </div>
  )
}
