import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import "~/styles/globals.css";

import { TRPCReactProvider } from "~/trpc/react";

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
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
