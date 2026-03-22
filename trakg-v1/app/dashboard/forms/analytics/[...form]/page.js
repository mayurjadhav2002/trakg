import FormAnalytics from "@/components/forms/FormAnalytics";
import BreadcrumbComponent from "@/components/others/Breadcrumb";
export async function generateMetadata({params}) {
	const {form} = await params;

	return {
		title: `Analytics for Form ${form}`,
		description: `View analytics and insights for the form with ID ${form}.`,
	};
}

export default async function Page({params}) {
	const {form} = await params;
	return (
		<>
			<BreadcrumbComponent
				BreadCrumbList={[
					{title: "Dashboard", url: "/dashboard"},
					{title: "Forms", url: "/dashboard/forms"},
					{
						title: "Analytics",
						url: `/dashboard/forms/analytics/${form}`,
					},
				]}
			/>
			<FormAnalytics formId={form} />
		</>
	);
}
