import time
import numpy as np
from fastapi import FastAPI
from portfolio_optimization import optimize_portfolio_with_quantum_walk

def setup_routes(app: FastAPI, stock_prices, normalized_stock_prices):
    @app.get("/optimize")
    def optimize_route(amount: float):
        time_start = time.time()
        weights, amounts = [], []
        runs = 5
        for _ in range(runs):
            print(f"Running optimization {runs} times...")
            optimized_weights, investment_amounts = optimize_portfolio_with_quantum_walk(stock_prices, total_investment=amount, steps=35)
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