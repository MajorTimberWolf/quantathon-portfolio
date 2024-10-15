"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
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

export function HistoricalPricesLineChart({ data, stockColors }) {
  const chartData = [];
  const companyColors = stockColors || {};

  if (Object.keys(data).length === 0) {
    return null;
  }

  for (const [company, values] of Object.entries(data || {})) {
    Object.entries(values).forEach(([day, price]) => {
      chartData.push({
        day,
        company,
        weight: price,
      });
    });
  }

  const groupedChartData = [];
  const companies = Object.keys(companyColors);

  chartData.forEach(({ day, company, weight }) => {
    const existingDataPoint = groupedChartData.find((item) => item.day === day);
    if (existingDataPoint) {
      existingDataPoint[company] = weight;
    } else {
      const newDataPoint = { day };
      companies.forEach((c) => (newDataPoint[c] = c === company ? weight : 0));
      groupedChartData.push(newDataPoint);
    }
  });

  if (groupedChartData.length === 0) {
    return null;
  }

  const chartConfig = companies.reduce((acc, company) => {
    acc[company] = {
      label: company,
      color: companyColors[company],
    };
    return acc;
  }, {});

  return (
    <Card className="bg-[#1a1a1a] text-white border border-gray-700 rounded-lg shadow-lg">
      <CardHeader className="px-6">
        <CardTitle className="text-2xl font-semibold">Normalized Historical Prices</CardTitle>
        <CardDescription className="text-sm text-gray-400">
          Last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 py-4">
        <ChartContainer config={chartConfig}>
          <LineChart
            data={groupedChartData}
            margin={{ left: 0, right: 0, top: 5 }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="#4B5563"
            />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
              stroke="#9CA3AF"
            />
            <YAxis stroke="#9CA3AF" />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            {companies.map((company) => (
              <Line
                key={company}
                dataKey={company}
                type="linear"
                stroke={companyColors[company]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="px-6 py-2">
        <div className="flex w-full items-start gap-2 text-sm text-gray-400">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {/* Additional info can go here */}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {/* More footer information */}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
