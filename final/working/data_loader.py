import json
import numpy as np
import pandas as pd

def load_historical_stock_data(filename):
    with open(filename, 'r') as file:
        data = json.load(file)
    stocks = list(data.keys())
    prices = []
    for stock in stocks:
        prices.append([entry['close'] for entry in data[stock]])
    prices = np.array(prices).T
    return pd.DataFrame(prices, columns=stocks)

def normalize_stock_prices(stock_prices):
    return stock_prices / stock_prices.iloc[0]