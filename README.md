# 🕌 Prayer Time Application

A full-stack web app that displays daily prayer times.  
Built with **React (Vite)** on the frontend and **Node.js + Express** on the backend.

---

## 📂 Project Structure

prayer-time/
│── public/ # Static assets
│── src/ # React frontend
│ ├── assets/ # Images, icons, styles
│ ├── components/ # React components
│ ├── App.jsx # Main React component
│ ├── main.jsx # React entry point
│ ├── index.css # Global styles
│ └── App.css
│
│── server/ # Backend (Node.js + Express)
│ ├── models/ # Database models
│ ├── routes/ # API routes
│ └── index.js # Express app entry
│
│── .env # Environment variables
│── package.json # Project metadata + dependencies
│── vite.config.js # Vite configuration
│── eslint.config.js # ESLint rules
│── index.html # HTML template
└── README.md # Documentation

---

## 🚀 Features

- 📅 Fetch and display daily prayer times.  
- 🌙 Clean UI with **React + Vite**.  
- ⚡ Backend API powered by **Express**.  
- 🛡️ Environment variable support via `.env`.  

---

## 🔧 Dependencies

### Frontend
- [React](https://react.dev/)  
- [Vite](https://vitejs.dev/)  
- [Axios](https://axios-http.com/)  

### Backend
- [Express](https://expressjs.com/)  
- [Mongoose](https://mongoosejs.com/) *(if using MongoDB)*  
- [dotenv](https://github.com/motdotla/dotenv)  
- [cors](https://github.com/expressjs/cors)  

---

## ⚙️ Setup & Run

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/prayer-time.git
   cd prayer-time


npm install
Create a .env file in the root:

env
PORT=5000
MONGO_URI=your_mongo_connection_string
Start development servers (frontend + backend together)

bash
npm run dev
React app runs on: http://localhost:5173

Express API runs on: http://localhost:5000
