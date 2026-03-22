'use client'

import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
  LabelList
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Dummy fallback data (percent values only)
const dummyChartData = [
  { field: "Name", percent: 32 },
  { field: "Email", percent: 40 },
  { field: "Address", percent: 36 },
  { field: "Subscribe", percent: 12 },
  { field: "Company Number", percent: 33 },
  { field: "Date of Birth", percent: 34 },
];
const chartConfig = {
  desktop: {
    label: "DropOff Percent",
    color: "var(--chart-1)",
  },
};
export function DropOffChart({ lastFieldsFilled }) {
  const hasData = Array.isArray(lastFieldsFilled) && lastFieldsFilled.length > 0;

  // Map data to proper numeric percent
  const chartData = hasData
    ? lastFieldsFilled.map(item => ({
      field: item.field,
      percent: Number(item.percent),
    }))
    : dummyChartData;

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle>User Drop Off Fields</CardTitle>
        <CardDescription>Fields where users most often abandon the form, indicating potential friction points.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <ChartContainer config={chartConfig}>
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="field"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={val => val}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="percent"
                fill="#0088FE"
                radius={8}
                opacity={hasData ? 1 : 0.3}
              >
                <LabelList
                  dataKey="percent"
                  position="center"
                  fill="#fff"
                  formatter={(val) => `${val}%`}
                  style={{ fontSize: 12, fontWeight: 500 }}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </ResponsiveContainer>

        {!hasData && (
          <div
            className="
              absolute inset-0
              flex items-center justify-center
              bg-white/30 dark:bg-gray-900/30
              backdrop-blur-sm
              pointer-events-none
              select-none
              font-semibold
              text-gray-500 dark:text-gray-400
              text-lg
            "
          >
            No data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
