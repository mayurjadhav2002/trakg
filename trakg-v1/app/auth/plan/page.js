import PlanTable from "@/components/auth/plan/PlanTable";
import SuspenseLoader from "@/components/loading/SuspenseLoader";
import React, {Suspense} from "react";

function page() {
	return (
		<>
			<Suspense fallback={<SuspenseLoader />}>
				<PlanTable />
			</Suspense>
		</>
	);
}

export default page;
