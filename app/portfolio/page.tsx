import TransactionHistory from "@/components/transaction-history"

export default function PortfolioPage() {
  return (
    <div className="flex flex-1 flex-col items-center py-12 md:py-24 lg:py-32 bg-medium-gray dark:bg-black text-black dark:text-white px-4">
      <h1 className="text-4xl font-bold mb-8">Your Portfolio & Transaction History</h1>
      <div className="w-full max-w-4xl">
        <TransactionHistory />
      </div>
    </div>
  )
}
