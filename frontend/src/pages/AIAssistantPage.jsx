import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MeetingAssistant from '../components/ai/MeetingAssistant';
import { BiArrowBack, BiInfoCircle } from 'react-icons/bi';
import toast from 'react-hot-toast';
import { meetings } from '../services/api';

export default function AIAssistantPage() {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const [meetingData, setMeetingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If a meetingId is provided, fetch the meeting data
    if (meetingId) {
      setLoading(true);
      
      meetings.getOne(meetingId)
        .then(response => {
          const meeting = response.data.data;
          
          // Transform the meeting data to the format expected by the AI Assistant
          setMeetingData({
            id: meeting._id,
            title: meeting.title,
            date: meeting.date,
            participants: meeting.participants?.map(p => p.name || p.email) || [],
            notes: meeting.summary || '',
          });
        })
        .catch(error => {
          console.error('Error fetching meeting:', error);
          setError(error.message || 'Failed to fetch meeting data');
          toast.error('Failed to fetch meeting data');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [meetingId]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all"
          >
            <BiArrowBack />
          </button>
          <h1 className="text-2xl font-bold text-white">AI Meeting Assistant</h1>
        </div>
        
        {meetingId && (
          <div className="text-sm text-slate-400">
            Meeting ID: {meetingId}
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="bg-indigo-900/20 border border-indigo-800/30 rounded-lg p-4 mb-8 flex items-start gap-3">
        <BiInfoCircle className="text-indigo-400 text-xl flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-indigo-300 font-medium mb-1">About AI Meeting Assistant</h3>
          <p className="text-slate-300 text-sm">
            This AI-powered assistant helps you get more out of your meetings. You can summarize meeting notes, 
            extract action items, generate meeting agendas, and analyze meeting sentiment. 
            All processing is done securely through the Gemini AI API.
          </p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-4 mb-8">
          <h3 className="text-red-300 font-medium mb-1">Error</h3>
          <p className="text-slate-300 text-sm">{error}</p>
        </div>
      )}

      {/* Meeting Context (if a meeting is selected) */}
      {meetingId && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-white mb-4">Meeting Context</h2>
          {loading ? (
            <div className="bg-slate-900/30 backdrop-blur-md rounded-xl p-6 border border-indigo-900/20 animate-pulse">
              <div className="h-6 bg-slate-800/50 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-slate-800/50 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-slate-800/50 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-slate-800/50 rounded w-1/3"></div>
            </div>
          ) : meetingData ? (
            <div className="bg-slate-900/30 backdrop-blur-md rounded-xl p-6 border border-indigo-900/20">
              <h3 className="text-xl font-semibold text-white mb-2">{meetingData.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-slate-400">Date</p>
                  <p className="text-white">{new Date(meetingData.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Participants</p>
                  <p className="text-white">{meetingData.participants.join(', ')}</p>
                </div>
              </div>
              {meetingData.notes && (
                <div>
                  <p className="text-sm text-slate-400 mb-1">Meeting Notes</p>
                  <p className="text-white bg-slate-800/50 p-3 rounded-lg">{meetingData.notes}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900/30 backdrop-blur-md rounded-xl p-6 border border-indigo-900/20">
              <p className="text-slate-300">No meeting data available.</p>
            </div>
          )}
        </div>
      )}

      {/* AI Meeting Assistant Component */}
      <MeetingAssistant meetingId={meetingId} meetingData={meetingData} />
    </div>
  );
} 