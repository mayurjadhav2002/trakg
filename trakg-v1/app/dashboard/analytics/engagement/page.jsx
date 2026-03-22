import EngagementAnalytics from "@/components/analytics/engagement/EngagementAnalytics";
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
						title: "Engagement",
						url: "/dashboard/analytics/engagement/overview",
					},
				]}
			/>
			
			<EngagementAnalytics/>
		</div>
	);
}

export default page;
