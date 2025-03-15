import { RouterProvider, createBrowserRouter, Outlet, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import Layout from './components/layout/Layout';
import MeetingList from './components/meetings/MeetingList';
import CreateMeeting from './components/meetings/CreateMeeting';
import MeetingDetail from './components/meetings/MeetingDetail';
import Tasks from './components/tasks/Tasks';
import InvitationPage from './pages/InvitationPage';
import PrivateRoute from './components/auth/PrivateRoute';
import ErrorBoundary from './components/shared/ErrorBoundary';
import AIAssistantPage from './pages/AIAssistantPage';
import AIChatbotPage from './pages/AIChatbotPage';

const router = createBrowserRouter([
    {
        element: (
            <AuthProvider>
                <Toaster />
                <ErrorBoundary>
                    {/* Outlet will be rendered here */}
                    <Outlet />
                </ErrorBoundary>
            </AuthProvider>
        ),
        children: [
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/register",
                element: <Register />
            },
            {
                path: "/invitation/:token",
                element: <InvitationPage />
            },
            {
                element: <PrivateRoute><Layout /></PrivateRoute>,
                children: [
                    {
                        path: "/",
                        element: <Dashboard />
                    },
                    {
                        path: "/dashboard",
                        element: <Dashboard />
                    },
                    {
                        path: "/meetings",
                        element: <MeetingList />
                    },
                    {
                        path: "/meetings/new",
                        element: <CreateMeeting />
                    },
                    {
                        path: "/meetings/:id",
                        element: <MeetingDetail />
                    },
                    {
                        path: "/tasks",
                        element: <Tasks />
                    },
                    {
                        path: "/ai-assistant",
                        element: <AIAssistantPage />
                    },
                    {
                        path: "/ai-assistant/:meetingId",
                        element: <AIAssistantPage />
                    },
                    {
                        path: "/ai-chatbot",
                        element: <AIChatbotPage />
                    }
                ]
            }
        ]
    }
]);

export default function App() {
    return <RouterProvider router={router} />;
} 