import numpy as np #type:ignore
import cirq #type:ignore
from cost_function import cost
from adjacency_matrix import construct_adjacency_matrix
from quantum_walk import quantum_walk_on_graph

def optimize_portfolio_with_quantum_walk(stock_prices, total_investment, steps=3):
    returns = stock_prices.pct_change().dropna().values
    num_stocks = returns.shape[1]
    fluctuation = stock_prices.pct_change().std().values
    risk_factors = fluctuation / np.max(fluctuation)
    print("Risk Factors for each stock:")
    for stock, risk in zip(stock_prices.columns, risk_factors):
        print(f"{stock}: {risk:.2f}")
    adjacency_matrix = construct_adjacency_matrix(returns)
    qubits = [cirq.NamedQubit(f'pos_{i}') for i in range(num_stocks)]
    circuit = quantum_walk_on_graph(qubits, adjacency_matrix, steps)
    simulator = cirq.Simulator()
    result = simulator.run(circuit, repetitions=1000)
    measurements = result.measurements['position']
    position_counts = {}
    for measurement in measurements:
        bitstring = ''.join(str(bit) for bit in measurement)
        index = int(bitstring, 2)
        if index < num_stocks:
            position_counts[index] = position_counts.get(index, 0) + 1
    sampled_weights = np.zeros(num_stocks)
    for index, count in position_counts.items():
        sampled_weights[index] = count
    if np.sum(sampled_weights) == 0:
        sampled_weights = np.ones(num_stocks) / num_stocks
    else:
        sampled_weights = sampled_weights / np.sum(sampled_weights)
    investment_amounts = sampled_weights * total_investment
    portfolio_cost = cost(sampled_weights, returns, risk_factors, risk_tolerance=0.5)
    print(f"Portfolio Cost from Quantum Walk: {portfolio_cost:.4f}")
    return sampled_weights, investment_amounts
