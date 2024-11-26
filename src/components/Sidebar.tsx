import { FC } from "react";
import { Calendar, Home, ShoppingBag, Star } from "lucide-react";
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
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

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
    icon: Star,
  },
];

const SidebarComponent: FC = () => {
  return (
    <Sidebar className="fixed">
      <SidebarHeader>
        <p className="text-3xl p-5 text-center">Steam Alternative</p>
      </SidebarHeader>
      <SidebarContent className="mx-auto mt-5">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="flex gap-5">
              {items.map((item) => (
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
      <SidebarFooter className="px-5 py-10">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex place-items-center gap-5">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <p className="text-2xl">Shad</p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>


      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarComponent;
