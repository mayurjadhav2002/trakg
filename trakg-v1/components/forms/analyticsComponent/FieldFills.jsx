"use client";

import { PieChart, Pie, Cell } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const COLORS = [
  "#4F46E5", // Indigo
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#3B82F6", // Blue
  "#9CA3AF", // Gray
  "#EF4444", // Red
  "#8B5CF6", // Violet
  "#14B8A6", // Teal
];

const chartConfig = {
  visitors: { label: "Input Fields" },
};

export function FieldFills({ fieldFillPercent }) {


  return (
    <Card className="flex flex-col w-full">
      <CardHeader className="pb-0">
        <CardTitle>Input Fills (% of Users Filling the Field)</CardTitle>
        <CardDescription>All Time</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {!fieldFillPercent || fieldFillPercent.length <= 0 && <div className="flex h-[250px] font-semibold  justify-center align-middle items-center">
          No Data Available
        </div>}
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-pie-label-text]:fill-foreground text-xs mx-auto overflow-visible max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value, name, props) => [`${value}%`, props.payload.fieldName]}
            />
            <Pie
              data={fieldFillPercent}
              dataKey="percentFilled"
              nameKey="fieldName"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              label={({ fieldName }) => fieldName}
              labelLine={true}
            >
              {fieldFillPercent.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
