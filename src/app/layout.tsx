import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SidebarComponent from "@/components/Sidebar";
import { ClerkProvider } from "@clerk/nextjs";
import { Sheet } from "@/components/ui/sheet";
import CardList from "@/components/CartList";
import { Dialog } from "@/components/ui/dialog";

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
  const darkMode = true;

  return (
    <ClerkProvider>
      <html lang="en" className={darkMode ? "dark" : ""}>
        <body
          className={`dark:--background  ${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Dialog>
            <Sheet>
              <div className="fixed rounded-xl cursor-pointer p-[10px] right-0 my-2 mx-5 z-10">
                <CardList />
              </div>
              <SidebarProvider>
                <SidebarComponent />
                <SidebarTrigger className="fixed z-10" />
                <main className="w-full dark">{children}</main>
              </SidebarProvider>
            </Sheet>
          </Dialog>
        </body>
      </html>
    </ClerkProvider>
  );
}
