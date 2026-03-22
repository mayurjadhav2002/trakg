import BreadcrumbComponent from "@/components/others/Breadcrumb";
import {PageHeader} from "@/components/others/pageHeader";
import AddWebsite from "@/components/web/AddWebsite";
import React from "react";

function page() {
	return (
		<div>
			<BreadcrumbComponent
				BreadCrumbList={[
					{title: "Dashboard", url: "/dashboard"},
					{title: "Website", url: "/dashboard/website"},
					{title: "New Website", url: "/dashboard/website/new"},
				]}
			/>
			<PageHeader className={"text-xl font-semibold"}>
				Add new Website
			</PageHeader>

			<AddWebsite />
		</div>
	);
}

export default page;
