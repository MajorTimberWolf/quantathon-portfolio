import time
import numpy as np
import pandas as pd
from fastapi import FastAPI
from portfolio_optimization import compare_portfolio_methods
import json
from data_loader import load_historical_stock_data, normalize_stock_prices

def setup_routes(app: FastAPI, stock_prices, normalized_stock_prices):
    @app.get("/optimize")
    def optimize_route(amount: float = 1000, risk: float = 0.1, stocks: str = "TATA STEEL LIMITED"):
        time_start = time.time()
        weights, amounts = [], []
        runs = 5
        input_stocks = stocks.split(",")
        print("Selected stocks:", input_stocks)

        filtered_stock_prices = stock_prices[input_stocks]

        normalized_stock_prices = filtered_stock_prices / filtered_stock_prices.iloc[0]

        for _ in range(runs):
            optimized_weights, investment_amounts, cost = compare_portfolio_methods(filtered_stock_prices, total_investment=amount, steps=35, take_more_risk=True if risk > 0.5 else False)

            print("Optimized Weights:", optimized_weights)
            print("Investment Amounts:", investment_amounts)

            weights.append(optimized_weights.tolist())
            amounts.append(investment_amounts.tolist())

        average_optimized_weights = np.mean(weights, axis=0)
        average_investment_amounts = np.mean(amounts, axis=0)
        print("Time taken:", time.time() - time_start, "seconds")

        return {
            "optimized_weights": average_optimized_weights.tolist(),
            "investment_amounts": average_investment_amounts.tolist(),
            "normalized_stock_prices": normalized_stock_prices.to_dict(),
            "all_weights": weights,
            "stock_prices": stock_prices.to_dict(),
            "message": "Optimization and visualization completed."
        }

    @app.get("/stocks")
    def stocks_route():
        with open("historical.json", "r") as f:
            historical_data = f.read()
            new_historical_data = {}

            historical_data = json.loads(historical_data)
            for key in historical_data.keys():
                new_historical_data[key] = historical_data[key].reverse()
        with open("nifty.json", "r") as f:
            nifty_data = f.read()
            nifty_data = json.loads(nifty_data)
            nifty_data

        return {
            "stock_prices": historical_data,
            "nifty_prices": nifty_data,
            "message": "Stock prices and Nifty data retrieved."
        }
    
    @app.get("/nifty")
    def nifty_route():
        nifty_data = load_historical_stock_data('nifty.json')
        normalized_nifty_data = normalize_stock_prices(nifty_data)
        return {
            "nifty": normalized_nifty_data.to_dict(),
            "message": "Nifty data retrieved."
        }
