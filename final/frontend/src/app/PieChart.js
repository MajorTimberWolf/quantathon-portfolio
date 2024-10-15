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

// Function to generate random colors
const getRandomColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 50%)`;
};

export function InvestmentDistributionPieChart({
  data,
  normalized_stock_prices,
}) {
  const chartData = data.map((investment, index) => {
    const company = Object.keys(normalized_stock_prices)[index];
    const color = getRandomColor(); // Assign random color
    return {
      sector: company,
      investment: Math.ceil(investment), // Use ceil for investment
      fill: color,
      color, // Add color for legend
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
    <Card className="flex flex-col shadow-lg border rounded-lg">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-xl font-semibold">
          Investment Distribution
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Allocation by sector
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="investment"
              nameKey="sector"
              innerRadius={60}
              outerRadius={80}
              strokeWidth={5}
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
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalInvestment.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
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
      <div className="ml-6 flex flex-col mb-4">
        {chartData.map(({ sector, investment, color }) => (
          <div
            key={sector}
            className={`flex items-center mb-2 ${
              investment == 0 ? "bg-red-200" : ""
            }`}
          >
            <div
              className="w-4 h-4 mr-2 rounded-full"
              style={{ backgroundColor: color }}
            ></div>
            <span className="font-medium">{sector}</span> -{" "}
            <span className="font-semibold">{investment.toLocaleString()}</span>
          </div>
        ))}
      </div>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing total investment distribution by sector
        </div>
      </CardFooter>
    </Card>
  );
}
