import json
import yfinance as yf
from difflib import get_close_matches

# Load INE codes
with open("ine_codes.txt", "r") as f:
    ine_codes = [line.strip() for line in f.readlines()]

# Load historical data
with open("historical.json", "r") as f:
    historical_data = json.load(f)

stock_data = {}

# Create a mapping of INE codes to their respective stocks
ine_mapping = {}

# Fetch stock names from yfinance based on INE codes
for ine_code in ine_codes:
    try:
        # Search for the stock using the INE code as a keyword
        print(f"Searching for {ine_code}...")
        search_result = yf.Ticker(ine_code).info
        if 'symbol' in search_result:
            print(f"Found: {search_result['symbol']}")
            closest_ticker = search_result['symbol']
            print(f"Closest ticker: {closest_ticker}")
            ine_mapping[closest_ticker] = ine_code
    except Exception as e:
        print(f"Error fetching data for {ine_code}: {e}")

for stock_name in historical_data.keys():
    # Find the closest ticker symbol based on stock name
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

# Save stock data to stock_data.json
with open("stock_data.json", "w") as f:
    json.dump({"stock_data": stock_data}, f, indent=4)

print("Stock data saved to stock_data.json.")
