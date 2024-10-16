import pennylane as qml #type:ignore
from pennylane import numpy as pnp #type:ignore
import numpy as np #type:ignore

def quantum_cost(weights, returns, risk_factors, risk_tolerance):
    num_qubits = len(weights)
    dev = qml.device("default.qubit", wires=num_qubits)

    @qml.qnode(dev)
    def circuit(weights):
        for i in range(num_qubits):
            qml.RY(weights[i], wires=i)
        for i in range(num_qubits - 1):
            qml.CNOT(wires=[i, i + 1])
        return [qml.expval(qml.PauliZ(i)) for i in range(num_qubits)]

    def cost_function(weights):
        quantum_expvals = circuit(weights)
        portfolio_return = np.dot(quantum_expvals, returns.mean(axis=0))
        portfolio_risk = pnp.sqrt(pnp.dot(weights.T, pnp.dot(np.cov(returns, rowvar=False), weights)))
        weighted_risk_factor = np.dot(weights, risk_factors)
        risk_penalty = portfolio_risk * risk_tolerance
        return -portfolio_return + risk_penalty + 0.1 * weighted_risk_factor

    return cost_function
