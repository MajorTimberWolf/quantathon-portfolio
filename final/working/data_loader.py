import json
import numpy as np
import pandas as pd

def load_historical_stock_data(filename):
    with open(filename, 'r') as file:
        data = json.load(file)
    stocks = list(data.keys())
    prices = []
    for stock in stocks:
        sorted_entries = sorted(data[stock], key=lambda x: x['date'])
        prices.append([entry['close'] for entry in sorted_entries])
    prices = np.array(prices).T
    return pd.DataFrame(prices, columns=stocks)

def normalize_stock_prices(stock_prices):
    return stock_prices / stock_prices.iloc[0]

def calculate_returns_and_risk(stock_prices):
    returns = stock_prices.pct_change().dropna()
    expected_return = returns.mean()
    volatility = returns.std()
    return expected_return, volatility
