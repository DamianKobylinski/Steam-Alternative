"use client";
import { FC } from "react";
import { Calendar, Heart, Home, ShoppingBag } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Shop",
    url: "/shop",
    icon: ShoppingBag,
  },
  {
    title: "Library",
    url: "/library",
    icon: Calendar,
  },
  {
    title: "Wishlist",
    url: "/wishlist",
    icon: Heart,
  },
];

const SidebarComponent: FC = () => {
  const user = useUser();

  return (
    <Sidebar className="fixed">
      <SidebarHeader>
        <p className="text-3xl p-5 text-center mt-12">Steam Alternative</p>
      </SidebarHeader>
      <SidebarContent className="mx-auto mt-5">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="flex gap-5">
              {items
                .filter((item) => {
                  if (user.user?.id) {
                    return true;
                  }
                  return item.title === "Home" || item.title === "Shop";
                })
                .map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link className="p-5" href={item.url}>
                        <item.icon
                          style={{
                            width: "25px",
                            height: "25px",
                          }}
                        />
                        <span className="text-2xl">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex place-items-center px-5 py-10">
        <Link
          href="/contact"
          className="text-xl bg-[#0a0a0a] bg-opacity-90 rounded-xl text-center w-3/4 py-2 shadow-lg transition-transform hover:scale-105"
        >
          Contact
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarComponent;
