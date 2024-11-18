import { FC } from "react";
import { Calendar, Home, ShoppingBag, Star } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import Link from "next/link";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Shop",
    url: "/game",
    icon: ShoppingBag,
  },
  {
    title: "Library",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Wishlist",
    url: "#",
    icon: Star,
  },
];

const SidebarComponent: FC = () => {
  return (
    <Sidebar>
      <SidebarContent className="mx-auto">
        <SidebarGroup>
          <SidebarGroupLabel>
            <p className="text-2xl">Steam Alternative</p>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link className="text-3xl my-4" href={item.url}>
                      <item.icon height={30} width={30} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SidebarComponent;
