import matplotlib.pyplot as plt #type:ignore
import os

def plot_normalized_stock_prices(normalized_stock_prices, stock_prices, output_dir):
    plt.figure(figsize=(12, 6))
    plt.plot(normalized_stock_prices)
    plt.title('Normalized Historical Stock Prices Over Time')
    plt.xlabel('Days')
    plt.ylabel('Normalized Price')
    plt.legend(stock_prices.columns, bbox_to_anchor=(1.05, 1), loc='upper left')
    plt.grid()
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'normalized_historical_stock_prices.png'))
    plt.close()

def plot_sampled_weights(stock_prices, optimized_weights, output_dir):
    plt.figure(figsize=(12, 6))
    plt.bar(stock_prices.columns, optimized_weights)
    plt.title('Sampled Weights from Quantum Walk')
    plt.xlabel('Stocks')
    plt.ylabel('Normalized Weight')
    plt.xticks(rotation=45, ha='right')
    plt.grid()
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'quantum_walk_weights.png'))
    plt.close()

def plot_investment_distribution(stock_prices, investment_amounts, output_dir):
    plt.figure(figsize=(8, 8))
    plt.pie(investment_amounts, labels=stock_prices.columns, autopct='%1.1f%%', startangle=140)
    plt.title('Final Investment Distribution')
    plt.axis('equal')
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'investment_distribution.png'))
    plt.close()
