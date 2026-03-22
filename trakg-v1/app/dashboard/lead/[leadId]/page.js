import LeadDetails from "@/components/lead/leadDetails";
import BreadcrumbComponent from "@/components/others/Breadcrumb";
import {redirect} from "next/navigation";
import React from "react";

export async function generateMetadata({params}) {
	const {leadId} = await params;

	if (!leadId) {
		redirect("/dashboard/lead");
	}

	return {
		title: `Lead Details - ${leadId}`,
		description: `Viewing details for lead with ID ${leadId}.`,
	};
}

export default async function Page({params}) {
	const {leadId} = await params;

	return (
		<>
			<BreadcrumbComponent
				BreadCrumbList={[
					{title: "Dashboard", url: "/dashboard"},
					{title: "Lead", url: "/dashboard/lead"},
					{
						title: "Lead Details",
						url: `/dashboard/lead/${leadId}`,
						active: true,
					},
				]}
			/>

			<LeadDetails leadId={leadId} />
		</>
	);
}
