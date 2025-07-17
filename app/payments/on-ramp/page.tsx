import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExternalLink } from "lucide-react"

export default function OnRampPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-gold">On-Ramp Fiat to Crypto</CardTitle>
          <p className="text-muted-foreground">
            Easily convert your fiat currency into Solana (SOL) or other cryptocurrencies.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="fiat-amount">Amount to Pay</Label>
            <Input id="fiat-amount" type="number" placeholder="100.00" />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">USD</SelectItem>
                <SelectItem value="eur">EUR</SelectItem>
                <SelectItem value="gbp">GBP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="crypto-receive">You Receive</Label>
            <Input id="crypto-receive" type="text" placeholder="0.00 SOL (Estimated)" readOnly />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Crypto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sol">Solana (SOL)</SelectItem>
                <SelectItem value="usdc">USD Coin (USDC)</SelectItem>
                <SelectItem value="usdt">Tether (USDT)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="payment-method">Payment Method</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                <SelectItem value="credit-card">Credit Card</SelectItem>
                <SelectItem value="apple-pay">Apple Pay</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full bg-gold hover:bg-dark-gold text-white">
            Continue to On-Ramp Partner <ExternalLink className="ml-2 h-4 w-4" />
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            Sparrow Protocol partners with third-party providers for fiat on-ramping. Your transaction will be processed
            by our trusted partners.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
