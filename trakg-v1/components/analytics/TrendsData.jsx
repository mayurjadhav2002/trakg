"use client";
import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/hooks/useUser";
import { useStore } from "@/stores/userStore";
import { ErrorMessages } from "@/lib/ErrorMessages";
import useSWR from "swr";
import { fetcher } from "../swrFetch";
import Spinner from "../loading/spinner";
import { useAnalytics } from "@/hooks/useAnalytics";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },

  completed: {
    label: "Completed Forms",
    color: "hsl(var(--chart-2))",
  },
  partiallyFilled: {
    label: "Partial Form Fills",
    color: "hsl(var(--chart-1))",
  },
};

function TrendsData({}) {
  const { analytics, loading } = useAnalytics();
  const [timeRange, setTimeRange] = React.useState("90d");

  const filteredData = React.useMemo(() => {
    if (!analytics) return [];

    const now = new Date();
    let days = 90;

    if (timeRange === "30d") days = 30;
    if (timeRange === "7d") days = 7;

    const start = new Date();
    start.setDate(now.getDate() - days);

    return analytics.filter((item) => new Date(item.date) >= start);
  }, [analytics, timeRange]);

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Partial/Completed Forms</CardTitle>
          <CardDescription>
            Showing total visitors for the last 3 months
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <div className="h-[250px] text-center w-full align-center justify-center rounded-lg">
            <Spinner />
          </div>
        ) : error ? (
          <div className="text-red-600 text-center">
            An error occurred while fetching the data. Please try again later.
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillcompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--chart-2))"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--chart-2))"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient
                  id="fillpartiallyFilled"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={true}
                axisLine={true}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={1}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="partiallyFilled"
                type="natural"
                fill="url(#fillpartiallyFilled)"
                stroke="hsl(var(--chart-1))"
                stackId="a"
              />
              <Area
                dataKey="completed"
                type="natural"
                fill="url(#fillcompleted)"
                stroke="hsl(var(--chart-2))"
                stackId="b"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

export default TrendsData;
