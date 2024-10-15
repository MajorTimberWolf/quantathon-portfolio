"use client";
import React, { useState, useEffect } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import Link from "next/link";

const HistoricalDataPage = () => {
  const [stocks, setStocks] = useState({});
  const [selectedStocks, setSelectedStocks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/stocks")
      .then((res) => res.json())
      .then((data) => setStocks(data.stock_prices))
      .catch((error) => console.error(error));
  }, []);

  if (Object.keys(stocks).length === 0) {
    return <div>Loading...</div>;
  }

  const formatChartData = (stockData) =>
    stockData.map((data) => ({
      date: new Date(data.date).toLocaleDateString(),
      open: data.open,
      close: data.close,
      volume: data.volume,
    }));

  const chartConfig = {
    close: {
      label: "Closing Price",
      color: "hsl(var(--chart-1))",
    },
    volume: {
      label: "Volume",
      color: "hsl(var(--chart-2))",
    },
  };

  const handleStockClick = (stockSymbol) => {
    if (selectedStocks.includes(stockSymbol)) {
      setSelectedStocks(
        selectedStocks.filter((symbol) => symbol !== stockSymbol)
      );
    } else if (selectedStocks.length < 15) {
      setSelectedStocks([...selectedStocks, stockSymbol]);
    }
  };

  return (
    <div className="p-10 mx-auto">
      <div class="flex justify-between">
        <h1 className="text-3xl font-bold mb-6 text-white">
          Historical Stock Data
        </h1>
        {selectedStocks.length && (
          <Link href={`/stocks/${selectedStocks.join(",")}`}>
            <Button variant="secondary" className="font-bold text-lg">
              Continue with selected stocks?
            </Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {Object.keys(stocks).map((stockSymbol) => {
          const isSelected = selectedStocks.includes(stockSymbol);

          return (
            <Card
              key={stockSymbol}
              className={`mb-4 bg-[#2d353d] ${
                isSelected ? "border-2 border-[#2ea583]" : "border-0"
              }`}
              onClick={() => handleStockClick(stockSymbol)}
              style={{ cursor: "pointer" }}
            >
              <CardHeader>
                <CardTitle class="text-white font-bold text-lg">
                  {stockSymbol}
                </CardTitle>
                <CardDescription class="text-slate-800 font-semibold text-md">
                  {stockSymbol}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <AreaChart
                    accessibilityLayer
                    data={formatChartData(stocks[stockSymbol])}
                    margin={{ left: 12, right: 12 }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <YAxis />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="line" />}
                    />
                    <Area
                      dataKey="close"
                      type="monotone"
                      fill="var(--color-close)"
                      fillOpacity={0.4}
                      stroke="var(--color-close)"
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default HistoricalDataPage;
