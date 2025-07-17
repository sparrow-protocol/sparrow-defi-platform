import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsOfUsePage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gold">Terms of Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-lg leading-relaxed">
          <p>
            Welcome to Sparrow Protocol. These Terms of Use ("Terms") govern your access to and use of the Sparrow
            Protocol decentralized finance (DeFi) platform (the "Platform"). By accessing or using the Platform, you
            agree to be bound by these Terms.
          </p>
          <h3 className="text-2xl font-semibold text-foreground">1. Acceptance of Terms</h3>
          <p>
            By using the Platform, you affirm that you are of legal age to enter into these Terms, and you agree to
            comply with all applicable laws and regulations. If you do not agree to these Terms, you may not access or
            use the Platform.
          </p>
          <h3 className="text-2xl font-semibold text-foreground mt-6">2. Nature of the Platform</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              **Decentralized Protocol:** Sparrow Protocol is a decentralized application built on the Solana
              blockchain. We do not custody your assets or control your transactions. All transactions are executed
              directly on the blockchain via smart contracts.
            </li>
            <li>
              **No Financial Advice:** The Platform provides tools and information for interacting with decentralized
              finance protocols. It does not provide financial, investment, legal, tax, or any other professional
              advice. You are solely responsible for evaluating the merits and risks associated with the use of any
              information or content on the Platform.
            </li>
            <li>
              **Risks:** You acknowledge and accept the inherent risks associated with cryptocurrency and DeFi,
              including but not limited to: volatility, smart contract vulnerabilities, impermanent loss, regulatory
              changes, and loss of funds.
            </li>
          </ul>
          <h3 className="text-2xl font-semibold text-foreground mt-6">3. Your Responsibilities</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              **Wallet Security:** You are solely responsible for maintaining the security of your cryptocurrency
              wallet, including your private keys. We are not responsible for any loss or theft of your digital assets.
            </li>
            <li>
              **Accuracy of Information:** You are responsible for ensuring that any information you provide to the
              Platform (e.g., wallet addresses) is accurate and complete.
            </li>
            <li>
              **Compliance with Laws:** You agree to comply with all applicable laws and regulations in your
              jurisdiction regarding your use of the Platform.
            </li>
          </ul>
          <h3 className="text-2xl font-semibold text-foreground mt-6">4. Intellectual Property</h3>
          <p>
            All content, trademarks, service marks, trade names, and logos on the Platform are proprietary to Sparrow
            Protocol or its licensors and are protected by intellectual property laws.
          </p>
          <h3 className="2xl font-semibold text-foreground mt-6">5. Limitation of Liability</h3>
          <p>
            To the fullest extent permitted by law, Sparrow Protocol shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly
            or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (a) your
            access to or use of or inability to access or use the Platform; (b) any conduct or content of any third
            party on the Platform; or (c) unauthorized access, use, or alteration of your transmissions or content.
          </p>
          <h3 className="text-2xl font-semibold text-foreground mt-6">6. Changes to Terms</h3>
          <p>
            We reserve the right to modify these Terms at any time. We will notify you of significant changes by posting
            the updated Terms on the Platform. Your continued use of the Platform after such modifications constitutes
            your acceptance of the revised Terms.
          </p>
          <h3 className="text-2xl font-semibold text-foreground mt-6">7. Governing Law</h3>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction, e.g., the State
            of Delaware, without regard to its conflict of law principles].
          </p>
          <h3 className="text-2xl font-semibold text-foreground mt-6">8. Contact Us</h3>
          <p>If you have any questions about these Terms, please contact us through our official support channels.</p>
        </CardContent>
      </Card>
    </div>
  )
}
