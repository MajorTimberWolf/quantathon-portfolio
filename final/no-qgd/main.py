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

# Allow CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/optimize")
def optimize_portfolio(amount: int = Query(..., description="Total investment amount")):
    # Load historical stock prices
    stock_prices = load_historical_stock_data('historical.json')
    num_stocks = stock_prices.shape[1]
    num_days = stock_prices.shape[0]

    # Normalize stock prices
    normalized_stock_prices = stock_prices / stock_prices.iloc[0]

    # Execute Optimization with the provided Total Investment
    optimized_weights, investment_amounts = optimize_portfolio_with_quantum_walk(
        stock_prices, amount, steps=3
    )

    # Create 'graphs' folder if it doesn't exist
    output_dir = 'graphs_corrected'
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Visualize Results
    # Uncomment the following lines if you want to generate graphs
    # plot_normalized_stock_prices(normalized_stock_prices, stock_prices, output_dir)
    # plot_sampled_weights(stock_prices, optimized_weights, output_dir)
    # plot_investment_distribution(stock_prices, investment_amounts, output_dir)

    return {
        "optimized_weights": optimized_weights.tolist(),
        "investment_amounts": investment_amounts.tolist(),
        "normalized_stock_prices": normalized_stock_prices.to_dict(),
        "stock_prices": stock_prices.to_dict(),
        "message": "Optimization and visualization completed."
    }
