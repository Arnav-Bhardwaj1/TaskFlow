# TaskFlow - Task Management Web App

A modern, responsive task management web app built with React frontend and Node.js backend, featuring secure authentication, real-time task updates, and a powerful dashboard for productivity insights.

## Features

* **Modern UI/UX** - Clean, responsive design with smooth animations
* **User Authentication** - Registration, login, and logout with JWT
* **Task Management** - Create, read, update, and delete tasks
* **Advanced Filtering & Sorting** - Search, filter by status/priority, and sort tasks
* **Dashboard & Insights** - Task statistics, progress monitoring, and quick actions
* **Priority Management** - Urgent, high, medium, and low priority levels
* **Due Date Tracking** - Stay on top of deadlines
* **Tag System** - Organize tasks with custom tags
* **Real-time Updates** - Instant updates and notifications

## Tech Stack

### Frontend

* React 18
* Tailwind CSS for styling
* Framer Motion for animations
* React Router for navigation
* React Query for state management
* React Hook Form for forms
* Lucide React for icons

### Backend

* Node.js with Express
* MongoDB with Mongoose
* JWT for authentication
* Bcrypt for password hashing
* Express Validator for validation

### Prerequisites

* Node.js (v16 or higher)
* MongoDB (local or Atlas)
* Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd task-management-web-app
   ```

2. **Install dependencies**

   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

3. **Environment Setup**

   ```bash
   # Create a .env file in the root directory
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/task-manager
   JWT_SECRET=your-super-secret-jwt-key
   CLIENT_URL=http://localhost:3000
   ```

4. **Start the application**

   ```bash
   # Development (frontend + backend)
   npm run dev

   # Backend only
   npm run server

   # Frontend only (inside client directory)
   npm run client
   ```

## Project Structure

```
task-management-web-app/
├── backend/                # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Auth & validation middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   └── server.js           # Main server file
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── context/        # React context
│   │   └── services/       # API services
│   └── public/             # Static assets
└── README.md
```

## API Endpoints

### Authentication

* `POST /api/auth/register` - User registration
* `POST /api/auth/login` - User login
* `GET /api/auth/profile` - Get current user profile
* `PUT /api/auth/profile` - Update profile

### Tasks

* `GET /api/tasks` - Get all tasks
* `GET /api/tasks/:id` - Get single task
* `POST /api/tasks` - Create task
* `PUT /api/tasks/:id` - Update task
* `DELETE /api/tasks/:id` - Delete task
* `PATCH /api/tasks/:id/status` - Update status
* `GET /api/tasks/stats/overview` - Get task stats

## Deployment

* Backend: Deployed on **Heroku**
* Frontend: Deployed on **Netlify**

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.
