import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboard, meetings } from '../../services/api';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';
import LoadingSpinner from '../shared/LoadingSpinner';
import StatCard from '../shared/StatCard';
import Modal from '../shared/Modal';

export default function AdminDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        participants: []
    });
    const [participantEmail, setParticipantEmail] = useState('');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await dashboard.getAdminData();
            setData(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateMeeting = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await meetings.create(formData);
            toast.success('Meeting created successfully');
            setShowModal(false);
            // Refresh dashboard data
            fetchDashboardData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create meeting');
        } finally {
            setLoading(false);
        }
    };

    const addParticipant = () => {
        if (!participantEmail) return;
        if (formData.participants.includes(participantEmail)) {
            toast.error('Participant already added');
            return;
        }
        setFormData({
            ...formData,
            participants: [...formData.participants, participantEmail]
        });
        setParticipantEmail('');
    };

    const removeParticipant = (email) => {
        setFormData({
            ...formData,
            participants: formData.participants.filter(p => p !== email)
        });
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
                >
                    Create Meeting
                </button>
            </div>

            {/* Create Meeting Modal */}
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <form onSubmit={handleCreateMeeting} className="space-y-4">
                    <h2 className="text-xl font-bold mb-4">Create New Meeting</h2>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date</label>
                        <input
                            type="datetime-local"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Add Participants</label>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter participant email"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                value={participantEmail}
                                onChange={(e) => setParticipantEmail(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={addParticipant}
                                className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Participant List */}
                    {formData.participants.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-gray-700">Participants:</h3>
                            <div className="mt-2 space-y-2">
                                {formData.participants.map((email) => (
                                    <div key={email} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                        <span>{email}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeParticipant(email)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create Meeting'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Admin Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Total Meetings" value={data?.stats?.totalMeetings || 0} />
                <StatCard title="Active Participants" value={data?.stats?.totalParticipants || 0} />
                <StatCard title="Total Tasks" value={data?.stats?.totalTasks || 0} />
                <StatCard title="Completed Tasks" value={data?.stats?.completedTasks || 0} />
            </div>

            {/* Recent Meetings */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Meetings</h2>
                <div className="space-y-4">
                    {data?.meetings?.slice(0, 5).map((meeting) => (
                        <div key={meeting._id} className="border-b pb-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium">{meeting.title}</h3>
                                    <p className="text-sm text-gray-600">{meeting.description}</p>
                                    <div className="flex space-x-4 mt-1">
                                        <p className="text-xs text-gray-500">
                                            Date: {formatDate(meeting.date)}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Participants: {meeting.participants?.length || 0}
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    to={`/meetings/${meeting._id}`}
                                    className="text-primary-600 hover:text-primary-700 text-sm"
                                >
                                    Manage
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Task Overview */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Task Overview</h2>
                <div className="space-y-4">
                    {data?.meetings?.flatMap(m => m.tasks || [])
                        .slice(0, 5)
                        .map((task) => (
                            <div key={task._id} className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{task.title}</p>
                                    <p className="text-sm text-gray-500">
                                        Status: <span className="capitalize">{task.status}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
} 