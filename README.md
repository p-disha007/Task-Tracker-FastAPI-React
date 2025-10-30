# Mini Task Tracker with Smart Insights

This is a full-stack application built with FastAPI (Python), React (JavaScript), and SQLite. It allows a user to manage tasks and get a "smart summary" of their workload.

## Project Structure

/
├── backend/
│   ├── app/
│   │   ├── init.py
│   │   ├── crud.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   └── schemas.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Insights.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   └── TaskList.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── DECLARATION.md
├── notes.md
└── README.md


## How to Run

You will need two terminals to run the backend and frontend servers.

1. Backend (FastAPI)

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload

Backend server will be running at: http://127.0.0.1:8000

Interactive API docs (Swagger): http://127.0.0.1:8000/docs

2. Frontend (React)
Note: Requires Node.js (v18+) and npm.

Bash
cd frontend
npm install
npm run dev
Frontend app will be running at: http://localhost:5173 (or the next available port)

Open http://localhost:5173 in your browser to use the app. 