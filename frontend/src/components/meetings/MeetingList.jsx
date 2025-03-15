import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { meetings } from '../../services/api';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';
import { BiCalendarEvent, BiMap, BiPlus, BiTrash, BiShow, BiRefresh, BiTime, BiUser } from 'react-icons/bi';

export default function MeetingList() {
    const [meetingsList, setMeetingsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMeetings();
    }, []);

    const fetchMeetings = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await meetings.getAll();
            setMeetingsList(response.data.data);
        } catch (error) {
            console.error('Error fetching meetings:', error);
            setError(error.displayMessage || 'Failed to fetch meetings');
            toast.error(error.displayMessage || 'Failed to fetch meetings');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this meeting?')) return;
        
        try {
            await meetings.delete(id);
            toast.success('Meeting deleted successfully');
            fetchMeetings();
        } catch (error) {
            toast.error(error.displayMessage || 'Failed to delete meeting');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-slate-300">Loading meetings...</p>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-6 text-center">
                <p className="text-red-300 mb-4">{error}</p>
                <button 
                    onClick={fetchMeetings} 
                    className="flex items-center gap-2 mx-auto px-4 py-2 bg-red-800/30 hover:bg-red-800/50 text-red-300 rounded-lg transition-colors"
                >
                    <BiRefresh className="text-lg" />
                    Try again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Meetings</h1>
                <Link
                    to="/meetings/new"
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:scale-105"
                >
                    <BiPlus className="text-lg" />
                    New Meeting
                </Link>
            </div>

            {!meetingsList.length ? (
                <div className="bg-slate-900/30 backdrop-blur-md rounded-xl p-8 border border-indigo-900/20 text-center">
                    <div className="w-16 h-16 bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BiCalendarEvent className="text-3xl text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">No meetings found</h3>
                    <p className="text-slate-400 mb-6">Create your first meeting to get started</p>
                    <Link
                        to="/meetings/new"
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg transition-colors"
                    >
                        <BiPlus />
                        Create a new meeting
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    {meetingsList.map((meeting) => (
                        <div 
                            key={meeting._id} 
                            className="bg-slate-900/30 backdrop-blur-md rounded-xl p-6 border border-indigo-900/20 hover:border-indigo-700/30 transition-all duration-300 group"
                        >
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex-1">
                                    <h2 className="text-xl font-semibold text-white group-hover:text-indigo-300 transition-colors">{meeting.title}</h2>
                                    <div className="mt-3 space-y-2">
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <BiCalendarEvent className="text-indigo-400" />
                                            <span>{formatDate(meeting.date)}</span>
                                        </div>
                                        {meeting.venue && (
                                            <div className="flex items-center gap-2 text-slate-300">
                                                <BiMap className="text-indigo-400" />
                                                <span>{meeting.venue}</span>
                                            </div>
                                        )}
                                        {meeting.participants && meeting.participants.length > 0 && (
                                            <div className="flex items-center gap-2 text-slate-300">
                                                <BiUser className="text-indigo-400" />
                                                <span>{meeting.participants.length} participants</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex md:flex-col gap-3 self-end md:self-center">
                                    <Link
                                        to={`/meetings/${meeting._id}`}
                                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 rounded-lg transition-colors"
                                    >
                                        <BiShow />
                                        View
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(meeting._id)}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-900/20 hover:bg-red-900/40 text-red-300 rounded-lg transition-colors"
                                    >
                                        <BiTrash />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}