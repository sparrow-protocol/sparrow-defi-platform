import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export default function ProPage() {
  const features = [
    "Advanced Trading Tools",
    "Lower Trading Fees",
    "Priority Customer Support",
    "Exclusive Analytics & Insights",
    "Early Access to New Features",
    "Customizable Dashboard",
  ]

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="w-full max-w-3xl mx-auto text-center">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-gold mb-4">Sparrow Pro</CardTitle>
          <p className="text-xl text-muted-foreground">Unlock the full potential of your DeFi trading experience.</p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle2 className="h-6 w-6 text-positive-green" />
                <span className="text-lg text-foreground">{feature}</span>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <p className="text-3xl font-bold text-foreground">
              $9.99<span className="text-lg text-muted-foreground">/month</span>
            </p>
            <Button className="w-full md:w-auto bg-gold hover:bg-dark-gold text-white text-lg px-8 py-6">
              Upgrade to Pro
            </Button>
            <p className="text-sm text-muted-foreground">Cancel anytime. No hidden fees.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
