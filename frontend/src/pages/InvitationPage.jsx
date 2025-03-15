import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BiCalendarCheck, BiCalendarX, BiLoader, BiLockAlt } from 'react-icons/bi';
import { useAuth } from '../context/AuthContext';
import GridBackground from '../components/shared/GridBackground';
import { invitations } from '../services/api';

export default function InvitationPage() {
    const { token } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [invitation, setInvitation] = useState(null);
    const [meeting, setMeeting] = useState(null);
    const navigate = useNavigate();
    const { user, login } = useAuth();

    useEffect(() => {
        const fetchInvitation = async () => {
            try {
                // Use the invitations API service instead of direct axios call
                const response = await invitations.getInvitation(token);
                console.log('Invitation response:', response);
                
                if (response.data && response.data.data) {
                    setInvitation(response.data.data.invitation);
                    setMeeting(response.data.data.meeting);
                } else {
                    console.error('Unexpected response format:', response);
                    setError('Invalid invitation format');
                    toast.error('Invalid invitation format');
                }
            } catch (error) {
                console.error('Error fetching invitation:', error);
                setError(error.response?.data?.error || 'Failed to load invitation');
                toast.error(error.response?.data?.error || 'Failed to load invitation');
            } finally {
                setLoading(false);
            }
        };

        fetchInvitation();
    }, [token]);

    const handleResponse = async (status) => {
        try {
            setLoading(true);
            if (status === 'accepted') {
                await invitations.accept(token);
            } else {
                await invitations.decline(token);
            }
            console.log('Invitation status updated:', status);
            toast.success(`You have ${status === 'accepted' ? 'accepted' : 'declined'} the invitation`);
            
            // If accepted, redirect to dashboard or meeting details
            if (status === 'accepted') {
                if (user) {
                    navigate('/dashboard');
                } else {
                    // Show login prompt
                    setInvitation({
                        ...invitation,
                        status,
                        showLoginPrompt: true
                    });
                }
            }
        } catch (error) {
            console.error('Error updating invitation status:', error);
            toast.error(`Error updating invitation status: ${error.response?.data?.error || 'Failed to update invitation status'}`);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 flex items-center justify-center">
                <GridBackground />
                <div className="text-white text-center">
                    <BiLoader className="animate-spin text-5xl mx-auto mb-4" />
                    <h2 className="text-xl font-semibold">Loading invitation...</h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 flex items-center justify-center">
                <GridBackground />
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 max-w-md w-full text-center">
                    <div className="text-red-400 text-5xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-white mb-4">Invitation Error</h2>
                    <p className="text-blue-200 mb-6">{error}</p>
                    <Link 
                        to="/login" 
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 flex items-center justify-center p-4">
            <GridBackground />
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl z-10"
            >
                <div className="text-center mb-8">
                    <motion.h1 
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        className="text-3xl font-bold bg-clip-text text-transparent 
                                 bg-gradient-to-r from-blue-200 to-blue-400"
                    >
                        Meeting Invitation
                    </motion.h1>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-xl 
                             border border-white/10"
                >
                    {invitation?.status === 'accepted' && invitation?.showLoginPrompt ? (
                        <div className="text-center">
                            <BiLockAlt className="text-5xl text-blue-300 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-white mb-4">Create an Account to Continue</h2>
                            <p className="text-blue-200 mb-6">
                                You've accepted the invitation! Create an account or login to access the meeting details.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link 
                                    to="/register" 
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                                >
                                    Create Account
                                </Link>
                                <Link 
                                    to="/login" 
                                    className="bg-transparent hover:bg-white/10 text-white border border-blue-400 font-medium py-2 px-6 rounded-lg transition-colors"
                                >
                                    Login
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-white mb-2">{meeting?.title}</h2>
                                <p className="text-blue-200">
                                    <span className="font-semibold">Date:</span> {new Date(meeting?.date).toLocaleString()}
                                </p>
                                <p className="text-blue-200">
                                    <span className="font-semibold">Venue:</span> {meeting?.venue}
                                </p>
                                <p className="text-blue-200">
                                    <span className="font-semibold">Organizer:</span> {meeting?.createdBy?.email}
                                </p>
                            </div>
                            
                            <div className="bg-blue-800/30 rounded-lg p-4 mb-6">
                                <h3 className="text-lg font-semibold text-white mb-2">Meeting Summary</h3>
                                <p className="text-blue-200">{meeting?.summary}</p>
                            </div>
                            
                            {invitation?.status === 'pending' ? (
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        onClick={() => handleResponse('accepted')}
                                        disabled={loading}
                                        className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        <BiCalendarCheck className="text-xl" />
                                        Accept Invitation
                                    </button>
                                    <button
                                        onClick={() => handleResponse('declined')}
                                        disabled={loading}
                                        className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        <BiCalendarX className="text-xl" />
                                        Decline
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center p-4 bg-blue-800/20 rounded-lg">
                                    <p className="text-lg text-white">
                                        You have {invitation?.status === 'accepted' ? 'accepted' : 'declined'} this invitation.
                                    </p>
                                    {invitation?.status === 'accepted' && (
                                        <Link 
                                            to={user ? "/dashboard" : "/login"}
                                            className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                                        >
                                            {user ? "Go to Dashboard" : "Login to View Meeting"}
                                        </Link>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
}
