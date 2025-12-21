import axios from 'axios';

// Base URL for API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me')
};

// Profile API calls
export const profileAPI = {
  createProfile: (profileData) => api.post('/profile', profileData),
  getMyProfile: () => api.get('/profile/me'),
  checkProfile: () => api.get('/profile/check'),
  deleteProfile: () => api.delete('/profile')
};

// Workout API calls
export const workoutAPI = {
  generateWorkout: () => api.post('/workouts/generate'),
  getWorkouts: () => api.get('/workouts'),
  getActiveWorkout: () => api.get('/workouts/active'),
  getWorkoutById: (id) => api.get(`/workouts/${id}`),
  deleteWorkout: (id) => api.delete(`/workouts/${id}`)
};

// Progress API calls
export const progressAPI = {
  logWorkout: (logData) => api.post('/progress/log', logData),
  getLogs: (params) => api.get('/progress/logs', { params }),
  getLogsByRange: (startDate, endDate) => 
    api.get('/progress/logs/range', { params: { startDate, endDate } }),
  getStats: (days = 30) => api.get('/progress/stats', { params: { days } })
};

export default api;