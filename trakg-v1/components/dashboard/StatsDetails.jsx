"use client";

import React, { memo, useMemo } from "react";
import { EmptyStateDefault } from "../others/Empty";
import SubscriptionStatus from "../subscription/Status";
import { useStore } from "@/stores/userStore";
import { Card } from "@/components/ui/card";
import { FormDeviceType } from "../forms/analyticsComponent/FormDeviceType";
import AcquisitionFormData, { DashboardGraph } from "../analytics/Engagement";
import {
  PiCardsThreeBold,
  PiClockBold,
  PiChartLineUpBold,
  PiChartBarBold,
} from "react-icons/pi";
import { useDashboardStats } from "@/hooks/useDashboardStats";

const MetricCardSkeleton = () => (
  <div className="border-b border-gray-200 px-6 py-5 sm:border-r xl:border-b-0 dark:border-gray-800 animate-pulse">
    <div className="h-4 bg-gray-300 rounded w-24 mb-3 dark:bg-gray-700" />
    <div className="h-6 bg-gray-300 rounded w-16 dark:bg-gray-700" />
  </div>
);

const MetricCard = memo(({ title, value, tag, icon, iconClasses }) => (
  <div className="border-b border-gray-200 px-4 py-4 sm:border-r xl:border-b-0 dark:border-gray-800">
    <div className="flex">
      <div
        className={
          iconClasses + " align-middle items-center max-h-36 mr-3 flex "
        }
      >
        {icon}
      </div>
      <div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {title}
        </span>
        <div className="mt-2 flex items-end gap-3">
          <h4 className="text-title-xs sm:text-title-sm font-bold text-gray-800 dark:text-white/90">
            {value}
          </h4>
          {tag && (
            <div>
              <span className="bg-gray-100 dark:bg-gray-700 flex items-center gap-1 rounded-full py-0.5 pr-2.5 pl-2 text-sm font-medium">
                {tag}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
));

const StatsDetails = () => {
  const { data: dashboardData, loading: isLoading } = useDashboardStats();
  const activeWebsite = useStore((s) => s.activeWebsite);

  const noWebsite = !activeWebsite?.id;
  const siteData = useMemo(() => {
    if (noWebsite) return null;
    return dashboardData?.data?.data?.find(
      (site) => site.websiteId === activeWebsite.id,
    );
  }, [dashboardData?.data?.data, activeWebsite?.id, noWebsite]);

  const isDataLoading = isLoading || (!dashboardData && !noWebsite);

  if (isDataLoading) {
    return (
      <div className="space-y-3">
        <SubscriptionStatus />
        <div className="grid rounded-xl border-2 border-gray-200 bg-white sm:grid-cols-2 xl:grid-cols-4 dark:border-gray-800 dark:bg-gray-900">
          {Array.from({ length: 4 }).map((_, idx) => (
            <MetricCardSkeleton key={idx} />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 grid-cols-2 sm:grid-cols-1 gap-3">
          <TodaysLeadTable leads={[]} isLoading />
          <EmptyStateDefault
            title="Loading Data..."
            description="Fetching data for your dashboard..."
            button="Create Website"
          />
        </div>
        <DashboardGraph data={[]} isLoading />
      </div>
    );
  }

  const renderEmptyFallback = () => (
    <div className="space-y-3">
      <SubscriptionStatus />
      <div className="grid rounded-xl border-2 border-gray-200 bg-white sm:grid-cols-2 xl:grid-cols-4 dark:border-gray-800 dark:bg-gray-900">
        <MetricCard
          title="Total Leads"
          value={0}
          icon={<PiCardsThreeBold size={28} />}
          iconClasses="  dark:bg-gray-800 p-2 rounded-lg text-blue-600 bg-blue-100"
        />
        <MetricCard
          title="Submissions"
          value={
            <>
              <span className="text-red-600">{0}</span> /
              <span className="text-green-500">{0}</span>
            </>
          }
          icon={<PiChartBarBold size={28} />}
          iconClasses=" bg-purple-100 dark:bg-gray-800 p-2 rounded-lg text-purple-600"
        />
        <MetricCard
          title="Abandonment Rate"
          value={`${0}%`}
          icon={<PiChartLineUpBold size={28} />}
          iconClasses=" bg-red-100 dark:bg-gray-800 p-2 rounded-lg text-red-600"
        />
        <MetricCard
          title="Average Lead Time"
          value={"-"}
          icon={<PiClockBold size={28} />}
          iconClasses=" bg-yellow-100 dark:bg-gray-800 p-2 rounded-lg text-yellow-600"
        />
      </div>
      <div className="grid lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 grid-cols-2 sm:grid-cols-1 gap-3">
        <TodaysLeadTable leads={[]} />
        <EmptyStateDefault
          title="No Data Available"
          description="This website has no data yet. Try again later once traffic comes in."
          button="Create Website"
        />
      </div>
      <DashboardGraph data={[]} />
    </div>
  );

  if (noWebsite || !siteData) {
    return renderEmptyFallback();
  }

  const leadsData = siteData.leadsData ?? {};

  return (
    <div className="space-y-3">
      <SubscriptionStatus />

      <div className="grid rounded-xl border-2 border-gray-200 bg-white sm:grid-cols-2 xl:grid-cols-4 dark:border-gray-800 dark:bg-gray-900">
        <MetricCard
          title="Total Leads"
          value={leadsData.totalLeads ?? 0}
          icon={<PiCardsThreeBold size={28} />}
          iconClasses="  dark:bg-gray-800 p-2 rounded-lg text-blue-600 bg-blue-100"
        />
        <MetricCard
          title="Submissions"
          value={
            <>
              <span className="text-red-600">{leadsData.partialLeads}</span> /
              <span className="text-green-500">{leadsData.completedLeads}</span>
            </>
          }
          icon={<PiChartBarBold size={28} />}
          iconClasses=" bg-purple-100 dark:bg-gray-800 p-2 rounded-lg text-purple-600"
        />
        <MetricCard
          title="Abandonment Rate"
          value={`${leadsData.abandonmentRate ?? 0}%`}
          icon={<PiChartLineUpBold size={28} />}
          iconClasses=" bg-red-100 dark:bg-gray-800 p-2 rounded-lg text-red-600"
        />
        <MetricCard
          title="Average Lead Time"
          value={leadsData.avgTimeSpent ?? "-"}
          icon={<PiClockBold size={28} />}
          iconClasses=" bg-yellow-100 dark:bg-gray-800 p-2 rounded-lg text-yellow-600"
        />
      </div>

      <div className="grid lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 grid-cols-2 sm:grid-cols-1 gap-3">
        <TodaysLeadTable leads={dashboardData?.data?.todaysLeads ?? []} />
        {dashboardData?.data?.data?.length ? (
          <WebsiteStatsTable websites={dashboardData?.data?.data} />
        ) : (
          <EmptyStateDefault
            title="No Website Created"
            description="Please create a new website to capture leads"
            button="Create Website"
          />
        )}
      </div>

      <DashboardGraph data={dashboardData?.data?.last7DaysLeadsStats ?? []} />
    </div>
  );
};

export const WebsiteStatsTable = memo(({ websites = [] }) => {
  if (!websites.length) return null;
  return (
    <Card className="p-4 h-[400px] w-full dark:bg-[#18181b]">
      <h2 className="text-lg mb-3 font-semibold px-2">All Website</h2>
      <div className="overflow-y-auto custom-width-scrollbar">
        <table className="w-full table-auto border-collapse">
          <thead className="sticky top-0 bg-white dark:bg-neutral-900 z-10 border-b-2 border-gray-300 dark:border-gray-300">
            <tr className="text-xs text-gray-700 dark:text-gray-200 p-2 uppercase ">
              <th className="text-left p-2 ml-5  ">Website</th>
              <th className="text-right p-2 ">Forms</th>
              <th className="text-right  p-2 ">Leads</th>
            </tr>
          </thead>
          <tbody>
            {websites.map((site, idx) => (
              <tr
                key={site.websiteId || idx}
                className={idx <= websites.length && "border-b"}
              >
                <td className="p-2">
                  <div className="flex flex-col">
                    <span className="font-normal text-sm">
                      {site.websiteName ?? "Untitled"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {site.url ?? "-"}
                    </span>
                  </div>
                </td>
                <td className="text-right text-sm font-medium p-2">
                  {site.formsCount ?? 0}
                </td>
                <td className="text-right text-sm font-medium p-2">
                  {site.leadsData?.totalLeads ?? 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
});
export const TodaysLeadTable = memo(({ leads = [] }) => {
  return (
    <Card className={`p-4 dark:bg-[#18181b] h-[400px] overflow-hidden`}>
      <h2 className="text-lg mb-3 font-semibold px-2">
        Leads{" "}
        <span className="text-xs text-gray-500 text-normal">
          {"(captured in last 24 hours)"}
        </span>
      </h2>

      {/* Scroll container with max height */}
      <div className="overflow-y-auto max-h-[320px] pr-1">
        <table className="w-full table-auto border-collapse">
          <thead className="sticky top-0 bg-white dark:bg-neutral-900 z-10 border-b-2 border-gray-300 dark:border-gray-300">
            <tr className="text-xs">
              <th className="text-left   p-2  uppercase">Value Entered</th>
              <th className="text-right  p-2 uppercase">Country</th>
              <th className="text-right  p-2 uppercase">Form Name</th>
              <th className="text-right  p-2 uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center pt-20 text-lg text-gray-500"
                >
                  No Leads Found yet
                </td>
              </tr>
            ) : (
              leads.map((lead, idx) => {
                const formData = lead.formData || {};
                const firstValue = Object.values(formData)[0] ?? "-";

                return (
                  <tr
                    key={idx}
                    className={idx < leads.length ? "border-b" : ""}
                  >
                    <td className="pt-2 text-sm px-2">{String(firstValue)}</td>
                    <td className="text-center text-sm font-medium p-2">
                      {lead.country || "-"}
                    </td>
                    <td className="text-right text-sm font-medium p-2">
                      {lead.form?.formName || "-"}
                    </td>
                    <td className="text-right text-sm font-medium p-2">
                      {lead.conversion ? (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                          Completed
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
                          Abandoned
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
});

export default memo(StatsDetails);
