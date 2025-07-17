import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gold">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-lg leading-relaxed">
          <p>
            At Sparrow Protocol, we are committed to protecting your privacy. This Privacy Policy explains how we
            collect, use, and disclose information when you use our decentralized finance (DeFi) platform.
          </p>
          <h3 className="text-2xl font-semibold text-foreground">1. Information We Collect</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              **Blockchain Data:** As a decentralized platform, all transactions and interactions occur on the Solana
              blockchain. This data is public and immutable. We do not control or store this public blockchain data.
            </li>
            <li>
              **Wallet Addresses:** We may collect your public wallet address to facilitate transactions and display
              your portfolio. We do not collect your private keys.
            </li>
            <li>
              **Usage Data:** We may collect anonymous usage data, such as IP addresses, browser types, operating
              systems, and interaction patterns, to improve our platform's functionality and user experience. This data
              is aggregated and does not identify individual users.
            </li>
            <li>
              **Optional Information:** If you choose to contact us for support or provide feedback, you may voluntarily
              provide personal information such as your email address.
            </li>
          </ul>
          <h3 className="text-2xl font-semibold text-foreground mt-6">2. How We Use Your Information</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>To facilitate and process your transactions on the Solana blockchain.</li>
            <li>To display your token balances and transaction history.</li>
            <li>To improve and optimize the functionality and performance of our platform.</li>
            <li>To respond to your inquiries and provide customer support.</li>
            <li>To comply with legal obligations.</li>
          </ul>
          <h3 className="text-2xl font-semibold text-foreground mt-6">3. Information Sharing and Disclosure</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              **Blockchain Transparency:** All on-chain transactions are public and visible on the Solana blockchain.
            </li>
            <li>
              **Service Providers:** We may share aggregated, non-personally identifiable usage data with third-party
              service providers to assist us in platform analytics and improvement.
            </li>
            <li>
              **Legal Compliance:** We may disclose your information if required to do so by law or in response to valid
              requests by public authorities (e.g., a court order or government agency).
            </li>
          </ul>
          <h3 className="text-2xl font-semibold text-foreground mt-6">4. Data Security</h3>
          <p>
            We implement reasonable security measures to protect the information we collect. However, no method of
            transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security.
          </p>
          <h3 className="text-2xl font-semibold text-foreground mt-6">5. Changes to This Privacy Policy</h3>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
            Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
          </p>
          <h3 className="text-2xl font-semibold text-foreground mt-6">6. Contact Us</h3>
          <p>If you have any questions about this Privacy Policy, please contact us through our support channels.</p>
        </CardContent>
      </Card>
    </div>
  )
}
