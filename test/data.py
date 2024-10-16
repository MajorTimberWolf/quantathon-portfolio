import json
import yfinance as yf
from difflib import get_close_matches

with open("ine_codes.txt", "r") as f:
    ine_codes = [line.strip() for line in f.readlines()]

with open("historical.json", "r") as f:
    historical_data = json.load(f)

stock_data = {}

ine_mapping = {}

for ine_code in ine_codes:
    try:
        search_result = yf.Ticker(ine_code).info
        if 'symbol' in search_result:
            closest_ticker = search_result['symbol']
            ine_mapping[closest_ticker] = ine_code
    except Exception as e:
        print(f"Error fetching data for {ine_code}: {e}")

for stock_name in historical_data.keys():
    closest_ticker = get_close_matches(stock_name, ine_mapping.keys(), n=1)
    
    if closest_ticker:
        ticker = yf.Ticker(closest_ticker[0])
        info = ticker.info

        stock_data[stock_name] = {
            "sector": info.get("sector"),
            "market_cap": info.get("marketCap"),
            "profit_margin": info.get("profitMargin"),
            "revenue": info.get("revenue"),
            "pe_ratio": info.get("trailingPE"),
            "dividend_yield": info.get("dividendYield"),
        }
    else:
        print(f"No close match found for: {stock_name}")

with open("stock_data.json", "w") as f:
    json.dump({"stock_data": stock_data}, f, indent=4)

print("Stock data saved to stock_data.json.")
