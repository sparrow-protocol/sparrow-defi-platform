import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 text-center text-black dark:text-white bg-medium-gray dark:bg-black md:py-24 lg:py-32">
      <h1 className="mb-4 text-6xl font-bold text-gold">404</h1>
      <h2 className="mb-4 text-3xl font-semibold">Page Not Found</h2>
      <p className="mb-8 text-lg text-black/70 dark:text-light-gray">
        Sorry, we couldn't find the page you were looking for.
      </p>
      <Link href="/" passHref>
        <Button variant="gold-filled" asChild>
          <span>Return Home</span>
        </Button>
      </Link>
    </div>
  )
}
