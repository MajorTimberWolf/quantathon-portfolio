"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function MultipleQuantumWalkWeightsBarCharts({ data, colors }) {
  const chartData = data[0].map((_, index) => {
    const entry = { index };
    data.forEach((weights, companyIndex) => {
      entry[Object.keys(colors)[companyIndex]] = weights[index];
    });
    return entry;
  });

  console.log({ chartData });

  let chartConfig = {};
  chartData.forEach((data) => {
    chartConfig[data.index] = {
      label: data.index,
    };
  });

  return (
    <Card className="bg-[#1a1a1a] text-white border border-gray-700 rounded-lg shadow-lg">
      <CardHeader className="px-6">
        <CardTitle className="text-3xl font-semibold">
          Quantum Walk Weights
        </CardTitle>
        <CardDescription className="text-sm text-gray-400">
          Weights per company
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
              dataKey="index"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            {Object.keys(colors).map((key) => (
              <Bar key={key} dataKey={key} fill={colors[key]} radius={4}>
                <LabelList
                  dataKey={key}
                  position="insideMiddle"
                  offset={12}
                  className="fill-white"
                  fontSize={12}
                  angle={-90}
                />
              </Bar>
            ))}
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
