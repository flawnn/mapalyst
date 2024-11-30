import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { MapProvider } from "~/lib/modules/map/context/MapContext";
import { ThemeProvider } from "~/lib/providers/theme-provider";
import "~/styles/globals.css";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/ui/components/toaster";

export const metadata: Metadata = {
  title: "Mapalytics",
  description: "Mapalytics",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} h-full`}>
      <body className="flex h-full flex-col">
        <MapProvider>
          <ThemeProvider defaultTheme="system" storageKey="app-theme">
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </ThemeProvider>
          <Toaster />
        </MapProvider>
      </body>
    </html>
  );
}
