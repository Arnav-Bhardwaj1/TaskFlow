import React, { createContext, useContext, useReducer } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import api from '../services/api';

// Action types
const TASK_ACTIONS = {
  SET_TASKS: 'SET_TASKS',
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',
  SET_FILTERS: 'SET_FILTERS',
  SET_SORT: 'SET_SORT',
  SET_SEARCH: 'SET_SEARCH',
  SET_PAGINATION: 'SET_PAGINATION',
};

// Initial state
const initialState = {
  tasks: [],
  filters: {
    status: '',
    priority: '',
  },
  sort: {
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  search: '',
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalTasks: 0,
    hasNext: false,
    hasPrev: false,
  },
};

// Reducer
const taskReducer = (state, action) => {
  switch (action.type) {
    case TASK_ACTIONS.SET_TASKS:
      return { ...state, tasks: action.payload };
    case TASK_ACTIONS.ADD_TASK:
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case TASK_ACTIONS.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task._id === action.payload._id ? action.payload : task
        ),
      };
    case TASK_ACTIONS.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(task => task._id !== action.payload),
      };
    case TASK_ACTIONS.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case TASK_ACTIONS.SET_SORT:
      return { ...state, sort: { ...state.sort, ...action.payload } };
    case TASK_ACTIONS.SET_SEARCH:
      return { ...state, search: action.payload };
    case TASK_ACTIONS.SET_PAGINATION:
      return { ...state, pagination: { ...state.pagination, ...action.payload } };
    default:
      return state;
  }
};

// Create context
const TaskContext = createContext();

// Task Provider Component
export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const queryClient = useQueryClient();

  // Fetch tasks with filters, sorting, and pagination
  const fetchTasks = async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add filters
    if (state.filters.status) queryParams.append('status', state.filters.status);
    if (state.filters.priority) queryParams.append('priority', state.filters.priority);
    
    // Add sorting
    queryParams.append('sortBy', state.sort.sortBy);
    queryParams.append('sortOrder', state.sort.sortOrder);
    
    // Add search
    if (state.search) queryParams.append('search', state.search);
    
    // Add pagination
    queryParams.append('page', state.pagination.currentPage);
    queryParams.append('limit', 20);
    
    const response = await api.get(`/api/tasks?${queryParams.toString()}`);
    return response.data;
  };

  // Use React Query for tasks
  const {
    data: tasksData,
    isLoading: tasksLoading,
    error: tasksError,
    refetch: refetchTasks,
  } = useQuery(
    ['tasks', state.filters, state.sort, state.search, state.pagination.currentPage],
    fetchTasks,
    {
      keepPreviousData: true,
      onSuccess: (data) => {
        dispatch({ type: TASK_ACTIONS.SET_TASKS, payload: data.tasks });
        dispatch({ type: TASK_ACTIONS.SET_PAGINATION, payload: data.pagination });
      },
    }
  );

  // Create task mutation
  const createTaskMutation = useMutation(
    (taskData) => api.post('/api/tasks', taskData),
    {
      onSuccess: (response) => {
        const newTask = response.data.task;
        dispatch({ type: TASK_ACTIONS.ADD_TASK, payload: newTask });
        queryClient.invalidateQueries(['tasks']);
        toast.success('Task created successfully!');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to create task';
        toast.error(message);
      },
    }
  );

  // Update task mutation
  const updateTaskMutation = useMutation(
    ({ id, taskData }) => api.put(`/api/tasks/${id}`, taskData),
    {
      onSuccess: (response) => {
        const updatedTask = response.data.task;
        dispatch({ type: TASK_ACTIONS.UPDATE_TASK, payload: updatedTask });
        queryClient.invalidateQueries(['tasks']);
        toast.success('Task updated successfully!');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to update task';
        toast.error(message);
      },
    }
  );

  // Delete task mutation
  const deleteTaskMutation = useMutation(
    (taskId) => api.delete(`/api/tasks/${taskId}`),
    {
      onSuccess: (_, taskId) => {
        dispatch({ type: TASK_ACTIONS.DELETE_TASK, payload: taskId });
        queryClient.invalidateQueries(['tasks']);
        toast.success('Task deleted successfully!');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to delete task';
        toast.error(message);
      },
    }
  );

  // Update task status mutation
  const updateTaskStatusMutation = useMutation(
    ({ id, status }) => api.patch(`/api/tasks/${id}/status`, { status }),
    {
      onSuccess: (response) => {
        const updatedTask = response.data.task;
        dispatch({ type: TASK_ACTIONS.UPDATE_TASK, payload: updatedTask });
        queryClient.invalidateQueries(['tasks']);
        toast.success('Task status updated!');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to update task status';
        toast.error(message);
      },
    }
  );

  // Action functions
  const createTask = (taskData) => {
    return createTaskMutation.mutateAsync(taskData);
  };

  const updateTask = (id, taskData) => {
    return updateTaskMutation.mutateAsync({ id, taskData });
  };

  const deleteTask = (taskId) => {
    return deleteTaskMutation.mutateAsync(taskId);
  };

  const updateTaskStatus = (id, status) => {
    return updateTaskStatusMutation.mutateAsync({ id, status });
  };

  const setFilters = (filters) => {
    dispatch({ type: TASK_ACTIONS.SET_FILTERS, payload: filters });
    dispatch({ type: TASK_ACTIONS.SET_PAGINATION, payload: { currentPage: 1 } });
  };

  const setSort = (sort) => {
    dispatch({ type: TASK_ACTIONS.SET_SORT, payload: sort });
    dispatch({ type: TASK_ACTIONS.SET_PAGINATION, payload: { currentPage: 1 } });
  };

  const setSearch = (search) => {
    dispatch({ type: TASK_ACTIONS.SET_SEARCH, payload: search });
    dispatch({ type: TASK_ACTIONS.SET_PAGINATION, payload: { currentPage: 1 } });
  };

  const setPage = (page) => {
    dispatch({ type: TASK_ACTIONS.SET_PAGINATION, payload: { currentPage: page } });
  };

  const clearFilters = () => {
    dispatch({ type: TASK_ACTIONS.SET_FILTERS, payload: { status: '', priority: '' } });
    dispatch({ type: TASK_ACTIONS.SET_SEARCH, payload: '' });
    dispatch({ type: TASK_ACTIONS.SET_PAGINATION, payload: { currentPage: 1 } });
  };

  // Context value
  const value = {
    ...state,
    tasks: state.tasks,
    filters: state.filters,
    sort: state.sort,
    search: state.search,
    pagination: state.pagination,
    loading: tasksLoading,
    error: tasksError,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    setFilters,
    setSort,
    setSearch,
    setPage,
    clearFilters,
    refetchTasks,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook to use task context
export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

