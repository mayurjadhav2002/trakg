"use client";

import React, { useState } from "react";
import Link from "next/link";
import { H4 } from "../others/texts";
import { Button } from "../ui/button";
import { Check, PlusIcon, X, BadgeCheck, RotateCcw } from "lucide-react";
import { PageHeader } from "../others/pageHeader";
import { cn } from "@/lib/utils";
import { useStore } from "@/stores/userStore";
import { ErrorMessages } from "@/lib/ErrorMessages";
import { toast } from "sonner";
import { useWebsites } from "@/hooks/useWebsites";
import { Loader2 } from "lucide-react";

const fetcher = async (url, options = {}) => {
  const res = await fetch(url, options);

  let json = null;
  try {
    const text = await res.text();
    json = text ? JSON.parse(text) : {};
  } catch {
    json = {
      error: true,
      errorCode: "INVALID_JSON",
      message: "Response was not valid JSON",
    };
  }

  if (!res.ok) {
    const message = json?.message || "An unexpected error occurred";
    throw new Error(message);
  }

  return json;
};

const ThumbIcon = ({ isSelected, className }) =>
  isSelected ? (
    <Check size={20} className={cn("text-green-500", className)} />
  ) : (
    <X size={20} className={cn("text-red-500", className)} />
  );

const Table = ({
  columns,
  data,
  handleDelete,
  handleRetry,
  onToggleActive,
  activeLoading,
}) => {
  const [retryLoading, setRetryLoading] = useState({});

  const onRetryClick = async (id) => {
    setRetryLoading((prev) => ({ ...prev, [id]: true }));
    await handleRetry(id);
    setRetryLoading((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <div className="overflow-x-auto mx-5">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800 p-5">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 font-semibold uppercase tracking-wider"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-950 divide-y divide-gray-200 dark:divide-gray-700">
          {data?.map((row) => (
            <tr key={row.trackingId}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${row.url}&size=64`}
                    alt={`${row.name}'s avatar`}
                  />
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {row.name}
                    </div>
                    <Link
                      href={row.url}
                      target="_blank"
                      className="text-sm text-gray-500 dark:text-gray-400"
                    >
                      {row.url}
                    </Link>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-gray-100">
                  {row.notificationUser}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {row.notificationEmail}
                </div>
              </td>

              {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
								<Link href={`/dashboard/website/analytics/${row.trackingId}?web=${row.url}&name=${encodeURIComponent(row.name)}`}>
									View
								</Link>
							</td> */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {row.verified ? (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                    <BadgeCheck className="w-4 h-4 mr-1" /> Verified
                  </span>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
                      Not Verified
                    </span>
                    <button
                      disabled={retryLoading[row.id]}
                      className={cn(
                        "text-gray-500 hover:-rotate-45 transition-all duration-250 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400",
                        retryLoading[row.id] && "animate-spin cursor-wait",
                      )}
                      onClick={() => onRetryClick(row.id)}
                      title="Retry Verification"
                      aria-label={`Retry verification for ${row.name}`}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Link
                  href={`/dashboard/website/${row.trackingId}?web=${row.url}&name=${encodeURIComponent(row.name)}`}
                  className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(row.id)}
                  className="ml-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const columns = [
  "Website",
  "Notification Recipient",
  // "Analytics",
  "Verification",
  "",
];

function WebList() {
  const { websites, loading, error, deleteWebsite, reFetchWebsites } =
    useWebsites();

  const [activeLoading, setActiveLoading] = useState({});

  const handleDelete = async (id) => {
    await deleteWebsite(id);
  };

  const handleRetry = async (websiteId) => {
    try {
      const result = await fetcher("/api/website/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          website_id: websiteId,
          tracking_id: websiteId,
        }),
      });

      if (result?.success) {
        toast.success("Website verified successfully", { richColors: true });
        reFetchWebsites();
      } else {
        toast.error(ErrorMessages[result?.error] || "Verification failed", {
          richColors: true,
        });
      }
    } catch {
      toast.error("An error occurred during verification retry", {
        richColors: true,
      });
    }
  };

  const onToggleActive = async (id, currentStatus) => {
    setActiveLoading((prev) => ({ ...prev, [id]: true }));

    try {
      const result = await fetcher(`/api/website`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          websiteId: id,
        },
        body: JSON.stringify({
          updateFields: {
            isActive: !currentStatus,
          },
        }),
      });

      if (result?.success) {
        toast.success(
          `Website marked as ${!currentStatus ? "Active" : "Inactive"}`,
          { richColors: true },
        );

        reFetchWebsites();
      } else {
        toast.error(ErrorMessages[result?.error] || "Failed to update status", {
          richColors: true,
        });
      }
    } catch {
      toast.error("Failed to update website status", { richColors: true });
    } finally {
      setActiveLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div>
      <PageHeader>
        <H4>Websites</H4>
        <Link href="/dashboard/website/new">
          <Button className="text-sm" varient="primary">
            <PlusIcon /> Add Website
          </Button>
        </Link>
      </PageHeader>

      {loading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : websites && websites.length > 0 ? (
        <Table
          columns={columns}
          data={websites}
          handleDelete={handleDelete}
          handleRetry={handleRetry}
          onToggleActive={onToggleActive}
          activeLoading={activeLoading}
        />
      ) : (
        <div className="text-center text-gray-800 dark:text-gray-300 text-xl py-10">
          <p>No websites found.</p>
        </div>
      )}
    </div>
  );
}

export default WebList;
