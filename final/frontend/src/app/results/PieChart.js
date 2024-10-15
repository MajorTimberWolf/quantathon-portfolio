// InvestmentDistributionPieChart.js
"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
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
    <Card className="flex flex-col shadow-lg border border-gray-700 rounded-lg transition-all duration-300 transform hover:scale-105 bg-gray-900">
      <CardHeader className="items-start pb-3 px-6">
        <CardTitle className="text-2xl font-semibold mb-1 text-white">
          Investment Distribution
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Allocation by sector
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-4 px-6">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px] mb-4"
        >
          <PieChart margin={{ left: 0, right: 0, top: 5 }}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Pie
              data={chartData}
              dataKey="investment"
              nameKey="sector"
              innerRadius={60}
              outerRadius={80}
              strokeWidth={4}
              stroke="#1f2937"
              labelLine={false}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-white text-4xl font-bold"
                        >
                          {totalInvestment.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-white text-sm text-white"
                        >
                          Investment
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-2 px-6 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing total investment distribution by sector
        </div>
      </CardFooter>
    </Card>
  );
}
