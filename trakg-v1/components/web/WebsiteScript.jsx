"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ErrorMessages } from "@/lib/ErrorMessages";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Copy, Check } from "lucide-react";
import Link from "next/link";

function WebsiteScript({ website_id, success, script, websiteName }) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(scriptUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    setOpen(success);
  }, [success]);

  const handleClose = () => {
    setOpen(false);
    router.push("/dashboard/website");
  };

  const handleVerify = async () => {
    setIsLoading(true);

    if (!website_id || !script) {
      toast.error("Missing website ID or tracking script.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/website/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          website_id,
          tracking_id: script,
        }),
      });

      const data = await res.json();

      if (data.status === "Success") {
        toast.success("Script verified successfully!");
        handleClose();
      } else {
        toast.error(
          ErrorMessages[data.error] ||
            "Tracking script not found. Please ensure it's added to your site.",
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during verification.");
    } finally {
      setIsLoading(false);
    }
  };

  const scriptUrl = `${process.env.NEXT_PUBLIC_TRACKING_SCRIPT_URL}?id=${script}`;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>"{websiteName}" Added</AlertDialogTitle>

          <AlertDialogDescription>
            Add the following script inside your website's{" "}
            <code className="px-1 py-0.5 bg-muted rounded text-sm">body</code>{" "}
            tag.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mt-4 rounded-md border bg-muted overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50 text-xs font-medium text-muted-foreground">
            <span>jsx</span>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-muted transition"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </button>
          </div>

          {/* Code */}
          <pre className="p-4 text-sm font-mono overflow-x-auto">
            <code>{`<script src="${scriptUrl}"></script>`}</code>
          </pre>
        </div>

        <p className="text-sm text-muted-foreground mt-4">
          Add this script inside the <code>&lt;body&gt;</code> tag of your
          website.
        </p>

        <Link
          href="https://docs.trakg.com"
          className="text-sm text-muted-foreground mt-4"
        >
          To learn how to add the script, please check our documentation.
        </Link>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>
            I'll do it later
          </AlertDialogCancel>

          <AlertDialogAction onClick={handleVerify} disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default WebsiteScript;
