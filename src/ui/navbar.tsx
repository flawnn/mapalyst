import Link from "next/link";

export function Navbar() {
  return (
    <nav className="bg-primary text-primary-foreground mb-6 rounded-lg p-4">
      <div className="container flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          mapalytics
        </Link>
      </div>
    </nav>
  );
}
