from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime
import os
from dotenv import load_dotenv
from groq import Groq

# Load environment variables
load_dotenv()

app = FastAPI(title="FullStackApp Backend API", version="1.0.0")

# CORS Configuration - Allow requests from Next.js dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Models
class ItemCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float

class ItemResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    price: float
    created_at: str

class CalculationRequest(BaseModel):
    num1: float
    num2: float
    operation: str  # "add", "subtract", "multiply", "divide"

class CalculationResponse(BaseModel):
    result: float
    operation: str
    num1: float
    num2: float

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[Dict[str, str]]] = []

class ChatResponse(BaseModel):
    response: str

# In-memory storage for items (in production, use a database)
items_store: List[ItemResponse] = []
next_item_id = 1

# API Endpoints

@app.get("/api/status")
async def get_status():
    """Health check endpoint"""
    return {"status": "FastAPI is running"}

@app.post("/api/items", response_model=ItemResponse)
async def create_item(item: ItemCreate):
    """Create a new item"""
    global next_item_id
    new_item = ItemResponse(
        id=next_item_id,
        name=item.name,
        description=item.description,
        price=item.price,
        created_at=datetime.now().isoformat()
    )
    items_store.append(new_item)
    next_item_id += 1
    return new_item

@app.get("/api/items", response_model=List[ItemResponse])
async def get_items():
    """Get all items"""
    # Return mock items if store is empty
    if not items_store:
        return [
            ItemResponse(
                id=1,
                name="Sample Item 1",
                description="This is a sample item",
                price=19.99,
                created_at=datetime.now().isoformat()
            ),
            ItemResponse(
                id=2,
                name="Sample Item 2",
                description="Another sample item",
                price=29.99,
                created_at=datetime.now().isoformat()
            )
        ]
    return items_store

@app.post("/api/calculate", response_model=CalculationResponse)
async def calculate(request: CalculationRequest):
    """Perform a calculation operation"""
    operation = request.operation.lower()
    
    if operation == "add":
        result = request.num1 + request.num2
    elif operation == "subtract":
        result = request.num1 - request.num2
    elif operation == "multiply":
        result = request.num1 * request.num2
    elif operation == "divide":
        if request.num2 == 0:
            raise ValueError("Division by zero is not allowed")
        result = request.num1 / request.num2
    else:
        raise ValueError(f"Unsupported operation: {operation}. Use 'add', 'subtract', 'multiply', or 'divide'")
    
    return CalculationResponse(
        result=result,
        operation=operation,
        num1=request.num1,
        num2=request.num2
    )

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Chat endpoint using Groq API"""
    groq_api_key = os.getenv("GROQ_API_KEY")
    
    if not groq_api_key:
        raise HTTPException(
            status_code=500,
            detail="GROQ_API_KEY environment variable is not set. Please set it in your .env file."
        )
    
    try:
        client = Groq(api_key=groq_api_key)
        
        # Build conversation history
        messages = []
        
        # Add conversation history if provided
        for msg in request.conversation_history:
            messages.append({
                "role": msg.get("role", "user"),
                "content": msg.get("content", "")
            })
        
        # Add the current message
        messages.append({
            "role": "user",
            "content": request.message
        })
        
        # Call Groq API
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",  # Fast and efficient model
            messages=messages,
            temperature=0.7,
            max_tokens=1024,
            top_p=1,
            stream=False,
        )
        
        response_content = completion.choices[0].message.content
        
        return ChatResponse(response=response_content)
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error calling Groq API: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

