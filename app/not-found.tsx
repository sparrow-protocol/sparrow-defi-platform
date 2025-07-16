import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-12 md:py-24 lg:py-32 bg-medium-gray dark:bg-black text-black dark:text-white px-4 text-center">
      <h1 className="text-6xl font-bold text-gold mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-lg text-black/70 dark:text-light-gray mb-8">Could not find the requested resource.</p>
      <Link href="/" passHref>
        <Button variant="gold-filled">Return Home</Button>
      </Link>
    </div>
  )
}
