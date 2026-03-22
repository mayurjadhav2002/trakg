"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Contact,
  Frame,
  Settings,
  FrameIcon,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { TeamSwitcher, WebsiteSwitcher } from "./website-switcher";
import Link from "next/link";
import { LuBookOpen } from "react-icons/lu";

import { LuSettings2, LuTextCursorInput } from "react-icons/lu";
import { GoQuestion } from "react-icons/go";
import { TbWorldWww } from "react-icons/tb";
import { SiGoogleads } from "react-icons/si";
import { HiUserGroup } from "react-icons/hi2";
import { FaWpforms } from "react-icons/fa";
import { RiExternalLinkFill } from "react-icons/ri";
import { MdOutlineInsights } from "react-icons/md";

import { IoMdNotificationsOutline } from "react-icons/io";
import { usePathname } from "next/navigation";
// This is sample data.
const data = {
  navMain: [
    {
      title: "Leads",
      url: "#",
      icon: SiGoogleads,
      isActive: true,
      items: [
        {
          title: "All Leads",
          url: "/dashboard/lead",
        },
        {
          title: "Partial Leads",
          url: "/dashboard/lead?conversion=false",
        },
      ],
    },
    {
      title: "Forms",
      url: "/dashboard/forms",
      icon: LuTextCursorInput,
    },
    {
      title: "Websites",
      url: "/dashboard/website",
      icon: TbWorldWww,
    },

    {
      title: "Notification",
      url: "/dashboard/notifications",
      icon: IoMdNotificationsOutline,
    },
    // {
    // 	title: "Settings",
    // 	url: "#",
    // 	icon: Settings2,
    // 	items: [
    // 		{
    // 			title: "General",
    // 			url: "/dashboard/settings/general",
    // 		},

    // 		{
    // 			title: "Billing",
    // 			url: "/dashboard/settings/billing",
    // 		},
    // 		{
    // 			title: "Help",
    // 			url: "/dashboard/settings/help",
    // 		},
    // 	],
    // },
  ],
  AnalyticsMenu: [
    {
      title: "Engagement and Conversion",
      url: "/dashboard/analytics/engagement",
      icon: MdOutlineInsights,
    },
    {
      title: "Acquisition",
      url: "/dashboard/analytics/acquisition",
      icon: HiUserGroup,
    },

    // {
    // 	title: "User Attributes",
    // 	url: "/dashboard/analytics/user-attributes",
    // },
  ],
  Pinned: [
    {
      name: "Google Form",
      url: "#",
      icon: Contact,
    },
    {
      name: "TypeForm",
      url: "#",
      icon: FrameIcon,
    },
  ],
};

export function AppSidebar({ ...props }) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <WebsiteSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} analyticsMenu={data.AnalyticsMenu} />
        {/* <NavProjects projects={data.Pinned} /> */}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuButton tooltip={"Settings"} className="-mb-2">
          <LuBookOpen />
          <Link
            href="https://docs.trakg.com?ref=trakg_app"
            target="blank"
            className="w-full"
          >
            <span>Guides</span>
          </Link>
          <RiExternalLinkFill className="w-4 h-4" />
        </SidebarMenuButton>

        <SidebarMenuButton
          tooltip={"Settings"}
          isActive={pathname === "/dashboard/settings/general"}
          className="-mb-2"
        >
          <LuSettings2 />
          <Link href="/dashboard/settings/general" className="w-full">
            <span>Settings</span>
          </Link>
        </SidebarMenuButton>

        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
