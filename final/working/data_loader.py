import json
import numpy as np
import pandas as pd

def load_historical_stock_data(filename):
    # Load historical stock data from JSON file
    with open(filename, 'r') as file:
        data = json.load(file)
    stocks = list(data.keys())[15:25]  # Use a subset of stocks (adjust range as needed)
    prices = []
    for stock in stocks:
        prices.append([entry['close'] for entry in data[stock]])
    prices = np.array(prices).T  # Transpose to get days as rows and stocks as columns
    return pd.DataFrame(prices, columns=stocks)

def normalize_stock_prices(stock_prices):
    # Normalize stock prices
    return stock_prices / stock_prices.iloc[0]

def calculate_returns_and_risk(stock_prices):
    # Calculate daily returns
    returns = stock_prices.pct_change().dropna()
    # Calculate expected return (mean) and risk (volatility - std deviation)
    expected_return = returns.mean()
    volatility = returns.std()
    return expected_return, volatility
