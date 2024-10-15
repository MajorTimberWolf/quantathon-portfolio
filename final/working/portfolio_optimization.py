import numpy as np
import cirq
from quantum_walk import construct_adjacency_matrix, quantum_walk_on_graph

def cost(weights, returns, risk_factors, risk_tolerance):
    portfolio_return = np.dot(weights, returns.mean(axis=0))
    portfolio_risk = np.sqrt(np.dot(weights.T, np.dot(np.cov(returns, rowvar=False), weights)))
    weighted_risk_factor = np.dot(weights, risk_factors)
    
    
    risk_penalty = portfolio_risk * risk_tolerance
    return -portfolio_return + risk_penalty + 0.1 * weighted_risk_factor

def optimize_portfolio_with_quantum_walk(stock_prices, total_investment, steps=25, take_more_risk=False):
    returns = stock_prices.pct_change().dropna().values
    num_stocks = returns.shape[1]

    
    fluctuation = stock_prices.pct_change().std().values
    risk_factors = fluctuation / np.max(fluctuation)  

    
    adjacency_matrix = construct_adjacency_matrix(returns)

   
    qubits = [cirq.NamedQubit(f'pos_{i}') for i in range(num_stocks)]

   
    circuit = quantum_walk_on_graph(qubits, adjacency_matrix, steps)

    
    simulator = cirq.Simulator()
    result = simulator.run(circuit, repetitions=5000)  
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
    
    if take_more_risk:
       
        sampled_weights = (risk_factors * 0.7) + (sampled_weights * 0.3)
        sampled_weights = sampled_weights / np.sum(sampled_weights)  
    
    
    sampled_weights = 0.7 * sampled_weights + 0.3 * (1 / num_stocks)

    
    investment_amounts = sampled_weights * total_investment

   
    portfolio_cost = cost(sampled_weights, returns, risk_factors, risk_tolerance=0.5)

    return sampled_weights, investment_amounts
