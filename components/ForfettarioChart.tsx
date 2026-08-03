"use client";

import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
} from "recharts";
import { formatCurrency } from "@/lib/forfettario-utils";

interface ChartDataPoint {
  revenue: number;
  forfettarioNet: number | undefined;
  ordinarioNet: number;
}

interface ForfettarioChartProps {
  chartData: ChartDataPoint[];
  expectedRevenue: number;
}

export default function ForfettarioChart({
  chartData,
  expectedRevenue,
}: ForfettarioChartProps) {
  return (
    <>
      <div className="w-full" style={{ height: "280px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            style={{ outline: "none" }}
          >
            <CartesianGrid
              strokeDasharray="0"
              vertical={false}
              stroke="#f0f0f0"
              strokeWidth={1}
            />
            <XAxis
              dataKey="revenue"
              tickFormatter={(v) => `€${v / 1000}k`}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#a1a1aa",
                fontSize: 11,
                fontFamily: "Courier New",
              }}
            />
            <YAxis
              tickFormatter={(v) => `€${v / 1000}k`}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#a1a1aa",
                fontSize: 11,
                fontFamily: "Courier New",
              }}
              width={52}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                formatCurrency(value),
                name === "forfettarioNet" ? "Forfettario" : "Ordinario",
              ]}
              labelFormatter={(label) =>
                `Fatturato: ${formatCurrency(label as number)}`
              }
              contentStyle={{
                background: "#ffffff",
                border: "1px solid #e4e4e7",
                borderRadius: 0,
                fontSize: 12,
                fontFamily: "Courier New",
                boxShadow: "none",
              }}
            />
            <ReferenceLine
              x={85000}
              stroke="#d97706"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            <ReferenceLine
              x={expectedRevenue}
              stroke="#dc2626"
              strokeWidth={2}
              strokeDasharray="4 4"
              label={{
                position: "top",
                value: "↑ qui",
                fill: "#dc2626",
                fontSize: 11,
                fontFamily: "Courier New",
              }}
            />
            {/* Forfettario — solid black */}
            <Line
              type="monotone"
              dataKey="forfettarioNet"
              stroke="#09090b"
              strokeWidth={2}
              dot={false}
              name="forfettarioNet"
              connectNulls={false}
              animationDuration={600}
            />
            {/* Ordinario — red dashed */}
            <Line
              type="monotone"
              dataKey="ordinarioNet"
              stroke="#dc2626"
              strokeWidth={2}
              strokeDasharray="5 3"
              dot={false}
              name="ordinarioNet"
              animationDuration={600}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="flex gap-6 mt-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-[2px] bg-zinc-950"></div>
          <span className="text-xs text-zinc-400 font-semibold uppercase tracking-editorial">
            Forfettario
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-[2px] bg-red-600"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to right, #dc2626 0, #dc2626 5px, transparent 5px, transparent 8px)",
            }}
          ></div>
          <span className="text-xs text-zinc-400 font-semibold uppercase tracking-editorial">
            Ordinario
          </span>
        </div>
      </div>
    </>
  );
}
