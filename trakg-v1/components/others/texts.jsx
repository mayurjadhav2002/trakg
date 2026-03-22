import { cn } from "@/lib/utils";

export const H4 = ({ className, id,  children, props }) => {
    return (
        <h4 className={cn("text-2xl font-bold dark:text-white " + className) } id={id} {...props}>
        {children}
        </h4>
    );
}