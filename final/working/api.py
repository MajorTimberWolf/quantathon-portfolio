import time
import numpy as np
from fastapi import FastAPI
from portfolio_optimization import optimize_portfolio_with_quantum_walk

def setup_routes(app: FastAPI, stock_prices, normalized_stock_prices):
    @app.get("/optimize")
    def optimize_route(amount: float, take_more_risk: bool = False, risk_tolerance: float = 1.0):
        time_start = time.time()
        weights, investment_amounts = [], []
        runs = 5
        
        for _ in range(runs):
            optimized_weights, investment_amounts_run = optimize_portfolio_with_quantum_walk(
                stock_prices, total_investment=amount, steps=35, take_more_risk=take_more_risk)
                
            weights.append(optimized_weights.tolist())
            investment_amounts.append(investment_amounts_run.tolist())
        
        average_optimized_weights = np.mean(weights, axis=0)
        average_investment_amounts = np.mean(investment_amounts, axis=0)
        
        print("Time taken:", time.time() - time_start, "seconds")
        return {
            "optimized_weights": average_optimized_weights.tolist(),
            "investment_amounts": average_investment_amounts.tolist(),
            "normalized_stock_prices": normalized_stock_prices.to_dict(),
            "stock_prices": stock_prices.to_dict(),
            "message": "Optimization completed."
        }
