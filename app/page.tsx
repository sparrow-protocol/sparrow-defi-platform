import { HeroSection } from "@/components/hero-section"
import { SwapInterface } from "@/components/swap-interface"
import { TokenChart } from "@/components/token-chart"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] py-8 px-4 md:px-6 lg:px-8">
      <HeroSection />
      <div className="grid w-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8 mt-8">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-gold">Swap Tokens</CardTitle>
          </CardHeader>
          <SwapInterface />
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-gold">SOL/USDC Price Chart</CardTitle>
          </CardHeader>
          <TokenChart />
        </Card>
      </div>
    </div>
  )
}
