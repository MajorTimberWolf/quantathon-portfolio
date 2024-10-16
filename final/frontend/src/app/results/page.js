"use client";

import { useState, useEffect } from "react";
import Loading from "@/components/Loading";
import { InvestmentDistributionPieChart } from "./PieChart";
import { HistoricalPricesLineChart } from "./LineChart";
import { QuantumWalkWeightsBarChart } from "./BarChart";
import { MultipleQuantumWalkWeightsBarCharts } from "./BarsChart";
import { InfoChart } from "./InfoChart";
import StockDistributionExplanation from "./StockDistributionExplanation";
import { Button } from "@/components/ui/button";
import randomColor from "randomcolor";

export default function Page({ searchParams: { investment, risk, stocks, method } }) {
  const [optimizedWeights, setOptimizedWeights] = useState([]);
  const [investmentAmounts, setInvestmentAmounts] = useState([]);
  const [normalizedStockPrices, setNormalizedStockPrices] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [stockColors, setStockColors] = useState({});
  const [stockData, setStockData] = useState([]);
  const [weights, setWeightData] = useState([]);
  const [showFirstChart, setShowFirstChart] = useState(true);

  const handleToggle = () => {
    setShowFirstChart((prev) => !prev);
  };

  useEffect(() => {
    const decodedStocks = decodeURIComponent(stocks).split(",");
    const colors = generateRandomColors(decodedStocks);
    setStockColors(colors);

    const fetchOptimizedData = async () => {
      if (investment && risk) {
        try {
          const response = await fetch(
            `http://localhost:8000/optimize?amount=${investment}&risk=${risk}&stocks=${decodedStocks.join(
              ","
            )}&method=${method}`
          );
          if (!response.ok) throw new Error("Network response was not ok");
          const data = await response.json();

          setOptimizedWeights(data.optimized_weights);
          setInvestmentAmounts(data.investment_amounts);
          setNormalizedStockPrices(data.normalized_stock_prices);
          setTotalInvestment(data.investment_amounts);
          setWeightData(data.all_weights);
          setStockData(decodedStocks);
        } catch (error) {
          console.error("Error fetching optimized data:", error);
          setError("Failed to fetch data from the server");
        } finally {
          setLoading(false);
        }
      } else {
        setError("Invalid parameters");
        setLoading(false);
      }
    };

    fetchOptimizedData();
  }, [investment, risk, stocks, method]);

  const generateRandomColors = (stocks) => {
    const colors = {};
    stocks.forEach((stock) => {
      colors[stock] = randomColor();
    });
    return colors;
  };

  if (loading) return <Loading message="Please Wait..." />;

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto py-12 px-8 bg-[#121212] text-white">
      <h1 className="text-5xl font-bold mb-8 text-center">
        Suggested Investment Portfolio
      </h1>

      <div className="flex flex-col lg:flex-row items-stretch gap-8 mb-8">
        <div className="flex-1 bg-[#1a1a1a] p-4 rounded-lg shadow-lg">
          <InvestmentDistributionPieChart
            data={investmentAmounts}
            normalized_stock_prices={normalizedStockPrices}
            stockColors={stockColors}
          />
        </div>

        <div className="flex-1 bg-[#1a1a1a] p-4 rounded-lg shadow-lg">
          <InfoChart
            investmentAmounts={investmentAmounts}
            normalizedStockPrices={normalizedStockPrices}
            stockColors={stockColors}
          />
        </div>
      </div>

      <div className="flex flex-col w-full mb-8">
        <div className="flex-1 bg-[#1a1a1a] p-4 rounded-lg shadow-lg">
          <HistoricalPricesLineChart
            data={normalizedStockPrices}
            stockColors={stockColors}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center w-full mb-8">
        <div className="flex-1 bg-[#1a1a1a] p-4 rounded-lg shadow-lg">
          <Button onClick={handleToggle} className="mb-4">
            {showFirstChart
              ? "Show Multiple Weights Chart"
              : "Show Quantum Walk Weights Chart"}
          </Button>

          {showFirstChart ? (
            <QuantumWalkWeightsBarChart
              data={optimizedWeights}
              colors={stockColors}
            />
          ) : (
            <MultipleQuantumWalkWeightsBarCharts
              data={weights}
              colors={stockColors}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center w-full">
        <StockDistributionExplanation
          // stockData={stockData}
          optimizedWeights={optimizedWeights}
          investmentAmounts={investmentAmounts}
        />
      </div>
    </div>
  );
}
