import Link from "next/link";

export function Navbar() {
  return (
    <nav className="bg-card text-card-foreground m-2 mb-4 rounded-lg p-4 shadow-lg">
      <div className="container flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          🌐 mapalytics
        </Link>
      </div>
    </nav>
  );
}
