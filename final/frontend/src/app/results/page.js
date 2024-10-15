"use client";

import { useState, useEffect } from "react";
import { InvestmentDistributionPieChart } from "./PieChart";
import { HistoricalPricesLineChart } from "./LineChart";
import { QuantumWalkWeightsBarChart } from "./BarChart";
import { InfoChart } from "./InfoChart";
import StockDistributionExplanation from "./StockDistributionExplanation";

export default function Page({ searchParams: { investment, risk, stocks } }) {
  const [optimizedWeights, setOptimizedWeights] = useState([]);
  const [investmentAmounts, setInvestmentAmounts] = useState([]);
  const [normalizedStockPrices, setNormalizedStockPrices] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [stockColors, setStockColors] = useState({});
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    const decodedStocks = decodeURIComponent(stocks).split(",");
    const colors = generateRandomColors(decodedStocks);
    setStockColors(colors);

    if (investment && risk) {
      fetchOptimizedData(investment, risk, decodedStocks);
    } else {
      setError("Invalid parameters");
      setLoading(false);
    }
  }, [investment, risk, stocks]);

  const fetchOptimizedData = async (
    investmentAmount,
    riskAmount,
    decodedStocks
  ) => {
    try {
      const response = await fetch(
        `http://localhost:8000/optimize?amount=${investmentAmount}&risk=${riskAmount}&stocks=${decodedStocks.join(
          ","
        )}`
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();

      setOptimizedWeights(data.optimized_weights);
      setInvestmentAmounts(data.investment_amounts);
      setNormalizedStockPrices(data.normalized_stock_prices);
      setTotalInvestment(
        data.investment_amounts.reduce((acc, amount) => acc + amount, 0)
      );

      // Sample boilerplate data for stock explanation
      const sampleStockData = decodedStocks.map((stock) => ({
        name: stock,
        description: `The stock ${stock} is expected to have a distribution based on market analysis and trends.`
      }));
      setStockData(sampleStockData);
    } catch (error) {
      setError("Failed to fetch data from the server");
    } finally {
      setLoading(false);
    }
  };

  const generateRandomColors = (stocks) => {
    const colors = {};
    stocks.forEach((stock) => {
      colors[stock] = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    });
    return colors;
  };

  if (loading) return <div className="text-white">Loading...</div>;

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-col items-center gap-8 p-10 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold text-center mb-6">Quantathon Results</h1>
      <div className="flex flex-col lg:flex-row items-stretch w-full max-w-6xl gap-8">
        <div className="flex-1 bg-gray-800 p-4 rounded-lg shadow-lg">
          <InvestmentDistributionPieChart
            data={investmentAmounts}
            normalized_stock_prices={normalizedStockPrices}
            stockColors={stockColors}
          />
        </div>

        <div className="flex-1 bg-gray-800 p-4 rounded-lg shadow-lg">
          <InfoChart
            investmentAmounts={investmentAmounts}
            normalizedStockPrices={normalizedStockPrices}
            stockColors={stockColors}
          />
        </div>
      </div>

      <div className="flex flex-col w-full max-w-6xl gap-8">
        <div className="flex-1 bg-gray-800 p-4 rounded-lg shadow-lg">
          <HistoricalPricesLineChart
            data={normalizedStockPrices}
            stockColors={stockColors}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center w-full max-w-6xl gap-8">
        <div className="flex-1 bg-gray-800 p-4 rounded-lg shadow-lg">
          <QuantumWalkWeightsBarChart
            data={optimizedWeights}
            colors={stockColors}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center w-full max-w-6xl gap-8">
        <StockDistributionExplanation stockData={stockData} />
      </div>
    </div>
  );
}
