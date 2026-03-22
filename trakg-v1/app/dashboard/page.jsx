import StatsDetails from "@/components/dashboard/StatsDetails";
import BreadcrumbComponent from "@/components/others/Breadcrumb";


function page() {
	return (
		<>
			<BreadcrumbComponent
				BreadCrumbList={[
					{ title: "Dashboard", url: "/dashboard" },
				]}
			/>


			<StatsDetails />

		</>
	);
}

export default page;
