import { Navbar } from "~/ui/navbar";
import { ChatInterface } from "../lib/modules/chat/ChatInterface";
import { MapInterface } from "../lib/modules/map/MapInterface";

export default function Home() {
  return (
    <div className="flex h-full flex-col bg-background overflow-hidden">
      <Navbar />
      <main className="flex flex-1 overflow-hidden p-6">
        <div className="w-full h-full overflow-hidden">
          <div className="grid h-full grid-cols-1 gap-6 md:grid-cols-2">
            <MapInterface />
            <ChatInterface />
          </div>
        </div>
      </main>
    </div>
  );
}
