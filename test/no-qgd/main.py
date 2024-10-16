import os
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from data_loader import load_historical_stock_data
from portfolio_optimizer import optimize_portfolio_with_quantum_walk
from visualization import (
    plot_normalized_stock_prices,
    plot_sampled_weights,
    plot_investment_distribution,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/optimize")
def optimize_portfolio(amount: int = Query(..., description="Total investment amount")):
    stock_prices = load_historical_stock_data('historical.json')
    num_stocks = stock_prices.shape[1]
    num_days = stock_prices.shape[0]

    normalized_stock_prices = stock_prices / stock_prices.iloc[0]

    optimized_weights, investment_amounts = optimize_portfolio_with_quantum_walk(
        stock_prices, amount, steps=3
    )

    output_dir = 'graphs_corrected'
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    return {
        "optimized_weights": optimized_weights.tolist(),
        "investment_amounts": investment_amounts.tolist(),
        "normalized_stock_prices": normalized_stock_prices.to_dict(),
        "stock_prices": stock_prices.to_dict(),
        "message": "Optimization and visualization completed."
    }
