"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import Spinner from "../loading/spinner";
import { useForms } from "@/hooks/useForm";

export const FormTable = () => {
  const {
    forms,
    loading,
    page,
    pageCount,
    nextPage,
    prevPage,
    toggleFormStatus,
  } = useForms();

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20%]">Name</TableHead>
              <TableHead className="w-[25%]">URL</TableHead>
              <TableHead className="text-center w-[10%]">Status</TableHead>
              <TableHead className="text-center w-[20%]">Stats</TableHead>
              <TableHead className="text-center w-[15%]">Analysis</TableHead>
              <TableHead className="text-center w-[10%]">Active</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {forms.map((item) => (
              <TableRow key={item.formId}>
                <TableCell>{item.formName}</TableCell>

                <TableCell className="break-all">
                  <Link
                    href={item.pageUrl}
                    className="flex items-center gap-1 hover:text-blue-500"
                    target="_blank"
                  >
                    {item.pageUrl}
                    <ExternalLink size={14} />
                  </Link>
                </TableCell>

                <TableCell className="text-center">
                  <Badge variant={item.isActive ? "default" : "secondary"}>
                    {item.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex justify-center gap-3 text-xs font-mono">
                    <span>T:{item.totalLeads}</span>
                    <span>C:{item.completedLeads}</span>
                    <span>P:{item.partialLeads}</span>
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  {item.advancedAnalytics ? (
                    <Link
                      href={`/dashboard/forms/analytics/${item.formId}`}
                      className="text-blue-600 hover:underline"
                    >
                      View Analytics
                    </Link>
                  ) : (
                    <span
                      className="text-muted-foreground cursor-not-allowed"
                      title="Upgrade your plan to view advanced analytics"
                    >
                      View Analytics
                    </span>
                  )}
                </TableCell>

                <TableCell className="text-center">
                  <Switch
                    checked={item.isActive}
                    onCheckedChange={(val) =>
                      toggleFormStatus({
                        formId: item.formId,
                        isSelected: val,
                      })
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!forms || forms.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            Not Enough Forms Information
          </div>
        ) : null}
      </div>

      {/* Pagination */}

      <div className="flex justify-end items-center mt-4 gap-3">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 0}
          onClick={prevPage}
        >
          Prev
        </Button>

        <span className="text-sm text-muted-foreground">
          Page {page + 1} of {pageCount || 1}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={page + 1 >= pageCount}
          onClick={nextPage}
        >
          Next
        </Button>
      </div>
    </>
  );
};
