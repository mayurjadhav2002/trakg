"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, CreditCard, Shield, Bell } from "lucide-react";

import BreadcrumbComponent from "@/components/others/Breadcrumb";
import { PageHeader } from "@/components/others/pageHeader";
import { H4 } from "@/components/others/texts";

const routeList = {
  "/dashboard/settings/general": {
    title: "General",
    pageHeading: "Profile Settings",
  },
  "/dashboard/settings/security": {
    title: "Security",
    pageHeading: "Security Settings",
  },
  "/dashboard/settings/notifications": {
    title: "Notifications",
    pageHeading: "Notification Preferences",
  },
};

const tabs = [
  { id: "general", label: "General", icon: User },
  { id: "security", label: "Security", icon: Shield },
  // { id: "notifications", label: "Notifications", icon: Bell },
];

function Tabs() {
  const pathname = usePathname();
  const activeTab = pathname.split("/").pop();

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;

          return (
            <li key={id} className="mr-2">
              <Link href={`/dashboard/settings/${id}`}>
                <button
                  type="button"
                  className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group
                                        hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800 
                    ${
                      isActive
                        ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                        : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                    }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon
                    className={`w-4 h-4 mr-2 ${
                      isActive
                        ? "text-blue-600 dark:text-blue-500"
                        : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                    }`}
                  />
                  {label}
                </button>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <div>
      <BreadcrumbComponent
        BreadCrumbList={[
          { title: "Dashboard", url: "/dashboard" },
          { title: "Settings", url: "/dashboard/settings" },
          {
            title: routeList[pathname]?.title || "Settings",
            url: pathname,
          },
        ]}
      />

      <Tabs />

      <div className="flex flex-col lg:flex-row-reverse md:flex-row gap-4 items-start">
        {/* Main Content */}
        <div className="w-full relative py-5">
          <PageHeader>
            <H4>{routeList[pathname]?.pageHeading || "Settings"}</H4>
          </PageHeader>
          {children}
        </div>
      </div>
    </div>
  );
}
