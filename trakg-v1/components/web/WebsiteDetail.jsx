"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

import {
  CheckCircle,
  XCircle,
  BarChart,
  Database,
  Users,
  Copy,
  Check,
  Trash2,
} from "lucide-react";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { useWebsites } from "@/hooks/useWebsites";
import Spinner from "../loading/spinner";

function WebsiteDetail({ id }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const web = searchParams.get("web");

  const { getWebsite, verifyWebsite, toggleWebsiteField, deleteWebsite } =
    useWebsites();

  const [website, setWebsite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const data = await getWebsite(id, web);
        setWebsite(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, web]);

  const handleVerify = async () => {
    if (!website) return;

    setVerifying(true);

    try {
      await verifyWebsite(website.id);

      setWebsite((prev) => ({
        ...prev,
        verified: true,
      }));
    } finally {
      setVerifying(false);
    }
  };

  const handleToggle = async (field) => {
    if (!website) return;

    setUpdating(true);

    try {
      await toggleWebsiteField(website.id, field, website[field]);

      setWebsite((prev) => ({
        ...prev,
        [field]: !prev[field],
      }));
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!website) return;

    try {
      await deleteWebsite(website.id);
      toast.success("Website deleted");
      router.push("/dashboard/website");
    } catch {
      toast.error("Failed to delete website");
    }
  };

  const scriptUrl = `${process.env.NEXT_PUBLIC_TRACKING_SCRIPT_URL}?id=${website?.trackingId}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`<script src="${scriptUrl}"></script>`);

    setCopied(true);
    toast.success("Copied");

    setTimeout(() => setCopied(false), 2000);
  };

  if (loading)
    return (
      <div className="flex justify-center mt-20">
        <Spinner />
      </div>
    );

  if (!website) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <img
            src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${website.website_url}&size=64`}
            className="w-12 h-12 rounded-full"
          />

          <div>
            <h1 className="text-2xl font-bold">{website.website_name}</h1>

            <Link
              href={website.website_url}
              target="_blank"
              className="text-sm text-blue-500 hover:underline"
            >
              {website.website_url}
            </Link>
          </div>
        </div>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 size={16} />
          Delete
        </Button>
      </div>

      {/* Details */}
      <div className="grid md:grid-cols-2 gap-4">
        <Detail label="Verified">
          <motion.div
            key={website.verified ? "verified" : "not"}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {website.verified ? (
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle size={16} /> Yes
              </span>
            ) : (
              <Button size="sm" onClick={handleVerify} disabled={verifying}>
                {verifying ? "Verifying..." : "Verify"}
              </Button>
            )}
          </motion.div>
        </Detail>

        <Detail label="Status">
          {website.isActive ? "Active" : "Inactive"}
        </Detail>

        <Detail label="Record Leads">
          <motion.div animate={{ opacity: updating ? 0.5 : 1 }}>
            <Switch
              checked={website.isActive}
              onCheckedChange={() => handleToggle("isActive")}
            />
          </motion.div>
        </Detail>

        <Detail label="Tracking ID">
          <span className="font-mono">{website.trackingId}</span>
        </Detail>
      </div>

      {/* Script */}
      <div className="mt-12">
        <h2 className="text-lg font-semibold mb-2">Install Script</h2>

        <div className="rounded-md border bg-muted overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b text-xs text-muted-foreground">
            <span>jsx</span>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1 hover:bg-muted px-2 py-1 rounded-md"
            >
              {copied ? (
                <>
                  <Check size={14} /> Copied
                </>
              ) : (
                <>
                  <Copy size={14} /> Copy
                </>
              )}
            </button>
          </div>

          <pre className="p-4 text-sm font-mono overflow-x-auto">
            <code>{`<script src="${scriptUrl}"></script>`}</code>
          </pre>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-12">
        <h2 className="text-lg font-semibold mb-4">Stats</h2>

        <div className="grid md:grid-cols-3 gap-4">
          <StatCard
            icon={<BarChart size={18} />}
            label="All Leads"
            value={website.lead_stats?.total || 0}
          />

          <StatCard
            icon={<Users size={18} />}
            label="Completed"
            value={website.lead_stats?.completed || 0}
          />

          <StatCard
            icon={<Database size={18} />}
            label="Partial"
            value={website.lead_stats?.partial || 0}
          />
        </div>
      </div>

      {/* Delete Dialog */}

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Website</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            This action cannot be undone.
          </p>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>

            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

function Detail({ label, children }) {
  return (
    <Card>
      <CardContent className="flex justify-between items-center p-4">
        <span className="text-sm text-muted-foreground">{label}</span>

        <span className="text-sm">{children}</span>
      </CardContent>
    </Card>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <motion.div whileHover={{ scale: 1.04 }}>
      <Card>
        <CardContent className="flex flex-col items-center gap-2 p-6">
          <span className="text-muted-foreground">{icon}</span>

          <p className="text-sm text-muted-foreground">{label}</p>

          <p className="text-xl font-semibold">{value}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default WebsiteDetail;
