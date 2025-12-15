# AI Chatbot Setup Guide

This guide will help you set up and use the AI Chatbot feature powered by Groq API with the beautiful LiquidGlass UI.

## Features

✨ **LiquidGlass UI Component**
- Pill-shaped design with red-to-green gradient tint (opacity: 0.3)
- Refraction effects with depth-of-field simulation
- Smooth animations and interactive hover effects
- Samples and distorts the parent container's live background

🤖 **Groq API Integration**
- Fast and efficient AI responses using Llama 3.1 8B Instant model
- Conversation history support for context-aware responses
- Error handling and loading states

## Setup Instructions

### 1. Get a Groq API Key

1. Visit [Groq Console](https://console.groq.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the API key (you'll need it in the next step)

### 2. Configure Backend Environment

Create or update the `.env` file in the `backend/` directory:

```bash
cd FullStackApp/backend
```

Create/Edit `.env` file:
```env
PORT=8000
API_URL=http://localhost:8000
GROQ_API_KEY=your_groq_api_key_here
```

Replace `your_groq_api_key_here` with your actual Groq API key.

### 3. Install Backend Dependencies

If you haven't already, install the updated requirements:

```bash
pip install -r requirements.txt
```

This will install:
- `groq` - Groq API client
- `python-dotenv` - Environment variable management

### 4. Start the Backend Server

```bash
# Make sure you're in the backend directory
cd FullStackApp/backend

# Activate virtual environment (if using one)
source venv/bin/activate

# Run the server
uvicorn main:app --reload --port 8000
```

### 5. Start the Frontend Server

In a new terminal:

```bash
cd FullStackApp/frontend
npm install  # If you haven't already
npm run dev
```

### 6. Access the Chatbot

Open your browser and navigate to:
```
http://localhost:3000/chat
```

## API Endpoint

### POST `/api/chat`

**Request Body:**
```json
{
  "message": "Hello, how are you?",
  "conversation_history": [
    {
      "role": "user",
      "content": "Previous message"
    },
    {
      "role": "assistant",
      "content": "Previous response"
    }
  ]
}
```

**Response:**
```json
{
  "response": "Hello! I'm doing well, thank you for asking. How can I help you today?"
}
```

## LiquidGlass Component Specifications

The LiquidGlass component implements:

- **Shape**: Pill-shaped (fully rounded)
- **Opacity**: 0.3
- **Gradient**: `linear-gradient(to right, #ff0000, #00ff00)` (red to green)
- **Refraction**: 
  - Depth: 10
  - Intensity: 0.5
  - Samples parent container's live background
  - Distorts background with depth-of-field effect

## Troubleshooting

### "GROQ_API_KEY environment variable is not set"

- Make sure you've created a `.env` file in the `backend/` directory
- Verify the API key is correctly set in the `.env` file
- Restart the backend server after creating/updating the `.env` file
- Make sure `python-dotenv` is installed

### API Errors

- Check your Groq API key is valid
- Verify you have API credits/quota available
- Check the backend logs for detailed error messages

### Frontend Not Connecting

- Ensure the backend server is running on port 8000
- Check that CORS is properly configured
- Verify `NEXT_PUBLIC_API_URL` in frontend `.env.local` matches your backend URL

## Customization

### Change AI Model

Edit `backend/main.py` and modify the model parameter:

```python
completion = client.chat.completions.create(
    model="llama-3.1-70b-versatile",  # Change this
    messages=messages,
    ...
)
```

Available models:
- `llama-3.1-8b-instant` (fast, efficient)
- `llama-3.1-70b-versatile` (more capable)
- `mixtral-8x7b-32768` (alternative)

### Adjust LiquidGlass Appearance

Edit `frontend/components/LiquidGlass.tsx` to customize:
- Gradient colors
- Opacity levels
- Refraction depth and intensity
- Animation speeds

## Enjoy!

Your AI chatbot is now ready to use with beautiful animations and smooth interactions! 🚀


