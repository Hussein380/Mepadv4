import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { meetings } from '../../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { BiPlus, BiTrash } from 'react-icons/bi';

export default function MeetingForm({ onSubmit, initialData = {} }) {
    const [formData, setFormData] = useState({
        title: initialData.title || '',
        date: initialData.date || '',
        venue: initialData.venue || '',
        summary: initialData.summary || '',
        status: initialData.status || 'upcoming',
        actionPoints: initialData.actionPoints || [],
        painPoints: initialData.painPoints || [],
        participants: initialData.participants || []
    });
    const [currentActionPoint, setCurrentActionPoint] = useState({
        description: '',
        assignedTo: '',
        dueDate: '',
        status: 'pending'
    });
    const [currentPainPoint, setCurrentPainPoint] = useState({
        description: '',
        severity: 'low',
        status: 'open'
    });
    const [currentParticipant, setCurrentParticipant] = useState({
        name: '',
        email: ''
    });
    const [showActionPointForm, setShowActionPointForm] = useState(false);
    const [showPainPointForm, setShowPainPointForm] = useState(false);
    const [showParticipantForm, setShowParticipantForm] = useState(false);
    const navigate = useNavigate();

    const handleAddActionPoint = () => {
        if (!currentActionPoint.description || !currentActionPoint.assignedTo || !currentActionPoint.dueDate) {
            toast.error('Please fill all action point fields');
            return;
        }
        setFormData({
            ...formData,
            actionPoints: [...formData.actionPoints, { ...currentActionPoint, id: Date.now() }]
        });
        setCurrentActionPoint({
            description: '',
            assignedTo: '',
            dueDate: '',
            status: 'pending'
        });
        toast.success('Action point added');
    };

    const handleAddPainPoint = () => {
        if (!currentPainPoint.description) {
            toast.error('Please fill pain point description');
            return;
        }
        setFormData({
            ...formData,
            painPoints: [...formData.painPoints, { ...currentPainPoint, id: Date.now() }]
        });
        setCurrentPainPoint({
            description: '',
            severity: 'low',
            status: 'open'
        });
        setShowPainPointForm(false);
        toast.success('Pain point added');
    };

    const handleRemoveActionPoint = (index) => {
        setFormData({
            ...formData,
            actionPoints: formData.actionPoints.filter((_, i) => i !== index)
        });
    };

    const handleRemovePainPoint = (index) => {
        setFormData({
            ...formData,
            painPoints: formData.painPoints.filter((_, i) => i !== index)
        });
    };

    const handleAddParticipant = () => {
        if (!currentParticipant.name || !currentParticipant.email) {
            toast.error('Please fill both name and email');
            return;
        }
        setFormData({
            ...formData,
            participants: [...formData.participants, { ...currentParticipant, id: Date.now() }]
        });
        setCurrentParticipant({ name: '', email: '' });
        toast.success('Participant added');
    };

    const handleRemoveParticipant = (index) => {
        setFormData({
            ...formData,
            participants: formData.participants.filter((_, i) => i !== index)
        });
    };

    const validateForm = () => {
        if (!formData.title || !formData.date || !formData.venue || !formData.summary) {
            toast.error('Please fill in all required fields');
            return false;
        }
        
        if (formData.actionPoints.length > 0) {
            const validActionPoints = formData.actionPoints.every(point => 
                point.description && point.assignedTo && point.dueDate
            );
            if (!validActionPoints) {
                toast.error('Please complete all action point details');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        try {
            const meetingData = {
                title: formData.title,
                date: new Date(formData.date).toISOString(),
                venue: formData.venue,
                summary: formData.summary,
                status: formData.status,
                actionPoints: formData.actionPoints.map(point => ({
                    description: point.description,
                    assignedTo: point.assignedTo,
                    dueDate: new Date(point.dueDate).toISOString(),
                    status: 'pending'
                })),
                painPoints: formData.painPoints.map(point => ({
                    description: point.description,
                    severity: point.severity,
                    status: 'open'
                })),
                participants: formData.participants.map(participant => ({
                    name: participant.name,
                    email: participant.email
                }))
            };

            await meetings.create(meetingData);
            toast.success('Meeting created successfully!');
            navigate('/meetings');
        } catch (error) {
            console.error('Error creating meeting:', error);
            toast.error('Failed to create meeting');
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 py-8"
        >
            <div className="w-full max-w-4xl mx-auto px-4">
                <motion.h1 
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    className="text-2xl sm:text-3xl font-bold text-white mb-8"
                >
                    Create New Meeting
                </motion.h1>

                <motion.form 
                    onSubmit={handleSubmit} 
                    className="space-y-6 bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl"
                >
                    {/* Meeting Details */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <motion.div 
                                whileHover={{ scale: 1.01 }}
                                className="space-y-2"
                            >
                                <label className="block text-sm font-medium text-blue-100">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 bg-blue-800/50 border border-blue-700 rounded-lg 
                                             text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-500 
                                             focus:border-transparent transition-all"
                                    required
                                />
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.01 }} className="space-y-2">
                                <label className="block text-sm font-medium text-blue-100">Venue</label>
                                <input
                                    type="text"
                                    value={formData.venue}
                                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                                    className="w-full px-4 py-2 bg-blue-800/50 border border-blue-700 rounded-lg 
                                             text-white focus:ring-2 focus:ring-blue-500 transition-all"
                                    required
                                />
                            </motion.div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <motion.div whileHover={{ scale: 1.01 }} className="space-y-2">
                                <label className="block text-sm font-medium text-blue-100">Date</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full px-4 py-2 bg-blue-800/50 border border-blue-700 rounded-lg 
                                             text-white focus:ring-2 focus:ring-blue-500 transition-all"
                                    required
                                />
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.01 }} className="space-y-2">
                                <label className="block text-sm font-medium text-blue-100">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-4 py-2 bg-blue-800/50 border border-blue-700 rounded-lg 
                                             text-white focus:ring-2 focus:ring-blue-500 transition-all"
                                    required
                                >
                                    <option value="upcoming">Upcoming</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </motion.div>
                        </div>

                        <div className="w-full">
                            <label className="block text-sm font-medium text-blue-100">Summary</label>
                            <textarea
                                value={formData.summary}
                                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                className="w-full px-4 py-2 bg-blue-800/50 border border-blue-700 rounded-lg 
                                         text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-500 
                                         focus:border-transparent transition-all resize-y"
                                required
                            ></textarea>
                        </div>
                    </div>

                    {/* Action Points Section */}
                    <motion.div 
                        className="space-y-4 border-t border-blue-800/50 pt-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-blue-100">Action Points</h3>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={() => setShowActionPointForm(true)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg 
                                         shadow-lg transition-all flex items-center gap-2"
                            >
                                <BiPlus className="text-xl" />
                                <span>Add Action Point</span>
                            </motion.button>
                        </div>

                        {showActionPointForm && (
                            <div className="w-full flex flex-col gap-2 p-3 bg-gray-50 rounded-md">
                                <input
                                    type="text"
                                    placeholder="Description"
                                    value={currentActionPoint.description}
                                    onChange={(e) => setCurrentActionPoint({ ...currentActionPoint, description: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md text-sm"
                                />
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <input
                                        type="text"
                                        placeholder="Assigned To"
                                        value={currentActionPoint.assignedTo}
                                        onChange={(e) => setCurrentActionPoint({ ...currentActionPoint, assignedTo: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-md text-sm"
                                    />
                                    <input
                                        type="date"
                                        value={currentActionPoint.dueDate}
                                        onChange={(e) => setCurrentActionPoint({ ...currentActionPoint, dueDate: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-md text-sm"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddActionPoint}
                                    className="w-full sm:w-auto px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                                >
                                    Add
                                </button>
                            </div>
                        )}

                        {/* Display added action points */}
                        <div className="space-y-2">
                            {formData.actionPoints.map((point, index) => (
                                <div key={point.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-md">
                                    <div>
                                        <p className="font-medium">{point.description}</p>
                                        <p className="text-sm text-gray-600">Assigned to: {point.assignedTo}</p>
                                        <p className="text-sm text-gray-600">Due: {new Date(point.dueDate).toLocaleDateString()}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveActionPoint(index)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Pain Points Section */}
                    <motion.div 
                        className="space-y-4 border-t border-blue-800/50 pt-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-blue-100">Pain Points</h3>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={() => setShowPainPointForm(true)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg 
                                         shadow-lg transition-all flex items-center gap-2"
                            >
                                <BiPlus className="text-xl" />
                                <span>Add Pain Point</span>
                            </motion.button>
                        </div>

                        {showPainPointForm && (
                            <div className="w-full flex flex-col gap-2 p-3 bg-gray-50 rounded-md">
                                <input
                                    type="text"
                                    placeholder="Description"
                                    value={currentPainPoint.description}
                                    onChange={(e) => setCurrentPainPoint({ ...currentPainPoint, description: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md text-sm"
                                />
                                <select
                                    value={currentPainPoint.severity}
                                    onChange={(e) => setCurrentPainPoint({ ...currentPainPoint, severity: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md text-sm"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                                <button
                                    type="button"
                                    onClick={handleAddPainPoint}
                                    className="w-full sm:w-auto px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                                >
                                    Add
                                </button>
                            </div>
                        )}

                        {/* Display added pain points */}
                        <div className="space-y-2">
                            {formData.painPoints.map((point, index) => (
                                <div key={point.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-md">
                                    <div>
                                        <p className="font-medium">{point.description}</p>
                                        <p className="text-sm text-gray-600">
                                            Severity: <span className={`${
                                                point.severity === 'high' ? 'text-red-600' :
                                                point.severity === 'medium' ? 'text-yellow-600' :
                                                'text-green-600'
                                            }`}>{point.severity}</span>
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemovePainPoint(index)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Participants Section */}
                    <motion.div 
                        className="space-y-4 border-t border-blue-800/50 pt-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-blue-100">Participants</h3>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={() => setShowParticipantForm(true)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg 
                                         shadow-lg transition-all flex items-center gap-2"
                            >
                                <BiPlus className="text-xl" />
                                <span>Add Participant</span>
                            </motion.button>
                        </div>

                        {showParticipantForm && (
                            <div className="w-full flex flex-col gap-2 p-3 bg-gray-50 rounded-md">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={currentParticipant.name}
                                    onChange={(e) => setCurrentParticipant({ ...currentParticipant, name: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md text-sm"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={currentParticipant.email}
                                    onChange={(e) => setCurrentParticipant({ ...currentParticipant, email: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddParticipant}
                                    className="w-full sm:w-auto px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                                >
                                    Add
                                </button>
                            </div>
                        )}

                        <div className="space-y-2">
                            {formData.participants.map((participant, index) => (
                                <div key={participant.id || index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                                    <div>
                                        <p className="font-medium">{participant.name}</p>
                                        <p className="text-sm text-gray-600">{participant.email}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveParticipant(index)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div 
                        className="pt-6 border-t border-blue-800/50"
                        whileHover={{ scale: 1.02 }}
                    >
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 
                                     hover:from-blue-500 hover:to-blue-400 text-white rounded-lg shadow-lg 
                                     transition-all transform hover:-translate-y-1"
                        >
                            Create Meeting
                        </button>
                    </motion.div>
                </motion.form>
            </div>
        </motion.div>
    );
} 