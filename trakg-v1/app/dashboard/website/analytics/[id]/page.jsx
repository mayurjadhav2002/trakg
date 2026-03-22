import WebsiteAnalytics from "@/components/analytics/website/WebsiteAnalytics";
import BreadcrumbComponent from "@/components/others/Breadcrumb";
import { getBaseUrl } from "@/lib/utils";
import React from "react";

export async function generateMetadata({
	searchParams,
}) {
	const name = await searchParams?.name ? decodeURIComponent(searchParams.name) : "Website";
	return {
		title: `Trakg - ${name} Analytics`,
	};
}

export default async function Page({
	params,
	searchParams,
}) {
	const { id } = await params;
	const { name } = await searchParams;

	if (!id) {
		return <div>Website ID is required</div>;
	}


	const res = await fetch(`${getBaseUrl()}/api/analytics/website`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ websiteId: id }),
		cache: "no-store",
	});

	console.log("Fetching analytics data for website ID:", id, res.json());
	if (!res.ok) {
		return <div>Failed to load analytics data</div>;
	}

	const analyticsData = await res.json();

	return (
		<div>
			<BreadcrumbComponent
				BreadCrumbList={[
					{ title: "Dashboard", url: "/dashboard" },
					{ title: "Website", url: "/dashboard/website" },
					{
						title: `${name || "Website"}'s Analytics`,
						url: `/dashboard/website/analytics/${id}?name=${encodeURIComponent(
							name || "Website"
						)}`,
					},
				]}
			/>
			<WebsiteAnalytics id={id} analyticsData={analyticsData} />
		</div>
	);
}
