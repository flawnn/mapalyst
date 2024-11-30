import Link from 'next/link'
import { Button } from "~/ui/components/button"

export function Navbar() {
  return (
    <nav className="bg-primary text-primary-foreground rounded-lg p-4 mb-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Mapalytics
        </Link>
        <div className="space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/about">About</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/contact">Contact</Link>
          </Button>
          <Button variant="secondary">Login</Button>
        </div>
      </div>
    </nav>
  )
}

