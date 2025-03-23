import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Update form data if user data changes
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      await updateProfile({ name: formData.name });
      // The toast is already shown in the updateProfile function
    } catch (error) {
      // Error toast is shown in the updateProfile function
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Profile Settings</h1>
        
        <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">User Information</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                readOnly
              />
              <p className="mt-1 text-xs text-slate-400">Email address cannot be changed</p>
            </div>
            
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
        
        <div className="bg-slate-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Account Preferences</h2>
          
          <div className="mb-4">
            <h3 className="text-md font-medium text-slate-300 mb-2">Theme</h3>
            <div className="flex items-center space-x-4">
              <button className="w-8 h-8 bg-indigo-600 rounded-full ring-2 ring-white"></button>
              <button className="w-8 h-8 bg-emerald-600 rounded-full"></button>
              <button className="w-8 h-8 bg-amber-600 rounded-full"></button>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="text-md font-medium text-slate-300 mb-2">Notifications</h3>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifications"
                className="mr-2"
                defaultChecked
              />
              <label htmlFor="notifications" className="text-slate-300">
                Receive email notifications
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 