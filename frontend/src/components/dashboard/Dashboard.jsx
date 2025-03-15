import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboard } from '../../services/api';
import { 
    BiCalendar, 
    BiPlus, 
    BiCheckCircle, 
    BiRefresh, 
    BiChevronRight,
    BiTimeFive,
    BiTask,
    BiLineChart,
    BiBot
} from 'react-icons/bi';
import { 
    AiOutlineClockCircle, 
    AiOutlineCheckCircle, 
    AiOutlineUnorderedList,
    AiOutlineFire,
    AiOutlineUser,
    AiOutlineCalendar
} from 'react-icons/ai';
import { FaUserFriends } from 'react-icons/fa';
import toast from 'react-hot-toast';
import LoadingSpinner from '../shared/LoadingSpinner';
import StatCard from '../shared/StatCard';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [recentMeetings, setRecentMeetings] = useState([]);
    const [pendingActions, setPendingActions] = useState([]);
    const [myAssignedActions, setMyAssignedActions] = useState([]);
    const [invitedMeetings, setInvitedMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchDashboardData = async () => {
        setRefreshing(true);
        try {
            const response = await dashboard.getData();
            setStats(response.data.data.stats);
            setRecentMeetings(response.data.data.recentMeetings);
            setPendingActions(response.data.data.pendingActions);
            setMyAssignedActions(response.data.data.myAssignedActions || []);
            setInvitedMeetings(response.data.data.invitedMeetings || []);
            if (refreshing) toast.success('Dashboard refreshed');
        } catch (error) {
            toast.error('Failed to fetch dashboard data');
            console.error('Dashboard error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Get current date for calendar view
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear();

    // Filter upcoming meetings for this month
    const thisMonthMeetings = [...recentMeetings, ...invitedMeetings].filter(meeting => {
        const meetingDate = new Date(meeting.date);
        return meetingDate.getMonth() === currentDate.getMonth() && 
               meetingDate.getFullYear() === currentDate.getFullYear();
    });

    if (loading) return <LoadingSpinner />;
    if (!stats) return <div>No data available</div>;

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-2">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-violet-300">
                        Welcome to MePad
                    </h1>
                    <p className="text-slate-400 mt-1">Your meeting management dashboard</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button 
                        onClick={fetchDashboardData}
                        className="bg-slate-800/80 hover:bg-slate-700/80 text-white px-4 py-2 rounded-lg 
                                 transition-all shadow-lg flex items-center justify-center gap-2 border border-slate-700/50"
                        disabled={refreshing}
                    >
                        <BiRefresh className={refreshing ? "animate-spin" : ""} />
                        <span>Refresh</span>
                    </button>
                    <Link
                        to="/meetings/new"
                        className="bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 
                                 text-white px-4 py-2 rounded-lg transition-all shadow-lg flex-1 sm:flex-initial 
                                 flex items-center justify-center gap-2"
                    >
                        <BiPlus />
                        <span>New Meeting</span>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    title="Total Meetings"
                    value={stats.totalMeetings}
                    icon={<BiCalendar />}
                    color="indigo"
                />
                <StatCard
                    title="Upcoming"
                    value={stats.upcomingMeetings}
                    icon={<AiOutlineClockCircle />}
                    color="violet"
                />
                <StatCard
                    title="Pending Actions"
                    value={stats.pendingActions}
                    icon={<AiOutlineUnorderedList />}
                    color="fuchsia"
                />
                <StatCard
                    title="Completed"
                    value={stats.completedActions}
                    icon={<AiOutlineCheckCircle />}
                    color="purple"
                />
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-900/30 backdrop-blur-md rounded-xl p-6 border border-indigo-900/20 shadow-xl">
                <h2 className="text-lg font-semibold mb-5 text-white flex items-center gap-2">
                    <AiOutlineFire className="text-fuchsia-400" />
                    <span>Quick Actions</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Link to="/meetings/new" className="group">
                        <div className="bg-slate-800/50 hover:bg-slate-700/50 p-5 rounded-xl flex flex-col items-center justify-center gap-3 transition-all border border-slate-700/50 group-hover:border-indigo-500/30 h-full">
                            <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-all">
                                <BiPlus className="text-2xl text-indigo-400 group-hover:text-indigo-300" />
                            </div>
                            <span className="text-sm font-medium text-slate-300 group-hover:text-white">New Meeting</span>
                        </div>
                    </Link>
                    <Link to="/meetings" className="group">
                        <div className="bg-slate-800/50 hover:bg-slate-700/50 p-5 rounded-xl flex flex-col items-center justify-center gap-3 transition-all border border-slate-700/50 group-hover:border-violet-500/30 h-full">
                            <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center group-hover:bg-violet-500/20 transition-all">
                                <BiCalendar className="text-2xl text-violet-400 group-hover:text-violet-300" />
                            </div>
                            <span className="text-sm font-medium text-slate-300 group-hover:text-white">All Meetings</span>
                        </div>
                    </Link>
                    <Link to="/tasks" className="group">
                        <div className="bg-slate-800/50 hover:bg-slate-700/50 p-5 rounded-xl flex flex-col items-center justify-center gap-3 transition-all border border-slate-700/50 group-hover:border-fuchsia-500/30 h-full">
                            <div className="w-12 h-12 rounded-full bg-fuchsia-500/10 flex items-center justify-center group-hover:bg-fuchsia-500/20 transition-all">
                                <BiTask className="text-2xl text-fuchsia-400 group-hover:text-fuchsia-300" />
                            </div>
                            <span className="text-sm font-medium text-slate-300 group-hover:text-white">My Tasks</span>
                        </div>
                    </Link>
                    <Link to="/ai-assistant" className="group">
                        <div className="bg-slate-800/50 hover:bg-slate-700/50 p-5 rounded-xl flex flex-col items-center justify-center gap-3 transition-all border border-slate-700/50 group-hover:border-purple-500/30 h-full">
                            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-all">
                                <BiBot className="text-2xl text-purple-400 group-hover:text-purple-300" />
                            </div>
                            <span className="text-sm font-medium text-slate-300 group-hover:text-white">AI Assistant</span>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Calendar View */}
            {thisMonthMeetings.length > 0 && (
                <div className="bg-slate-900/30 backdrop-blur-md rounded-xl p-6 border border-indigo-900/20 shadow-xl">
                    <h2 className="text-lg font-semibold mb-5 text-white flex items-center gap-2">
                        <AiOutlineCalendar className="text-indigo-400" />
                        <span>Meetings This Month ({currentMonth} {currentYear})</span>
                    </h2>
                    <div className="space-y-3">
                        {thisMonthMeetings.map((meeting) => {
                            const meetingDate = new Date(meeting.date);
                            const dayOfMonth = meetingDate.getDate();
                            const dayName = meetingDate.toLocaleDateString('en-US', { weekday: 'short' });
                            
                            return (
                                <div key={meeting._id}>
                                    <Link
                                        to={`/meetings/${meeting._id}`}
                                        className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 
                                                 border border-slate-700/50 hover:border-indigo-500/30 transition-all group"
                                    >
                                        <div className="flex-shrink-0 w-16 h-16 bg-indigo-500/10 rounded-xl flex flex-col items-center justify-center group-hover:bg-indigo-500/20 transition-all">
                                            <span className="text-xl font-bold text-white">{dayOfMonth}</span>
                                            <span className="text-xs text-indigo-300">{dayName}</span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-white group-hover:text-indigo-300 transition-colors">{meeting.title}</h3>
                                            <div className="flex items-center text-sm text-slate-400 mt-1">
                                                <BiTimeFive className="mr-1" />
                                                <span>{meetingDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                                <span className="mx-2">•</span>
                                                <span>{meeting.venue}</span>
                                            </div>
                                        </div>
                                        <div className="text-slate-500 group-hover:text-indigo-400 transition-colors">
                                            <BiChevronRight className="text-xl" />
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Recent Meetings & Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Meetings */}
                <div className="bg-slate-900/30 backdrop-blur-md rounded-xl p-6 border border-indigo-900/20 shadow-xl h-full">
                    <h2 className="text-lg font-semibold mb-5 text-white flex items-center gap-2">
                        <BiCalendar className="text-violet-400" />
                        <span>Recent Meetings</span>
                    </h2>
                    <div className="space-y-3">
                        {recentMeetings.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 mx-auto bg-slate-800/50 rounded-full flex items-center justify-center mb-3">
                                    <BiCalendar className="text-2xl text-slate-500" />
                                </div>
                                <p className="text-slate-400">No recent meetings</p>
                            </div>
                        ) : (
                            recentMeetings.map((meeting) => (
                                <div key={meeting._id}>
                                    <Link
                                        to={`/meetings/${meeting._id}`}
                                        className="block p-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 
                                                 border border-slate-700/50 hover:border-violet-500/30 transition-all group"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                            <div>
                                                <h3 className="font-medium text-white group-hover:text-violet-300 transition-colors">{meeting.title}</h3>
                                                <p className="text-sm text-slate-400 mt-1">{meeting.venue}</p>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="text-xs px-2 py-1 rounded-full bg-slate-700/50 text-slate-300">
                                                    {new Date(meeting.date).toLocaleDateString()}
                                                </span>
                                                <BiChevronRight className="text-xl text-slate-500 group-hover:text-violet-400 transition-colors ml-2" />
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Pending Actions */}
                <div className="bg-slate-900/30 backdrop-blur-md rounded-xl p-6 border border-indigo-900/20 shadow-xl h-full">
                    <h2 className="text-lg font-semibold mb-5 text-white flex items-center gap-2">
                        <AiOutlineUnorderedList className="text-fuchsia-400" />
                        <span>Pending Actions</span>
                    </h2>
                    <div className="space-y-3">
                        {pendingActions.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 mx-auto bg-slate-800/50 rounded-full flex items-center justify-center mb-3">
                                    <AiOutlineCheckCircle className="text-2xl text-slate-500" />
                                </div>
                                <p className="text-slate-400">No pending actions</p>
                            </div>
                        ) : (
                            pendingActions.map((action) => (
                                <div key={action._id}>
                                    <Link
                                        to={`/meetings/${action.meetingId}`}
                                        className="block p-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 
                                                 border border-slate-700/50 hover:border-fuchsia-500/30 transition-all group"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium text-white group-hover:text-fuchsia-300 transition-colors">{action.description}</h3>
                                                <div className="flex items-center mt-2">
                                                    <div className="flex items-center text-xs text-slate-400">
                                                        <AiOutlineUser className="mr-1" />
                                                        <span>{action.assignedTo}</span>
                                                    </div>
                                                    <span className="mx-2 text-slate-600">•</span>
                                                    <div className="text-xs px-2 py-1 rounded-full bg-fuchsia-500/10 text-fuchsia-300">
                                                        Due: {new Date(action.dueDate).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <BiChevronRight className="text-xl text-slate-500 group-hover:text-fuchsia-400 transition-colors" />
                                        </div>
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}