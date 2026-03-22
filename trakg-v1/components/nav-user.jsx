"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Palette,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useUser } from "@/hooks/useUser";
import { useCallback } from "react";
import Link from "next/link";

export function NavUser({}) {
  const { user, Logout } = useUser();
  const { isMobile } = useSidebar();
  const handleLogout = useCallback(() => {
    Logout();
  }, [Logout]);
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={
                    user?.avatar ||
                    "https://res.cloudinary.com/dioiyots5/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1739513484/notion_15_tghqw3.jpg"
                  }
                  className="bg-cover"
                  alt={"user.name"}
                />
                <AvatarFallback className="rounded-lg">
                  {user?.name?.slice(0, 2)}{" "}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.name}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.name}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropdownMenuGroup aria-label="Link Actions">
              <DropdownMenuItem>
                <Sparkles />
                Integration
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator /> */}
            <DropdownMenuGroup>
              <DropdownMenuItem className="w-full relative cursor-pointer">
                <BadgeCheck />

                <Link href="/dashboard/settings/general" className="w-full">
                  {" "}
                  Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="w-full relative cursor-pointer">
                <CreditCard />
                <Link href="/dashboard/settings/billing" className="w-full">
                  {" "}
                  Billing
                </Link>
              </DropdownMenuItem>
              {/* <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem> */}

              <DropdownMenuItem>
                <Palette />
                <div className="flex items-center justify-between w-full">
                  <p>Theme</p>
                  <ThemeSwitcher />
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
