import React, { useEffect, useState, useRef } from "react";

const StockDistributionExplanation = ({
  stockData,
  optimizedWeights,
  investmentAmounts,
}) => {
  const [explanations, setExplanations] = useState([]);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    const fetchExplanations = async () => {
      if (hasFetchedRef.current) return;

      hasFetchedRef.current = true;

      try {
        const response = await fetch("/api/explain", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stockData,
            optimizedWeights,
            investmentAmounts,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch explanations");
        }

        const data = await response.json();
        setExplanations(data);
      } catch (error) {
        console.error("Error fetching explanations:", error);
      }
    };

    fetchExplanations();
  }, [stockData, optimizedWeights, investmentAmounts]);

  return (
    <div className="flex-1 bg-[#1a1a1a] p-6 rounded-lg shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-4">
        Stock Distribution Explanation
      </h2>
      <p className="text-sm text-gray-400 mb-4">
        The following explanations outline why each stock has been allocated the
        specified investment amount based on optimized weights.
      </p>
      <div className="space-y-4">
        {explanations.map((explanation, index) => (
          <div key={index} className="border border-gray-600 rounded-md p-4">
            <h3 className="text-lg font-semibold text-white">
              {explanation.stock}
            </h3>
            <p className="text-sm text-gray-300">
              Investment Amount: ${investmentAmounts[index].toFixed(2)}
            </p>
            <p className="text-sm text-gray-300">
              Explanation: {explanation.explanation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockDistributionExplanation;
