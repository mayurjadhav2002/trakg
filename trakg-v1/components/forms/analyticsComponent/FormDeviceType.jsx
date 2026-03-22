"use client";

import React, { useState, useMemo, useCallback } from "react";
import { TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

// Accessible color palette (good on light and dark backgrounds)
const colorPalette = [
  "#4F46E5", // Indigo
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#3B82F6", // Blue
  "#EF4444", // Red
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#22C55E", // Green
  "#EAB308", // Yellow
  "#64748B", // Slate
];

// Label inside pie slice
const renderLabelInside = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  name,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) / 2;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
      pointerEvents="none"
    >
      {name}
    </text>
  );
};

export function FormDeviceType({ deviceStats = [], browserStats = [] }) {
  const [selectedStat, setSelectedStat] = useState("device");

  const handleSelectChange = useCallback((value) => {
    setSelectedStat(value);
  }, []);

  const chartData = useMemo(() => {
    const source = selectedStat === "device" ? deviceStats : browserStats;

    return source.map((item, index) => ({
      name: item.name || "Unknown",
      value: item.count || 0,
      fill: colorPalette[index % colorPalette.length],
    }));
  }, [selectedStat, deviceStats, browserStats]);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-4 text-medium">
          {selectedStat === "device" ? "Device Type Stats" : "Browser Stats"}

          <Select value={selectedStat} onValueChange={handleSelectChange}>
            <SelectTrigger className="w-[160px] rounded-lg">
              <SelectValue placeholder="Select Stat" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="device">Device Stats</SelectItem>
              <SelectItem value="browser">Browser Stats</SelectItem>
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center">
        {chartData.length === 0 ? (
          <div className="text-muted-foreground text-sm py-8">
            No data available for selected type.
          </div>
        ) : (
          <PieChart width={250} height={250}>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
         
              label={renderLabelInside}
              labelLine={false}
              isAnimationActive={true}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        )}
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm mt-2">

        <div className="text-muted-foreground">
          Showing data of all visitors
        </div>
      </CardFooter>
    </Card>
  );
}
