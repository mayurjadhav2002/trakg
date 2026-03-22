'use client'

import { TrendingUp } from "lucide-react"
import {
	Bar,
	BarChart,
	XAxis,
	  Tooltip as RechartsTooltip,

	YAxis,
	LabelList,
	ResponsiveContainer,
} from "recharts"

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,

} from "@/components/ui/chart"
import { InfoIcon } from 'lucide-react'
function formatTime(seconds) {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${(seconds / 60).toFixed(1)}m`;
  return `${(seconds / 3600).toFixed(2)}h`;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const { fieldName, avgTimeSpent } = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: "white",
          padding: "10px 14px",
          borderRadius: 8,
          boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
          color: "#000",
          fontSize: 14,
          maxWidth: 260,
        }}
      >
        <div style={{ fontWeight: "bold", marginBottom: 4 }}>#{label}</div>
        <div>
          For <b>{fieldName}</b>, user has spent <b>{formatTime(avgTimeSpent)}</b>
        </div>
      </div>
    );
  }

  return null;
};

export function FieldTimeSpend({ fieldTimeStats }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Spent on Each Field</CardTitle>
        <CardDescription>Average time users spend interacting with each form field.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">

          {fieldTimeStats.length <= 0 && <div className="flex h-[250px] font-semibold  justify-center align-middle items-center">
            No Data Available
            </div>}
          <ResponsiveContainer width="100%" height={250}>
            <BarChart layout="vertical" data={fieldTimeStats} margin={{ left: 0, right: 20 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="fieldName" hide />
              <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.1)" }} />
              <Bar dataKey="avgTimeSpent" fill="var(--color-desktop)" radius={5}>
                <LabelList
                  dataKey="fieldName"
                  position="insideLeft"
                  style={{ fill: "#fff", fontSize: 12 }}
                />
                <LabelList
                  dataKey="avgTimeSpent"
                  position="insideRight"
                  formatter={formatTime}
                  style={{ fill: "#fff", fontSize: 12 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 align-middle items-center leading-none font-medium">
          <InfoIcon /> Time spent by users on each input field in this form
        </div>
      </CardFooter>
    </Card>
  );
}