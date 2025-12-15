# Quick Start Guide

## Running the Application

You need **two terminal windows** - one for the backend and one for the frontend.

---

## 🐍 Backend (Terminal 1)

### Option A: Quick Setup (Recommended for first time)

```bash
# Navigate to backend directory
cd FullStackApp/backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
```

### Option B: Using the run script (after first setup)

```bash
cd backend
source venv/bin/activate  # Only needed if not already activated
./run.sh
```

**You should see:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

✅ Backend is running at: `http://localhost:8000`  
📖 API Docs available at: `http://localhost:8000/docs`

**Keep this terminal open!**

---

## ⚛️ Frontend (Terminal 2 - NEW TERMINAL)

Open a **new terminal window** and run:

```bash
# Navigate to frontend directory
cd FullStackApp/frontend

# Install dependencies (only needed the first time)
npm install

# Run the development server
npm run dev
```

**You should see:**
```
✓ Ready in X ms
○ Local:        http://localhost:3000
```

✅ Frontend is running at: `http://localhost:3000`

**Keep this terminal open!**

---

## 🌐 Access the Application

1. Open your browser and go to: **http://localhost:3000**
2. You should see:
   - The homepage with backend status (fetched from server component)
   - A form to create items (client component)

---

## 🛑 Stopping the Servers

- Press `Ctrl + C` in each terminal to stop the servers
- To deactivate the Python virtual environment: `deactivate`

---

## ✅ Verify Everything Works

1. **Backend Health Check:**
   - Visit: http://localhost:8000/api/status
   - Should return: `{"status":"FastAPI is running"}`

2. **API Documentation:**
   - Visit: http://localhost:8000/docs
   - Interactive API testing interface

3. **Frontend:**
   - Visit: http://localhost:3000
   - Should show the backend status
   - Try creating an item using the form

---

## 🔧 Troubleshooting

### Backend Issues:

- **Port 8000 already in use:**
  ```bash
  # Find and kill the process
  lsof -ti:8000 | xargs kill -9
  ```

- **Module not found errors:**
  ```bash
  # Make sure virtual environment is activated
  source venv/bin/activate
  pip install -r requirements.txt
  ```

### Frontend Issues:

- **Port 3000 already in use:**
  - Next.js will automatically use the next available port (3001, 3002, etc.)

- **Module not found errors:**
  ```bash
  # Delete node_modules and reinstall
  rm -rf node_modules package-lock.json
  npm install
  ```

### Connection Issues:

- Make sure both servers are running
- Check that backend is on port 8000 and frontend can access it
- Verify CORS is working (check browser console for errors)

