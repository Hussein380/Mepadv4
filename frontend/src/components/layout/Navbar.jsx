import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
    AiOutlineMenu, 
    AiOutlineClose, 
    AiOutlineDashboard, 
    AiOutlineCalendar, 
    AiOutlineCheckSquare,
    AiOutlineUser,
    AiOutlineSetting
} from 'react-icons/ai';
import { BiBot, BiMessageRoundedDots } from 'react-icons/bi';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { name: 'Dashboard', path: '/', icon: <AiOutlineDashboard /> },
        { name: 'Meetings', path: '/meetings', icon: <AiOutlineCalendar /> },
        { name: 'Tasks', path: '/tasks', icon: <AiOutlineCheckSquare /> },
        { name: 'AI Assistant', path: '/ai-assistant', icon: <BiBot /> },
        { name: 'AI Chatbot', path: '/ai-chatbot', icon: <BiMessageRoundedDots /> },
    ];

    const isActive = (path) => {
        return location.pathname === path || 
               (path !== '/' && location.pathname.startsWith(path));
    };

    return (
        <nav className="backdrop-blur-md bg-slate-950/80 border-b border-indigo-900/30 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and brand */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 flex items-center justify-center mr-2 shadow-lg shadow-indigo-500/20">
                                <span className="text-white font-bold text-sm">MP</span>
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-300">
                                MePad
                            </span>
                        </Link>
                    </div>

                    {/* Desktop menu */}
                    <div className="hidden sm:flex sm:items-center">
                        <div className="flex space-x-1 mr-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-all duration-200 ${
                                        isActive(link.path)
                                            ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-700/50 shadow-sm shadow-indigo-900/30'
                                            : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                                    }`}
                                >
                                    <span>{link.icon}</span>
                                    <span>{link.name}</span>
                                </Link>
                            ))}
                        </div>
                        
                        <div className="flex items-center border-l border-indigo-900/30 pl-4">
                            <div className="relative group">
                                <button className="flex items-center space-x-1 text-slate-300 hover:text-white px-2 py-1 rounded-md text-sm">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 flex items-center justify-center shadow-sm shadow-indigo-500/20">
                                        <AiOutlineUser className="text-white" />
                                    </div>
                                    <span className="max-w-[120px] truncate">{user?.email}</span>
                                </button>
                                
                                <div className="absolute right-0 w-48 mt-2 origin-top-right bg-slate-900 border border-indigo-900/30 rounded-md shadow-lg shadow-black/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    <div className="py-1">
                                        <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-indigo-900/30 hover:text-white">
                                            <AiOutlineSetting className="mr-2" />
                                            <span>Settings</span>
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-indigo-900/30 hover:text-white"
                                        >
                                            <AiOutlineClose className="mr-2" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-indigo-900/30"
                        >
                            {isOpen ? (
                                <AiOutlineClose className="block h-6 w-6" />
                            ) : (
                                <AiOutlineMenu className="block h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden overflow-hidden transition-all duration-200`}>
                    <div className="pt-2 pb-3 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                                    isActive(link.path)
                                        ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-700/50'
                                        : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                                }`}
                                onClick={() => setIsOpen(false)}
                            >
                                <span>{link.icon}</span>
                                <span>{link.name}</span>
                            </Link>
                        ))}
                        
                        <div className="border-t border-indigo-900/30 pt-2 mt-2">
                            <div className="px-3 py-2 text-sm text-slate-400">
                                Signed in as: <span className="font-medium text-slate-300">{user?.email}</span>
                            </div>
                            <Link 
                                to="/profile" 
                                className="flex items-center w-full text-left px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-800/50 hover:text-white"
                                onClick={() => setIsOpen(false)}
                            >
                                <AiOutlineSetting className="mr-2" />
                                <span>Settings</span>
                            </Link>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsOpen(false);
                                }}
                                className="flex w-full text-left px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-800/50 hover:text-white"
                            >
                                <AiOutlineClose className="mr-2" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
} 