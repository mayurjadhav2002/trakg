"use client";

import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useState } from "react";

export const useChangePassword = () => {
  const [loading, setLoading] = useState(false);

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) {
        throw new Error("User session not found");
      }

      // Step 1: reauthenticate
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        throw new Error("Current password is incorrect");
      }

      // Step 2: update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      toast.success("Password updated successfully", { richColors: true });

      return true;
    } catch (err) {
      toast.error(err.message || "Failed to change password", {
        richColors: true,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    changePassword,
    loading,
  };
};
