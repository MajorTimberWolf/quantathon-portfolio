import cirq #type:ignore
import numpy as np #type:ignore

def quantum_walk_on_graph(qubits, adjacency_matrix, steps):
    circuit = cirq.Circuit()
    num_qubits = len(qubits)
    for qubit in qubits:
        circuit.append(cirq.H(qubit))
    for _ in range(steps):
        for i in range(num_qubits):
            for j in range(num_qubits):
                if i != j and adjacency_matrix[i, j] > 0:
                    circuit.append(cirq.CZ(qubits[i], qubits[j]) ** adjacency_matrix[i, j])
        for i in range(num_qubits):
            circuit.append(cirq.H(qubits[i]))
    circuit.append(cirq.measure(*qubits, key='result'))
    return circuit
