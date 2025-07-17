import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gold">About Sparrow Protocol</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-lg leading-relaxed">
          <p>
            Sparrow Protocol is a cutting-edge decentralized finance (DeFi) platform built on the Solana blockchain. Our
            mission is to provide users with a seamless, secure, and efficient experience for token swaps, advanced
            trading, and integrated payment solutions.
          </p>
          <p>
            Leveraging Solana's high throughput and low transaction costs, Sparrow Protocol aims to deliver a superior
            DeFi experience, enabling lightning-fast transactions and robust liquidity for a wide range of digital
            assets.
          </p>
          <p>
            We believe in the power of decentralization and are committed to building a platform that is transparent,
            community-driven, and accessible to everyone. Our team is dedicated to continuous innovation, bringing new
            features and improvements to meet the evolving needs of the DeFi ecosystem.
          </p>
          <p>
            Join us on our journey to redefine decentralized finance and empower users with the tools they need to
            navigate the digital asset landscape with confidence.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
