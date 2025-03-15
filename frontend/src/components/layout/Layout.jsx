import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { useState, useEffect } from 'react';
import { BiBot } from 'react-icons/bi';

export default function Layout({ children }) {
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Global error boundary
    useEffect(() => {
        const handleError = (event) => {
            console.error('Global error caught:', event.error);
            setError(event.error?.message || 'An unexpected error occurred');
            event.preventDefault();
        };

        window.addEventListener('error', handleError);
        return () => window.removeEventListener('error', handleError);
    }, []);

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white flex items-center justify-center">
                <div className="bg-red-900/20 backdrop-blur-md rounded-xl p-6 border border-red-800/30 max-w-md">
                    <h2 className="text-xl font-semibold text-red-300 mb-4">Something went wrong</h2>
                    <p className="text-slate-300 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-red-800/30 hover:bg-red-800/50 text-red-300 rounded-lg transition-colors"
                    >
                        Reload Page
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-indigo-500/5 to-transparent"></div>
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 relative z-10">
                {children || <Outlet />}
            </main>
            
            {/* Floating AI Chatbot Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => navigate('/ai-chatbot')}
                    className="bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 
                             text-white p-3 rounded-full shadow-lg shadow-indigo-500/20 transition-all duration-300 
                             hover:scale-110"
                    title="Open AI Chatbot"
                >
                    <BiBot className="text-2xl" />
                </button>
            </div>
        </div>
    );
} 