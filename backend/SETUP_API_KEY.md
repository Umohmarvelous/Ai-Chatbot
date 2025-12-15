# Setting Up Your Groq API Key

## Quick Steps

1. **Get your Groq API Key:**
   - Visit: https://console.groq.com/
   - Sign up or log in
   - Go to "API Keys" section
   - Create a new API key
   - Copy the key

2. **Add the API key to your .env file:**
   - Open the file: `backend/.env`
   - Replace `your_groq_api_key_here` with your actual API key
   - Save the file

3. **Restart your backend server:**
   - If the server is running, stop it (Ctrl+C)
   - Start it again: `uvicorn main:app --reload --port 8000`

## Example .env file

```
PORT=8000
API_URL=http://localhost:8000
GROQ_API_KEY=gsk_your_actual_api_key_here openai/gpt-oss-20b
```

## Important Notes

- Never commit your `.env` file to git (it's already in .gitignore)
- Keep your API key secret
- The API key should start with `gsk_` (Groq API key format)


