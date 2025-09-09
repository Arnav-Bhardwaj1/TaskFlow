import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  Target,
  BarChart3
} from 'lucide-react';
import { useTask } from '../../contexts/TaskContext';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const Dashboard = () => {
  const { tasks, loading } = useTask();
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
    overdue: 0,
    urgent: 0,
    high: 0,
  });

  useEffect(() => {
    if (tasks.length > 0) {
      const taskStats = {
        total: tasks.length,
        completed: tasks.filter(task => task.status === 'completed').length,
        pending: tasks.filter(task => task.status === 'pending').length,
        inProgress: tasks.filter(task => task.status === 'in-progress').length,
        overdue: tasks.filter(task => {
          if (task.status === 'completed' || !task.dueDate) return false;
          return new Date(task.dueDate) < new Date();
        }).length,
        urgent: tasks.filter(task => task.priority === 'urgent').length,
        high: tasks.filter(task => task.priority === 'high').length,
      };
      setStats(taskStats);
    }
  }, [tasks]);

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${change > 0 ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`}>
              {change > 0 ? '+' : ''}{change}% from last week
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const RecentTask = ({ task }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 hover:shadow-sm transition-shadow"
    >
      <div className="flex items-center space-x-3">
        <div className={`w-3 h-3 rounded-full ${
          task.priority === 'urgent' ? 'bg-danger-500' :
          task.priority === 'high' ? 'bg-warning-500' :
          task.priority === 'medium' ? 'bg-primary-500' : 'bg-gray-400'
        }`} />
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">{task.title}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Due {task.dueDate ? format(new Date(task.dueDate), 'MMM dd') : 'No due date'}
          </p>
        </div>
      </div>
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
        task.status === 'completed' ? 'bg-success-100 dark:bg-success-900 text-success-800 dark:text-success-200' :
        task.status === 'in-progress' ? 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200' :
        task.status === 'pending' ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
      }`}>
        {task.status.replace('-', ' ')}
      </span>
    </motion.div>
  );

  const QuickAction = ({ title, description, icon: Icon, href, color }) => (
    <Link
      to={href}
      className="group block p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-primary-200 dark:hover:border-primary-600 transition-all"
    >
      <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </Link>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Welcome back! Here's what's happening with your tasks today.
          </p>
        </div>
        <Link
          to="/tasks/new"
          className="btn-primary inline-flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Task
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tasks"
          value={stats.total}
          icon={BarChart3}
          color="bg-primary-500"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle}
          color="bg-success-500"
          change={stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon={Clock}
          color="bg-warning-500"
        />
        <StatCard
          title="Overdue"
          value={stats.overdue}
          icon={AlertTriangle}
          color="bg-danger-500"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tasks */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Tasks</h2>
              <Link
                to="/tasks"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
              >
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {tasks.slice(0, 5).map((task, index) => (
                <RecentTask key={task._id} task={task} />
              ))}
              {tasks.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                  <p>No tasks yet. Create your first task to get started!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions & Priority Tasks */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <QuickAction
                title="Create Task"
                description="Add a new task to your list"
                icon={Plus}
                href="/tasks/new"
                color="bg-primary-500"
              />
              <QuickAction
                title="View Calendar"
                description="See your tasks in calendar view"
                icon={Calendar}
                href="/tasks"
                color="bg-success-500"
              />
              <QuickAction
                title="Set Goals"
                description="Define your weekly objectives"
                icon={Target}
                href="/tasks"
                color="bg-warning-500"
              />
            </div>
          </div>

          {/* Priority Tasks */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Priority Tasks</h3>
            <div className="space-y-3">
              {tasks
                .filter(task => task.priority === 'urgent' || task.priority === 'high')
                .slice(0, 3)
                .map((task) => (
                  <div key={task._id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      task.priority === 'urgent' ? 'bg-danger-500' : 'bg-warning-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{task.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Due {task.dueDate ? format(new Date(task.dueDate), 'MMM dd') : 'No due date'}
                      </p>
                    </div>
                  </div>
                ))}
              {tasks.filter(task => task.priority === 'urgent' || task.priority === 'high').length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No priority tasks at the moment
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Progress Overview</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <TrendingUp className="w-4 h-4" />
            <span>This week</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Completion Rate</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning-600 dark:text-warning-400 mb-2">
              {stats.overdue}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Overdue Tasks</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success-600 dark:text-success-400 mb-2">
              {stats.urgent + stats.high}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">High Priority</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

