"use client";

import * as React from "react";
import { Label, Pie, PieChart, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function InvestmentDistributionPieChart({
  data,
  normalized_stock_prices,
  stockColors,
}) {
  const chartData = data.map((investment, index) => {
    const company = Object.keys(normalized_stock_prices)[index];
    return {
      sector: company,
      investment: Math.ceil(investment),
      fill: stockColors[company],
      color: stockColors[company],
    };
  });

  const totalInvestment = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.investment, 0);
  }, [chartData]);

  const chartConfig = {};
  chartData.forEach((data) => {
    chartConfig[data.sector] = {
      label: data.sector,
    };
  });

  return (
    <Card className="flex flex-col h-full shadow-lg border border-gray-700 rounded-lg transition-all duration-300 transform hover:scale-105 bg-[#1a1a1a] text-white">
      <CardHeader className="items-start pb-3 px-6">
        <CardTitle className="text-2xl font-semibold mb-1">
          Investment Distribution
        </CardTitle>
        <CardDescription className="text-sm text-gray-400">
          Allocation by sector
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-4 px-6">
        <div className="w-full h-[calc(100vh-300px)] min-h-[400px] max-h-[600px]">
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer config={chartConfig}>
              <PieChart>
                <ChartTooltip
                  cursor={true}
                  content={<ChartTooltipContent className="bg-gray-800 text-white" />}
                />
                <Pie
                  data={chartData}
                  dataKey="investment"
                  nameKey="sector"
                  innerRadius="40%"
                  outerRadius="80%"
                  strokeWidth={4}
                  stroke="#1f2937"
                  labelLine={false}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        const centerX = viewBox.cx;
                        const centerY = viewBox.cy;
                        const radius = Math.min(centerX, centerY);
                        
                        return (
                          <g>
                            <text
                              x={centerX}
                              y={centerY}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="fill-white font-bold"
                              style={{ fontSize: `${radius * 0.2}px` }}
                            >
                              {totalInvestment.toLocaleString()}
                            </text>
                            <text
                              x={centerX}
                              y={centerY + radius * 0.15}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="fill-white"
                              style={{ fontSize: `${radius * 0.1}px` }}
                            >
                              Investment
                            </text>
                          </g>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </ResponsiveContainer>
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-2 px-6 text-sm">
        <div className="leading-none text-gray-400">
          Showing total investment distribution by sector
        </div>
      </CardFooter>
    </Card>
  );
}
