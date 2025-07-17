"use client"

import { motion } from "framer-motion"
import { HeroSection } from "@/components/hero-section"
import { SwapInterface } from "@/components/swap/swap-interface"
import { TokenChart } from "@/components/token-chart"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
}

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] py-8 px-4 md:px-6 lg:px-8">
      <HeroSection />

      <div className="grid w-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8 mt-8">
        {[SwapInterface, TokenChart].map((Component, index) => (
          <motion.div
            key={index}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className={`order-${index === 1 ? "1" : "2"} lg:order-${index + 1}`}
          >
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-gold">
                  {index === 0 ? "Swap Tokens" : "SOL/USDC Price Chart"}
                </CardTitle>
              </CardHeader>
              <Component />
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
