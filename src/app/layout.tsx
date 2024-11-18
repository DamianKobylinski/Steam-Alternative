import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SidebarComponent from "@/components/Sidebar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Steam Alternative",
  description:
    "A Steam alternative for gamers - Aleksandra Czuba, Damian Kobyliński",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`bg-[#1C2541] ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SidebarProvider>
          <SidebarComponent />
          <SidebarTrigger />
          <main className="w-full mx-5">{children}</main>
        </SidebarProvider>
      </body>
    </html>
  );
}
