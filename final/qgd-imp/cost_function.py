import numpy as np #type:ignore
import pennylane as qml #type:ignore
from pennylane import numpy as pnp #type:ignore

def cost(weights, returns, risk_factors, risk_tolerance):
    portfolio_return = np.dot(weights, returns.mean(axis=0))
    portfolio_risk = pnp.sqrt(pnp.dot(weights.T, pnp.dot(np.cov(returns, rowvar=False), weights)))
    weighted_risk_factor = np.dot(weights, risk_factors)
    risk_penalty = portfolio_risk * risk_tolerance
    return -portfolio_return + risk_penalty + 0.1 * weighted_risk_factor
