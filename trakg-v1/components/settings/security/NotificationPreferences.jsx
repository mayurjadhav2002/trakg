"use client";

import * as Dialog from "@radix-ui/react-dialog";
import React, { useState } from "react";
import { X, Megaphone, Percent, ShoppingCart, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Spinner from "@/components/loading/spinner";
import { useNotificationPreferences } from "@/hooks/useNotificationPreferences";

const categories = [
  {
    label: "Marketing",
    key: "marketing",
    description: "Product announcements, campaigns, and brand news",
    icon: Megaphone,
    color: "text-pink-600",
    bg: "bg-pink-100 dark:bg-pink-900/20",
  },
  {
    label: "Promotions",
    key: "promotions",
    description: "Special deals, coupons, and limited-time offers",
    icon: Percent,
    color: "text-yellow-600",
    bg: "bg-yellow-100 dark:bg-yellow-900/20",
  },
  {
    label: "Sales",
    key: "sales",
    description: "Personalized offers and purchase recommendations",
    icon: ShoppingCart,
    color: "text-green-600",
    bg: "bg-green-100 dark:bg-green-900/20",
  },
  {
    label: "Updates",
    key: "updates",
    description: "Account changes, system alerts, or app updates",
    icon: Bell,
    color: "text-blue-600",
    bg: "bg-blue-100 dark:bg-blue-900/20",
  },
];

export default function NotificationPreferences() {
  const [open, setOpen] = useState(false);

  const {
    preferences,
    loading,
    getNotificationPreferences,
    updateNotificationPreference,
  } = useNotificationPreferences();

  const handleChange = (type, value) => {
    const subscribe = value === "enabled";
    updateNotificationPreference(type, subscribe);
  };

  const handleDialogOpen = (openState) => {
    setOpen(openState);

    if (openState) {
      getNotificationPreferences();
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium">Notification Preferences</p>
        <p className="text-sm text-muted-foreground">
          Manage what type of notifications you want to receive
        </p>
      </div>
      <Dialog.Root open={open} onOpenChange={handleDialogOpen}>
        <Dialog.Trigger asChild>
          <Button variant="outline">Change</Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
          <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-[95vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-xl focus:outline-none">
            <div className="flex justify-between items-start">
              <div>
                <Dialog.Title className="text-xl font-semibold">
                  Notification Preferences
                </Dialog.Title>
                <Dialog.Description className="text-sm text-muted-foreground mt-1">
                  Choose what type of email updates you want to receive.
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button
                  className="text-muted-foreground hover:text-foreground transition"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Spinner />
              </div>
            ) : (
              <div className="space-y-2 mt-6">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <div
                      key={cat.key}
                      className={`flex items-center justify-between p-4 rounded-lg`}
                    >
                      <div className="flex items-start gap-4">
                        <Icon
                          className={`w-10 h-10 mt-1 ${cat.color} ${cat.bg} p-2 rounded-lg`}
                        />
                        <div>
                          <p className="font-medium">
                            {cat.label} Notifications
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {cat.description}
                          </p>
                        </div>
                      </div>
                      <Select
                        value={preferences[cat.key] || "disabled"}
                        onValueChange={(val) => handleChange(cat.key, val)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="enabled">Enabled</SelectItem>
                          <SelectItem value="disabled">Disabled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  );
                })}
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
