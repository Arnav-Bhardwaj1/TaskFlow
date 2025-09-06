# TaskFlow - Task Management Web App

A modern, full-stack task management web application with exceptional UI/UX, built with React, Node.js, and MongoDB.

## ✨ Features

- **User Authentication**: Secure registration, login, and logout with JWT
- **Task Management**: Full CRUD operations for tasks
- **Advanced Filtering**: Filter tasks by status, priority, and search
- **Smart Sorting**: Sort tasks by various criteria
- **Responsive Design**: Beautiful UI that works on all devices
- **Real-time Updates**: Instant task updates and notifications
- **Task Statistics**: Comprehensive dashboard with insights
- **Priority Management**: Urgent, high, medium, and low priority levels
- **Due Date Tracking**: Never miss a deadline again
- **Tag System**: Organize tasks with custom tags

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **React Query** - Server state management
- **React Hook Form** - Form handling and validation
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn package manager

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd task-management-web-app
```

### 2. Install dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/task-manager

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000
```

### 4. Start MongoDB
Make sure MongoDB is running on your system or use MongoDB Atlas.

### 5. Run the application
```bash
# Development mode (runs both frontend and backend)
npm run dev

# Or run separately:
# Backend only
npm run server

# Frontend only
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

## 📱 Usage

### 1. Create Account
- Navigate to `/register`
- Fill in your details
- Create your account

### 2. Login
- Use your email and password to login
- You'll be redirected to the dashboard

### 3. Manage Tasks
- **Create**: Click "New Task" to add tasks
- **View**: See all tasks in the tasks list
- **Edit**: Click on any task to modify it
- **Delete**: Remove tasks you no longer need
- **Filter**: Use filters to find specific tasks
- **Sort**: Organize tasks by different criteria

### 4. Dashboard
- View task statistics
- See recent tasks
- Monitor progress
- Quick actions

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Tasks
- `GET /api/tasks` - Get all tasks (with filters)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get specific task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/status` - Update task status
- `GET /api/tasks/stats/overview` - Get task statistics

## 🎨 UI Components

- **Responsive Layout**: Works on all screen sizes
- **Modern Design**: Clean, intuitive interface
- **Smooth Animations**: Framer Motion powered transitions
- **Interactive Elements**: Hover effects and micro-interactions
- **Color-coded Priority**: Visual priority indicators
- **Status Badges**: Clear task status representation

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet Friendly**: Responsive grid layouts
- **Desktop Optimized**: Full-featured desktop experience
- **Touch Friendly**: Optimized for touch interactions

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt password encryption
- **Input Validation**: Server-side validation
- **CORS Protection**: Cross-origin request security
- **Helmet Security**: HTTP header security

## 🚀 Deployment

### Backend (Heroku)
1. Create a Heroku app
2. Set environment variables
3. Deploy using Git:
```bash
git push heroku main
```

### Frontend (Netlify)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `client/build`
4. Deploy automatically on push

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify MongoDB connection
3. Check environment variables
4. Open an issue on GitHub

## 🔮 Future Enhancements

- [ ] Real-time collaboration
- [ ] File attachments
- [ ] Calendar integration
- [ ] Email notifications
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Team management
- [ ] Time tracking


