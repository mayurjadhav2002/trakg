import {cn} from "@/lib/utils";

export function PageHeader({className, children, props}) {
	return (
		<div
			className={cn("flex justify-between items-center pb-5", className)}
			{...props}
		>
			{children}
		</div>
	);
}

