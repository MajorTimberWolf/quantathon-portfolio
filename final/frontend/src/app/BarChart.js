"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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

// Function to generate an array of random colors
const generateRandomColors = (num) => {
  const colors = [];
  for (let i = 0; i < num; i++) {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let j = 0; j < 6; j++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    colors.push(color);
  }
  return colors;
};

// Generate random colors for the chart config
const randomColors = generateRandomColors(10); // Adjust the number based on expected data points

const chartConfig = {
  weight: { label: "Weight", colors: randomColors }, // Store random colors in chartConfig
};

export function QuantumWalkWeightsBarChart({ data }) {
  const chartData = data.map((weight, index) => ({
    step: index + 1, // assuming steps are indexed from 1
    weight: weight, // use the weight value directly
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quantum Walk Weights</CardTitle>
        <CardDescription>Per step weights</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="step"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar
              dataKey="weight"
              fill={({ index }) =>
                chartConfig.weight.colors[
                  index % chartConfig.weight.colors.length
                ]
              } // Use colors from chartConfig
              radius={8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// Helper function to calculate the trend percentage
const calculateTrending = (data) => {
  const length = data.length;
  if (length < 2) return 0;
  const lastWeight = data[length - 1];
  const firstWeight = data[0];
  return (((lastWeight - firstWeight) / firstWeight) * 100).toFixed(2);
};
