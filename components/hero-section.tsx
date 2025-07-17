"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex h-[500px] items-center justify-center overflow-hidden rounded-xl bg-cover bg-center p-8 text-center text-white shadow-lg"
      style={{ backgroundImage: "url('/images/hero-background.png')" }}
    >
      <div className="absolute inset-0 bg-black/50" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 space-y-6"
      >
        <h1 id="hero-heading" className="text-5xl font-bold leading-tight md:text-6xl">
          Trade, Earn, and Build on Solana
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">
          Experience the future of decentralized finance with lightning-fast transactions and low fees.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
            <Link href="/swap">
              Start Swapping <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="text-white border-white hover:bg-white/10 bg-transparent"
          >
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  )
}
