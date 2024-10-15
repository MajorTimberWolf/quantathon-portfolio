"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Function to generate a random color in hexadecimal format
const getRandomColor = () => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return `#${randomColor}`;
};

export function HistoricalPricesLineChart({ data }) {
  const chartData = [];
  const companyColors = {};

  if (Object.keys(data).length === 0) {
    return null;
  }

  console.log({ line: data });

  // Transform the data
  for (const [company, values] of Object.entries(data || {})) {
    // Generate a random color for each company if it doesn't already have one
    if (!companyColors[company]) {
      companyColors[company] = getRandomColor();
    }

    Object.entries(values).forEach(([day, price]) => {
      // Push entries in the format { day, company, weight }
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
    const existingDataPoint = groupedChartData.find(item => item.day === day);
    if (existingDataPoint) {
      existingDataPoint[company] = weight;
    } else {
      const newDataPoint = { day };
      companies.forEach(c => newDataPoint[c] = c === company ? weight : 0);
      groupedChartData.push(newDataPoint);
    }
  });

  console.log({ groupedChartData, companyColors });

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
    <Card>
      <CardHeader>
        <CardTitle>Normalized Historical Prices</CardTitle>
        <CardDescription>Last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={groupedChartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)} // Shorten the day representation if needed
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            {companies.map(company => (
              <Line
                key={company}
                dataKey={company}
                type="linear"
                stroke={companyColors[company]}
                strokeWidth={2}
                dot={false} // Set to true if you want to show dots on the line
                activeDot={{
                  r: 6,
                }}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
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
