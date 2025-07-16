export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-12 md:py-24 lg:py-32 bg-medium-gray dark:bg-black text-black dark:text-white px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
      <div className="max-w-3xl text-left text-black/70 dark:text-light-gray space-y-4">
        <p>
          This Privacy Policy describes how Sparrow Protocol ("we," "us," or "our") collects, uses, and discloses your
          information when you use our decentralized exchange aggregator platform (the "Service").
        </p>
        <p>
          We are committed to protecting your privacy. We do not collect personally identifiable information unless
          voluntarily provided. Our Service operates on a decentralized network, and your interactions are primarily
          with the blockchain.
        </p>
        <p>
          <strong>Information We Collect:</strong>
          <ul>
            <li>
              <strong>Blockchain Data:</strong> We process public blockchain data, such as wallet addresses, transaction
              IDs, and token amounts, which are inherently public on the Solana blockchain.
            </li>
            <li>
              <strong>Usage Data:</strong> We may collect anonymous usage data to improve our Service, such as
              interaction patterns and feature usage. This data is not linked to your personal identity.
            </li>
          </ul>
        </p>
        <p>
          <strong>How We Use Your Information:</strong>
          <ul>
            <li>To provide and maintain our Service.</li>
            <li>To improve and personalize your experience.</li>
            <li>To monitor and analyze usage and trends.</li>
            <li>To detect, prevent, and address technical issues.</li>
          </ul>
        </p>
        <p>
          <strong>Data Sharing and Disclosure:</strong>
          We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties.
          Public blockchain data is, by its nature, publicly accessible.
        </p>
        <p>
          <strong>Security:</strong>
          We implement reasonable security measures to protect your information. However, no method of transmission over
          the Internet or electronic storage is 100% secure.
        </p>
        <p>
          <strong>Changes to This Privacy Policy:</strong>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
          Privacy Policy on this page.
        </p>
        <p>
          <strong>Contact Us:</strong>
          If you have any questions about this Privacy Policy, please contact us through our official channels.
        </p>
      </div>
    </div>
  )
}
