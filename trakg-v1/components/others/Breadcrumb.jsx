"use client";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import Image from "next/image";

function BreadcrumbComponent({ BreadCrumbList }) {
  return (
    <header className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 ">
        <SidebarTrigger className="-ml-2" />
        <Separator orientation="vertical" className="mr-2 h-4" />

        <Breadcrumb>
          <BreadcrumbList>
            {BreadCrumbList.map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={item.url} target={item.target}>
                      {item.title}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>

                {index < BreadCrumbList.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}

export default BreadcrumbComponent;
