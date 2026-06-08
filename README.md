# 🚀 TaskForge

TaskForge is a modern project management and team collaboration platform built to help teams organize projects, manage tasks, track progress, and collaborate efficiently.

## 🌐 Live Demo

- Frontend:https://taskforge-system-hazel.vercel.app
- Backend API: https://taskforge-system-backend-system-xc4.vercel.app/api/health

## 📌 Overview

TaskForge provides a complete workspace for managing projects and tasks. Team members can collaborate through project boards, task assignments, comments, activity tracking, and real-time updates.

Whether you're working alone or with a team, TaskForge helps keep everything organized in one place.

---

## ✨ Features

### 🔐 Authentication & Security
- Secure JWT Authentication
- Password Hashing with Bcrypt
- Protected Routes
- Role-Based Access Control

### 📁 Project Management
- Create, Update, and Delete Projects
- Project Team Management
- Project Progress Tracking
- Project Activity History

### ✅ Task Management
- Create, Edit, and Delete Tasks
- Task Assignment
- Due Dates & Priorities
- Status Tracking

### 📋 Kanban Board
- Drag & Drop Tasks
- Todo → In Progress → Completed Workflow
- Real-Time UI Updates

### 👥 Team Collaboration
- Add Team Members
- Task Discussions & Comments
- Activity Logs
- Notifications

### 📊 Dashboard & Analytics
- Project Statistics
- Task Overview
- Recent Activities
- Performance Insights

### 🎨 User Experience
- Fully Responsive Design
- Dark / Light Mode
- Modern UI
- Fast & Optimized Performance

---

## 🛠️ Tech Stack

### Frontend
- Next.js 15
- React 19
- Redux Toolkit
- RTK Query
- Tailwind CSS v4
- React Hook Form
- Recharts
- Lucide React
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt

### Deployment
- Vercel
- Railway / Render
- MongoDB Atlas

---

## 📂 Project Structure

```bash
taskforge/
│
├── client/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── hooks/
│   │   └── utils/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (.env)

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://://localhost:5000/api
```

---

## 🚀 Getting Started

### Clone Repository

```bash
git clone https://github.com/yeasinrahman26/Project-collaboration-system

cd taskforge
```

### Backend Setup

```bash
cd server

npm install

npm run dev
```

Backend runs on:

```bash
http://localhost:5001
```

### Frontend Setup

```bash
cd client

npm install

npm run dev
```

Frontend runs on:

```bash
http://localhost:3000
```

---

## 🔑 Demo Credentials

```text
Email: admin@demo.com
Password: password123
```

---

## 📡 API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
```

### Projects

```http
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id
```

### Tasks

```http
GET    /api/tasks
POST   /api/tasks
GET    /api/tasks/:id
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

### Comments

```http
GET    /api/comments/:taskId
POST   /api/comments
DELETE /api/comments/:id
```

---

## 📈 Future Improvements

- Real-Time Collaboration
- WebSocket Integration
- File Uploads
- Team Chat
- Advanced Analytics
- Calendar View
- Mobile Application
- Custom Workflows

---

## 🧪 Testing

```bash
# Backend
npm run test

# Frontend
npm run test
```

---

## 🚀 Deployment

### Frontend

Deploy on Vercel:

```bash
vercel
```

### Backend

Deploy on Railway, Render, or VPS.

---

## 🤝 Contributing

Contributions are welcome.

```bash
Fork the repository

Create a feature branch

Commit your changes

Push to your branch

Create a Pull Request
```

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Built by **Yeasin Rahman Safa**

If you found this project useful, consider giving it a ⭐ on GitHub.