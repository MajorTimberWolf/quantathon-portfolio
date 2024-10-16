import os
import numpy as np
import pandas as pd
from data_loader import load_historical_stock_data
from portfolio_optimizer import optimize_portfolio_with_qgd
from visualization import (
    plot_normalized_stock_prices,
    plot_investment_distribution,
    plot_optimized_weights,
)

stock_prices = load_historical_stock_data('historical.json')
num_stocks = stock_prices.shape[1]
num_days = stock_prices.shape[0]

normalized_stock_prices = stock_prices / stock_prices.iloc[0]

total_investment = 10000
optimized_weights, investment_amounts = optimize_portfolio_with_qgd(
    stock_prices, total_investment, steps=3
)

output_dir = 'graphs_new_test3'
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

plot_normalized_stock_prices(normalized_stock_prices, stock_prices, output_dir)
plot_investment_distribution(stock_prices, investment_amounts, output_dir)
plot_optimized_weights(stock_prices, optimized_weights, output_dir)
