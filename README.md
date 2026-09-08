# 🚀 LeadFlow — Client Lead Management System

> A modern full-stack CRM built to help businesses capture, manage, track, and convert leads from a single powerful dashboard.

![MERN Stack](https://img.shields.io/badge/MERN-Stack-61DAFB?style=for-the-badge)
![React](https://img.shields.io/badge/React.js-20232A?style=for-the-badge\&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge\&logo=node.js\&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge\&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge\&logo=mongodb\&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge\&logo=tailwindcss\&logoColor=white)

---

## 📌 About The Project

**LeadFlow** is a full-stack Customer Relationship Management (CRM) application designed for businesses to efficiently manage their customer leads.

The system provides an organized workflow for capturing leads, monitoring their progress, scheduling follow-ups, adding notes, and tracking conversion performance through an interactive admin dashboard.

Instead of managing customer information across spreadsheets, messages, and scattered tools, LeadFlow provides a centralized platform for managing the complete lead lifecycle.

---

## ✨ Features

### 🔐 Authentication & Security

* Secure admin registration and login
* JWT-based authentication
* Protected routes
* Password hashing using bcrypt
* Persistent authentication using LocalStorage
* Secure API authorization with Bearer tokens

### 📊 Admin Dashboard

* Overview of total leads
* New leads tracking
* Contacted leads
* Converted/Won leads
* Conversion rate
* Recent leads overview
* Follow-up management

### 👥 Lead Management

* Create and manage leads
* View detailed lead information
* Edit lead information
* Track lead status
* Add notes to leads
* Monitor lead progression

### 🔄 Lead Lifecycle

LeadFlow supports a complete lead pipeline:

```text
NEW
 ↓
CONTACTED
 ↓
REPLIED
 ↓
INTERESTED
 ↓
MEETING SCHEDULED
 ↓
PROPOSAL SENT
 ↓
NEGOTIATION
 ↓
WON / LOST
```

### 📅 Follow-Up Management

* Schedule follow-ups
* View today's follow-ups
* View upcoming follow-ups
* Track pending customer interactions
* Organize follow-up activities

### 📈 Analytics

* Lead statistics
* Conversion tracking
* Lead status distribution
* Performance insights
* Advanced lead aggregation through MongoDB

### 🎨 Modern UI

* Responsive design
* Tailwind CSS
* Modern dashboard interface
* Light/Dark mode
* Interactive components
* Smooth transitions and animations
* Mobile-friendly layout

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router DOM
* Tailwind CSS
* Zustand
* Axios
* React Hook Form
* React Hot Toast
* Lucide React

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* REST APIs

### Development Tools

* Vite
* Git & GitHub
* Postman
* MongoDB Atlas

---

## 🏗️ Project Architecture

```text
LeadFlow/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── layouts/
│       ├── store/
│       ├── services/
│       ├── hooks/
│       ├── utils/
│       ├── App.jsx
│       └── main.jsx
│
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── utils/
│       └── server.js
│
└── README.md
```

---

## 🔑 Core Modules

### Authentication

Handles:

* Admin registration
* Login
* JWT generation
* Authentication middleware
* User session management

### Leads

Handles:

* Lead creation
* Lead retrieval
* Lead updates
* Lead status management
* Lead details
* Notes

### Follow-Ups

Handles:

* Scheduling follow-ups
* Today's follow-ups
* Upcoming follow-ups
* Follow-up tracking

### Analytics

Provides aggregated information about:

* Total leads
* Lead statuses
* Conversion rate
* Lead performance

---

## 🔌 API Structure

Example API structure:

```text
/api/auth
    ├── POST /register
    ├── POST /login
    └── GET  /me

/api/leads
    ├── GET    /
    ├── POST   /
    ├── GET    /:id
    ├── PUT    /:id
    ├── DELETE /:id
    └── GET    /advanced
```

Authentication-protected endpoints require:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

## ⚙️ Environment Variables

### Backend

Create a `.env` file inside the `backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

### Frontend

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

> Never commit `.env` files or other secrets to GitHub.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/leadflow.git

cd leadflow
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Backend Environment

Create your `.env` file and add your MongoDB connection string and JWT secret.

### 4. Start Backend

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

### 5. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

### 6. Start Frontend

```bash
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

---

## 🔒 Security

LeadFlow implements several security practices:

* JWT authentication
* bcrypt password hashing
* Protected API routes
* Authorization middleware
* Environment-based secrets
* Input validation
* Separation of frontend and backend responsibilities

---

## 📱 Responsive Design

The application is designed to work across:

* 💻 Desktop
* 💻 Laptop
* 📱 Tablet
* 📱 Mobile

---

## 🎯 Future Improvements

* Real-time notifications
* Email integration
* WhatsApp integration
* Advanced reporting
* Export leads to CSV/Excel
* Team member management
* Role-based permissions
* Automated follow-up reminders
* Lead assignment
* Activity timeline

---

## 🧠 What I Learned

Through this project, I gained practical experience in:

* Building a complete MERN application
* Designing RESTful APIs
* Implementing JWT authentication
* Working with MongoDB and Mongoose
* Managing global state with Zustand
* Building protected React routes
* Designing responsive dashboards
* Implementing CRUD operations
* Creating MongoDB aggregation pipelines
* Connecting frontend applications with backend APIs
* Structuring scalable full-stack applications

---

## 👨‍💻 Author

### Ayush Gaur

**B.Tech CSE | Full-Stack MERN Developer**

Interested in building modern, scalable and user-focused web applications.

---

## ⭐ Support

If you found this project interesting, consider giving the repository a ⭐ on GitHub.

---

> **LeadFlow — Capture. Track. Convert. 🚀**
