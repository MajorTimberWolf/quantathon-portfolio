"use client";

import { Bar, BarChart, CartesianGrid, XAxis, LabelList } from "recharts";
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

export function QuantumWalkWeightsBarChart({ data, colors }) {
  const chartData = data?.map((weight, index) => ({
    company: Object.keys(colors)[index],
    weight,
    fill: colors[Object.keys(colors)[index]],
  }));

  const chartConfig = {};

  chartData.forEach((data) => {
    chartConfig[data.company] = {
      label: data.company,
    };
  });

  return (
    <Card className="bg-[#1a1a1a] text-white border border-gray-700 rounded-lg shadow-lg">
      <CardHeader className="px-6">
        <CardTitle className="text-3xl font-semibold">Quantum Walk Weights</CardTitle>
        <CardDescription className="text-sm text-gray-400">
          Per company weights
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 py-4">
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData} margin={{ left: 0, right: 0, top: 5 }}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="#4B5563"
            />
            <XAxis
              dataKey="company"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              stroke="#9CA3AF"
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar
              dataKey="weight"
              fill={({ index }) => chartData[index].fill}
              radius={8}
            >
              <LabelList
                dataKey="weight"
                position="top"
                offset={12}
                className="fill-white"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="px-6 py-2">
        <div className="flex w-full items-start gap-2 text-sm text-gray-400">
          {/* Additional footer information can go here */}
        </div>
      </CardFooter>
    </Card>
  );
}
