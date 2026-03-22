import AllForms from '@/components/forms/AllForms'
import BreadcrumbComponent from '@/components/others/Breadcrumb'
import React from 'react'
export const metadata = {
  title: "Forms - Dashboard",
  description: "Manage and view all forms created in the dashboard.",
}
function page() {
  return (
    <>
     <BreadcrumbComponent
					BreadCrumbList={[
            {title: "Dashboard", url: "/dashboard"},
            {title: "Forms", url: "/dashboard/forms"},
          ]}
			/> 
      <AllForms/>
    </>
  )
}

export default page