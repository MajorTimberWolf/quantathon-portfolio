import yfinance as yf
import json

nifty_ticker = "^NSEI"
nifty_data = yf.Ticker(nifty_ticker)
historical_data = nifty_data.history(period="1y")
historical_data.reset_index(inplace=True)

formatted_data = []
for _, row in historical_data.iterrows():
    entry = {
        "date": row['Date'].isoformat(),
        "open": row['Open'],
        "close": row['Close'],
        "volume": int(row['Volume'])
    }
    formatted_data.append(entry)

with open('nifty.json', 'w') as json_file:
    json.dump(formatted_data, json_file, indent=4)

print("Nifty 50 data saved to nifty.json")
