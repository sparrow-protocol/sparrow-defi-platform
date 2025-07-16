export default function TermsOfUsePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-12 md:py-24 lg:py-32 bg-medium-gray dark:bg-black text-black dark:text-white px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Terms of Use</h1>
      <div className="max-w-3xl text-left text-black/70 dark:text-light-gray space-y-4">
        <p>
          Welcome to Sparrow Protocol. These Terms of Use ("Terms") govern your access to and use of the Sparrow
          Protocol decentralized exchange aggregator platform (the "Service"). By accessing or using the Service, you
          agree to be bound by these Terms.
        </p>
        <p>
          <strong>1. Acceptance of Terms:</strong> By using the Service, you acknowledge that you have read, understood,
          and agree to be bound by these Terms. If you do not agree to these Terms, you may not use the Service.
        </p>
        <p>
          <strong>2. The Service:</strong> Sparrow Protocol provides a non-custodial interface for interacting with
          various decentralized exchanges (DEXes) on the Solana blockchain. We do not hold your funds or act as a
          custodian. All transactions are executed directly on the blockchain via smart contracts.
        </p>
        <p>
          <strong>3. Risks:</strong> You acknowledge and agree that using decentralized finance (DeFi) applications
          involves significant risks, including but not limited to:
          <ul>
            <li>Volatility of cryptocurrency prices.</li>
            <li>Smart contract risks and vulnerabilities.</li>
            <li>Liquidity risks.</li>
            <li>Regulatory risks.</li>
            <li>Loss of funds due to user error (e.g., incorrect address, lost private keys).</li>
          </ul>
          You are solely responsible for understanding and assuming these risks.
        </p>
        <p>
          <strong>4. No Financial Advice:</strong> The information provided on the Service is for informational purposes
          only and does not constitute financial, investment, or trading advice. You should conduct your own research
          and consult with a qualified financial advisor before making any investment decisions.
        </p>
        <p>
          <strong>5. User Responsibilities:</strong> You are responsible for:
          <ul>
            <li>Maintaining the security of your wallet and private keys.</li>
            <li>Ensuring the accuracy of all transaction details before confirming.</li>
            <li>Complying with all applicable laws and regulations in your jurisdiction.</li>
          </ul>
        </p>
        <p>
          <strong>6. Disclaimers:</strong> THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY
          KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE
          OF HARMFUL COMPONENTS.
        </p>
        <p>
          <strong>7. Limitation of Liability:</strong> TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, SPARROW
          PROTOCOL SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY
          LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR
          OTHER INTANGIBLE LOSSES, RESULTING FROM (A) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE
          SERVICE; (B) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE; OR (C) UNAUTHORIZED ACCESS, USE, OR
          ALTERATION OF YOUR TRANSMISSIONS OR CONTENT.
        </p>
        <p>
          <strong>8. Changes to Terms:</strong> We reserve the right to modify these Terms at any time. We will notify
          you of any changes by posting the updated Terms on the Service. Your continued use of the Service after such
          modifications constitutes your acceptance of the revised Terms.
        </p>
        <p>
          <strong>9. Governing Law:</strong> These Terms shall be governed by and construed in accordance with the laws
          of the jurisdiction where Sparrow Protocol is established, without regard to its conflict of law principles.
        </p>
      </div>
    </div>
  )
}
