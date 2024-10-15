import React from "react";

const StockDistributionExplanation = ({ stockData }) => {
  return (
    <div className="flex-1 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-4">Stock Distribution Explanation</h2>
      <p className="text-sm text-gray-400 mb-4">
        The following explanation outlines why the stock distributions are
        configured based on current market trends and historical performance.
      </p>
      <div className="space-y-4">
        {stockData.map((stock, index) => (
          <div key={index} className="border border-gray-600 rounded-md p-4">
            <h3 className="text-lg font-semibold text-white">{stock.name}</h3>
            <p className="text-sm text-gray-300">{stock.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockDistributionExplanation;
