"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const StockPage = ({ params: { selectedStocks } }) => {
  const [investment, setInvestment] = useState(10000);
  const [risk, setRisk] = useState(50);
  const [stocks, setStocks] = useState([]);
  const [availableStocks, setAvailableStocks] = useState([]);
  const [allStocks, setAllStocks] = useState([]);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch("http://localhost:8000/stocks");
        const data = await response.json();
        const stocks = Object.keys(data.stock_prices);
        setAllStocks(stocks);
      } catch (error) {
        console.error("Error fetching stocks:", error);
      }
    };

    fetchStocks();
  }, []);

  useEffect(() => {
    const decodedStocks = decodeURIComponent(selectedStocks);
    const stocksArray = decodedStocks.split(",");

    setStocks(stocksArray);

    if (allStocks.length > 0) {
      const available = allStocks.filter(
        (stock) => !stocksArray.includes(stock)
      );
      setAvailableStocks(available);
    }
  }, [selectedStocks, allStocks]);

  const handleSelectStock = (stock) => {
    if (!stocks.includes(stock)) {
      setStocks((prevStocks) => [...prevStocks, stock]);
      setAvailableStocks((prevAvailable) =>
        prevAvailable.filter((s) => s !== stock)
      );
    }
  };

  return (
    <div className="container mx-auto py-12 px-8 bg-[#121212] text-white">
      <h1 className="text-5xl font-bold mb-8 text-center">
        Investment Selection
      </h1>

      <div className="flex flex-col gap-8">
        <Card className="bg-[#1a1a1a] text-white p-6 rounded-lg shadow-lg border border-gray-700">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold">Stocks</CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-lg font-semibold mb-4">Selected Stocks</h2>
            <div className="mb-6 grid grid-cols-4 gap-4">
              {stocks.map((stock, index) => (
                <div
                  key={index}
                  className="bg-[#2a2a2a] p-4 rounded-md text-lg font-medium flex items-center justify-center h-full"
                >
                  {stock}
                </div>
              ))}
            </div>

            <h2 className="text-lg font-semibold mb-4">Available Stocks</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {availableStocks.map((stock, index) => (
                <div
                  key={index}
                  className="bg-[#2a2a2a] p-4 rounded-md text-lg font-medium cursor-pointer hover:bg-[#3a3a3a]"
                  onClick={() => handleSelectStock(stock)}
                >
                  {stock}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] text-white p-6 rounded-lg shadow-lg border border-gray-700">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold">
              Investment Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Label htmlFor="investment" className="text-lg font-semibold">
                Investment Amount (₹)
              </Label>
              <Input
                id="investment"
                type="number"
                className="mt-2 w-full bg-[#2a2a2a] text-white border-none rounded-lg"
                value={investment}
                onChange={(e) => setInvestment(Number(e.target.value))}
              />
            </div>

            <div className="space-y-4 my-4">
              <Label htmlFor="risk" className="text-lg font-semibold">
                Risk Tolerance
              </Label>
              <Slider
                id="risk"
                min={0}
                max={100}
                step={1}
                value={[risk]}
                onValueChange={(value) => setRisk(value[0])}
                className="mt-2 bg-[#2a2a2a]"
              />
              <div className="mt-2 text-sm font-medium">
                <span
                  className={
                    risk < 33
                      ? "text-green-500"
                      : risk < 66
                      ? "text-yellow-500"
                      : "text-red-500"
                  }
                >
                  {risk < 33
                    ? "Low Risk: Generally safer investments with lower returns."
                    : risk < 66
                    ? "Medium Risk: Balanced approach with moderate returns."
                    : "High Risk: Higher potential returns with increased volatility."}
                </span>
              </div>
            </div>

            <Link
              href={`/results?investment=${investment}&risk=${risk}&stocks=${encodeURIComponent(
                stocks.join(",")
              )}`}
            >
              <Button className="w-full bg-[#2ea583] text-[#121212] hover:bg-[#28a374] rounded-lg py-3 text-lg font-semibold">
                Generate Suggestions
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StockPage;
