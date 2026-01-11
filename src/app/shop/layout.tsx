import type { Metadata } from "next";
import "../globals.css";

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
  return <main className="flex w-full px-2 md:px-4 lg:w-4/5 xl:w-3/4 mx-auto">{children}</main>;
}
