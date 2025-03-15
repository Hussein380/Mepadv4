import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboard, meetings } from '../../services/api';
import { AiOutlineUnorderedList, AiOutlineCheckCircle } from 'react-icons/ai';
import { BiCalendar, BiRefresh } from 'react-icons/bi';
import toast from 'react-hot-toast';
import LoadingSpinner from '../shared/LoadingSpinner';
import { motion } from 'framer-motion';

export default function Tasks() {
    const [myTasks, setMyTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchTasks = async () => {
        setRefreshing(true);
        try {
            const response = await dashboard.getData();
            setMyTasks(response.data.data.myAssignedActions || []);
            if (refreshing) toast.success('Tasks refreshed');
        } catch (error) {
            toast.error(error.displayMessage || 'Failed to fetch tasks');
            console.error('Tasks error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleStatusChange = async (taskId, meetingId, newStatus) => {
        try {
            await meetings.updateActionPointStatus(meetingId, taskId, newStatus);
            toast.success(`Task marked as ${newStatus}`);
            fetchTasks();
        } catch (error) {
            toast.error(error.displayMessage || 'Failed to update task status');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950">
            <div className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full py-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4"
                >
                    <h1 className="text-xl sm:text-2xl font-bold text-white">
                        My Tasks
                    </h1>
                    <button 
                        onClick={fetchTasks}
                        className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg 
                                 transition-all shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto"
                        disabled={refreshing}
                    >
                        <BiRefresh className={refreshing ? "animate-spin" : ""} />
                        Refresh
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl mb-8"
                >
                    <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                        <AiOutlineUnorderedList className="text-yellow-400" />
                        Tasks Assigned to Me
                    </h2>
                    
                    {myTasks.length === 0 ? (
                        <div className="text-center py-8">
                            <AiOutlineCheckCircle className="text-green-400 text-5xl mx-auto mb-4" />
                            <p className="text-blue-200 mb-2">You don't have any assigned tasks</p>
                            <p className="text-blue-300 text-sm">When you're assigned tasks in meetings, they'll appear here</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {myTasks.map((task) => (
                                <motion.div
                                    key={task._id}
                                    whileHover={{ scale: 1.01 }}
                                    className="bg-blue-800/30 border border-blue-700/50 rounded-lg overflow-hidden"
                                >
                                    <div className="p-4">
                                        <div className="flex justify-between items-start gap-4 mb-3">
                                            <h3 className="font-medium text-white">{task.description}</h3>
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                task.status === 'completed' ? 'bg-green-900/50 text-green-300' : 
                                                'bg-yellow-900/50 text-yellow-300'
                                            }`}>
                                                {task.status}
                                            </span>
                                        </div>
                                        
                                        <div className="flex flex-col sm:flex-row justify-between text-sm text-blue-200 mb-3">
                                            <div className="flex items-center gap-2">
                                                <BiCalendar />
                                                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                            </div>
                                            <div>
                                                From meeting: {task.meetingTitle}
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-between items-center mt-4">
                                            <div className="flex gap-2">
                                                {task.status !== 'completed' && (
                                                    <button 
                                                        onClick={() => handleStatusChange(task._id, task.meetingId, 'completed')}
                                                        className="bg-green-600/70 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
                                                    >
                                                        Mark Complete
                                                    </button>
                                                )}
                                                {task.status === 'completed' && (
                                                    <button 
                                                        onClick={() => handleStatusChange(task._id, task.meetingId, 'pending')}
                                                        className="bg-yellow-600/70 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
                                                    >
                                                        Mark Pending
                                                    </button>
                                                )}
                                            </div>
                                            <Link 
                                                to={`/meetings/${task.meetingId}`}
                                                className="text-blue-300 hover:text-blue-200 text-sm"
                                            >
                                                View Meeting
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
