import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  SortAsc, 
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useTask } from '../../contexts/TaskContext';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

const TaskList = () => {
  const { 
    tasks, 
    loading, 
    filters, 
    sort, 
    search, 
    pagination,
    setFilters, 
    setSort, 
    setSearch, 
    setPage,
    clearFilters,
    deleteTask,
    updateTaskStatus
  } = useTask();

  const [showFilters, setShowFilters] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-danger-100 dark:bg-danger-900 text-danger-800 dark:text-danger-200';
      case 'high': return 'bg-warning-100 dark:bg-warning-900 text-warning-800 dark:text-warning-200';
      case 'medium': return 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200';
      case 'low': return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-success-100 dark:bg-success-900 text-success-800 dark:text-success-200';
      case 'in-progress': return 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200';
      case 'pending': return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
      case 'cancelled': return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const TaskCard = ({ task }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{task.title}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
              {task.status.replace('-', ' ')}
            </span>
          </div>
          
          {task.description && (
            <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{task.description}</p>
          )}
          
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
            {task.dueDate && (
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Due {format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
              </div>
            )}
            {task.estimatedTime && (
              <span>Est. {task.estimatedTime} min</span>
            )}
          </div>
          
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {task.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(task._id, e.target.value)}
            className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <div className="relative">
            <button
              onClick={() => setSelectedTask(selectedTask === task._id ? null : task._id)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
            
            {selectedTask === task._id && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                <Link
                  to={`/tasks/${task._id}/edit`}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </Link>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left rounded-b-lg"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tasks</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage and organize your tasks efficiently
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

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-outline inline-flex items-center"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
            
            <select
              value={`${sort.sortBy}-${sort.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                setSort({ sortBy, sortOrder });
              }}
              className="input"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="dueDate-asc">Due Date (Earliest)</option>
              <option value="dueDate-desc">Due Date (Latest)</option>
              <option value="priority-desc">Priority (High to Low)</option>
              <option value="priority-asc">Priority (Low to High)</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
            </select>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ status: e.target.value })}
                    className="input"
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={filters.priority}
                    onChange={(e) => setFilters({ priority: e.target.value })}
                    className="input"
                  >
                    <option value="">All Priorities</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="btn-outline w-full"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Task Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          {pagination.totalTasks} task{pagination.totalTasks !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence>
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </AnimatePresence>
        
        {tasks.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500 mb-6">
              {search || Object.values(filters).some(f => f) 
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first task'
              }
            </p>
            {!search && !Object.values(filters).some(f => f) && (
              <Link
                to="/tasks/new"
                className="btn-primary inline-flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Task
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setPage(pagination.currentPage - 1)}
            disabled={!pagination.hasPrev}
            className="btn-outline px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <span className="text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          <button
            onClick={() => setPage(pagination.currentPage + 1)}
            disabled={!pagination.hasNext}
            className="btn-outline px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskList;

