"use client"

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react"

export type ToastType = "success" | "error" | "info" | "warning"

interface Toast {
  message: string
  type: ToastType
}

interface ToastOptions {
  message: string
  type?: ToastType
  duration?: number
}

interface ToastContextType {
  showToast: (options: ToastOptions) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<Toast | null>(null)

  const showToast = useCallback(
    ({ message, type = "info", duration = 3000 }: ToastOptions) => {
      setToast({ message, type })
      const timeout = setTimeout(() => setToast(null), duration)
      return () => clearTimeout(timeout)
    },
    []
  )

  const bgColor =
    toast?.type === "success"
      ? "bg-green-600"
      : toast?.type === "error"
      ? "bg-red-600"
      : toast?.type === "warning"
      ? "bg-yellow-500"
      : "bg-blue-500"

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div
          className={`fixed bottom-4 right-4 z-50 rounded px-4 py-3 text-white shadow-lg transition-all duration-300 ${bgColor}`}
          onClick={() => setToast(null)}
        >
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  )
}

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext)
  if (!context) throw new Error("useToast must be used within a ToastProvider")
  return context
}
