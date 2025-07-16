import SwapInterface from "@/components/swap-interface"
import Image from "next/image"

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100vh-120px)] items-center justify-center py-12 md:py-24 lg:py-32 bg-medium-gray dark:bg-black">
      {/* Background Image */}
      <Image
        src="/images/hero-background.png"
        alt="Gold coins background"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="z-0 opacity-20 dark:opacity-10" // Adjust opacity for readability
      />
      {/* Overlay for readability */}
      <div className="absolute inset-0 z-10 bg-white opacity-80 dark:bg-black dark:opacity-80" />

      <div className="relative z-20 container flex flex-col items-center justify-center gap-8 px-4 md:px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-gold mb-2">Welcome to Sparrow Protocol</p>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-black dark:text-white">
            The Future of Decentralized Swaps
          </h1>
          <p className="mx-auto mt-4 max-w-[700px] text-black/70 md:text-xl dark:text-light-gray">
            Experience seamless, secure, and efficient token exchanges across multiple DEXes.
          </p>
        </div>
        <SwapInterface />
      </div>
    </section>
  )
}
