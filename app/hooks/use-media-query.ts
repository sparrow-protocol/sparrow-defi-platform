"use client"

import { useState, useEffect } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") {
      return // Do nothing on the server
    }

    const mediaQueryList = window.matchMedia(query)
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Set initial state
    setMatches(mediaQueryList.matches)

    // Add event listener
    mediaQueryList.addEventListener("change", listener)

    // Clean up
    return () => {
      mediaQueryList.removeEventListener("change", listener)
    }
  }, [query])

  return matches
}

// Common breakpoint hooks
export const useIsMobile = () => useMediaQuery("(max-width: 768px)")
export const useIsTablet = () => useMediaQuery("(max-width: 1024px)")
export const useIsDesktop = () => useMediaQuery("(min-width: 1025px)")
export const useIsLargeScreen = () => useMediaQuery("(min-width: 1440px)")

// Specific breakpoint hooks matching Tailwind CSS
export const useBreakpoint = () => {
  const isSm = useMediaQuery("(min-width: 640px)")
  const isMd = useMediaQuery("(min-width: 768px)")
  const isLg = useMediaQuery("(min-width: 1024px)")
  const isXl = useMediaQuery("(min-width: 1280px)")
  const is2Xl = useMediaQuery("(min-width: 1536px)")

  return {
    isSm,
    isMd,
    isLg,
    isXl,
    is2Xl,
    current: is2Xl ? "2xl" : isXl ? "xl" : isLg ? "lg" : isMd ? "md" : isSm ? "sm" : "xs",
  }
}
