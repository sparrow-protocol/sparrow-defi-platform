"use client"

export function Footer() {
  return (
    <footer className="bg-white p-4 text-center text-black border-t border-light-gray dark:bg-black dark:text-white dark:border-dark-gray">
      <p className="text-black/70 dark:text-light-gray">&copy; 2025 Sparrow Protocol. All rights reserved.</p>
      <div className="flex justify-center space-x-4 mt-2">
        <a
          href="/privacy-policy"
          className="text-black/70 hover:text-gold dark:text-light-gray dark:hover:text-gold text-sm"
        >
          Privacy Policy
        </a>
        <a
          href="/terms-of-use"
          className="text-black/70 hover:text-gold dark:text-light-gray dark:hover:text-gold text-sm"
        >
          Terms of Use
        </a>
        <a
          href="/disclaimer"
          className="text-black/70 hover:text-gold dark:text-light-gray dark:hover:text-gold text-sm"
        >
          Disclaimer
        </a>
        <a href="/about" className="text-black/70 hover:text-gold dark:text-light-gray dark:hover:text-gold text-sm">
          About Us
        </a>
      </div>
    </footer>
  )
}
