import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: false
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized errors by redirecting to login
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        
        // Create a more descriptive error message
        const errorMessage = error.response?.data?.error || 
                            error.response?.data?.message || 
                            error.message || 
                            'An unexpected error occurred';
        
        // Attach the error message to the error object for easier access
        error.displayMessage = errorMessage;
        
        return Promise.reject(error);
    }
);

export const auth = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getMe: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/profile', data)
};

export const meetings = {
    create: (data) => api.post('/meetings', data),
    getAll: () => api.get('/meetings'),
    getOne: (id) => api.get(`/meetings/${id}`),
    update: (id, data) => api.put(`/meetings/${id}`, data),
    delete: (id) => api.delete(`/meetings/${id}`),
    updateActionPoint: (meetingId, actionId, data) => 
        api.put(`/meetings/${meetingId}/action-points/${actionId}`, data),
    updateActionPointStatus: (meetingId, actionId, status) => 
        api.put(`/meetings/${meetingId}/action-points/${actionId}`, { status }),
    addActionPoint: (meetingId, actionPoint) => 
        api.post(`/meetings/${meetingId}/action-points`, actionPoint),
    deleteActionPoint: (meetingId, actionId) => 
        api.delete(`/meetings/${meetingId}/action-points/${actionId}`),
    sendInvitations: (meetingId, participants) => 
        api.post(`/meetings/${meetingId}/invitations`, { participants })
};

export const invitations = {
    verify: (token) => api.get(`/invite/${token}`),
    accept: (token) => api.put(`/invite/${token}/status`, { status: 'accepted' }),
    decline: (token) => api.put(`/invite/${token}/status`, { status: 'declined' }),
    getInvitation: (token) => api.get(`/invite/${token}`),
    updateInvitationStatus: (token, data) => api.put(`/invite/${token}/status`, data)
};

export const dashboard = {
    getData: () => api.get('/dashboard')
};

export default api; 