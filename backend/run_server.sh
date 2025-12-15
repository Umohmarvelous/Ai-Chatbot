#!/bin/bash
# Script to run the FastAPI backend server

# Navigate to backend directory
cd "$(dirname "$0")"

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Run the server using python3 -m uvicorn (works even if uvicorn isn't in PATH)
python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

