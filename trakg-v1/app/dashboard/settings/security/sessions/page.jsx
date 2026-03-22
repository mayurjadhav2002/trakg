"use client";

import React from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import {
  MapPin,
  Monitor,
  Server,
  Globe,
  Smartphone,
  Laptop,
  Clock,
  LogIn,
  User,
} from "lucide-react";
import { FaGoogle, FaLinkedin } from "react-icons/fa";
import Spinner from "@/components/loading/spinner";
import { useFetch } from "@/hooks/useFetch";
import { ErrorMessages } from "@/lib/ErrorMessages";
import { useSessions } from "@/hooks/useSessions";
import { useEffect } from "react";
import { safeValue } from "@/lib/utils";

// Utils
function getDeviceIcon(deviceType) {
  if (!deviceType) return <Monitor className="w-4 h-4 text-muted-foreground" />;
  switch (deviceType.toLowerCase()) {
    case "desktop":
      return <Laptop className="w-4 h-4 text-muted-foreground" />;
    case "mobile":
    case "tablet":
      return <Smartphone className="w-4 h-4 text-muted-foreground" />;
    default:
      return <Monitor className="w-4 h-4 text-muted-foreground" />;
  }
}

function getLoginIcon(type) {
  switch (type?.toLowerCase()) {
    case "google":
      return <FaGoogle className="w-4 h-4 text-[#DB4437]" />;
    case "linkedin":
      return <FaLinkedin className="w-4 h-4 text-[#0077B5]" />;
    case "simple":
      return <User className="w-4 h-4 text-muted-foreground" />;
    default:
      return <LogIn className="w-4 h-4 text-muted-foreground" />;
  }
}

function formatDateTime(timestamp) {
  const date = new Date(timestamp);
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleString(undefined, options);
}

export default function SessionsPage() {
  const { sessions, loading, error, fetchSessions } = useSessions();

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(ErrorMessages[error?.errorCode] || ErrorMessages.default, {
        richColors: true,
      });
    }
  }, [error]);

  return (
    <div className="max-w-6xl mx-auto px-4 pb-10">
      <h1 className="text-2xl font-bold mb-6 inline-block px-4 py-2 rounded-md bg-gray-100 text-blue-700 dark:bg-gray-800 dark:text-blue-400">
        Active Sessions
      </h1>
      {loading && (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      )}

      {!loading && sessions?.length === 0 && (
        <p className="text-muted-foreground text-sm text-center">
          No sessions found.
        </p>
      )}

      {!loading && sessions?.length > 0 && (
        <div className="space-y-3">
          {sessions?.map((session, index) => {
            const os = safeValue(session.os);
            const deviceType = safeValue(session.deviceType);
            const browser = safeValue(session.browser);
            const ip = safeValue(session.ip, "Unknown");
            const country = safeValue(session.country);
            const region = safeValue(session.region);
            const city = safeValue(session.city);
            const loginType = safeValue(session.loginType);
            const createdAt = session.createdAt;

            const location =
              [city, region, country]
                .filter((v) => v && v !== "Unknown")
                .join(", ") || "Unknown";
            return (
              <Card
                key={index}
                className="p-4 bg-muted/40 dark:bg-muted/10 border border-muted rounded-lg space-y-3"
              >
                <div className="flex items-center gap-2 text-base font-medium">
                  {getDeviceIcon(deviceType)}
                  <span>
                    {os} — {deviceType}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="w-4 h-4" />
                  <span>{browser}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Server className="w-4 h-4" />
                  <span>{ip}</span>
                </div>

                {location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{location}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {getLoginIcon(loginType)}
                  <span className="capitalize">Login Type: {loginType}</span>
                </div>

                {createdAt && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Logged in {formatDateTime(createdAt)}</span>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
