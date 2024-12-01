"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { cn } from "~/lib/utils";

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
}

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  data,
  className,
  height = 200,
  color = "#8884d8",
  onPointHover,
}) => {
  const formatXAxis = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          onMouseLeave={() => onPointHover?.(null)}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatXAxis}
            type="number"
            domain={["dataMin", "dataMax"]}
          />
          <YAxis />
          <Tooltip
            formatter={(value: number) => [value, "Value"]}
            labelFormatter={(label: number) => new Date(label).toLocaleString()}
            onMouseEnter={(data) => {
              if (data.activePayload) {
                onPointHover?.(data.activePayload[0].payload as DataPoint);
              }
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}; 