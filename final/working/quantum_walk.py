import cirq
import numpy as np

def construct_adjacency_matrix(returns):
    covariance_matrix = np.cov(returns, rowvar=False)
    max_cov = np.max(np.abs(covariance_matrix))
    if max_cov != 0:
        adjacency_matrix = covariance_matrix / max_cov  # Normalize covariance values to [-1, 1]
    else:
        adjacency_matrix = covariance_matrix
    # Set diagonal to zero to avoid self-loops
    np.fill_diagonal(adjacency_matrix, 0)
    return adjacency_matrix

def quantum_walk_on_graph(qubits, adjacency_matrix, steps):
    circuit = cirq.Circuit()
    num_qubits = len(qubits)
    
    # Define coin qubits
    coin_qubits = [cirq.NamedQubit(f'coin_{i}') for i in range(num_qubits)]
    
    # Initialize coin and position in superposition
    for qubit in qubits + coin_qubits:
        circuit.append(cirq.H(qubit))
    
    # Quantum walk steps
    for _ in range(steps):
        # Coin operator: Apply Hadamard to coin qubits
        for coin in coin_qubits:
            circuit.append(cirq.H(coin))
        
        # Shift operator: Based on adjacency matrix
        for i in range(num_qubits):
            for j in range(num_qubits):
                if adjacency_matrix[i, j] != 0 and i != j:
                    # Conditional shift using coin qubits
                    circuit.append(cirq.CCX(coin_qubits[i], qubits[i], qubits[j]))
    
    # Measure position qubits
    circuit.append(cirq.measure(*qubits, key='position'))
    return circuit