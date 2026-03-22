import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const DeviceType = ({ data = [], loading = true, error = null }) => {
    const hasRealData = data.length > 0;

 const chartData = {
    labels: hasRealData ? data.map(item => item.name) : ["No Data"],
    datasets: [
        {
            label: "Device Usage",
            data: hasRealData ? data.map(item => item.count) : [1],
            backgroundColor: hasRealData
                ? [
                    "#ff6384",
                    "#36a2eb",
                    "#4bc0c0",
                    "#ffce56",
                    "#9966ff",
                    "#00C49F",
                    "#FFBB28",
                    "#FF8042",
                ]
                : ["#f3f4f6"],
            hoverOffset: 4,
        },
    ],
};


    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: hasRealData, 
                position: "top",
                labels: {
                    usePointStyle: true,
                    pointStyle: "circle",
                },
            },
            tooltip: {
                enabled: hasRealData,
            },
        },
      // Add custom text when loading or no data
      elements: {
          center: {
              text: loading ? "Loading..." : error ? "Error loading data" : "No device data",
              color: "#999",
              fontStyle: 'Arial',
              sidePadding: 20
          },
      },
    };

    return (
        <div className="w-full flex justify-center relative">
            <div className="max-w-auto max-h-72 my-10 w-full h-72 relative">
                <Pie
                    data={chartData}
                    options={options}
                    className="w-full h-full m-auto"
                />
                {!hasRealData && !loading && !error && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-gray-500 dark:text-gray-400">No device data available</p>
                    </div>
                )}
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-gray-500 dark:text-gray-400">Loading chart...</p>
                    </div>
                )}
                {error && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-red-500 dark:text-red-400">Error loading data</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeviceType;
