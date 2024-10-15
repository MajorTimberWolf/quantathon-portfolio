import time
import numpy as np
import pandas as pd
from fastapi import FastAPI
from portfolio_optimization import optimize_portfolio_with_quantum_walk
import json

def setup_routes(app: FastAPI, stock_prices, normalized_stock_prices):
    @app.get("/optimize")
    def optimize_route(amount: float = 1000, risk: float = 0.1, stocks: str = "TATA STEEL LIMITED"):
        time_start = time.time()
        weights, amounts = [], []
        runs = 1
        input_stocks = stocks.split(",")
        print("Selected stocks:", input_stocks)

        filtered_stock_prices = stock_prices[input_stocks]

        normalized_stock_prices = filtered_stock_prices / filtered_stock_prices.iloc[0]

        for _ in range(runs):
            optimized_weights, investment_amounts = optimize_portfolio_with_quantum_walk(filtered_stock_prices, total_investment=amount, steps=35)
            weights.append(optimized_weights.tolist())
            amounts.append(investment_amounts.tolist())

        average_optimized_weights = np.mean(weights, axis=0)
        average_investment_amounts = np.mean(amounts, axis=0)
        print("Time taken:", time.time() - time_start, "seconds")

        return {
            "optimized_weights": average_optimized_weights.tolist(),
            "investment_amounts": average_investment_amounts.tolist(),
            "normalized_stock_prices": normalized_stock_prices.to_dict(),
            "stock_prices": stock_prices.to_dict(),
            "message": "Optimization and visualization completed."
        }

    @app.get("/stocks")
    def stocks_route():
        with open("historical.json", "r") as f:
            historical_data = f.read()
            historical_data = json.loads(historical_data)
        return {
            "stock_prices": historical_data,
            "message": "Stock prices retrieved."
        }
