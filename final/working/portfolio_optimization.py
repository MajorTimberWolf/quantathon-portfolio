import numpy as np
import cirq
from scipy.optimize import minimize

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

def create_qaoa_circuit(qubits, gamma, beta):
    circuit = cirq.Circuit()
    n = len(qubits)

    for i in range(n):
        circuit.append(cirq.rx(2 * gamma)(qubits[i]))

    
    for i in range(n):
        circuit.append(cirq.rx(2 * beta)(qubits[i]))

    return circuit

def qaoa_cost_function(params, qubits, returns, risk_factors, risk_tolerance):
    n = len(qubits)
    p = len(params) // 2
    gammas = params[:p]
    betas = params[p:]

    circuit = cirq.Circuit()
    for qubit in qubits:
        circuit.append(cirq.H(qubit))

    for i in range(p):
        circuit += create_qaoa_circuit(qubits, gammas[i], betas[i])

    circuit.append(cirq.measure(*qubits, key='result'))

    simulator = cirq.Simulator()
    result = simulator.run(circuit, repetitions=1000)
    measurements = result.measurements['result']

    weights = np.mean(measurements, axis=0)
    weights = weights / np.sum(weights)

    return cost(weights, returns, risk_factors, risk_tolerance)

def optimize_portfolio_with_qaoa(stock_prices, total_investment, steps=25, risk_tolerance=0.5):
    returns = stock_prices.pct_change().dropna().values
    num_stocks = returns.shape[1]

    fluctuation = stock_prices.pct_change().std().values
    risk_factors = fluctuation / np.max(fluctuation)

    qubits = [cirq.NamedQubit(f'q{i}') for i in range(num_stocks)]

    p = steps
    initial_params = np.random.rand(2 * p)

    result = minimize(
        lambda params: qaoa_cost_function(params, qubits, returns, risk_factors, risk_tolerance),
        initial_params,
        method='COBYLA',
        options={'maxiter': 100}
    )

    optimized_params = result.x
    gammas = optimized_params[:p]
    betas = optimized_params[p:]

    circuit = cirq.Circuit()
    for qubit in qubits:
        circuit.append(cirq.H(qubit))

    for i in range(p):
        circuit += create_qaoa_circuit(qubits, gammas[i], betas[i])

    circuit.append(cirq.measure(*qubits, key='result'))

    simulator = cirq.Simulator()
    result = simulator.run(circuit, repetitions=1000)
    measurements = result.measurements['result']

    weights = np.mean(measurements, axis=0)
    weights = weights / np.sum(weights)

    investment_amounts = weights * total_investment
    portfolio_cost = cost(weights, returns, risk_factors, risk_tolerance)

    return weights, investment_amounts, portfolio_cost

def classical_portfolio_optimization(returns, total_investment, risk_tolerance=0.5, regularization=10):
    num_stocks = returns.shape[1]

    def classical_cost(weights):
        portfolio_return = np.dot(weights, returns.mean(axis=0))
        portfolio_risk = np.sqrt(np.dot(weights.T, np.dot(np.cov(returns, rowvar=False), weights)))
        risk_penalty = portfolio_risk * risk_tolerance

        mean_weight = 1 / num_stocks
        regularization_penalty = regularization * np.sum((weights - mean_weight) ** 2)

        return -portfolio_return + risk_penalty + regularization_penalty

    initial_weights = np.ones(num_stocks) / num_stocks
    
    bounds = [(0.8 / num_stocks, 1.2 / num_stocks) for _ in range(num_stocks)]
    
    constraints = {'type': 'eq', 'fun': lambda weights: np.sum(weights) - 1}

    result = minimize(classical_cost, initial_weights, method='SLSQP', bounds=bounds, constraints=constraints)
    
    optimized_weights = result.x
    investment_amounts = optimized_weights * total_investment
    portfolio_cost = classical_cost(optimized_weights)

    return optimized_weights, investment_amounts, portfolio_cost

def compare_portfolio_methods(stock_prices, total_investment, steps=25, take_more_risk=False, risk_tolerance=0.5):
    returns = stock_prices.pct_change().dropna().values
    
    weights_hadamard, investments_hadamard, cost_hadamard = optimize_portfolio_with_hadamard_test(stock_prices, total_investment, steps, take_more_risk)
    weights_walk, investments_walk, cost_walk = optimize_portfolio_with_quantum_walk(stock_prices, total_investment, steps, take_more_risk)
    weights_qaoa, investments_qaoa, cost_qaoa = optimize_portfolio_with_qaoa(stock_prices, total_investment, steps, risk_tolerance)

    print("Hadamard Test Weights:", weights_hadamard)
    print("Hadamard Test Investments:", investments_hadamard)
    print("Hadamard Test Cost:", cost_hadamard)

    print("Quantum Walk Weights:", weights_walk)
    print("Quantum Walk Investments:", investments_walk)
    print("Quantum Walk Cost:", cost_walk)

    print("QAOA Weights:", weights_qaoa)
    print("QAOA Investments:", investments_qaoa)
    print("QAOA Cost:", cost_qaoa)
    
    costs = [cost_hadamard, cost_walk, cost_qaoa]
    min_cost_index = np.argmin(costs)

    if min_cost_index == 0:
        print("Choosing Hadamard Test Portfolio")
        return weights_hadamard, investments_hadamard, cost_hadamard
    elif min_cost_index == 1:
        print("Choosing Quantum Walk Portfolio")
        return weights_walk, investments_walk, cost_walk
    elif min_cost_index == 2:
        print("Choosing QAOA Portfolio")
        return weights_qaoa, investments_qaoa, cost_qaoa