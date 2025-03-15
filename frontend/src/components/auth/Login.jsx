import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { BiUser, BiLock, BiLogIn } from 'react-icons/bi';
import toast from 'react-hot-toast';
import GridBackground from '../shared/GridBackground';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(formData);
            toast.success('Login successful!');
            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
            toast.error(error.message || 'Login failed');
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
                        Welcome Back
                    </motion.h1>
                    <p className="text-blue-200 mt-2">Sign in to continue to your account</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-xl 
                             border border-white/10"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-blue-100">Email</label>
                            <div className="relative group">
                                <BiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 
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
                                    placeholder="Enter your password"
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
                                    <BiLogIn className="text-xl" />
                                    <span>Sign In</span>
                                </>
                            )}
                        </motion.button>

                        <div className="text-center mt-4">
                            <p className="text-blue-200">
                                Don't have an account?{' '}
                                <Link 
                                    to="/register" 
                                    className="text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </div>
    );
} 