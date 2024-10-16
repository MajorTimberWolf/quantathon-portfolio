"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import { useDebounce } from "use-debounce";

const formatChartData = (stockData) =>
  stockData.map((data) => ({
    date: new Date(data.date).toLocaleDateString(),
    open: data.open,
    close: data.close,
    volume: data.volume,
  }));

const StockCard = React.memo(({ stockSymbol, stockData, isSelected, onClick }) => {
  const formattedData = useMemo(() => formatChartData(stockData), [stockData]);
  const lastDayPrice = formattedData[formattedData.length - 1]?.close;
  const previousDayPrice = formattedData[formattedData.length - 2]?.close;

  const areaColor = lastDayPrice > previousDayPrice ? "#0a632d" : "#a21a39";

  return (
    <Card
      className={`mb-4 bg-[#111111] ${isSelected ? "border-2 border-[#2ea583]" : "border-0"}`}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-white font-bold text-lg">{stockSymbol}</CardTitle>
          <span className="bg-[#2ea583] text-white text-xs font-semibold px-2 rounded">
            Nifty 50
          </span>
        </div>
        <CardDescription className="text-slate-800 font-semibold text-md">
          {stockSymbol.split(" ").map((word) => word.charAt(0)).join("")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{ close: { label: `${stockSymbol} Close`, color: areaColor } }}>
          <AreaChart data={formattedData} margin={{ left: 0, right: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="close"
              type="monotone"
              fill={areaColor}
              fillOpacity={0.4}
              stroke={areaColor}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
});

const HistoricalDataPage = () => {
  const [stocks, setStocks] = useState({});
  const [selectedStocks, setSelectedStocks] = useState(new Set());
  const [nifty50Data, setNifty50Data] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  useEffect(() => {
    fetch("http://localhost:8000/stocks")
      .then((res) => res.json())
      .then((data) => {
        setStocks(data.stock_prices);
        if (data.nifty_prices) {
          setNifty50Data(formatChartData(data.nifty_prices));
        }
      })
      .catch((error) => console.error(error));
  }, []);

  const handleStockClick = useCallback((stockSymbol) => {
    setSelectedStocks((prev) => {
      const selectedSet = new Set(prev);
      if (selectedSet.has(stockSymbol)) {
        selectedSet.delete(stockSymbol);
      } else if (selectedSet.size < 15) {
        selectedSet.add(stockSymbol);
      }
      return selectedSet;
    });
  }, []);

  const filteredStocks = useMemo(() => 
    Object.keys(stocks).filter((stockSymbol) =>
      stockSymbol.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    ),
    [stocks, debouncedSearchTerm]
  );

  if (Object.keys(stocks).length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-10 mx-auto">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Historical Stock Data</h1>
        {selectedStocks.size > 0 && (
          <Link href={`/stocks/${Array.from(selectedStocks).join(",")}`}>
            <Button variant="secondary" className="font-bold text-lg">
              Continue with selected stocks?
            </Button>
          </Link>
        )}
      </div>

      <input
        type="text"
        placeholder="Search stocks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 p-3 rounded-lg bg-[#131212] text-[#fefffe] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2ea583] focus:border-transparent transition-all duration-200"
      />

      {nifty50Data.length > 0 && (
        <div className="mb-6">
          <Card className="bg-[#111111] border-0">
            <CardHeader>
              <CardTitle className="text-white font-bold text-lg">Nifty50</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{ close: { label: `Nifty50 Close`, color: "#0a632d" } }}
                className="h-64 w-full"
              >
                <AreaChart data={nifty50Data} margin={{ left: 0, right: 0 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Area
                    dataKey="close"
                    type="monotone"
                    fill="#0a632d"
                    fillOpacity={0.4}
                    stroke="#0a632d"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {filteredStocks.map((stockSymbol) => (
          <StockCard
            key={stockSymbol}
            stockSymbol={stockSymbol}
            stockData={stocks[stockSymbol]}
            isSelected={selectedStocks.has(stockSymbol)}
            onClick={() => handleStockClick(stockSymbol)}
          />
        ))}
      </div>
    </div>
  );
};

export default HistoricalDataPage;