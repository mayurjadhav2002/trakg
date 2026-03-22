import React, { useMemo, useState } from "react";
import { Chart } from "react-google-charts";
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
export function GeoType({ data = [["Country", "Visitors"]], loading = true, error = null }) {
    return (
        <Chart
            chartEvents={[
                {
                    eventName: "error",
                    callback: (e) => {
                        console.error("Chart Error", e);
                    },
                },
            ]}
            chartType="GeoChart"
            width="100%"
            className="h-96"
            data={data && data.length > 1 ? data : [["Country", "Visitors"], ["", 0]]} // always safe fallback data
            loader={
                <div className="flex items-center justify-center h-96">
                    <p className="text-gray-500 dark:text-gray-400">Loading chart...</p>
                </div>
            }
            options={{
                colorAxis: { colors: ["#aecbfa", "#1a73e8"] },
                datalessRegionColor: loading ? "#f3f4f6" : error ? "#fecaca" : "#e5e7eb",
                defaultColor: loading ? "#f3f4f6" : error ? "#fecaca" : "#e5e7eb",
                tooltip: { trigger: "focus" },

            }}
        />
    );
}



const CATEGORY_OPTIONS = [
    { label: "All", value: "all" },
    { label: "Completed", value: "complete" },
    { label: "Partial", value: "partial" },
];

function formatDataForChart(data) {
    // data: [{country, count}, ...]
    if (!data || data.length === 0) {
        return [["Country", "Visitors"], ["", 0]];
    }
    return [["Country", "Visitors"], ...data.map(item => [
        item.country || "Unknown",
        item._count || item.count || 0
    ])];
}

export function GeoType2({ stats = { all: [], partial: [], complete: [] }, loading = false, error = null }) {
    const [selectedCategory, setSelectedCategory] = useState("all");

    const chartData = useMemo(() => {
        return formatDataForChart(stats[selectedCategory]);
    }, [stats, selectedCategory]);

    return (
        <Card>
            <CardHeader className="flex items-center gap-2 space-y-0  pt-5 sm:flex-row">
                <h4 className="font-bold text-large -mt-3">Country Wise Fills</h4>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger
                        className="w-[160px] rounded-lg sm:ml-auto"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Show All Leads" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="all" className="rounded-lg">
                            Show All Leads
                        </SelectItem>
                        <SelectItem value="completed" className="rounded-lg">
                            Show Completed Leads
                        </SelectItem>
                        <SelectItem value="partial" className="rounded-lg">
                            Show Partial Leads
                        </SelectItem>

                    </SelectContent>
                </Select>

            </CardHeader>
            <CardContent>
                <div className="w-full max-w-4xl mx-auto">

                    <Chart
                        chartEvents={[
                            {
                                eventName: "error",
                                callback: (e) => {
                                    console.error("Chart Error", e);
                                },
                            },
                        ]}
                        chartType="GeoChart"
                        width="100%"
                        height="400px"
                        className="rounded-lg"
                        data={chartData}
                        loader={
                            <div className="flex items-center justify-center h-96">
                                <p className="text-gray-500 dark:text-gray-400">Loading chart...</p>
                            </div>
                        }
                        options={{
                            colorAxis: { colors: ["#aecbfa", "#1a73e8"] },
                            datalessRegionColor: loading ? "#f3f4f6" : error ? "#fecaca" : "#e5e7eb",
                            defaultColor: loading ? "#f3f4f6" : error ? "#fecaca" : "#e5e7eb",
                            tooltip: { trigger: "focus" },
                        }}
                    />
                </div>
            </CardContent>
        </Card>

    );
}