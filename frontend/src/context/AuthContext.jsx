import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await auth.getMe();
                setUser(response.data.data);
            } catch (error) {
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    };

    const login = async (credentials) => {
        try {
            const response = await auth.login(credentials);
            console.log('AuthContext login response:', response);
            const { token, ...userData } = response.data.data;
            localStorage.setItem('token', token);
            setUser(userData);
            return userData;
        } catch (error) {
            console.error('AuthContext login error:', error);
            throw error;
        }
    };

    const register = async (userData) => {
        const response = await auth.register(userData);
        toast.success('Registration successful! Please login.');
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const updateProfile = async (profileData) => {
        try {
            const response = await auth.updateProfile(profileData);
            setUser(response.data.data);
            toast.success('Profile updated successfully!');
            return response.data.data;
        } catch (error) {
            toast.error(error.displayMessage || 'Failed to update profile');
            throw error;
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 