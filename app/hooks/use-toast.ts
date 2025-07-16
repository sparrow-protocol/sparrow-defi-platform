"use client"

import { useState, useCallback } from "react"

interface ToastOptions {
  message: string
  type?: "success" | "error" | "info" | "warning"
  duration?: number
}

export function useToast() {
  const [toast, setToast] = useState<ToastOptions | null>(null)

  const showToast = useCallback(({ message, type = "info", duration = 3000 }: ToastOptions) => {
    setToast({ message, type, duration })

    const timer = setTimeout(() => {
      setToast(null)
    }, duration)

    return () => clearTimeout(timer)
  }, [])

  const hideToast = useCallback(() => {
    setToast(null)
  }, [])

  return { toast, showToast, hideToast }
}

// A simple ToastDisplay component (can be integrated into layout or specific pages)
// This is a basic example, for a full solution, shadcn/ui's toast component is recommended.
export function ToastDisplay() {
  const { toast, hideToast } = useToast()

  if (!toast) return null

  const bgColor =
    toast.type === "success"
      ? "bg-positive-green"
      : toast.type === "error"
        ? "bg-negative-red"
        : toast.type === "warning"
          ? "bg-gold"
          : "bg-blue-500" // Default info color

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 rounded-md p-3 text-white shadow-lg ${bgColor}`}
      onClick={hideToast}
      role="alert"
    >
      {toast.message}
    </div>
  )
}
