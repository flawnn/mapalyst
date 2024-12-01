/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
  type ChartData,
  type ChartOptions,
  type ScaleOptionsByType,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { enUS } from "date-fns/locale";
import React from "react";
import { Line } from "react-chartjs-2";
import { cn } from "~/lib/utils";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
);

export interface DataPoint {
  timestamp: number;
  value: number;
}

interface TimeSeriesChartProps {
  data: DataPoint[];
  className?: string;
  height?: number;
  color?: string;
  onPointHover?: (point: DataPoint | null) => void;
  timeUnit?: "day" | "month";
}

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  data,
  className,
  height = 200,
  color = "#8884d8",
  onPointHover,
  timeUnit = "month",
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const chartData: ChartData<"line"> = {
    datasets: [
      {
        label: "Value",
        data: data.map((point) => ({
          x: point.timestamp,
          y: point.value,
        })),
        borderColor: color,
        backgroundColor: color,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: true,
      mode: "index",
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          title: (context) => {
            const point = data[context[0].dataIndex];
            if (point) {
              return new Date(point.timestamp).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              });
            }
            return "";
          },
          label: (context) => {
            const point = data[context.dataIndex];
            if (point) {
              onPointHover?.(point);
            }
            return ` Value: ${context.formattedValue}`;
          },
        },
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: timeUnit,
          displayFormats: {
            month: "MMM yyyy",
          },
        },
        adapters: {
          date: {
            locale: enUS,
          },
        },
        grid: {
          display: false,
        },
        ticks: {
          source: 'data',
          maxRotation: 0,
          autoSkip: false,
          callback: function(value: number | string, index: number): string | null {
            if (typeof value !== 'number') return null;
            
            const date = new Date(value);
            
            if (index === 0 || index === data.length - 1) {
              return date.toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              });
            }
            
            if (index % 4 === 0) {
              return date.toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              });
            }
            
            return null;
          },
          font: {
            size: 11,
          },
        },
      } as unknown as ScaleOptionsByType<"time">,
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
    },
    onHover: (_event, _elements, chart) => {
      if (_elements.length === 0) {
        onPointHover?.(null);
      }
    },
  };

  return (
    <div
      ref={containerRef}
      className={cn("w-full", className)}
      style={{ height }}
    >
      <Line data={chartData} options={options} />
    </div>
  );
};
