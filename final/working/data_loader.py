import json
import numpy as np
import pandas as pd

def load_historical_stock_data(filename):
    with open(filename, 'r') as file:
        data = json.load(file)
    stocks = list(data.keys())[15:25]  # Use only the first 10 stocks
    prices = []
    for stock in stocks:
        prices.append([entry['close'] for entry in data[stock]])
    prices = np.array(prices).T  # Transpose to get days as rows and stocks as columns
    return pd.DataFrame(prices, columns=stocks)

def normalize_stock_prices(stock_prices):
    return stock_prices / stock_prices.iloc[0]