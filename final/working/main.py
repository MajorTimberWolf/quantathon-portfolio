import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from data_loader import load_historical_stock_data, normalize_stock_prices
from api import setup_routes

app = FastAPI()

# Setup CORS (cross-origin resource sharing, useful for frontend interaction)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

stock_prices = load_historical_stock_data('historical.json')
normalized_stock_prices = normalize_stock_prices(stock_prices)

setup_routes(app, stock_prices, normalized_stock_prices)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)