import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gold">Disclaimer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-lg leading-relaxed">
          <p>
            Sparrow Protocol is a decentralized finance (DeFi) platform. By using this platform, you acknowledge and
            agree to the following:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              **No Financial Advice:** The information provided on this platform is for general informational purposes
              only and does not constitute financial, investment, or trading advice. You should not make any financial
              decisions based solely on the information presented here.
            </li>
            <li>
              **Risks of Cryptocurrency:** Trading cryptocurrencies involves significant risk and can result in the loss
              of your capital. The value of cryptocurrencies can be highly volatile and unpredictable. You should
              carefully consider whether trading or holding cryptocurrencies is suitable for you in light of your
              financial condition.
            </li>
            <li>
              **Smart Contract Risks:** This platform relies on smart contracts. Smart contracts are experimental and
              may contain vulnerabilities or bugs that could lead to loss of funds. While we strive for security, we
              cannot guarantee the absence of such vulnerabilities.
            </li>
            <li>
              **No Guarantees:** Sparrow Protocol does not guarantee the accuracy, completeness, or reliability of any
              information on the platform, nor does it guarantee the performance or success of any transactions.
            </li>
            <li>
              **Your Responsibility:** You are solely responsible for your decisions and actions when using this
              platform. You should conduct your own research and consult with a qualified financial professional before
              making any investment decisions.
            </li>
            <li>
              **Jurisdictional Limitations:** The availability of Sparrow Protocol may be subject to jurisdictional
              restrictions. You are responsible for ensuring that your use of the platform complies with all applicable
              laws and regulations in your jurisdiction.
            </li>
          </ul>
          <p>By proceeding, you confirm that you understand and accept these risks and disclaimers.</p>
        </CardContent>
      </Card>
    </div>
  )
}
