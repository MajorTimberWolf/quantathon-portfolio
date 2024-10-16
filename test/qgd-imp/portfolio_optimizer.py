import numpy as np #type:ignore
import pennylane as qml #type:ignore
from pennylane import numpy as pnp #type:ignore
from cost_function import cost
from quantum_cost_function import quantum_cost

def optimize_portfolio_with_qgd(stock_prices, total_investment, steps=3):
    returns = stock_prices.pct_change().dropna().values
    num_stocks = returns.shape[1]
    fluctuation = stock_prices.pct_change().std().values
    risk_factors = fluctuation / np.max(fluctuation)
    print("Risk Factors for each stock:")
    for stock, risk in zip(stock_prices.columns, risk_factors):
        print(f"{stock}: {risk:.2f}")
    quantum_cost_function = quantum_cost(weights=np.random.rand(num_stocks), returns=returns, risk_factors=risk_factors, risk_tolerance=0.5)
    opt = qml.GradientDescentOptimizer(stepsize=0.01)
    weights = pnp.random.rand(num_stocks, requires_grad=True)
    max_iterations = 100
    for i in range(max_iterations):
        weights = opt.step(quantum_cost_function, weights)
        if (i + 1) % 10 == 0:
            current_cost = quantum_cost_function(weights)
            print(f"Iteration {i + 1}: Cost = {current_cost:.4f}")
    final_weights = weights / pnp.sum(weights)
    investment_amounts = final_weights * total_investment
    investment_amounts = pnp.maximum(investment_amounts, 0)
    return final_weights, investment_amounts
