"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarList } from "@tremor/react";
import "@/style/chart.min.css";
import DeviceType from "./DeviceType";
import { GeoType } from "./GeoType";
import { useTrafficAnalytics } from "@/hooks/useTrafficAnalytics";

const ReferralList = ({ referrals, loading, error }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading referrals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Error loading referrals</p>
      </div>
    );
  }

  if (!referrals || referrals.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No referral data</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {referrals.map(([url, referralObj], index) => {
        const isValidUrl = /^https?:\/\//i.test(url);

        const formattedUrl = !isValidUrl
          ? "Direct Visit"
          : new URL(url).hostname + new URL(url).pathname;

        const referralCount = referralObj?.referral ?? 0;

        return (
          <div
            key={index}
            className="grid grid-cols-2 px-2 py-1 hover:bg-muted cursor-pointer rounded"
          >
            {!isValidUrl ? (
              <p className="text-left break-words text-sm text-muted-foreground italic">
                {formattedUrl}
              </p>
            ) : (
              <Link
                className="text-left break-words text-sm"
                href={url}
                target="_blank"
              >
                {formattedUrl}
              </Link>
            )}

            <p className="text-right font-semibold text-sm">{referralCount}</p>
          </div>
        );
      })}
    </div>
  );
};

function PageViews() {
  const {
    loading,
    error,
    deviceTypeCounts,
    formattedCountryData,
    formattedReferralData,
    formattedPageUrlData,
  } = useTrafficAnalytics();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-5">
        <div className="col-span-4 lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Geo Location</CardTitle>
            </CardHeader>

            <CardContent>
              <GeoType
                data={formattedCountryData}
                loading={loading}
                error={error}
              />
            </CardContent>
          </Card>
        </div>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Operating System</CardTitle>
          </CardHeader>

          <CardContent>
            <DeviceType
              data={deviceTypeCounts}
              loading={loading}
              error={error}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-5">
        <Card className="col-span-4 lg:col-span-2 p-2 relative">
          <CardHeader>
            <CardTitle>Page Sessions</CardTitle>
          </CardHeader>

          <CardContent className="max-h-[350px] overflow-y-auto dark:bg-slate-900 rounded-lg bg-opacity-35">
            <BarList
              data={
                formattedPageUrlData.length
                  ? formattedPageUrlData
                  : [{ name: "No data", value: 0 }]
              }
              color="blue"
              className="opacity-80"
            />

            {loading && (
              <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm">
                <p className="text-muted-foreground">
                  Loading page sessions...
                </p>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm">
                <p className="text-red-500">Error loading page sessions</p>
              </div>
            )}

            {!loading && !error && formattedPageUrlData.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm">
                <p className="text-muted-foreground">No page session data</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Referrals</CardTitle>
          </CardHeader>

          <CardContent className="h-[200px] overflow-y-auto dark:bg-slate-900 px-2 mb-4 bg-opacity-35 rounded-lg">
            <ReferralList
              referrals={formattedReferralData}
              loading={loading}
              error={error}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default PageViews;
