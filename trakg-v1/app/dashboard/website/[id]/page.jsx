import NotFound from "@/app/not-found";
import BreadcrumbComponent from "@/components/others/Breadcrumb";
import WebsiteDetail from "@/components/web/WebsiteDetail";
import React from "react";


export async function generateMetadata({ searchParams }) {
    const name = searchParams?.name ? decodeURIComponent(searchParams.name) : "Website";
    return {
        title: `Trakg - ${name} Website Details`,
    };
}


export default async function Page({ params, searchParams }) {
    const { id } = await params;
    const name = searchParams?.name ? decodeURIComponent(searchParams.name) : null;

    if (!id) return NotFound();


    return (
        <div>
            <BreadcrumbComponent
                BreadCrumbList={[
                    { title: "Dashboard", url: "/dashboard" },
                    { title: "Website", url: "/dashboard/website" },
                ]}
            />
            <WebsiteDetail id={id} />
        </div>
    );
}
