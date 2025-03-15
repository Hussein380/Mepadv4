import { useState, useEffect } from 'react';
import AIChatbot from '../components/ai/AIChatbot';
import { meetings, dashboard } from '../services/api';
import { BiBot, BiInfoCircle } from 'react-icons/bi';

export default function AIChatbotPage() {
  const [meetingsData, setMeetingsData] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch meetings data
        const meetingsResponse = await meetings.getAll();
        setMeetingsData(meetingsResponse.data.data || []);
        
        // Fetch dashboard data using the correct function
        const dashboardResponse = await dashboard.getData();
        setDashboardData(dashboardResponse.data.data || {});
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.displayMessage || 'Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <BiBot className="text-3xl text-indigo-400" />
        <h1 className="text-2xl font-bold text-white">AI Assistant</h1>
      </div>

      {/* Info Card */}
      <div className="bg-indigo-900/20 border border-indigo-800/30 rounded-lg p-4 mb-8 flex items-start gap-3">
        <BiInfoCircle className="text-indigo-400 text-xl flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-indigo-300 font-medium mb-1">About AI Assistant</h3>
          <p className="text-slate-300 text-sm">
            This AI-powered assistant can help you with information about your meetings, dashboard data, and MePad features.
            Ask questions like "What meetings do I have this week?", "How many tasks are overdue?", or "How do I create a new meeting?"
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="bg-slate-900/30 backdrop-blur-md rounded-xl p-6 border border-indigo-900/20 h-[500px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-300">Loading your data...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-4 mb-8">
          <h3 className="text-red-300 font-medium mb-1">Error</h3>
          <p className="text-slate-300 text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-800/30 hover:bg-red-800/50 text-red-300 rounded-lg transition-colors text-sm"
          >
            Try Again
          </button>
        </div>
      ) : (
        <AIChatbot userMeetings={meetingsData} dashboardData={dashboardData} />
      )}
    </div>
  );
} 