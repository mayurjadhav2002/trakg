import React from "react";
import "@/style/spinner.min.css"
function Spinner() {
	return (
		<div className="flex items-center justify-center h-full w-full">
	<div className='spinner'>
			<div className='loader l1'></div>
			<div className='loader l2'></div>
		</div>
		</div>
	
	);
}

export default Spinner;
