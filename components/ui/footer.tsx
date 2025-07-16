"use client"

export function Footer() {
  return (
    <footer className="border-t border-light-gray bg-white px-4 py-6 text-center text-black dark:border-dark-gray dark:bg-black dark:text-white">
      <p className="text-sm text-black/70 dark:text-light-gray">
        &copy; {new Date().getFullYear()} Sparrow Protocol. All rights reserved.
      </p>

      <nav className="mt-3 flex flex-wrap justify-center gap-4 text-sm">
        <a
          href="/privacy-policy"
          className="text-black/70 hover:text-gold dark:text-light-gray dark:hover:text-gold transition-colors"
        >
          Privacy Policy
        </a>
        <a
          href="/terms-of-use"
          className="text-black/70 hover:text-gold dark:text-light-gray dark:hover:text-gold transition-colors"
        >
          Terms of Use
        </a>
        <a
          href="/disclaimer"
          className="text-black/70 hover:text-gold dark:text-light-gray dark:hover:text-gold transition-colors"
        >
          Disclaimer
        </a>
        <a
          href="/about"
          className="text-black/70 hover:text-gold dark:text-light-gray dark:hover:text-gold transition-colors"
        >
          About Us
        </a>
      </nav>
    </footer>
  )
}
