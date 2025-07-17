import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center px-4">
      <h1 className="text-6xl font-bold text-gold mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-foreground mb-6">Page Not Found</h2>
      <p className="text-lg text-muted-foreground mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link href="/" passHref>
        <Button className="bg-gold hover:bg-dark-gold text-white">Go to Homepage</Button>
      </Link>
    </div>
  )
}
