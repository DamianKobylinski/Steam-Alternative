import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SidebarComponent from "@/components/Sidebar";
import { ClerkProvider } from "@clerk/nextjs";

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
  const darkMode = true; // or set it based on your logic

  return (
    <ClerkProvider>
      <html lang="en" className={darkMode ? "dark" : ""}>
        <body
          className={`dark:--background  ${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <SidebarProvider>
            <SidebarComponent />
            <SidebarTrigger className="fixed z-10" />
            <main className="w-full dark">{children}</main>
          </SidebarProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
