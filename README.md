# 🚀 Patles.ai — Autonomous AI Software Engineering Platform

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📌 Overview

**Patles.ai** is an **AI-powered full-stack development platform** that automates the entire software lifecycle:

- 🧠 Generate full-stack apps from natural language  
- 💻 Edit code in a Monaco (VS Code-like) workspace  
- 🤖 AI assistant for code understanding  
- 🔍 Automated code review & debugging  
- 🚀 Deployment readiness validation  
- 📊 GitHub repository intelligence & visualization  

---

## 🔄 Core Workflow


User Prompt → AI Generator → Workspace → AI Assistant
→ Code Review → Debugger → Deployment Check → Documentation


---

## ✨ Features

### 🧠 AI Project Generator
- Multi-stack support (React, Node, Python, etc.)
- Full production-ready code (no placeholders)
- API + DB consistency guaranteed

### 💻 Monaco Workspace
- VS Code-like editor in browser
- File tree, search, and editing
- Persistent project storage

### 🤖 AI Assistant
- Context-aware answers
- Explains codebase structure
- Clickable file references

### 🔍 AI Code Review
- Security checks (XSS, SQL Injection)
- Performance optimization
- Code quality analysis

### 🐞 AI Debugger
- Stack trace analysis
- Root-cause detection
- One-click code fixes (diff view)

### 🚀 Deployment Validator
- Checks Vercel, Netlify, Docker configs
- Environment validation
- Readiness scoring

### 📄 Documentation Generator
- README
- API docs
- Architecture diagrams
- Deployment guides

### 🔗 GitHub Intelligence
- Import repositories
- Detect tech stack
- Visual workflow graph

---

## 🛠 Tech Stack

| Layer       | Technology |
|------------|-----------|
| Frontend   | React 19, TypeScript |
| Backend    | Node.js, Express |
| Styling    | Tailwind CSS v4 |
| Editor     | Monaco Editor |
| AI Engine  | Gemini 3.8 Flash |
| Charts     | Recharts |
| Animation  | Framer Motion |

---

## 📂 Project Structure


src/
├── components/
├── pages/
├── context/
├── data/
├── layouts/
└── types/

server/
├── routes/
├── services/
└── db/


---

## ⚙️ Setup Guide

### 1️⃣ Clone Repo
```bash
git clone https://github.com/your-username/patles-ai.git
cd patles-ai
2️⃣ Install Dependencies
npm install
3️⃣ Configure Environment
cp .env.example .env

Edit .env:

GEMINI_API_KEY=your_api_key
PORT=3000
4️⃣ Run Dev Server
npm run dev

👉 Open: http://localhost:3000

5️⃣ Build Production
npm run build
npm start
📡 API Endpoints
Projects
Method	Endpoint
POST	/api/projects/generate
GET	/api/projects
GET	/api/projects/:id
GitHub
Method	Endpoint
POST	/api/github/import
GET	/api/github/repositories