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
        <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Create New Meeting</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Meeting Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="Enter meeting title"
                    />
                </div>

                {/* Date and Duration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                            Date and Time
                        </label>
                        <input
                            type="datetime-local"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                            Duration (minutes)
                        </label>
                        <input
                            type="number"
                            id="duration"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            min="15"
                            step="15"
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                </div>

                {/* Venue */}
                <div>
                    <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-1">
                        Venue
                    </label>
                    <input
                        type="text"
                        id="venue"
                        name="venue"
                        value={formData.venue}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="Enter meeting location"
                    />
                </div>

                {/* Summary */}
                <div>
                    <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
                        Meeting Summary
                    </label>
                    <textarea
                        id="summary"
                        name="summary"
                        value={formData.summary}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="Enter meeting summary or agenda"
                    ></textarea>
                </div>

                {/* Participants Section */}
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h3 className="text-lg font-semibold">Participants</h3>
                        <button
                            type="button"
                            onClick={handleAddParticipant}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 
                                     transition-colors w-full sm:w-auto text-center whitespace-nowrap"
                        >
                            Add Participant
                        </button>
                    </div>

                    {participants.map((participant, index) => (
                        <div 
                            key={index} 
                            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-gray-50 rounded-md"
                        >
                            <div className="w-full sm:w-1/3">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={participant.name}
                                    onChange={(e) => handleParticipantChange(index, 'name', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
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
                                />
                            </div>
                            <div className="w-full sm:w-1/3">
                                <select
                                    value={participant.role}
                                    onChange={(e) => handleParticipantChange(index, 'role', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md"
                                >
                                    <option value="viewer">Viewer</option>
                                    <option value="contributor">Contributor</option>
                                </select>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemoveParticipant(index)}
                                className="text-red-600 hover:text-red-700 px-2 py-1 rounded-md 
                                         hover:bg-red-50 transition-colors w-full sm:w-auto text-center"
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
                        disabled={isSubmitting}
                        className={`${
                            isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                        } text-white px-6 py-2 rounded-md transition-colors w-full sm:w-auto text-center`}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Meeting'}
                    </button>
                </div>
            </form>
        </div>
    );
}