"use client";

import { useState } from "react";
import { InvestmentDistributionPieChart } from "./PieChart";
import { HistoricalPricesLineChart } from "./LineChart";
import { QuantumWalkWeightsBarChart } from "./BarChart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Page() {
  const [optimizedWeights, setOptimizedWeights] = useState([]);
  const [investmentAmounts, setInvestmentAmounts] = useState([]);
  const [normalizedStockPrices, setNormalizedStockPrices] = useState({});
  const [error, setError] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!investmentAmount) return;

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8000/optimize?amount=${investmentAmount}`
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();

      setOptimizedWeights(data.optimized_weights);
      setInvestmentAmounts(data.investment_amounts);
      setNormalizedStockPrices(data.normalized_stock_prices);
    } catch (error) {
      setError("Failed to fetch data from the server");
    } finally {
      setLoading(false);
    }
  };

  // if (loading) return <div>Loading...</div>;

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-col items-center gap-8 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Quantathon - Loading: {loading ? "true" : "false"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mb-4 w-full flex items-center justify-center"
      >
        <Input
          type="number"
          value={investmentAmount}
          onChange={(e) => setInvestmentAmount(e.target.value)}
          placeholder="Enter investment amount"
          className="mr-2 w-full max-w-lg"
          required
        />
        <Button type="submit" className="w-full max-w-xs">
          Optimize
        </Button>
      </form>

      {optimizedWeights.length > 0 &&
        investmentAmounts.length > 0 &&
        Object.keys(normalizedStockPrices).length > 0 && (
          <div className="flex flex-row items-center w-full">
            <div className="w-full max-w-6xl">
              <InvestmentDistributionPieChart
                data={investmentAmounts}
                normalized_stock_prices={normalizedStockPrices}
              />
            </div>

            <div className="w-full max-w-6xl">
              <HistoricalPricesLineChart data={normalizedStockPrices} />
            </div>

            <div className="w-full max-w-6xl">
              <QuantumWalkWeightsBarChart data={optimizedWeights} />
            </div>
          </div>
        )}
    </div>
  );
}
