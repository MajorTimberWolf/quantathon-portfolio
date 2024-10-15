"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

export function InfoChart({
  investmentAmounts,
  normalizedStockPrices,
  stockColors,
}) {
  const totalInvestment = React.useMemo(() => {
    return investmentAmounts.reduce((acc, curr) => acc + curr, 0);
  }, [investmentAmounts]);

  const chartData = investmentAmounts.map((investment, index) => {
    const company = Object.keys(normalizedStockPrices)[index];
    return {
      company: company,
      investment: Math.ceil(investment),
      color: stockColors[company] || "gray",
    };
  });

  return (
    <Card className="flex flex-col h-full flex-1 shadow-lg border border-gray-700 rounded-lg overflow-hidden transition-transform transform hover:scale-105 bg-gray-900">
      <CardHeader className="flex flex-col items-start pb-4 px-6">
        <CardTitle className="text-2xl font-semibold mb-1 text-white">
          Investment Distribution
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Allocation by company
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0 px-6">
        <div className="text-center text-4xl font-bold mb-4 text-white">
          {totalInvestment.toLocaleString()}
        </div>
        <div className="text-center text-sm text-muted-foreground mb-6">
          Total Investment
        </div>

        <div className="flex flex-col space-y-2 flex-1">
          {chartData.map(({ company, investment, color }) => (
            <div
              key={company}
              className={`flex justify-between p-3 rounded-lg border border-gray-600 font-bold hover:bg-gray-800 transition duration-200`}
              style={{
                backgroundColor:
                  investment === 0 ? "rgba(255, 0, 0, 0.1)" : color,
              }}
              role="row"
              aria-label={`Investment in ${company}: ${investment.toLocaleString()}`}
            >
              <span className="text-white font-bold">{company}</span>
              <span className="text-white font-bold">
                {investment.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex-col items-start gap-1 px-6 pb-4 text-sm mt-5">
        <div className="leading-none text-muted-foreground">
          Showing total investment distribution by company
        </div>
      </CardFooter>
    </Card>
  );
}
