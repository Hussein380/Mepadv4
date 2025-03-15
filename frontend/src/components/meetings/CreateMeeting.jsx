import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { meetings } from '../../services/api';
import toast from 'react-hot-toast';

export default function CreateMeeting() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        venue: '',
        summary: '',
        duration: 60,
    });
    const [participants, setParticipants] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleParticipantChange = (index, field, value) => {
        const updatedParticipants = [...participants];
        updatedParticipants[index] = {
            ...updatedParticipants[index],
            [field]: value
        };
        setParticipants(updatedParticipants);
    };

    const handleAddParticipant = () => {
        setParticipants([...participants, { name: '', email: '', role: 'viewer' }]);
        
        // Ensure the new fields are properly styled after they're added
        setTimeout(() => {
            const newInputs = document.querySelectorAll('.participant-row:last-child input, .participant-row:last-child select');
            newInputs.forEach(input => {
                input.style.color = 'white';
                input.style.backgroundColor = '#1e293b';
                input.style.caretColor = 'white';
                input.style.borderColor = '#3b82f6';
            });
        }, 0);
    };

    const handleRemoveParticipant = (index) => {
        setParticipants(participants.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Create meeting with participants
            const meetingData = {
                ...formData,
                participants
            };

            const response = await meetings.create(meetingData);
            
            toast.success('Meeting created successfully!');
            
            // Add a slight delay before redirecting to ensure the meeting is properly saved
            setTimeout(() => {
                // Redirect to meetings list instead of dashboard
                navigate('/meetings');
            }, 1000);
        } catch (error) {
            console.error('Error creating meeting:', error);
            toast.error(error.displayMessage || 'Failed to create meeting');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 py-8">
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6 text-white">Create New Meeting</h1>
                <form onSubmit={handleSubmit} className="space-y-6 bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-blue-100">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-blue-700"
                            placeholder="Enter meeting title"
                            style={{
                                backgroundColor: '#1e293b',
                                color: 'white',
                                caretColor: 'white'
                            }}
                        />
                    </div>

                    {/* Date and Duration */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-blue-100">Date and Time</label>
                            <input
                                type="datetime-local"
                                name="dateTime"
                                value={formData.dateTime}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 rounded-lg border border-blue-700"
                                style={{
                                    backgroundColor: '#1e293b',
                                    color: 'white',
                                    caretColor: 'white'
                                }}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-blue-100">Duration (minutes)</label>
                            <input
                                type="number"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 rounded-lg border border-blue-700"
                                style={{
                                    backgroundColor: '#1e293b',
                                    color: 'white',
                                    caretColor: 'white'
                                }}
                            />
                        </div>
                    </div>

                    {/* Venue */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-blue-100">Venue</label>
                        <input
                            type="text"
                            name="venue"
                            value={formData.venue}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-blue-700"
                            placeholder="Enter meeting location"
                            style={{
                                backgroundColor: '#1e293b',
                                color: 'white',
                                caretColor: 'white'
                            }}
                        />
                    </div>

                    {/* Summary */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-blue-100">Meeting Summary</label>
                        <textarea
                            name="summary"
                            value={formData.summary}
                            onChange={handleChange}
                            required
                            rows="4"
                            className="w-full px-4 py-2 rounded-lg border border-blue-700"
                            placeholder="Enter meeting summary or agenda"
                            style={{
                                backgroundColor: '#1e293b',
                                color: 'white',
                                caretColor: 'white'
                            }}
                        ></textarea>
                    </div>

                    {/* Participants Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-blue-100">Participants</h3>
                            <button
                                type="button"
                                onClick={handleAddParticipant}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg 
                                         shadow-lg transition-all flex items-center gap-2"
                            >
                                Add Participant
                            </button>
                        </div>

                        {participants.map((participant, index) => (
                            <div 
                                key={index} 
                                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-slate-800 rounded-md participant-row"
                            >
                                <div className="w-full sm:w-1/3">
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        value={participant.name}
                                        onChange={(e) => handleParticipantChange(index, 'name', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-md"
                                        required
                                        style={{
                                            color: 'white',
                                            backgroundColor: '#1e293b',
                                            caretColor: 'white',
                                            borderColor: '#3b82f6'
                                        }}
                                    />
                                </div>
                                <div className="w-full sm:w-1/3">
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={participant.email}
                                        onChange={(e) => handleParticipantChange(index, 'email', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-md"
                                        required
                                        style={{
                                            color: 'white',
                                            backgroundColor: '#1e293b',
                                            caretColor: 'white',
                                            borderColor: '#3b82f6'
                                        }}
                                    />
                                </div>
                                <div className="w-full sm:w-1/3">
                                    <select
                                        value={participant.role}
                                        onChange={(e) => handleParticipantChange(index, 'role', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-md"
                                        style={{
                                            color: 'white',
                                            backgroundColor: '#1e293b',
                                            caretColor: 'white',
                                            borderColor: '#3b82f6'
                                        }}
                                    >
                                        <option value="viewer" style={{ backgroundColor: '#1e293b' }}>Viewer</option>
                                        <option value="contributor" style={{ backgroundColor: '#1e293b' }}>Contributor</option>
                                    </select>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveParticipant(index)}
                                    className="text-red-400 hover:text-red-300 bg-red-900/30 px-2 py-1 rounded"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 
                                    hover:from-blue-500 hover:to-blue-400 text-white rounded-lg shadow-lg 
                                    transition-all transform hover:-translate-y-1"
                        >
                            Create Meeting
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}