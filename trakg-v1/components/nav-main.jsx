"use client";

import { ChevronRight } from "lucide-react";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { HomeIcon } from "lucide-react";
import { usePathname } from "next/navigation";

export function NavMain({ items, analyticsMenu }) {
	const pathname = usePathname();

	return (
		<SidebarGroup>
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton tooltip={"Dashboard"}>
						<HomeIcon />
						<Link href={"/dashboard"} className="w-full">
							<span>Dashboard</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
			<SidebarGroupLabel className="font-semibold">Records</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => (
					<Collapsible
						key={item.title}
						asChild
						defaultOpen={item.isActive}
						className='group/collapsible'
					>
						<SidebarMenuItem>
							<CollapsibleTrigger asChild>
								<SidebarMenuButton tooltip={item.title}
								  isActive={pathname === item.url}

								>
									{item.icon && <item.icon />}

									{item.url != "#" ? (
										<Link href={item.url} className="w-full">
											<span>{item.title}</span>
										</Link>
									) : (
										<>
											<span>{item.title}</span>
											<ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
										</>
									)}
								</SidebarMenuButton>
							</CollapsibleTrigger>
							{item.items && (
								<CollapsibleContent>
									<SidebarMenuSub>
										{item.items?.map((subItem) => (
											<SidebarMenuSubItem
												key={subItem.title}
												
											>
												<SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
													<Link href={subItem.url} >
														<span>
															{subItem.title}
														</span>
													</Link>
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										))}
									</SidebarMenuSub>
								</CollapsibleContent>
							)}
						</SidebarMenuItem>
					</Collapsible>
				))}
			</SidebarMenu>


			<SidebarGroupLabel className="font-semibold">Analytics</SidebarGroupLabel>
			<SidebarMenu>
				{analyticsMenu.map((item) => (
					<Collapsible
						key={item.title}
						asChild
						defaultOpen={item.isActive}
						  

						className='group/collapsible'
					>
						<SidebarMenuItem>
							<CollapsibleTrigger asChild>
								<SidebarMenuButton tooltip={item.title} isActive={pathname === item.url}>
									{item.icon && <item.icon />}

									{item.url != "#" ? (
										<Link href={item.url} className="w-full">
											<span>{item.title}</span>
										</Link>
									) : (
										<>
											<span>{item.title}</span>
											<ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
										</>
									)}
								</SidebarMenuButton>
							</CollapsibleTrigger>
							{item.items && (
								<CollapsibleContent>
									<SidebarMenuSub>
										{item.items?.map((subItem) => (
											<SidebarMenuSubItem
												key={subItem.title}
												isActive={pathname === subItem.url}
											>
												<SidebarMenuSubButton asChild>
													<Link href={subItem.url}>
														<span>
															{subItem.title}
														</span>
													</Link>
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										))}
									</SidebarMenuSub>
								</CollapsibleContent>
							)}
						</SidebarMenuItem>
					</Collapsible>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
