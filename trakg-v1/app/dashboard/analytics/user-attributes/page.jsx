import BreadcrumbComponent from "@/components/others/Breadcrumb";
import React from "react";

function page() {
	return (
		<div>
			<BreadcrumbComponent
				BreadCrumbList={[
					{title: "Dashboard", url: "/dashboard"},
					{title: "Analytics", url: "/dashboard/analytics"},
					{
						title: "User Attributes",
						url: "/dashboard/analytics/user-attributes/overview",
					},
				]}
			/>
			page
		</div>
	);
}

export default page;
