"use client";
import BreadcrumbComponent from "@/components/others/Breadcrumb";
import WebList from "@/components/web/WebList";


function Page() {


	return (
		<>
			<BreadcrumbComponent
				BreadCrumbList={[
					{ title: "Dashboard", url: "/dashboard" },
					{ title: "Website", url: "/dashboard/website" },
				]}
			/>
			<WebList />
		</>
	);
}

export default Page;
