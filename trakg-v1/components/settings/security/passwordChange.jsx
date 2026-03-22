"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PasswordInput } from "@/components/auth/passwordInput";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useChangePassword } from "@/hooks/useChangePassword";

export function PasswordChange() {
  const { changePassword, loading } = useChangePassword();

  const [open, setOpen] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    if (!passwords.currentPassword) {
      toast.error("Current password is required");
      return false;
    }

    if (!passwords.newPassword) {
      toast.error("New password is required");
      return false;
    }

    if (passwords.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return false;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  const handlePasswordChange = async () => {
    if (!validate()) return;

    const success = await changePassword(
      passwords.currentPassword,
      passwords.newPassword,
    );

    if (success) {
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setOpen(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Update Password</p>
          <p className="text-sm text-muted-foreground">
            Change your login password regularly
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black dark:bg-white dark:text-black text-white">
              Change
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[420px]">
            <DialogHeader>
              <DialogTitle>Password Change</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div>
                <Label>Current Password</Label>
                <PasswordInput
                  name="currentPassword"
                  value={passwords.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <Label>New Password</Label>
                <PasswordInput
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <Label>Confirm New Password</Label>
                <PasswordInput
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>

              <Button onClick={handlePasswordChange} disabled={loading}>
                {loading ? "Updating..." : "Change Password"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
