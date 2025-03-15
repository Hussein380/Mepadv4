import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { meetings } from '../../services/api';
import { formatDate } from '../../utils/helpers';
import { motion } from 'framer-motion';
import { BiEdit, BiTrash, BiArrowBack, BiSave, BiX, BiPlus, BiBot } from 'react-icons/bi';
import toast from 'react-hot-toast';
import LoadingSpinner from '../shared/LoadingSpinner';

export default function MeetingDetail() {
    const [meeting, setMeeting] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedMeeting, setEditedMeeting] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showAddActionPoint, setShowAddActionPoint] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchMeetingDetails();
    }, [id]);

    const fetchMeetingDetails = async () => {
        try {
            const response = await meetings.getOne(id);
            setMeeting(response.data.data);
            setEditedMeeting(response.data.data);
        } catch (error) {
            toast.error(error.displayMessage || 'Failed to fetch meeting details');
            navigate('/meetings');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await meetings.delete(id);
            toast.success('Meeting deleted successfully');
            navigate('/meetings');
        } catch (error) {
            toast.error(error.displayMessage || 'Failed to delete meeting');
        }
        setShowDeleteConfirm(false);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            await meetings.update(id, editedMeeting);
            setMeeting(editedMeeting);
            setIsEditing(false);
            toast.success('Meeting updated successfully');
            fetchMeetingDetails();
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
            await meetings.updateActionPoint(id, actionId, { status: newStatus });
            toast.success('Action point updated successfully');
            fetchMeetingDetails();
        } catch (error) {
            toast.error('Failed to update action point');
        }
    };

    const handleAddActionPoint = async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const actionPoint = {
            description: formData.get('description'),
            assignedTo: formData.get('assignedTo'),
            dueDate: formData.get('dueDate'),
            status: 'pending'
        };
        
        try {
            await meetings.addActionPoint(id, actionPoint);
            toast.success('Action point added successfully');
            setShowAddActionPoint(false);
            fetchMeetingDetails();
        } catch (error) {
            toast.error(error.displayMessage || 'Failed to add action point');
        }
    };

    if (loading) return <LoadingSpinner />;
    if (!meeting) return <div className="text-center text-white">Meeting not found</div>;

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 py-8 px-4">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-5xl mx-auto"
            >
                {/* Header Section */}
                <div className="flex justify-between items-center mb-8">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/meetings')}
                        className="flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors"
                    >
                        <BiArrowBack />
                        <span>Back to Meetings</span>
                    </motion.button>

                    <div className="flex gap-3">
                        {isEditing ? (
                            <>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg 
                                             flex items-center gap-2 hover:bg-green-500 transition-colors"
                                >
                                    <BiSave />
                                    Save Changes
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleCancel}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg 
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
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg 
                                             flex items-center gap-2 hover:bg-purple-500 transition-colors"
                                >
                                    <BiBot />
                                    AI Assistant
                                </Link>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleEdit}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg 
                                             flex items-center gap-2 hover:bg-blue-500 transition-colors"
                                >
                                    <BiEdit />
                                    Edit Meeting
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg 
                                             flex items-center gap-2 hover:bg-red-500 transition-colors"
                                >
                                    <BiTrash />
                                    Delete
                                </motion.button>
                            </>
                        )}
                    </div>
                </div>

                {/* Meeting Details Card */}
                <motion.div 
                    className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl 
                             border border-white/10 mb-6"
                >
                    {isEditing ? (
                        <div className="space-y-4">
                            <input
                                type="text"
                                name="title"
                                value={editedMeeting.title}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 bg-blue-800/50 border border-blue-700 
                                         rounded-lg text-white placeholder-blue-300 focus:ring-2 
                                         focus:ring-blue-500 focus:border-transparent"
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input
                                    type="date"
                                    name="date"
                                    value={editedMeeting.date.split('T')[0]}
                                    onChange={handleInputChange}
                                    className="px-4 py-2 bg-blue-800/50 border border-blue-700 
                                             rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    name="venue"
                                    value={editedMeeting.venue}
                                    onChange={handleInputChange}
                                    className="px-4 py-2 bg-blue-800/50 border border-blue-700 
                                             rounded-lg text-white placeholder-blue-300 focus:ring-2"
                                    placeholder="Venue"
                                />
                            </div>
                            <textarea
                                name="summary"
                                value={editedMeeting.summary}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 bg-blue-800/50 border border-blue-700 
                                         rounded-lg text-white placeholder-blue-300 focus:ring-2 
                                         focus:ring-blue-500 resize-y"
                                rows="4"
                            />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <h1 className="text-2xl font-bold text-white">{meeting.title}</h1>
                            <div className="grid grid-cols-2 gap-4 text-blue-200">
                                <p>Date: {formatDate(meeting.date)}</p>
                                <p>Venue: {meeting.venue}</p>
                            </div>
                            <p className="text-blue-100">{meeting.summary}</p>
                        </div>
                    )}
                </motion.div>

                {/* Participants Section */}
                <motion.div 
                    className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl 
                             border border-white/10 mb-6"
                >
                    <div className="flex justify-between items-center mb-4">
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
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md flex items-center gap-1"
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
                                        className="flex-1 px-3 py-1 bg-blue-800/50 border border-blue-700 rounded-md text-white"
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
                                        className="flex-1 px-3 py-1 bg-blue-800/50 border border-blue-700 rounded-md text-white"
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
                                        className="px-3 py-1 bg-blue-800/50 border border-blue-700 rounded-md text-white"
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {meeting.participants.map((participant, index) => (
                                <div key={index} className="flex items-center gap-2 p-2 bg-blue-800/30 rounded-lg">
                                    <div className="flex-1">
                                        <p className="text-white font-medium">{participant.name}</p>
                                        <p className="text-blue-300 text-sm">{participant.email}</p>
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
                    className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl 
                             border border-white/10 mb-6"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-white">Action Points</h2>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowAddActionPoint(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg 
                                     flex items-center gap-2 hover:bg-blue-500 transition-colors"
                        >
                            Add Action Point
                        </motion.button>
                    </div>
                    
                    <div className="space-y-4">
                        {meeting.actionPoints?.map((action) => (
                            <motion.div
                                key={action._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-blue-800/30 rounded-lg border border-blue-700/50"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <p className="font-medium text-white">{action.description}</p>
                                        <p className="text-sm text-blue-200">
                                            Assigned to: {action.assignedTo}
                                        </p>
                                        <p className="text-sm text-blue-200">
                                            Due: {formatDate(action.dueDate)}
                                        </p>
                                    </div>
                                    <select
                                        value={action.status}
                                        onChange={(e) => handleActionPointStatusUpdate(action._id, e.target.value)}
                                        className="px-3 py-1 bg-blue-900/50 border border-blue-700 
                                                 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Add Action Point Modal */}
                {showAddActionPoint && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-xl 
                                     border border-white/10 max-w-md w-full mx-4"
                        >
                            <h3 className="text-xl font-semibold text-white mb-4">Add Action Point</h3>
                            <form onSubmit={handleAddActionPoint} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-blue-200 mb-1">
                                        Description
                                    </label>
                                    <input
                                        type="text"
                                        name="description"
                                        className="w-full px-3 py-2 bg-blue-800/50 border border-blue-700 
                                                 rounded-lg text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-blue-200 mb-1">
                                        Assigned To
                                    </label>
                                    <input
                                        type="text"
                                        name="assignedTo"
                                        className="w-full px-3 py-2 bg-blue-800/50 border border-blue-700 
                                                 rounded-lg text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-blue-200 mb-1">
                                        Due Date
                                    </label>
                                    <input
                                        type="date"
                                        name="dueDate"
                                        className="w-full px-3 py-2 bg-blue-800/50 border border-blue-700 
                                                 rounded-lg text-white"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddActionPoint(false)}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                                    >
                                        Add
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-xl 
                                     border border-white/10 max-w-md w-full mx-4"
                        >
                            <h3 className="text-xl font-semibold text-white mb-4">Confirm Delete</h3>
                            <p className="text-blue-200 mb-6">
                                Are you sure you want to delete this meeting? This action cannot be undone.
                            </p>
                            <div className="flex justify-end gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
                                >
                                    Delete
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </motion.div>
        </div>
    );
} 