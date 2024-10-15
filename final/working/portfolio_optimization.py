import numpy as np
import cirq

def construct_adjacency_matrix(returns):
    correlation_matrix = np.corrcoef(returns, rowvar=False)
    adjacency_matrix = np.where(correlation_matrix > 0.5, 1, 0)  
    print("Adjacency Matrix:\n", adjacency_matrix)
    return adjacency_matrix

def quantum_walk_on_graph(qubits, adjacency_matrix, steps):
    circuit = cirq.Circuit()
    num_qubits = len(qubits)

    
    for _ in range(steps):
        for i in range(num_qubits):
            for j in range(num_qubits):
                if adjacency_matrix[i, j] == 1 and i != j:  
                    circuit.append(cirq.CNOT(qubits[i], qubits[j]))
                    circuit.append(cirq.CNOT(qubits[j], qubits[i]))

    return circuit

def cost(weights, returns, risk_factors, risk_tolerance):
    portfolio_return = np.dot(weights, returns.mean(axis=0))
    portfolio_risk = np.sqrt(np.dot(weights.T, np.dot(np.cov(returns, rowvar=False), weights)))
    weighted_risk_factor = np.dot(weights, risk_factors)

    risk_penalty = portfolio_risk * risk_tolerance
    total_cost = -portfolio_return + risk_penalty + 0.1 * weighted_risk_factor
    return total_cost

def optimize_portfolio_with_hadamard_test(stock_prices, total_investment, steps=25, take_more_risk=False):
    returns = stock_prices.pct_change().dropna().values
    num_stocks = returns.shape[1]

    fluctuation = stock_prices.pct_change().std().values
    risk_factors = fluctuation / np.max(fluctuation)

    adjacency_matrix = construct_adjacency_matrix(returns)

    
    qubits = [cirq.NamedQubit(f'pos_{i}') for i in range(num_stocks)]
    ancillary_qubit = cirq.NamedQubit('ancilla')

    
    circuit = cirq.Circuit()
    circuit.append(cirq.H(ancillary_qubit))  

    
    for i in range(num_stocks):
        circuit.append(cirq.CNOT(ancillary_qubit, qubits[i]))

    
    circuit += quantum_walk_on_graph(qubits, adjacency_matrix, steps)

    
    circuit.append(cirq.H(ancillary_qubit))

    
    circuit.append(cirq.measure(ancillary_qubit, key='ancilla_measure'))

    
    simulator = cirq.Simulator()
    result = simulator.run(circuit, repetitions=5000)
    measurements = result.measurements['ancilla_measure']

    
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

    return sampled_weights, investment_amounts, portfolio_cost

def optimize_portfolio_with_quantum_walk(stock_prices, total_investment, steps=25, take_more_risk=False):
    returns = stock_prices.pct_change().dropna().values
    num_stocks = returns.shape[1]

    fluctuation = stock_prices.pct_change().std().values
    risk_factors = fluctuation / np.max(fluctuation)

    adjacency_matrix = construct_adjacency_matrix(returns)

    
    qubits = [cirq.NamedQubit(f'pos_{i}') for i in range(num_stocks)]

    
    circuit = cirq.Circuit()
    
    
    circuit += quantum_walk_on_graph(qubits, adjacency_matrix, steps)

    
    circuit.append(cirq.measure(*qubits, key='positions'))

    
    simulator = cirq.Simulator()
    result = simulator.run(circuit, repetitions=5000)
    measurements = result.measurements['positions']

    
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

    return sampled_weights, investment_amounts, portfolio_cost

def compare_portfolio_methods(stock_prices, total_investment, steps=25, take_more_risk=False):
    weights_hadamard, investments_hadamard, cost_hadamard = optimize_portfolio_with_hadamard_test(stock_prices, total_investment, steps, take_more_risk)
    weights_walk, investments_walk, cost_walk = optimize_portfolio_with_quantum_walk(stock_prices, total_investment, steps, take_more_risk)

    print("Hadamard Test Weights:", weights_hadamard)
    print("Hadamard Test Investments:", investments_hadamard)
    print("Hadamard Test Cost:", cost_hadamard)

    print("Quantum Walk Weights:", weights_walk)
    print("Quantum Walk Investments:", investments_walk)
    print("Quantum Walk Cost:", cost_walk)

    
    if cost_hadamard < cost_walk:
        print("Choosing Hadamard Test Portfolio")
        return weights_hadamard, investments_hadamard, cost_hadamard
    else:
        print("Choosing Quantum Walk Portfolio")
        return weights_walk, investments_walk, cost_walk








