import BreadcrumbComponent from '@/components/others/Breadcrumb'
import React from 'react'

function page() {
  return (
    <div>
      
			<BreadcrumbComponent
				BreadCrumbList={[
					{title: "Dashboard", url: "/dashboard"},
					{title: "Analytics", url: "/dashboard/analytics"},
          {title: "Overview", url: "/dashboard/analytics/overview"},
				]}
			/>
      Analytics
    </div>
  )
}

export default page