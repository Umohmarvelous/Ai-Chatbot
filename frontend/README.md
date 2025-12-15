
A full-stack application built with Next.js (TypeScript) for the frontend and FastAPI (Python) for the backend.

## Project Structure

```
FullStackApp/
├── backend/           # FastAPI backend application
│   ├── main.py       # Main FastAPI application with all endpoints
│   └── requirements.txt
├── frontend/          # Next.js frontend application
│   ├── app/          # Next.js App Router directory
│   ├── components/   # React components
│   └── package.json
└── README.md
```

## Features

### Backend (FastAPI)

- Health check endpoint (`/api/status`)
- CRUD operations for items (`/api/items`)
- Calculation endpoint (`/api/calculate`)
- CORS configuration for frontend integration
- Pydantic models for data validation

### Frontend (Next.js)

- Server Component data fetching (homepage)
- Client Component with form (ItemCreator)
- TypeScript support
- Tailwind CSS for styling

## Setup Instructions

### Prerequisites

- Python 3.8+ installed
- Node.js 18+ and npm installed

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd FullStackApp/backend
   ```

2. Create a virtual environment (recommended):

   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Run the FastAPI server:

   ```bash
   uvicorn main:app --reload --port 8000
   ```

   Or directly:

   ```bash
   python main.py
   ```

   The API will be available at `http://localhost:8000`
   API documentation (Swagger UI) will be available at `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd FullStackApp/frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## API Endpoints

### GET `/api/status`

Health check endpoint that returns the API status.

**Response:**

```json
{
  "status": "FastAPI is running"
}
```

### POST `/api/items`

Create a new item.

**Request Body:**

```json
{
  "name": "Item Name",
  "description": "Item description (optional)",
  "price": 29.99
}
```

**Response:**

```json
{
  "id": 1,
  "name": "Item Name",
  "description": "Item description",
  "price": 29.99,
  "created_at": "2024-01-01T12:00:00"
}
```

### GET `/api/items`

Get all items.

**Response:**

```json
[
  {
    "id": 1,
    "name": "Sample Item 1",
    "description": "This is a sample item",
    "price": 19.99,
    "created_at": "2024-01-01T12:00:00"
  }
]
```

### POST `/api/calculate`

Perform a calculation operation.

**Request Body:**

```json
{
  "num1": 10,
  "num2": 5,
  "operation": "add"
}
```

**Supported operations:** `add`, `subtract`, `multiply`, `divide`

**Response:**

```json
{
  "result": 15,
  "operation": "add",
  "num1": 10,
  "num2": 5
}
```

## Environment Variables

### Backend

Create a `.env` file in the `backend/` directory:

```
PORT=8000
API_URL=http://localhost:8000
```

### Frontend

Create a `.env.local` file in the `frontend/` directory:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
PORT=3000
```

## Development Notes

- The backend uses in-memory storage for items (data is lost on server restart)
- CORS is configured to allow requests from `http://localhost:3000`
- The frontend uses Next.js App Router with Server and Client Components
- All API endpoints include proper error handling and data validation

## Running Both Servers

To run both the backend and frontend simultaneously:

1. Open two terminal windows
2. In the first terminal, start the backend (from `backend/` directory)
3. In the second terminal, start the frontend (from `frontend/` directory)

You can also use process managers like `concurrently` or `tmux` to run both servers in a single terminal.
