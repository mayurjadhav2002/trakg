"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import AddFirstWebsite from "./others/AddFirstWebsite";
import { useStore } from "@/stores/userStore";
import { useWebsites } from "@/hooks/useWebsites";

export function WebsiteSwitcher() {
  const { websites, loading } = useWebsites();

  const activeWebsite = useStore((s) => s.activeWebsite);
  const setActiveWebsite = useStore((s) => s.setActiveWebsite);

  const { isMobile } = useSidebar();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {loading && (
          <div className="flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
            <div
              size="lg"
              className=" flex gap-2 items-center justify-between w-full data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex gap-2">
                <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
                  <img
                    src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=undefined&size=64`}
                    alt={"loading"}
                    width={32}
                    height={32}
                    className="bg-white border-2 rounded-full"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold h-4 transition-all min-w-24 bg-gray-200 w-full animate-pulse rounded"></span>
                  <span className="truncate font-semibold h-3 transition-all min-w-32 bg-gray-200 w-full animate-pulse rounded"></span>
                </div>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </div>
          </div>
        )}
        {!loading && (
          <DropdownMenu>
            {activeWebsite && websites ? (
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
                    <img
                      src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${activeWebsite.url}&size=64`}
                      alt={"activeWebsite.name"}
                      width={32}
                      height={32}
                      className="bg-white border-2 rounded-full"
                    />
                    {/* <activeWeb.logo className="size-4" /> */}
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {activeWebsite.name}
                    </span>
                    <span className="truncate text-xs">
                      {activeWebsite.url}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
            ) : (
              <>
                <AddFirstWebsite />
              </>
            )}

            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Websites
              </DropdownMenuLabel>
              {websites?.map((web, index) => (
                <DropdownMenuItem
                  key={web.id}
                  onClick={() => setActiveWebsite(web)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm">
                    <img
                      src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${web.url}&size=64`}
                      alt={web.name}
                      width={32}
                      height={32}
                      className="bg-white border-2 rounded-full"
                    />{" "}
                  </div>
                  {web.name}
                  {/* <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut> */}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 p-2">
                <Link
                  href="/dashboard/website/new"
                  className="flex  gap-2 items-center"
                >
                  <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                    <Plus className="size-4" />
                  </div>
                  <div className="font-medium text-muted-foreground">
                    Add Website
                  </div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
