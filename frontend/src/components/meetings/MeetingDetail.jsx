import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { meetings } from '../../services/api';
import { formatDate } from '../../utils/helpers';
import { motion } from 'framer-motion';
import { BiEdit, BiTrash, BiArrowBack, BiSave, BiX, BiPlus, BiBot, BiUser, BiCalendar } from 'react-icons/bi';
import toast from 'react-hot-toast';
import LoadingSpinner from '../shared/LoadingSpinner';

export default function MeetingDetail() {
    const [meeting, setMeeting] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedMeeting, setEditedMeeting] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showAddActionPoint, setShowAddActionPoint] = useState(false);
    const [newActionPoint, setNewActionPoint] = useState({
        title: '',
        description: '',
        assignedTo: '',
        dueDate: '',
        status: 'pending'
    });
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchMeeting();
    }, [id]);

    const fetchMeeting = async () => {
        try {
            const response = await meetings.getOne(id);
            // Check the structure of the response and handle it accordingly
            const meetingData = response.data.data || response.data;
            setMeeting(meetingData);
            
            // Extract time from date or set a default time if not available
            const meetingDate = new Date(meetingData.date);
            const hours = meetingDate.getHours().toString().padStart(2, '0');
            const minutes = meetingDate.getMinutes().toString().padStart(2, '0');
            const timeString = `${hours}:${minutes}`;
            
            setEditedMeeting({
                ...meetingData,
                date: meetingData.date.split('T')[0],
                time: timeString,
                // Make sure description is set correctly (could be summary in the backend)
                description: meetingData.description || meetingData.summary || ''
            });
            setLoading(false);
        } catch (error) {
            toast.error('Failed to fetch meeting details');
            console.error('Error fetching meeting:', error);
            navigate('/meetings');
        }
    };

    const handleDeleteMeeting = async () => {
        try {
            await meetings.delete(id);
            toast.success('Meeting deleted successfully');
            navigate('/meetings');
        } catch (error) {
            toast.error('Failed to delete meeting');
            console.error(error);
        }
        setShowDeleteConfirm(false);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            // Create a copy of the editedMeeting object for submission
            const meetingToUpdate = { ...editedMeeting };
            
            // If description exists but summary doesn't, map description to summary
            if (meetingToUpdate.description && !meetingToUpdate.summary) {
                meetingToUpdate.summary = meetingToUpdate.description;
            }
            
            // Format date with time if both exist
            if (meetingToUpdate.date && meetingToUpdate.time) {
                const [year, month, day] = meetingToUpdate.date.split('-');
                const [hours, minutes] = meetingToUpdate.time.split(':');
                const dateObj = new Date(year, month - 1, day, hours, minutes);
                meetingToUpdate.date = dateObj.toISOString();
            }
            
            await meetings.update(id, meetingToUpdate);
            setMeeting({...meetingToUpdate});
            setIsEditing(false);
            toast.success('Meeting updated successfully');
            fetchMeeting();
        } catch (error) {
            toast.error(error.displayMessage || 'Failed to update meeting');
        }
    };

    const handleCancel = () => {
        setEditedMeeting(meeting);
        setIsEditing(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedMeeting(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleActionPointStatusUpdate = async (actionId, newStatus) => {
        try {
            await meetings.updateActionPointStatus(id, actionId, newStatus);
            toast.success('Status updated successfully');
            fetchMeeting();
        } catch (error) {
            toast.error('Failed to update status');
            console.error(error);
        }
    };

    const handleAddActionPoint = async (e) => {
        e.preventDefault();
        try {
            const actionPointData = {
                description: newActionPoint.description,
                assignedTo: newActionPoint.assignedTo,
                dueDate: newActionPoint.dueDate,
                status: 'pending'
            };
            
            // If title is provided, add it
            if (newActionPoint.title) {
                actionPointData.title = newActionPoint.title;
            }
            
            await meetings.addActionPoint(id, actionPointData);
            toast.success('Action point added successfully');
            setShowAddActionPoint(false);
            setNewActionPoint({
                title: '',
                description: '',
                assignedTo: '',
                dueDate: '',
                status: 'pending'
            });
            fetchMeeting();
        } catch (error) {
            toast.error('Failed to add action point');
            console.error(error);
        }
    };

    const handleDeleteActionPoint = async (actionId) => {
        try {
            console.log('Deleting action point with ID:', actionId);
            console.log('Meeting ID:', id);
            
            await meetings.deleteActionPoint(id, actionId);
            toast.success('Action point deleted successfully');
            fetchMeeting();
        } catch (error) {
            console.error('Error deleting action point:', error);
            toast.error('Failed to delete action point');
        }
    };

    if (loading) return <LoadingSpinner />;
    if (!meeting) return <div className="text-center text-white">Meeting not found</div>;

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 py-8 px-4 overflow-x-hidden">
            <motion.div 
                className="max-w-5xl mx-auto w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Back Button */}
                <div className="mb-6">
                    <Link 
                        to="/meetings" 
                        className="inline-flex items-center gap-1 text-blue-300 hover:text-white transition-colors"
                    >
                        <BiArrowBack className="text-xl" />
                        <span>Back to Meetings</span>
                    </Link>
                </div>

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <h2 className="text-xl font-semibold text-white">Meeting Details</h2>

                    <div className="flex flex-wrap gap-2 sm:gap-3">
                        {isEditing ? (
                            <>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSave}
                                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-600 text-white text-sm rounded-lg 
                                             flex items-center gap-2 hover:bg-green-500 transition-colors"
                                >
                                    <BiSave />
                                    Save
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleCancel}
                                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-600 text-white text-sm rounded-lg 
                                             flex items-center gap-2 hover:bg-gray-500 transition-colors"
                                >
                                    <BiX />
                                    Cancel
                                </motion.button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to={`/ai-assistant/${id}`}
                                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-600 text-white text-sm rounded-lg 
                                             flex items-center gap-2 hover:bg-purple-500 transition-colors"
                                >
                                    <BiBot />
                                    <span className="hidden sm:inline">AI Assistant</span>
                                    <span className="sm:hidden">AI</span>
                                </Link>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleEdit}
                                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white text-sm rounded-lg 
                                             flex items-center gap-2 hover:bg-blue-500 transition-colors"
                                >
                                    <BiEdit />
                                    <span className="hidden sm:inline">Edit Meeting</span>
                                    <span className="sm:hidden">Edit</span>
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 text-white text-sm rounded-lg 
                                             flex items-center gap-2 hover:bg-red-500 transition-colors"
                                >
                                    <BiTrash />
                                    <span className="hidden sm:inline">Delete</span>
                                </motion.button>
                            </>
                        )}
                    </div>
                </div>

                {/* Meeting Details Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6 shadow-xl 
                             border border-white/10 mb-6 overflow-hidden"
                >
                    {isEditing ? (
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                                <h1 className="text-2xl sm:text-3xl font-bold text-white">Edit Meeting</h1>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-md flex items-center gap-1"
                                    >
                                        <BiX /> Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-md flex items-center gap-1"
                                    >
                                        <BiSave /> Save
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-200 mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={editedMeeting.title}
                                    onChange={(e) => setEditedMeeting({ ...editedMeeting, title: e.target.value })}
                                    className="w-full px-3 py-2 bg-blue-800/50 border border-blue-700 rounded-md text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-200 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={editedMeeting.description}
                                    onChange={(e) => setEditedMeeting({ ...editedMeeting, description: e.target.value })}
                                    className="w-full px-3 py-2 bg-blue-800/50 border border-blue-700 rounded-md text-white min-h-[100px]"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-blue-200 mb-1">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={editedMeeting.date}
                                        onChange={(e) => setEditedMeeting({ ...editedMeeting, date: e.target.value })}
                                        className="w-full px-3 py-2 bg-blue-800/50 border border-blue-700 rounded-md text-white appearance-none"
                                        style={{ colorScheme: 'dark' }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-blue-200 mb-1">
                                        Time
                                    </label>
                                    <input
                                        type="time"
                                        value={editedMeeting.time}
                                        onChange={(e) => setEditedMeeting({ ...editedMeeting, time: e.target.value })}
                                        className="w-full px-3 py-2 bg-blue-800/50 border border-blue-700 rounded-md text-white appearance-none"
                                        style={{ colorScheme: 'dark' }}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-white">{meeting.title}</h1>
                                    <p className="text-blue-300 mt-1">
                                        {new Date(meeting.date).toLocaleDateString()} at {meeting.time || (() => {
                                            const date = new Date(meeting.date);
                                            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                        })()}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-md flex items-center gap-1"
                                    >
                                        <BiEdit /> <span className="hidden sm:inline">Edit</span>
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-sm rounded-md flex items-center gap-1"
                                    >
                                        <BiTrash /> <span className="hidden sm:inline">Delete</span>
                                    </button>
                                </div>
                            </div>

                            <div className="bg-blue-900/30 rounded-lg p-4 mb-6">
                                <h2 className="text-xl font-semibold text-white mb-2">Description</h2>
                                <p className="text-blue-200 whitespace-pre-wrap">{meeting.description || meeting.summary}</p>
                            </div>
                        </>
                    )}
                </motion.div>

                {/* Participants Section */}
                <motion.div 
                    className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6 shadow-xl 
                             border border-white/10 mb-6"
                >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                        <h2 className="text-xl font-semibold text-white">Participants</h2>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditedMeeting({
                                        ...editedMeeting,
                                        participants: [
                                            ...editedMeeting.participants,
                                            { name: '', email: '', role: 'viewer' }
                                        ]
                                    });
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md flex items-center gap-1 text-sm"
                            >
                                <BiPlus /> Add Participant
                            </button>
                        )}
                    </div>
                    
                    {isEditing ? (
                        <div className="space-y-3">
                            {editedMeeting.participants.map((participant, index) => (
                                <div key={index} className="flex flex-col sm:flex-row gap-2 p-2 bg-blue-800/30 rounded-lg">
                                    <input
                                        type="text"
                                        value={participant.name}
                                        onChange={(e) => {
                                            const updatedParticipants = [...editedMeeting.participants];
                                            updatedParticipants[index].name = e.target.value;
                                            setEditedMeeting({
                                                ...editedMeeting,
                                                participants: updatedParticipants
                                            });
                                        }}
                                        placeholder="Name"
                                        className="flex-1 px-3 py-1 bg-blue-800/50 border border-blue-700 rounded-md text-white text-sm"
                                    />
                                    <input
                                        type="email"
                                        value={participant.email}
                                        onChange={(e) => {
                                            const updatedParticipants = [...editedMeeting.participants];
                                            updatedParticipants[index].email = e.target.value;
                                            setEditedMeeting({
                                                ...editedMeeting,
                                                participants: updatedParticipants
                                            });
                                        }}
                                        placeholder="Email"
                                        className="flex-1 px-3 py-1 bg-blue-800/50 border border-blue-700 rounded-md text-white text-sm"
                                    />
                                    <select
                                        value={participant.role}
                                        onChange={(e) => {
                                            const updatedParticipants = [...editedMeeting.participants];
                                            updatedParticipants[index].role = e.target.value;
                                            setEditedMeeting({
                                                ...editedMeeting,
                                                participants: updatedParticipants
                                            });
                                        }}
                                        className="px-3 py-1 bg-blue-800/50 border border-blue-700 rounded-md text-white text-sm"
                                    >
                                        <option value="viewer">Viewer</option>
                                        <option value="contributor">Contributor</option>
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const updatedParticipants = [...editedMeeting.participants];
                                            updatedParticipants.splice(index, 1);
                                            setEditedMeeting({
                                                ...editedMeeting,
                                                participants: updatedParticipants
                                            });
                                        }}
                                        className="text-red-400 hover:text-red-300 px-2 py-1"
                                    >
                                        <BiX size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3">
                            {meeting.participants.map((participant, index) => (
                                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2 bg-blue-800/30 rounded-lg">
                                    <div className="flex-1">
                                        <p className="text-white font-medium">{participant.name}</p>
                                        <p className="text-blue-300 text-sm truncate">{participant.email}</p>
                                    </div>
                                    <span className="px-2 py-1 bg-blue-700/50 text-xs text-blue-200 rounded-full">
                                        {participant.role}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Action Points Section */}
                <motion.div 
                    className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6 shadow-xl 
                             border border-white/10 mb-6"
                >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
                        <h2 className="text-xl font-semibold text-white">Action Points</h2>
                        <button
                            type="button"
                            onClick={() => setShowAddActionPoint(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 
                                      rounded-md flex items-center gap-1 text-sm"
                        >
                            <BiPlus /> Add Action Point
                        </button>
                    </div>
                    
                    {meeting.actionPoints && meeting.actionPoints.length > 0 ? (
                        <div className="space-y-4">
                            {meeting.actionPoints.map((actionPoint, index) => (
                                <div 
                                    key={index} 
                                    className="bg-blue-800/30 rounded-lg p-3 border border-blue-700/30"
                                >
                                    <div className="flex flex-col sm:flex-row justify-between gap-2 mb-2">
                                        <h3 className="text-white font-medium">
                                            {actionPoint.title || actionPoint.description.substring(0, 50)}
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            <select
                                                value={actionPoint.status}
                                                onChange={(e) => handleActionPointStatusUpdate(actionPoint._id, e.target.value)}
                                                className="bg-blue-800/50 border border-blue-700 rounded-md 
                                                         text-white text-sm px-2 py-1 w-full sm:w-auto"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="in-progress">In Progress</option>
                                                <option value="completed">Completed</option>
                                            </select>
                                            <button
                                                onClick={() => handleDeleteActionPoint(actionPoint._id)}
                                                className="text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/30 
                                                         px-2 py-1 rounded text-sm flex items-center gap-1"
                                            >
                                                <BiTrash />
                                                <span className="hidden sm:inline">Delete</span>
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-blue-200 text-sm mb-1">{actionPoint.description}</p>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-blue-300">
                                        <div className="flex items-center gap-1">
                                            <BiUser />
                                            <span>{actionPoint.assignedTo}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <BiCalendar />
                                            <span>{new Date(actionPoint.dueDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <p className="text-blue-300">No action points added yet</p>
                        </div>
                    )}
                </motion.div>

                {/* Add Action Point Modal */}
                {showAddActionPoint && (
                    <div className="fixed inset-0 bg-slate-800/90 flex items-center justify-center p-4 z-50">
                        <div className="bg-gradient-to-b from-blue-900 to-blue-950 border border-blue-700/50 
                                      rounded-lg p-4 sm:p-6 max-w-md w-full shadow-xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg sm:text-xl font-semibold text-white">Add Action Point</h3>
                                <button 
                                    onClick={() => setShowAddActionPoint(false)}
                                    className="text-blue-300 hover:text-white"
                                >
                                    <BiX size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleAddActionPoint} className="space-y-4">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-blue-200 mb-1">Title</label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={newActionPoint.title}
                                        onChange={(e) => setNewActionPoint({ ...newActionPoint, title: e.target.value })}
                                        className="w-full px-3 py-2 bg-blue-800/50 border border-blue-700 rounded-md text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-blue-200 mb-1">Description</label>
                                    <textarea
                                        id="description"
                                        value={newActionPoint.description}
                                        onChange={(e) => setNewActionPoint({ ...newActionPoint, description: e.target.value })}
                                        className="w-full px-3 py-2 bg-blue-800/50 border border-blue-700 rounded-md text-white min-h-[80px]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="assignedTo" className="block text-sm font-medium text-blue-200 mb-1">Assigned To</label>
                                    <input
                                        type="text"
                                        id="assignedTo"
                                        value={newActionPoint.assignedTo}
                                        onChange={(e) => setNewActionPoint({ ...newActionPoint, assignedTo: e.target.value })}
                                        className="w-full px-3 py-2 bg-blue-800/50 border border-blue-700 rounded-md text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="dueDate" className="block text-sm font-medium text-blue-200 mb-1">Due Date</label>
                                    <input
                                        type="date"
                                        id="dueDate"
                                        value={newActionPoint.dueDate}
                                        onChange={(e) => setNewActionPoint({ ...newActionPoint, dueDate: e.target.value })}
                                        className="w-full px-3 py-2 bg-blue-800/50 border border-blue-700 rounded-md text-white appearance-none"
                                        style={{ colorScheme: 'dark' }}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddActionPoint(false)}
                                        className="w-full sm:w-1/2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="w-full sm:w-1/2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md"
                                    >
                                        Add Action Point
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-slate-800/90 flex items-center justify-center p-4 z-50">
                        <div className="bg-gradient-to-b from-blue-900 to-blue-950 border border-blue-700/50 
                                      rounded-lg p-4 sm:p-6 max-w-md w-full shadow-xl">
                            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Confirm Delete</h3>
                            <p className="text-blue-200 mb-6">Are you sure you want to delete this meeting? This action cannot be undone.</p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="w-full sm:w-1/2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteMeeting}
                                    className="w-full sm:w-1/2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
} 