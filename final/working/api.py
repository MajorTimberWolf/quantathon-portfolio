import time
import numpy as np
from fastapi import FastAPI
from portfolio_optimization import compare_portfolio_methods, optimize_portfolio_with_hadamard_test, optimize_portfolio_with_quantum_walk, optimize_portfolio_with_qaoa, classical_portfolio_optimization
import json
from advanced_cost_functions import calculate_entanglement_based_cost
from data_loader import load_historical_stock_data, normalize_stock_prices

def setup_routes(app: FastAPI, stock_prices, normalized_stock_prices):
    
    @app.get("/optimize")
    def optimize_route(amount: float = 1000, risk: float = 0.1, method: str = "classical", stocks: str = "TATA STEEL LIMITED", runs: int = 5):
        time_start = time.time()

        input_stocks = stocks.split(",")
        print("Selected stocks:", input_stocks)

        filtered_stock_prices = stock_prices[input_stocks]
        normalized_stock_prices = filtered_stock_prices / filtered_stock_prices.iloc[0]

        weights = []
        amounts = []

        for _ in range(runs):
            if method == "hadamard":
                optimized_weights, investment_amounts, cost = optimize_portfolio_with_hadamard_test(
                    filtered_stock_prices, total_investment=amount, steps=35, take_more_risk=True if risk > 0.5 else False
                )
            elif method == "quantum_walk":
                optimized_weights, investment_amounts, cost = optimize_portfolio_with_quantum_walk(
                    filtered_stock_prices, total_investment=amount, steps=35, take_more_risk=True if risk > 0.5 else False
                )
            elif method == "qaoa":
                optimized_weights, investment_amounts, cost = optimize_portfolio_with_qaoa(
                    filtered_stock_prices, total_investment=amount, steps=35, risk_tolerance=risk
                )
            elif method == "entanglement_based":
                returns = filtered_stock_prices.pct_change().dropna().values
                fluctuation = filtered_stock_prices.pct_change().std().values
                risk_factors = fluctuation / np.max(fluctuation)

                # Use the entanglement-based cost function
                optimized_weights = np.ones(len(input_stocks)) / len(input_stocks)  # Uniform initial weights
                cost = calculate_entanglement_based_cost(
                    optimized_weights, returns, risk_factors, risk_tolerance=risk
                )
                investment_amounts = optimized_weights * amount
            elif method == "classical":
                returns = filtered_stock_prices.pct_change().dropna().values
                optimized_weights, investment_amounts, cost = classical_portfolio_optimization(
                    returns, total_investment=amount, risk_tolerance=risk
                )
            elif method == "compare":
                optimized_weights, investment_amounts, cost = compare_portfolio_methods(
                    filtered_stock_prices, total_investment=amount, steps=35, take_more_risk=True if risk > 0.5 else False
                )
            else:
                return {"error": "Invalid optimization method. Choose 'hadamard', 'quantum_walk', 'qaoa', 'entanglement_based', 'classical', or 'compare'."}
            
            print(f"Run {_ + 1} - Optimized Weights ({method}):", optimized_weights)
            print(f"Run {_ + 1} - Investment Amounts ({method}):", investment_amounts)

            weights.append(optimized_weights.tolist())
            amounts.append(investment_amounts.tolist())

        average_optimized_weights = np.mean(weights, axis=0)
        average_investment_amounts = np.mean(amounts, axis=0)

        print("Time taken:", time.time() - time_start, "seconds")

        return {
            "optimized_weights": average_optimized_weights.tolist(),
            "investment_amounts": average_investment_amounts.tolist(),
            "cost": cost,
            "all_weights": weights,
            "normalized_stock_prices": normalized_stock_prices.to_dict(),
            "stock_prices": stock_prices.to_dict(),
            "message": f"Optimization using {method} completed successfully across {runs} runs."
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