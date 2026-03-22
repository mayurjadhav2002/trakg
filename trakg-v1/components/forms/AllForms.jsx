import React from "react";
import {PageHeader} from "../others/pageHeader";
import {H4} from "../others/texts";
import {FormTable} from "./FormTable";

function AllForms() {
	return (
		<div>
			<PageHeader>
				<H4>Forms</H4>
			</PageHeader>
			<FormTable />
		</div>
	);
}

export default AllForms;
