import { Navbar } from "~/ui/navbar";


export default function Home() {
  return (
    <div className="min-h-screen bg-background p-6">
      <Navbar />
      <main className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card text-card-foreground rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Chat Interface</h2>
            <p>This is where the chat interface will be implemented.</p>
          </div>
          <div className="bg-card text-card-foreground rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Results Display</h2>
            <p>This area will show the results of the satellite imagery analysis.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

