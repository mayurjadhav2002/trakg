import SuspenseLoader from "@/components/loading/SuspenseLoader";
import BreadcrumbComponent from "@/components/others/Breadcrumb";
import React, { Suspense } from "react";
import { BellOff } from "lucide-react";

export const metadata = {
	title: "Notifications - Trakg",
	description: "Manage and view all leads created in the dashboard.",
};
export default async function Page() {
	return (
		<Suspense fallback={<SuspenseLoader />}>
			<BreadcrumbComponent
				BreadCrumbList={[
					{ title: "Dashboard", url: "/dashboard" },
					{ title: "Notifications", url: "/dashboard/Notifications" },
				]}
			/>
			<div>
				<div className="flex h-[80vh] flex-col items-center justify-center text-center px-4">
					<div className="flex items-center justify-center w-20 h-20 rounded-full bg-muted">
						<BellOff className="w-10 h-10 text-muted-foreground" />
					</div>
					<h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
						No Notifications Yet
					</h2>
					<p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
						You’re all caught up! We’ll let you know when there’s something new to review.
					</p>
				</div>
			</div>
		</Suspense>
	);
}
