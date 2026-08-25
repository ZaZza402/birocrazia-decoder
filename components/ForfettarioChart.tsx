"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot,
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

function formatRevenueK(value: number): string {
  return `€${Math.round(value / 1000)}k`;
}

export default function ForfettarioChart({
  chartData,
  expectedRevenue,
}: ForfettarioChartProps) {
  const [chartWidth, setChartWidth] = useState(0);
  const [activeRevenue, setActiveRevenue] = useState<number | null>(null);

  const isCompact = chartWidth > 0 && chartWidth < 540;
  const chartHeight = chartWidth < 420 ? 220 : chartWidth < 768 ? 260 : 300;

  const { yAxisWidth, currentPoint } = useMemo(() => {
    const allValues = chartData.flatMap((point) =>
      point.forfettarioNet !== undefined
        ? [point.forfettarioNet, point.ordinarioNet]
        : [point.ordinarioNet],
    );

    const maxValue = allValues.length > 0 ? Math.max(...allValues) : 0;
    const longestLabel = `€${Math.round(maxValue / 1000)}k`;
    const computedWidth = Math.min(72, Math.max(44, longestLabel.length * 7));

    const exactMatch = chartData.find(
      (point) => point.revenue === expectedRevenue,
    );
    const nearestMatch = chartData.reduce<ChartDataPoint | null>(
      (nearest, point) => {
        if (!nearest) return point;
        const currentDistance = Math.abs(point.revenue - expectedRevenue);
        const nearestDistance = Math.abs(nearest.revenue - expectedRevenue);
        return currentDistance < nearestDistance ? point : nearest;
      },
      null,
    );

    return {
      yAxisWidth: computedWidth,
      currentPoint: exactMatch ?? nearestMatch,
    };
  }, [chartData, expectedRevenue]);

  const compactTicks = [30000, 50000, 70000, 85000, 100000, 120000];
  const activePoint =
    (activeRevenue !== null
      ? chartData.find((point) => point.revenue === activeRevenue)
      : undefined) ?? currentPoint;

  const extractPayload = (state: unknown): ChartDataPoint | undefined => {
    if (!state || typeof state !== "object") return undefined;
    const maybePayload = state as {
      activePayload?: Array<{ payload?: ChartDataPoint }>;
    };
    return maybePayload.activePayload?.[0]?.payload;
  };

  return (
    <>
      <div className="w-full" style={{ height: `${chartHeight}px` }}>
        <ResponsiveContainer
          width="100%"
          height="100%"
          onResize={(w) => setChartWidth(w)}
        >
          <AreaChart
            data={chartData}
            margin={{ top: 14, right: 8, left: 0, bottom: 2 }}
            style={{ outline: "none" }}
            onMouseMove={(state) => {
              const payload = extractPayload(state);
              if (payload) setActiveRevenue(payload.revenue);
            }}
            onMouseLeave={() => setActiveRevenue(null)}
            onTouchMove={(state) => {
              const payload = extractPayload(state);
              if (payload) setActiveRevenue(payload.revenue);
            }}
          >
            <CartesianGrid
              strokeDasharray="2 4"
              vertical={false}
              stroke="#e7e5e4"
              strokeWidth={1}
            />
            <XAxis
              dataKey="revenue"
              tickFormatter={(v) => `€${v / 1000}k`}
              ticks={isCompact ? compactTicks : undefined}
              interval={isCompact ? 0 : "preserveStartEnd"}
              minTickGap={isCompact ? 0 : 14}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#52525b",
                fontSize: isCompact ? 10 : 11,
                fontFamily: "Courier New",
              }}
            />
            <YAxis
              tickFormatter={(v) => `€${v / 1000}k`}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#52525b",
                fontSize: isCompact ? 10 : 11,
                fontFamily: "Courier New",
              }}
              width={yAxisWidth}
            />
            <Tooltip
              cursor={{
                stroke: "#d4d4d8",
                strokeWidth: 1,
                strokeDasharray: "3 4",
              }}
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
                fontSize: 12,
                fontFamily: "Courier New",
                maxWidth: "220px",
                borderRadius: isCompact ? 8 : 0,
                boxShadow: isCompact ? "0 10px 24px rgba(0,0,0,0.14)" : "none",
              }}
              wrapperStyle={{ zIndex: 20 }}
              position={isCompact ? { y: 6 } : undefined}
              allowEscapeViewBox={{ x: false, y: false }}
            />
            <ReferenceLine
              x={85000}
              stroke="#d97706"
              strokeWidth={1}
              strokeDasharray="3 3"
              label={
                isCompact
                  ? undefined
                  : {
                      position: "insideTopRight",
                      value: "85k limite",
                      fill: "#d97706",
                      fontSize: 11,
                      fontFamily: "Courier New",
                    }
              }
            />
            <ReferenceLine
              x={expectedRevenue}
              stroke="#dc2626"
              strokeWidth={2}
              strokeDasharray="4 4"
              label={{
                position: "top",
                value: isCompact ? "qui" : "↑ posizione attuale",
                fill: "#dc2626",
                fontSize: isCompact ? 10 : 11,
                fontFamily: "Courier New",
              }}
            />

            {activePoint && (
              <ReferenceLine
                x={activePoint.revenue}
                stroke="#52525b"
                strokeWidth={1}
                strokeDasharray="2 3"
              />
            )}

            <Area
              type="monotone"
              dataKey="forfettarioNet"
              stroke="none"
              fill="#e7e5e4"
              fillOpacity={0.45}
              isAnimationActive
              animationDuration={450}
            />

            <Line
              type="monotone"
              dataKey="forfettarioNet"
              stroke="#09090b"
              strokeWidth={2.25}
              dot={false}
              name="forfettarioNet"
              connectNulls={false}
              animationDuration={450}
            />

            <Line
              type="monotone"
              dataKey="ordinarioNet"
              stroke="#dc2626"
              strokeWidth={2.1}
              strokeDasharray="5 3"
              dot={false}
              name="ordinarioNet"
              animationDuration={450}
            />

            {activePoint && activePoint.forfettarioNet !== undefined && (
              <ReferenceDot
                x={activePoint.revenue}
                y={activePoint.forfettarioNet}
                r={4.2}
                fill="#09090b"
                stroke="#ffffff"
                strokeWidth={1}
              />
            )}

            {activePoint && (
              <ReferenceDot
                x={activePoint.revenue}
                y={activePoint.ordinarioNet}
                r={4.2}
                fill="#dc2626"
                stroke="#ffffff"
                strokeWidth={1}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-[2px] bg-zinc-950"></div>
          <span className="text-xs text-zinc-600 font-semibold uppercase tracking-editorial">
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
          <span className="text-xs text-zinc-600 font-semibold uppercase tracking-editorial">
            Ordinario
          </span>
        </div>
      </div>

      {isCompact && activePoint && (
        <div className="mt-3 border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-[10px] uppercase tracking-editorial font-semibold text-zinc-500 mb-2">
            Punto Attivo: {formatRevenueK(activePoint.revenue)}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white border border-zinc-200 px-2.5 py-2">
              <p className="text-[10px] uppercase tracking-editorial font-semibold text-zinc-600">
                Forfettario
              </p>
              <p className="text-sm font-black font-mono text-zinc-950 mt-0.5">
                {activePoint.forfettarioNet !== undefined
                  ? formatCurrency(activePoint.forfettarioNet)
                  : "N/D"}
              </p>
            </div>
            <div className="bg-white border border-zinc-200 px-2.5 py-2">
              <p className="text-[10px] uppercase tracking-editorial font-semibold text-zinc-600">
                Ordinario
              </p>
              <p className="text-sm font-black font-mono text-red-600 mt-0.5">
                {formatCurrency(activePoint.ordinarioNet)}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
