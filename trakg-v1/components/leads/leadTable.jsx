"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import LeadFilter from "./leadFilter";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  EyeIcon,
  Loader,
  Trash2,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "../ui/pagination";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Image from "next/image";
import { generateLeads } from "@/fakedata/LeadData";
import { cn } from "@/lib/utils";
import { PageHeader } from "../others/pageHeader";
import { H4 } from "../others/texts";
import { useStore } from "@/stores/userStore";

import Spinner from "../loading/spinner";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useLeads } from "@/hooks/useLead";

const LeadData = {
  columns: ["Name", "Location", "IP Address", "Conversion", "Date", "Action"],
  rows: generateLeads(20),
};

function LeadTable({ conversion }) {
  const { activeWebsite } = useStore();

  const {
    leads,
    loading,
    page,
    setPage,
    take,
    setTake,
    totalPages,
    filters,
    selectedCountry,
    setSelectedCountry,
    selectedFormId,
    setSelectedFormId,
    conversionStatus,
    setConversionStatus,
    searchValue,
    setSearchValue,
    deleteLead,
  } = useLeads();
  return (
    <div className="">
      <PageHeader>
        <H4>Leads</H4>
        <LeadFilter
          filters={filters}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          selectedFormId={selectedFormId}
          setSelectedFormId={setSelectedFormId}
          conversionStatus={conversionStatus}
          setConversionStatus={setConversionStatus}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
      </PageHeader>

      {activeWebsite == null || activeWebsite == undefined || !activeWebsite ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">
            Please select a website to view leads.
          </p>
        </div>
      ) : (
        <>
          <div className=" mb-5 rounded-lg border border-border bg-background">
            <Table className=" w-full">
              <TableHeader>
                <TableRow className="gap-x-4">
                  {LeadData.columns.map((column, index) => (
                    <TableHead key={index} className="text-center px-4 py-2">
                      {column}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && (
                  <TableRow className="gap-x-4">
                    <TableCell
                      colSpan={LeadData.columns.length}
                      className="text-center px-4 py-10"
                    >
                      <Spinner />
                    </TableCell>
                  </TableRow>
                )}
                {leads.length === 0 && (
                  <TableRow className="gap-x-4">
                    <TableCell
                      colSpan={LeadData.columns.length}
                      className="text-center px-4 py-2"
                    >
                      No Leads Captured Yet
                    </TableCell>
                  </TableRow>
                )}
                {!loading &&
                  leads?.map((row, index) => (
                    <TableRow key={index} className="gap-x-4">
                      <TableCell className="group cursor-pointer relative font-medium text-center px-4 py-2 whitespace-normal break-words">
                        {Object.values(row.formData)[0] ||
                          row.name ||
                          row.email ||
                          "Not Available"}
                        <div className="shadow hidden group-hover:block text-left z-20 p-3 absolute min-w-[200px] max-w-[280px] max-h-60 overflow-y-auto rounded-xl bg-[#fffbfb] dark:bg-[#232222] dark:text-gray-300 text-sm sm:text-base space-y-2">
                          {Object.entries(row.formData).map(([key, value]) => (
                            <p key={key} className="break-words leading-snug">
                              <span className="font-semibold capitalize">
                                {key}
                              </span>
                              : {value}
                            </p>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[250px] flex items-start gap-2 px-4  py-2 min-w-0">
                        <Image
                          src={`https://flagsapi.com/${row.countryCode || "IN"}/shiny/32.png`}
                          alt="Country Flag"
                          className="ml-10"
                          width={26}
                          height={26}
                        />
                        <div className="text-sm text-gray-900 dark:text-white">
                          <div>{row.country}</div>
                          <div className="font-medium text-gray-500 truncate">
                            {row.city}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 whitespace-normal break-words min-w-[120px]">
                        {row.ip}
                      </TableCell>
                      <TableCell className="text-center px-4 py-2">
                        <span
                          className={cn(
                            " text-sm font-medium px-2.5 py-0.5 rounded-sm ",
                            !row.conversion
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
                          )}
                        >
                          {row.conversion ? "Submitted" : "Abandoned"}
                        </span>
                      </TableCell>
                      <TableCell className="text-center px-4 py-2">
                        {row.createdAt.split("T")[0]}
                      </TableCell>
                      <TableCell className="text-center flex justify-center items-center gap-2 px-4 py-2">
                        <Link href={`/dashboard/lead/${row.uniqueId}`}>
                          <EyeIcon className="w-6 h-6 text-primary" />
                        </Link>
                        <DeleteConfirmation leadId={row.uniqueId} />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

          <PaginationComp
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            take={take}
            setTake={setTake}
          />
        </>
      )}
    </div>
  );
}

const DeleteConfirmation = ({ leadId }) => {
  const [loading, setLoading] = useState(false);
  const closebtnref = useRef();
  const { deleteLead } = useLeads();

  const handleConfirmDelete = async () => {
    setLoading(true);

    try {
      await deleteLead(leadId);

      closebtnref.current && closebtnref.current.click();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-red-100 dark:hover:bg-red-900"
        >
          <Trash2 className="w-5 h-5 text-red-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete this lead?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Are you sure you want to permanently
            delete this lead?
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 mt-4">
          <DialogClose asChild>
            <Button variant="outline" ref={closebtnref}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleConfirmDelete}
            disabled={loading}
          >
            {loading ? <Loader className="animate-spin w-4 h-4" /> : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

function PaginationComp({ page, setPage, totalPages, take, setTake }) {
  const handlePageClick = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const handleTakeChange = (value) => {
    const newTake = Number(value);
    if (newTake !== take) {
      setTake(newTake); // Do not reset page
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 max-sm:flex-col">
      <p className="flex-1 text-sm text-muted-foreground">
        Page <span className="text-foreground">{page + 1}</span> of{" "}
        <span className="text-foreground">{totalPages}</span>
      </p>

      <div className="grow">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                size="icon"
                variant="outline"
                onClick={() => handlePageClick(page - 1)}
                disabled={page === 0}
                aria-label="Go to previous page"
              >
                <ChevronLeft size={16} />
              </Button>
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <Button
                  size="icon"
                  variant={i === page ? "outline" : "ghost"}
                  onClick={() => handlePageClick(i)}
                >
                  {i + 1}
                </Button>
              </PaginationItem>
            ))}

            <PaginationItem>
              <Button
                size="icon"
                variant="outline"
                onClick={() => handlePageClick(page + 1)}
                disabled={page >= totalPages - 1}
                aria-label="Go to next page"
              >
                <ChevronRight size={16} />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Per page selector */}
      <div className="flex flex-1 justify-end">
        <Select value={take.toString()} onValueChange={handleTakeChange}>
          <SelectTrigger className="w-fit whitespace-nowrap">
            <SelectValue placeholder="Select number of results" />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 25, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={pageSize.toString()}>
                {pageSize} / page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default LeadTable;
