"use client";

import * as React from "react";

interface SparkAreaChartProps {
  data: number[];
  width: number;
  height: number;
  strokeColor: string;
  fillColor: string;
}

export function SparkAreaChart({
  data,
  width,
  height,
  strokeColor = "#16a34a",
  fillColor = "rgba(22, 163, 74, 0.1)",
}: SparkAreaChartProps) {
  if (!data?.length) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  // Create points for the area
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  });

  // Create path for the line
  const linePath = `M${points.join(" L")}`;

  // Create path for the area
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <path
        d={areaPath}
        fill={fillColor}
        stroke="none"
      />
      <path
        d={linePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
      />
    </svg>
  );
} 