import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../services/api';
import { motion } from 'framer-motion';
import { BiUser, BiLock, BiEnvelope, BiUserPlus } from 'react-icons/bi';
import toast from 'react-hot-toast';
import GridBackground from '../shared/GridBackground';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await auth.register(formData);
            toast.success('Registration successful! Please login.');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative bg-gradient-to-b from-blue-900 to-blue-950 flex items-center justify-center p-4">
            <GridBackground />
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md z-10"
            >
                <div className="text-center mb-8">
                    <motion.h1 
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        className="text-3xl font-bold bg-clip-text text-transparent 
                                 bg-gradient-to-r from-blue-200 to-blue-400"
                    >
                        Create Account
                    </motion.h1>
                    <p className="text-blue-200 mt-2">Join us and start managing your meetings</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-xl 
                             border border-white/10"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-blue-100">Full Name</label>
                            <div className="relative group">
                                <BiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                                 text-blue-300 group-hover:text-blue-200 transition-colors" />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 bg-blue-800/50 border border-blue-700 
                                             rounded-lg text-white placeholder-blue-300 focus:ring-2 
                                             focus:ring-blue-500 focus:border-transparent transition-all
                                             group-hover:border-blue-600"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-blue-100">Email</label>
                            <div className="relative group">
                                <BiEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                                     text-blue-300 group-hover:text-blue-200 transition-colors" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 bg-blue-800/50 border border-blue-700 
                                             rounded-lg text-white placeholder-blue-300 focus:ring-2 
                                             focus:ring-blue-500 focus:border-transparent transition-all
                                             group-hover:border-blue-600"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-blue-100">Password</label>
                            <div className="relative group">
                                <BiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                                 text-blue-300 group-hover:text-blue-200 transition-colors" />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 bg-blue-800/50 border border-blue-700 
                                             rounded-lg text-white placeholder-blue-300 focus:ring-2 
                                             focus:ring-blue-500 focus:border-transparent transition-all
                                             group-hover:border-blue-600"
                                    placeholder="Create a password"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-blue-100">Confirm Password</label>
                            <div className="relative group">
                                <BiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                                 text-blue-300 group-hover:text-blue-200 transition-colors" />
                                <input
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 bg-blue-800/50 border border-blue-700 
                                             rounded-lg text-white placeholder-blue-300 focus:ring-2 
                                             focus:ring-blue-500 focus:border-transparent transition-all
                                             group-hover:border-blue-600"
                                    placeholder="Confirm your password"
                                    required
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 
                                     hover:from-blue-500 hover:to-blue-400 text-white rounded-lg 
                                     shadow-lg flex items-center justify-center gap-2 
                                     disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/20 border-t-white 
                                              rounded-full animate-spin" />
                            ) : (
                                <>
                                    <BiUserPlus className="text-xl" />
                                    <span>Create Account</span>
                                </>
                            )}
                        </motion.button>

                        <div className="text-center mt-4">
                            <p className="text-blue-200">
                                Already have an account?{' '}
                                <Link 
                                    to="/login" 
                                    className="text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </div>
    );
} 