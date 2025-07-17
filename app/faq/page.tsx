import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQPage() {
  const faqs = [
    {
      question: "What is Sparrow Protocol?",
      answer:
        "Sparrow Protocol is a decentralized finance (DeFi) platform built on the Solana blockchain, offering token swaps, advanced trading features, and integrated payment solutions.",
    },
    {
      question: "Why Solana?",
      answer:
        "Solana provides high throughput, low transaction costs, and fast finality, making it an ideal blockchain for a responsive and efficient DeFi experience.",
    },
    {
      question: "How do I swap tokens on Sparrow Protocol?",
      answer:
        "You can swap tokens directly on the main page. Select your input and output tokens, enter the amount, and confirm the swap. Ensure your wallet is connected.",
    },
    {
      question: "Is Sparrow Protocol secure?",
      answer:
        "We prioritize security and utilize robust smart contracts. However, all DeFi platforms carry inherent risks, and users should exercise caution and understand the risks involved.",
    },
    {
      question: "What wallets are supported?",
      answer:
        "Sparrow Protocol supports popular Solana wallets like Phantom, Solflare, and Backpack, among others, through the Solana Wallet Adapter.",
    },
    {
      question: "How are transaction fees handled?",
      answer:
        "Transaction fees on Solana are generally very low. Sparrow Protocol may also apply a small platform fee, which is clearly indicated during the transaction process.",
    },
    {
      question: "Where can I find more information or get support?",
      answer:
        "You can refer to our documentation (coming soon) or reach out to our community channels for support. Links to our social media and community platforms are available in the footer.",
    },
  ]

  return (
    <div className="container mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gold">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-lg text-left hover:no-underline">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
