# Quantum Portfolio Optimization

This project implements various quantum computing approaches to optimize investment portfolios. It uses quantum algorithms such as Quantum Walks, QAOA (Quantum Approximate Optimization Algorithm), and quantum entanglement measures to find optimal asset allocations.

## Project Structure

The project is divided into two main parts:

1. Backend (Python FastAPI)
2. Frontend (Next)

## Setup and Running

### Backend

1. Navigate to the backend directory:
   ```
   cd final/working
   ```

2. Install the required Python packages (it's recommended to use a virtual environment):
   ```
   conda env create -f environment.yml
   ```

3. Run the FastAPI server:
   ```
   fastapi dev main.py
   ```
   or
   ```
   uvicorn main:app --reload
   ```

The API will be available at `http://localhost:8000`.

### Frontend

1. Navigate to the frontend directory:
   ```
   cd final/frontend
   ```

2. Install the required npm packages:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

The frontend will be available at `http://localhost:3000` (or another port if 3000 is already in use).

## API Endpoints

- `/optimize`: Performs portfolio optimization using the specified method.
- `/stocks`: Retrieves historical stock data.
- `/nifty`: Retrieves Nifty index data.

## Usage

1. Start both the backend and frontend servers as described above.
2. Open your web browser and navigate to the frontend URL (typically `http://localhost:3000`).
3. Use the interface to select stocks, set investment amounts, and choose optimization methods.
4. View the optimized portfolio allocations and performance metrics.


## License

Check LICENSE.MD for more details.

## Acknowledgments

- This project uses Cirq for quantum circuit simulations.
- FastAPI is used for the backend API.
- Next.js is used for the frontend user interface.
