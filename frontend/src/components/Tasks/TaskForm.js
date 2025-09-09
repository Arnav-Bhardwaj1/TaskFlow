import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { 
  Save, 
  X, 
  Calendar, 
  Clock, 
  Tag, 
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { useTask } from '../../contexts/TaskContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createTask, updateTask, tasks } = useTask();
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  const isEditing = Boolean(id);
  const currentTask = isEditing ? tasks.find(task => task._id === id) : null;

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      status: 'pending',
      dueDate: '',
      estimatedTime: '',
      tags: []
    }
  });

  const watchedPriority = watch('priority');

  useEffect(() => {
    if (currentTask) {
      reset({
        title: currentTask.title || '',
        description: currentTask.description || '',
        priority: currentTask.priority || 'medium',
        status: currentTask.status || 'pending',
        dueDate: currentTask.dueDate ? new Date(currentTask.dueDate).toISOString().split('T')[0] : '',
        estimatedTime: currentTask.estimatedTime || '',
        tags: currentTask.tags || []
      });
      setTags(currentTask.tags || []);
    }
  }, [currentTask, reset]);

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      setValue('tags', newTags);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    setValue('tags', newTags);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (isEditing) {
        await updateTask(id, data);
        toast.success('Task updated successfully!');
      } else {
        await createTask(data);
        toast.success('Task created successfully!');
      }
      navigate('/tasks');
    } catch (error) {
      toast.error(isEditing ? 'Failed to update task' : 'Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-danger-100 dark:bg-danger-900 text-danger-800 dark:text-danger-200 border-danger-200 dark:border-danger-700';
      case 'high': return 'bg-warning-100 dark:bg-warning-900 text-warning-800 dark:text-warning-200 border-warning-200 dark:border-warning-700';
      case 'medium': return 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 border-primary-200 dark:border-primary-700';
      case 'low': return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/tasks')}
            className="btn-outline p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Edit Task' : 'Create New Task'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {isEditing ? 'Update your task details' : 'Add a new task to your list'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Task Title *
            </label>
            <input
              {...register('title', {
                required: 'Task title is required',
                maxLength: {
                  value: 100,
                  message: 'Title cannot exceed 100 characters'
                }
              })}
              type="text"
              id="title"
              className="input w-full"
              placeholder="Enter task title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              {...register('description', {
                maxLength: {
                  value: 500,
                  message: 'Description cannot exceed 500 characters'
                }
              })}
              id="description"
              rows={4}
              className="input w-full resize-none"
              placeholder="Describe your task (optional)"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{errors.description.message}</p>
            )}
          </div>

          {/* Priority and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-4 gap-2">
                    {['low', 'medium', 'high', 'urgent'].map((priority) => (
                      <button
                        key={priority}
                        type="button"
                        onClick={() => field.onChange(priority)}
                        className={`p-3 text-center rounded-lg border-2 transition-all ${
                          field.value === priority
                            ? getPriorityColor(priority)
                            : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                      >
                        <span className="text-xs font-medium capitalize">{priority}</span>
                      </button>
                    ))}
                  </div>
                )}
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                {...register('status')}
                className="input w-full"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Due Date and Estimated Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Due Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  {...register('dueDate')}
                  type="date"
                  id="dueDate"
                  className="input w-full pl-10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="estimatedTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Estimated Time (minutes)
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  {...register('estimatedTime', {
                    min: {
                      value: 0,
                      message: 'Time cannot be negative'
                    }
                  })}
                  type="number"
                  id="estimatedTime"
                  min="0"
                  className="input w-full pl-10"
                  placeholder="0"
                />
              </div>
              {errors.estimatedTime && (
                <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{errors.estimatedTime.message}</p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags
            </label>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="input w-full pl-10 pr-20"
                    placeholder="Add a tag"
                  />
                </div>
                <button
                  type="button"
                  onClick={addTag}
                  className="btn-primary px-4"
                >
                  Add
                </button>
              </div>
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-sm rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 hover:text-primary-600 dark:hover:text-primary-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Priority Warning */}
          {watchedPriority === 'urgent' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-3 p-4 bg-danger-50 border border-danger-200 rounded-lg"
            >
              <AlertTriangle className="w-5 h-5 text-danger-600" />
              <span className="text-sm text-danger-800">
                This task is marked as urgent. Please ensure it's completed on time.
              </span>
            </motion.div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/tasks')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>{isEditing ? 'Update Task' : 'Create Task'}</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default TaskForm;

