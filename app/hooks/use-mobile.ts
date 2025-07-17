"use client"
import { useMediaQuery } from "@/app/hooks/use-media-query"

export function useMobile() {
  const isMobile = useMediaQuery("(max-width: 768px)") // Tailwind's 'md' breakpoint

  return isMobile
}
