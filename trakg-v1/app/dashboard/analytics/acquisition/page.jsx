import AcquisitionFormData from "@/components/analytics/Engagement";
import BreadcrumbComponent from "@/components/others/Breadcrumb";
import {PageHeader} from "@/components/others/pageHeader";
import { H4 } from "@/components/others/texts";
import React from "react";

function page() {
	return (
		<div>
			<BreadcrumbComponent
				BreadCrumbList={[
					{title: "Dashboard", url: "/dashboard"},
					{title: "Analytics", url: "/dashboard/analytics"},
					{
						title: "Acquisition",
						url: "/dashboard/analytics/acquisition",
					},
				]}
			/>
			<PageHeader>
				<H4>Lead Acquisition Overview</H4>
			</PageHeader>
			<AcquisitionFormData />
		</div>
	);
}

export default page;
