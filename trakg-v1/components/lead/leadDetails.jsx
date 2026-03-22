"use client";
import {
  Building2,
  EthernetPort,
  Hourglass,
  LandPlot,
  Navigation,
  Phone,
  Rows3,
  Smartphone,
  TimerIcon,
  XIcon,
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Globe, MonitorSmartphone, Languages, Laptop } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { XMarkIcon } from "@heroicons/react/24/outline";
import "@/style/scrollbar.min.css";
import {
  RiEarthLine,
  RiInformation2Fill,
  RiMobileDownloadLine,
} from "@remixicon/react";
import { ComputerIcon } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import Spinner from "../loading/spinner";
import { useFetch } from "@/hooks/useFetch";
import { useLead } from "@/hooks/useLead";

function LeadDetails({ leadId }) {
  const [open, setOpen] = useState(false);
  const [currentField, setCurrentField] = useState("");

  const { lead, loading, error, refresh } = useLead(leadId);

  if (loading)
    return (
      <div className="w-full h-[70vh] flex justify-center items-center">
        <Spinner />
      </div>
    );

  if (error || lead?.errorCode) {
    return (
      <div className="flex items-center justify-center">
        <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-md max-w-md">
          <h2 className="text-xl font-bold">Error</h2>
          <p>
            {lead?.errorCode === "lead_not_found_or_unauthorized"
              ? "The requested lead could not be found or you are not authorized to view it."
              : lead?.message || error?.message || "An unknown error occurred."}
          </p>
        </div>
      </div>
    );
  }

  if (!lead) return <p>No data found.</p>;

  const formData = lead?.data?.formData ?? [];

  // const advancedAllowed = !!lead?.allowed?.advancedAnalytics;

  const handleSetkey = (key) => {
    setCurrentField(key);
    setOpen(true);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 w-full">
      <div className="w-full sm:w-3/5">
        <div className="divide-y w-full divide-gray-200">
          <div className="py-5">
            <div className="px-4 sm:px-6">
              <h2 className="text-3xl/7 font-bold text-gray-900 dark:text-blue-50 sm:truncate sm:text-3xl sm:tracking-tight">
                Lead Information
              </h2>
            </div>
            <div className="flex gap-2 p-4">
              {lead?.data?.conversion ? (
                <Badge className="bg-green-600 text-white">Submitted</Badge>
              ) : (
                <>
                  <Badge variant="destructive">Abandoned</Badge>
                  <Badge variant="secondary">Not submitted</Badge>
                </>
              )}

              <Badge variant="outline">User: {lead?.data?.opportunityId}</Badge>
            </div>
            <dl className="mt-4">
              {(!formData || Object.keys(formData).length === 0) && (
                <p>No form fields captured</p>
              )}

              {formData &&
                Object.entries(formData).map(([key, value], index) => (
                  <div
                    key={index}
                    className="py-2 sm:py-2 sm:grid sm:grid-cols-6 w-full sm:gap-5 sm:px-6"
                  >
                    <dt className="text-sm font-medium sm:col-span-2 text-gray-500 dark:text-gray-300 capitalize">
                      {key}
                    </dt>
                    <dd className="mt-1 relative text-sm flex items-center group gap-2 text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-4">
                      {value}
                      <RiInformation2Fill
                        className="text-xs m-0 cursor-pointer right-0 group-hover:block hidden 
                    w-5 h-5
                    dark:bg-blue-700 dark:hover:bg-blue-800 dark:text-white rounded-lg"
                        onClick={() => {
                          handleSetkey(key);
                        }}
                      />
                    </dd>
                  </div>
                ))}
            </dl>
          </div>

          <div className="mb-5">
            <dl className="mt-4">
              <h2 className=" w-full sm:gap-5 sm:px-6"> Other Information</h2>

              <div className="py-2 sm:py-2 sm:grid sm:grid-cols-6 w-full sm:gap-5 sm:px-6">
                <dt className="text-sm font-medium sm:col-span-2 text-gray-500 dark:text-gray-300 capitalize">
                  Referral
                </dt>
                <dd className="mt-1 relative text-sm flex items-center group gap-2 text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-4">
                  {lead?.data?.referral}
                </dd>
              </div>
              <div className="py-2 sm:py-2 sm:grid sm:grid-cols-6 w-full sm:gap-5 sm:px-6">
                <dt className="text-sm font-medium sm:col-span-2 text-gray-500 dark:text-gray-300 capitalize">
                  Form Name
                </dt>
                <dd className="mt-1 relative text-sm flex items-center group gap-2 text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-4">
                  {lead?.data?.form?.formName}
                </dd>
              </div>
              <div className="py-2 sm:py-2 sm:grid sm:grid-cols-6 w-full sm:gap-5 sm:px-6">
                <dt className="text-sm font-medium sm:col-span-2 text-gray-500 dark:text-gray-300 capitalize">
                  Page URL
                </dt>
                <dd className="mt-1 relative text-sm flex items-center group gap-2 text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-4">
                  {lead?.data?.form?.pageUrl}
                </dd>
              </div>
              <div className="py-2 sm:py-2 sm:grid sm:grid-cols-6 w-full sm:gap-5 sm:px-6">
                <dt className="text-sm font-medium sm:col-span-2 text-gray-500 dark:text-gray-300 capitalize">
                  Last field Filled
                </dt>
                <dd className="mt-1 relative text-sm flex items-center group gap-2 text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-4">
                  {lead?.data?.leadinfo?.lastFieldFilled}
                </dd>
              </div>
            </dl>
          </div>
          {/* Geo Information */}
          <Section title="Geo Information">
            <GeoInfo geoData={lead?.data?.opportunityGeo} />
          </Section>

          <Section title={"Device Information"}>
            <DeviceInfo deviceData={lead?.data?.deviceInfo} />
          </Section>
        </div>
      </div>

      {lead?.data?.valueChanges && currentField && (
        <InfoSidebar
          open={open}
          setOpen={setOpen}
          data={lead?.data?.valueChanges[currentField] ?? {}}
          formSession={formatDuration(lead?.data?.timeSpendOnForm)}
          averageOnEachField={formatDuration(lead?.data?.averageOnEachField)}
        />
      )}
    </div>
  );
}

function RenderData({ valuesChanges, statsComp }) {
  const bestRecord = useMemo(() => {
    if (!valuesChanges?.data || !Array.isArray(valuesChanges.data)) return null;

    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;

    const emailEntry = valuesChanges.data.find((entry) =>
      emailRegex.test(entry?.value || ""),
    );
    if (emailEntry) {
      return {
        best: emailEntry.value,
        time: getTimeSpent(valuesChanges?.timespent),
      };
    }

    const validEntries = valuesChanges.data.filter(
      (entry) =>
        typeof entry?.value === "string" && entry.value.trim().length > 0,
    );
    if (validEntries.length === 0) return null;

    const longestEntry = validEntries.reduce((a, b) =>
      a.value.length > b.value.length ? a : b,
    );

    return {
      best: longestEntry.value,
      time: getTimeSpent(valuesChanges?.timespent),
    };
  }, [valuesChanges]);

  function getTimeSpent(timespent) {
    if (!Array.isArray(timespent)) return 0;
    const numericTimes = timespent.map(Number).filter((n) => !isNaN(n));
    return numericTimes.length ? Math.max(...numericTimes) : 0;
  }
  return (
    <Card className="dark:bg-slate-900 overflow-auto h-screen top-0 fixed right-0 z-[20] w-full max-w-md shadow-xl border-l border-gray-300 dark:border-gray-700">
      <CardContent className="p-4 sm:p-6">
        <div className="absolute top-4 left-0 -ml-12 p-2 bg-gray-100 dark:bg-slate-900 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-all">
          <XIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </div>

        {statsComp}

        <Separator className="my-6" />

        <section>
          <h2 className="text-2xl font-semibold dark:text-white">
            Field Session
          </h2>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Tag label={`${bestRecord?.time || 0}s spent`} color="blue" />
          </div>
        </section>

        <section className="mt-6">
          <h3 className="text-lg font-bold dark:text-white mb-1">
            Best Record:
          </h3>

          <div className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md p-3 overflow-x-auto text-sm custom-x-scrollbar">
            {bestRecord?.best || "No valid record found"}
          </div>
        </section>

        <section className="mt-8">
          <h3 className="text-lg font-bold dark:text-white">Recorded Events</h3>

          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Each captured after a 2s interval
          </p>

          <div className="max-h-[350px] overflow-y-auto border dark:border-gray-700 rounded-lg p-3 custom-width-scrollbar bg-white dark:bg-slate-800">
            <ul className="space-y-2">
              {valuesChanges?.data?.map((entry, index) => (
                <li
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 p-2 rounded-md shadow-sm text-sm"
                >
                  {entry?.value || "N/A"}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </CardContent>
    </Card>
  );
}

function Tag({ label, color }) {
  const colorMap = {
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    yellow:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  };

  return (
    <span
      className={`text-xs font-medium px-2.5 py-1 rounded-sm ${colorMap[color]}`}
    >
      {label}
    </span>
  );
}

const InfoSidebar = ({
  open,
  setOpen,
  data,
  formSession,
  averageOnEachField,
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Field Analytics</DialogTitle>
        </DialogHeader>

        <RenderData
          valuesChanges={data}
          statsComp={
            <div className="flex gap-4 p-4">
              <div className="flex w-full items-center p-4 bg-green-100 rounded">
                <TimerIcon className="w-8 h-8" />
                <div className="ml-4">
                  <p className="font-bold">{formSession}</p>
                  <p className="text-sm text-muted-foreground">
                    Time Spent on Form
                  </p>
                </div>
              </div>

              <div className="flex w-full items-center p-4 bg-blue-100 rounded">
                <Hourglass className="w-8 h-8" />
                <div className="ml-4">
                  <p className="font-bold">{averageOnEachField}</p>
                  <p className="text-sm text-muted-foreground">
                    Avg Spend on Each Field
                  </p>
                </div>
              </div>
            </div>
          }
        />
      </DialogContent>
    </Dialog>
  );
};

export default LeadDetails;

function GeoInfo({ geoData }) {
  return (
    <div className="grid grid-cols-2 gap-4 px-6 py-4">
      {[
        {
          icon: RiEarthLine,
          label: "Country",
          value: geoData?.countryName || "N/A",
        },
        { icon: Building2, label: "City", value: geoData?.cityName || "N/A" },
        {
          icon: LandPlot,
          label: "Region",
          value: geoData?.regionName || "N/A",
        },
        {
          icon: Navigation,
          label: "Postal Code",
          value: geoData?.zipCode || "N/A",
        },
        {
          icon: EthernetPort,
          label: "IP Address",
          value: geoData?.ipAddress || "N/A",
        },
        {
          icon: TimerIcon,
          label: "Timezone",
          value: geoData?.timeZone || "N/A",
        },
      ].map(({ icon: Icon, label, value }, index) => (
        <dl key={index} className="w-full">
          <dt className="text-sm flex items-center gap-2 text-gray-700 dark:text-slate-200">
            <Icon className="w-6 h-6 dark:text-slate-200" /> {label}
          </dt>
          <dd className="ml-8 font-semibold bg-gray-100 dark:bg-gray-800 py-1 px-2 rounded-md">
            {value}
          </dd>
        </dl>
      ))}
    </div>
  );
}

const DeviceInfo = React.memo(({ deviceData }) => {
  return (
    <div className="grid grid-cols-2 gap-4 px-6 py-4">
      {[
        {
          icon: Globe,
          label: "Browser",
          value: deviceData?.uaParsed?.browser?.name || "N/A",
        },
        {
          icon: MonitorSmartphone,
          label: "OS",
          value:
            `${deviceData?.uaParsed?.os?.name || ""} ${deviceData?.uaParsed?.os?.version || ""}`.trim() ||
            "N/A",
        },
        {
          icon: Languages,
          label: "Language",
          value: deviceData?.otherData?.language || "N/A",
        },
        {
          icon: Navigation,
          label: "Vendor",
          value: deviceData?.otherData?.vendor || "N/A",
        },
      ].map(({ icon: Icon, label, value }, index) => (
        <dl key={index} className="w-full">
          <dt className="text-sm flex items-center gap-2 text-gray-700 dark:text-slate-200">
            <Icon className="w-5 h-5" /> {label}
          </dt>
          <dd className="ml-8 font-semibold bg-gray-100 dark:bg-gray-800 py-1 px-2 rounded-md">
            {value}
          </dd>
        </dl>
      ))}

      {/* Full width User Agent */}
      <div className="col-span-2">
        <dt className="text-sm flex items-center gap-2 text-gray-700 dark:text-slate-200">
          <Laptop className="w-5 h-5" /> User Agent
        </dt>
        <dd className="ml-8 w-full font-semibold bg-gray-100 dark:bg-gray-800 py-1 px-2 rounded-md break-all">
          {deviceData?.otherData?.userAgent || "N/A"}
        </dd>
      </div>
    </div>
  );
});

function Section({ title, children }) {
  return (
    <div className="p-5">
      <h3 className="text-2xl/7 font-bold text-gray-900 dark:text-blue-50 sm:truncate sm:text-2xl sm:tracking-tight">
        {title}
      </h3>
      {children}
    </div>
  );
}
