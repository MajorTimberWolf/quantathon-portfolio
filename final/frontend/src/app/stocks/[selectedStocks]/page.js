"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const StockPage = ({ params: { selectedStocks } }) => {
  const [investment, setInvestment] = useState(1000);
  const [risk, setRisk] = useState(50);
  const [stocks, setStocks] = useState([]);
  const [availableStocks, setAvailableStocks] = useState([]);
  const [allStocks, setAllStocks] = useState([]);

  // Fetch all stocks from API
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch("http://localhost:8000/stocks");
        const data = await response.json();
        const stocks = Object.keys(data.stock_prices);
        setAllStocks(stocks.filter((stock) => !stocks.includes(stock)));
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

  return (
    <div className="container mx-auto py-12 px-8">
      <h1 className="text-4xl font-semibold mb-8 text-white">
        Investment Selection
      </h1>

      <div className="w-full flex flex-col">
        {/* Combined Selected and Available Stocks */}
        <Card className="bg-[#131212] text-white w-full p-8 rounded-lg shadow-lg border border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl">Stocks</CardTitle>
          </CardHeader>
          <CardContent className="mt-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Selected Stocks */}
              <div>
                <h2 className="text-lg mb-4">Selected Stocks</h2>
                <div className="space-y-4">
                  {stocks.map((stock, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 p-4 rounded-md text-lg"
                    >
                      {stock}
                    </div>
                  ))}
                </div>
              </div>

              {/* Available Stocks */}
              <div>
                <h2 className="text-lg mb-4">Available Stocks</h2>
                <div className="grid grid-cols-2 gap-4">
                  {availableStocks.map((stock, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 p-4 rounded-md text-lg"
                    >
                      {stock}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Investment and Risk Slider */}
      <Card className="bg-[#131212] text-white w-full mt-12 p-8 rounded-lg shadow-lg border border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl">Investment Details</CardTitle>
        </CardHeader>
        <CardContent className="mt-6">
          <div className="">
            <div>
              <Label htmlFor="investment" className="text-lg">
                Investment Amount (₹)
              </Label>
              <Input
                id="investment"
                type="number"
                className="mt-2 w-full bg-gray-700 text-white border-none rounded-lg"
                value={investment}
                onChange={(e) => setInvestment(Number(e.target.value))}
              />
            </div>

            <div className="space-y-4 my-4">
              <Label htmlFor="risk" className="text-lg">
                Risk Tolerance
              </Label>
              <Slider
                id="risk"
                min={0}
                max={100}
                step={1}
                value={[risk]}
                onValueChange={(value) => setRisk(value[0])}
                className="mt-2 bg-gray-700"
              />
              <div className="mt-2 text-sm">
                {risk < 33 ? "Low" : risk < 66 ? "Medium" : "High"} Risk
              </div>
            </div>

            <Link href={`/results?investment=${investment}&risk=${risk}&stocks=${selectedStocks}`}>
              <Button className="w-full bg-[#2ea583] text-[#131212] hover:bg-[#28a374] rounded-lg py-3 text-lg">
                Generate Suggestions
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockPage;
