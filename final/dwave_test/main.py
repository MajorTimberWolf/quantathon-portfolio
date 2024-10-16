import json
import numpy as np
from dwave.system import EmbeddingComposite, DWaveSampler

def optimize_portfolio_with_dwave_v3(total_investment=10000, risk_threshold=0.2, max_stock_weight=0.2, num_stocks_to_consider=3):
    with open('historical.json') as f:
        data = json.load(f)

    tickers = list(data.keys())
    avg_returns = []
    for ticker in tickers:
        prices = [entry['close'] for entry in data[ticker]]
        daily_returns = np.diff(prices) / prices[:-1]
        avg_returns.append(np.mean(daily_returns))

    top_stocks = sorted(zip(tickers, avg_returns), key=lambda x: x[1], reverse=True)[:num_stocks_to_consider]
    tickers = [stock[0] for stock in top_stocks]
    num_stocks = len(tickers)

    min_days = min(len(data[ticker]) for ticker in tickers)
    returns = np.zeros((num_stocks, min_days - 1))

    for i, ticker in enumerate(tickers):
        prices = [entry['close'] for entry in data[ticker][-min_days:]]
        returns[i] = np.diff(prices) / prices[:-1]


    mean_returns = np.mean(returns, axis=1)
    cov_matrix = np.cov(returns)

    risk_free_rate = 0.02
    sharpe_ratios = (mean_returns - risk_free_rate) / np.maximum(np.sqrt(np.diag(cov_matrix)), 1e-8)
    normalized_sharpe = (sharpe_ratios - np.min(sharpe_ratios)) / (np.max(sharpe_ratios) - np.min(sharpe_ratios) + 1e-8)


    linear = {}
    quadratic = {}

    for i in range(num_stocks):
        linear[(i, i)] = -10 * normalized_sharpe[i] + (np.diag(cov_matrix)[i] / risk_threshold) + 100 + 0.1

        for j in range(i + 1, num_stocks):
            quadratic[(i, j)] = 5 * cov_matrix[i, j] / risk_threshold

    for i in range(num_stocks):
        linear[(i, i)] += 100

    for i in range(num_stocks):
        for j in range(i + 1, num_stocks):
            quadratic[(i, j)] += 100

    Q = {**linear, **quadratic}

    print("QUBO matrix:", Q)

    sampler = EmbeddingComposite(DWaveSampler(token='DEV-8c726c6d5f8b80ca50e72d6f58091fb872ab3d95'))
    sampleset = sampler.sample_qubo(Q, num_reads=10000)

    print("Sampleset:", sampleset)

    best_sample = sampleset.first.sample

    weights = np.array([best_sample.get(i, 0) for i in range(num_stocks)])
    weights = np.maximum(weights, 0)
    total_weight = np.sum(weights)

    if total_weight > 0:
        weights = weights / total_weight
    else:
        weights = np.ones(num_stocks) / num_stocks

    weights = np.minimum(weights, max_stock_weight)
    weights = weights / np.sum(weights)

    investment_amounts = weights * total_investment

    portfolio_return = np.dot(weights, mean_returns)
    portfolio_volatility = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
    portfolio_sharpe = (portfolio_return - risk_free_rate) / max(portfolio_volatility, 1e-8)

    return tickers, weights, investment_amounts, portfolio_return, portfolio_volatility, portfolio_sharpe

tickers, weights, investment_amounts, portfolio_return, portfolio_volatility, portfolio_sharpe = optimize_portfolio_with_dwave_v3()
print("Selected Tickers:", tickers)
print("Weights:", weights)
print("Investment Amounts:", investment_amounts)
print(f"Portfolio Return: {portfolio_return:.4f}")
