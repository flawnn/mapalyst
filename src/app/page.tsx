import { Navbar } from "~/ui/navbar";
import { ChatInterface } from "../lib/modules/chat/ChatInterface";
import { MapInterface } from "../lib/modules/map/MapInterface";

export default function Home() {
  return (
    <div className="flex h-full flex-col bg-background">
      <Navbar />
      <main className="flex flex-1 p-6">
        <div className="container mx-auto">
          <div className="grid h-full grid-cols-1 gap-6 md:grid-cols-2">
            <MapInterface />
            <ChatInterface />
          </div>
        </div>
      </main>
    </div>
  );
}
