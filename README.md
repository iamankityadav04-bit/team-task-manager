<<<<<<< HEAD
# Team Task Manager

A complete MERN stack Team Task Manager with JWT authentication, role-based access control, project membership, task assignment, Kanban status updates, dashboard analytics, comments, filters, and dummy seed data.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Axios, React Router, dnd-kit, Recharts
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: JWT and bcrypt
- State: React Context API

## Features

- Signup, login, logout, persisted JWT session
- Admin and Member roles
- Admins can create/update/delete projects and tasks
- Members can view assigned projects/tasks and update only their assigned task status
- Dashboard stats with project count, task count, completed, pending, overdue, priority, and status analytics
- Drag-and-drop Kanban board with API persistence
- Search tasks and filter by status, priority, and project
- Project member management
- Task comments, due date highlighting, empty states, loading states, responsive UI
- Seed script with demo users, projects, and tasks

## Folder Structure

```text
backend/
  config/
  controllers/
  middleware/
  models/
  routes/
  scripts/
  utils/
  validators/
  server.js

frontend/
  src/
    api/
    components/
    context/
    hooks/
    layouts/
    pages/
    routes/
    utils/
    App.jsx
```

## Setup

1. Install dependencies:

```bash
npm run install:all
```

2. Create environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Start MongoDB locally, or set `MONGO_URI` in `backend/.env` to your MongoDB Atlas connection string.

4. Seed dummy data:

```bash
npm run seed
```

5. Run the backend:

```bash
npm run dev:backend
```

6. Run the frontend in another terminal:

```bash
npm run dev:frontend
```

Frontend: `http://localhost:5173`  
Backend health check: `http://localhost:5000/api/health`

## Demo Accounts

After running the seed script:

```text
Admin
email: admin@example.com
password: password123

Member
email: maya@example.com
password: password123
```

## API Routes

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Projects

- `POST /api/projects` Admin
- `GET /api/projects`
- `GET /api/projects/:id`
- `PUT /api/projects/:id` Admin
- `DELETE /api/projects/:id` Admin

### Tasks

- `POST /api/tasks` Admin
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `PUT /api/tasks/:id` Admin
- `DELETE /api/tasks/:id` Admin
- `PATCH /api/tasks/:id/status` Admin or assigned member
- `POST /api/tasks/:id/comments`

### Dashboard

- `GET /api/dashboard/stats`

## Security Notes

- Passwords are hashed with bcrypt before persistence.
- JWTs are validated by protected route middleware.
- Admin-only actions use role authorization middleware.
- Request bodies and ObjectIds are validated before controller logic.
- Passwords are hidden from API responses.

For production, prefer short-lived access tokens with refresh tokens in secure HTTP-only cookies and add stricter CORS, logging, and secret rotation policies.
=======
# team-task-manager
>>>>>>> 2d7cc1cf28d2fc9e908e80f3ccd178d2dbe44236
