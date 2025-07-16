import type { Metadata } from "next"
import HeroSection from "@/components/hero-section"

export const metadata: Metadata = {
  title: "Sparrow Protocol | Swap Tokens Instantly",
  description: "A seamless token swap experience powered by Sparrow Protocol."
}

export default function HomePage() {
  return <HeroSection />
}
