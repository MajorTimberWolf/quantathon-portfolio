import json
import numpy as np #type:ignore
import pandas as pd #type:ignore

def load_historical_stock_data(filename):
    with open(filename, 'r') as file:
        data = json.load(file)
    stocks = list(data.keys())[15:25]
    prices = []
    for stock in stocks:
        prices.append([entry['close'] for entry in data[stock]])
    prices = np.array(prices).T
    return pd.DataFrame(prices, columns=stocks)
