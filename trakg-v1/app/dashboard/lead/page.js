import LeadTable from "@/components/leads/leadTable";
import SuspenseLoader from "@/components/loading/SuspenseLoader";
import BreadcrumbComponent from "@/components/others/Breadcrumb";
import React, {Suspense} from "react";
export const metadata = {
	title: "Leads - Dashboard",
	description: "Manage and view all leads created in the dashboard.",
};
export default async function Page({searchParams}) {
	const conversion = (await searchParams).conversion;
	return (
		<Suspense fallback={<SuspenseLoader />}>
			<BreadcrumbComponent
				BreadCrumbList={[
					{title: "Dashboard", url: "/dashboard"},
					{title: "Lead", url: "/dashboard/lead"},
				]}
			/>
			<div className=''>
				<LeadTable conversion={conversion} />
			</div>
		</Suspense>
	);
}
