"use client"

import * as React from "react"

import type { ToastAction } from "@/components/ui/toast"
import { toast as showShadcnToast } from "@/components/ui/use-toast"

export type ToastType = "success" | "error" | "info" | "warning"

interface ToastOptions {
  title?: string
  description?: string
  type?: ToastType
  duration?: number
  action?: React.ReactElement<typeof ToastAction>
}

interface ToastContextType {
  toast: (options: ToastOptions) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const toast = React.useCallback(({ title, description, type = "info", duration = 3000, action }: ToastOptions) => {
    let variant: "default" | "destructive" = "default"
    let className = ""

    switch (type) {
      case "success":
        className = "bg-positive-green text-white"
        break
      case "error":
        variant = "destructive"
        className = "bg-negative-red text-white"
        break
      case "warning":
        className = "bg-yellow-500 text-white"
        break
      case "info":
      default:
        className = "bg-blue-500 text-white"
        break
    }

    showShadcnToast({
      title: title || type.charAt(0).toUpperCase() + type.slice(1),
      description,
      duration,
      variant,
      className,
      action,
    })
  }, [])

  return <ToastContext.Provider value={{ toast }}>{children}</ToastContext.Provider>
}

export const useToast = (): ToastContextType => {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
