"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Monitor, Smartphone } from "lucide-react";
import { PasswordChange } from "./passwordChange";
import Spinner from "@/components/loading/spinner";
import NotificationPreferences from "./NotificationPreferences";
import { MapPin, Server, Globe, Laptop } from "lucide-react";
import { ErrorMessages } from "@/lib/ErrorMessages";
import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { useSessions } from "@/hooks/useSessions";
import { useDeleteAccount } from "@/hooks/useDeleteAccount";
import { useEffect } from "react";
import { safeValue } from "@/lib/utils";

function SecurityComponent() {
  return (
    <div className="max-w-3xl space-y-6 px-4">
      <PreferencesComponent />
      <SessionInfo />
      <AccountSettings />
    </div>
  );
}

function getDeviceIcon(deviceType) {
  if (!deviceType) return <Monitor className="w-5 h-5 text-muted-foreground" />;
  switch (deviceType.toLowerCase()) {
    case "desktop":
      return <Laptop className="w-5 h-5 text-muted-foreground" />;
    case "mobile":
    case "tablet":
      return <Smartphone className="w-5 h-5 text-muted-foreground" />;
    default:
      return <Monitor className="w-5 h-5 text-muted-foreground" />;
  }
}

function SessionInfo() {
  const { sessions, loading, error, fetchSessions } = useSessions();

  useEffect(() => {
    fetchSessions(5);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Sessions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Recent 5 Sessions</h3>
          <Link href="/dashboard/settings/security/sessions">
            <Button color="primary">View All</Button>
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center py-4">
            <Spinner />
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm">
            {ErrorMessages[error?.errorCode] || ErrorMessages.default}
          </div>
        )}

        {!loading && !error && sessions?.length === 0 && (
          <p className="text-muted-foreground text-sm">
            No active sessions found.
          </p>
        )}

        {!loading && !error && sessions?.length > 0 && (
          <div className="space-y-4">
            {sessions?.map((session, index) => {
              const os = safeValue(session.os);
              const deviceType = safeValue(session.deviceType);
              const browser = safeValue(session.browser);
              const ip = safeValue(session.ip, "Unknown");
              const country = safeValue(session.country);
              const region = safeValue(session.region);
              const city = safeValue(session.city);

              const location =
                [city, region, country]
                  .filter((v) => v && v !== "Unknown")
                  .join(", ") || "Unknown";

              return (
                <div
                  key={index}
                  className="flex items-start justify-between p-4 rounded-lg bg-muted/40 dark:bg-muted/10 border"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium">
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
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AccountSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Account Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <PasswordChange />

        {/* <div className="flex items-center justify-between relative">
          <div>
            <p className="font-medium">Download Your Data</p>
            <p className="text-sm text-muted-foreground">
              Export all your account-related data
            </p>
          </div>
          <Button color="primary" variant="faded" isDisabled>
            Export
          </Button>
        </div> */}

        <DeleteAccount />
      </CardContent>
    </Card>
  );
}

const DeleteAccount = () => {
  const { Logout } = useUser();
  const { deleteAccount, loading } = useDeleteAccount();
  const [open, setOpen] = useState(false);

  const handleDeleteAccount = async () => {
    const res = await deleteAccount();

    if (res?.success) {
      Logout();
    }

    setOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-red-600">Delete Your Account</p>
          <p className="text-sm text-muted-foreground">
            Permanently remove your account and all associated data
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete</Button>
          </DialogTrigger>

          <DialogOverlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />

          <DialogContent className="sm:max-w-[420px] z-50">
            <DialogHeader>
              <DialogTitle className="text-red-600">Delete Account</DialogTitle>
            </DialogHeader>

            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                This action{" "}
                <span className="font-semibold text-red-500">
                  cannot be undone
                </span>
                . Deleting your account will permanently erase:
              </p>

              <ul className="list-disc list-inside space-y-1">
                <li>Captured leads</li>
                <li>Sessions</li>
                <li>Payment information</li>
                <li>User profiles</li>
                <li>Automation workflows</li>
              </ul>

              <p>Please confirm if you want to proceed.</p>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>

              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete Account"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

function PreferencesComponent() {
  // const [analyticsSharing, setAnalyticsSharing] = useState("disabled");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <NotificationPreferences />
        {/* 
				<div className="flex items-center justify-between">
					<div>
						<p className="font-medium">Share Data for Analytics</p>
						<p className="text-sm text-muted-foreground">Help us improve by sharing anonymous usage data</p>
					</div>
					<Select
						value={analyticsSharing}
						onValueChange={setAnalyticsSharing}
					>
						<SelectTrigger className="w-32">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="enabled">Enabled</SelectItem>
							<SelectItem value="disabled">Disabled</SelectItem>
						</SelectContent>
					</Select>
				</div> */}

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Theme</p>
            <p className="text-sm text-muted-foreground">
              Choose your preferred appearance
            </p>
          </div>
          <ThemeSwitcher />
        </div>
      </CardContent>
    </Card>
  );
}

export default SecurityComponent;
