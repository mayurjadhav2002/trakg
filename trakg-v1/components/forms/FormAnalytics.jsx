"use client";

import React, { useMemo } from "react";

import { DropOffChart } from "./analyticsComponent/DropOffChart";
import { FieldTimeSpend } from "./analyticsComponent/FieldTimeSpend";
import { FieldFills } from "./analyticsComponent/FieldFills";
import { H4 } from "../others/texts";
import { GeoType2 } from "../analytics/engagement/GeoType";
import { FormDeviceType } from "./analyticsComponent/FormDeviceType";
import { ReturningUserCard } from "./analyticsComponent/ReturningUserCount";
import { FormCountryWiseData } from "../analytics/Engagement";
import Spinner from "../loading/spinner";
import { useFetch } from "@/hooks/useFetch";
import {
  FiClock,
  FiUsers,
  FiCheckCircle,
  FiAlertCircle,
  FiActivity,
} from "react-icons/fi";
function CardStack({ icon, color, label, value }) {
  return (
    <div className="p-4 flex items-center">
      <div className={`p-3 rounded-full mr-4 ${color}`}>{icon}</div>
      <div>
        <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
          {label}
        </p>
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          {value}
        </p>
      </div>
    </div>
  );
}

function FormAnalyticsStats({
  avgTime,
  completedLeads,
  partialCount,
  totalUsers,
  totalLeads,
}) {
  return (
    <div className="w-full flex flex-col xl:flex-row gap-0 mb-8">
      <div className="flex-1 max-w-[230px] xl:mr-6 mb-4 xl:mb-0 shadow border-t-2 rounded-lg min-w-[150px]">
        <CardStack
          icon={<FiClock className="w-5 h-5" />}
          color="text-purple-500 bg-purple-100 dark:text-purple-100 dark:bg-purple-500"
          label="Avg. Time Spent"
          value={avgTime}
        />
      </div>

      <div className="flex flex-1 flex-wrap border-t-2 sm:flex-nowrap w-full overflow-hidden rounded-lg shadow">
        {[
          {
            icon: <FiUsers className="w-5 h-5" />,
            color:
              "text-orange-500 bg-orange-100 dark:text-orange-100 dark:bg-orange-500",
            label: "Total Users",
            value: totalUsers,
          },
          {
            icon: <FiActivity className="w-5 h-5" />,
            color:
              "text-green-500 bg-green-100 dark:text-green-100 dark:bg-green-500",
            label: "Total Leads",
            value: totalLeads,
          },
          {
            icon: <FiAlertCircle className="w-5 h-5" />,
            color:
              "text-blue-500 bg-blue-100 dark:text-blue-100 dark:bg-blue-500",
            label: "Partial Leads",
            value: partialCount,
          },
          {
            icon: <FiCheckCircle className="w-5 h-5" />,
            color:
              "text-teal-500 bg-teal-100 dark:text-teal-100 dark:bg-teal-500",
            label: "Completed Leads",
            value: completedLeads,
          },
        ].map((item, index) => (
          <div
            key={index}
            className="flex-1 border-l last:border-r bg-white dark:bg-gray-800"
          >
            <CardStack {...item} />
          </div>
        ))}
      </div>
    </div>
  );
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

export default function FormAnalytics({ formId }) {
  const { getFormAnalytics, analyticsLoading } = useForms();

  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (!formId) return;

    (async () => {
      const data = await getFormAnalytics(formId);
      setAnalytics(data);
    })();
  }, [formId]);

  if (analyticsLoading) {
    return (
      <div className="w-full h-[80vh]">
        <Spinner />
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="px-4 space-y-5">
      <FormAnalyticsStats
        avgTime={formatTime(analytics?.averageTimeOnForm)}
        completedLeads={analytics?.completeCount}
        partialCount={analytics?.partialCount}
        totalUsers={analytics?.totalUsers}
        totalLeads={analytics?.totalLeads}
      />

      <DropOffChart lastFieldsFilled={analytics?.lastFilledFieldStats} />

      <div className="grid grid-cols-2 gap-5 flex-wrap w-full">
        <FieldTimeSpend fieldTimeStats={analytics?.fieldTimeStats} />
        <FieldFills fieldFillPercent={analytics?.fieldFillPercent} />
      </div>

      <div className="space-y-5">
        <H4>User Attributes</H4>
        <GeoType2 stats={analytics?.countryStats} />

        <div className="grid grid-cols-2 gap-5 flex-wrap w-full">
          <FormDeviceType
            deviceStats={analytics?.deviceStats?.os}
            browserStats={analytics?.deviceStats?.browser}
          />
          <ReturningUserCard returningUsers={analytics?.returningUsers} />
        </div>

        <FormCountryWiseData
          alldata={data?.trendAnalytics}
          todayData={analytics?.formBehavior?.today}
        />
      </div>
    </div>
  );
}
