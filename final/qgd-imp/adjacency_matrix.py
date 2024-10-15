import numpy as np #type:ignore

def construct_adjacency_matrix(returns):
    covariance_matrix = np.cov(returns, rowvar=False)
    max_cov = np.max(covariance_matrix)
    if max_cov != 0:
        adjacency_matrix = covariance_matrix / max_cov
    else:
        adjacency_matrix = covariance_matrix
    return adjacency_matrix
