import { useState } from 'react';
import { motion } from 'framer-motion';
import { BiEnvelope, BiPlus, BiX, BiLoaderAlt } from 'react-icons/bi';
import toast from 'react-hot-toast';
import InvitationLinks from './InvitationLinks';
import { meetings } from '../../services/api';

export default function InviteParticipants({ meetingId, onSuccess }) {
    const [participants, setParticipants] = useState([
        { name: '', email: '', role: 'viewer' }
    ]);
    const [loading, setLoading] = useState(false);
    const [invitationLinks, setInvitationLinks] = useState(null);

    const handleAddParticipant = () => {
        setParticipants([...participants, { name: '', email: '', role: 'viewer' }]);
    };

    const handleRemoveParticipant = (index) => {
        const newParticipants = [...participants];
        newParticipants.splice(index, 1);
        setParticipants(newParticipants);
    };

    const handleParticipantChange = (index, field, value) => {
        const newParticipants = [...participants];
        newParticipants[index][field] = value;
        setParticipants(newParticipants);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate inputs
        const validParticipants = participants.filter(p => p.name.trim() && p.email.trim());
        if (validParticipants.length === 0) {
            toast.error('Please add at least one participant with name and email');
            return;
        }
        
        setLoading(true);
        try {
            console.log('Sending invitation request for meeting:', meetingId);
            console.log('Participants:', validParticipants);
            
            const response = await meetings.sendInvitations(meetingId, validParticipants);
            console.log('Invitation response:', response);
            
            toast.success('Invitations sent successfully! Participants will receive an email with meeting details.');
            
            // Store the invitation links - handle different response formats
            if (response.data && response.data.data && response.data.data.invitationLinks) {
                setInvitationLinks(response.data.data.invitationLinks);
                if (onSuccess) onSuccess(response.data.data);
            } else if (response.data && response.data.invitationLinks) {
                setInvitationLinks(response.data.invitationLinks);
                if (onSuccess) onSuccess(response.data);
            } else {
                console.error('Unexpected response format:', response);
                toast.error('Received invitation links in an unexpected format');
            }
        } catch (error) {
            console.error('Error generating invitation links:', error);
            toast.error(error.response?.data?.error || 'Failed to generate invitation links');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseInvitationLinks = () => {
        setInvitationLinks(null);
        // Reset form
        setParticipants([{ name: '', email: '', role: 'viewer' }]);
    };

    return (
        <>
            <div className="bg-blue-800/20 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <BiEnvelope className="mr-2" /> Invite Participants
                </h3>
                
                <form onSubmit={handleSubmit}>
                    {participants.map((participant, index) => (
                        <div key={index} className="flex flex-wrap gap-2 mb-3 items-start">
                            <div className="flex-1 min-w-[200px]">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={participant.name}
                                    onChange={(e) => handleParticipantChange(index, 'name', e.target.value)}
                                    className="w-full bg-blue-900/50 border border-blue-700 rounded px-3 py-2 text-white placeholder-blue-300"
                                    required
                                />
                            </div>
                            <div className="flex-1 min-w-[200px]">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={participant.email}
                                    onChange={(e) => handleParticipantChange(index, 'email', e.target.value)}
                                    className="w-full bg-blue-900/50 border border-blue-700 rounded px-3 py-2 text-white placeholder-blue-300"
                                    required
                                />
                            </div>
                            <div className="w-[120px]">
                                <select
                                    value={participant.role}
                                    onChange={(e) => handleParticipantChange(index, 'role', e.target.value)}
                                    className="w-full bg-blue-900/50 border border-blue-700 rounded px-3 py-2 text-white"
                                >
                                    <option value="viewer">Viewer</option>
                                    <option value="contributor">Contributor</option>
                                </select>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemoveParticipant(index)}
                                className="p-2 text-red-400 hover:text-red-300 transition-colors"
                                disabled={participants.length === 1}
                            >
                                <BiX className="text-xl" />
                            </button>
                        </div>
                    ))}
                    
                    <div className="flex justify-between mt-4">
                        <motion.button
                            type="button"
                            onClick={handleAddParticipant}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center text-blue-300 hover:text-blue-200 transition-colors"
                        >
                            <BiPlus className="mr-1" /> Add Another Participant
                        </motion.button>
                        
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center transition-colors disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <BiLoaderAlt className="animate-spin mr-2" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <BiEnvelope className="mr-2" />
                                    Generate Invitation Links
                                </>
                            )}
                        </motion.button>
                    </div>
                </form>
            </div>
            
            {/* Modal to display invitation links */}
            {invitationLinks && (
                <InvitationLinks 
                    invitationLinks={invitationLinks} 
                    onClose={handleCloseInvitationLinks} 
                />
            )}
        </>
    );
}
