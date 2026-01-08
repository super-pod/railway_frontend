import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../lib/apiClient';
import { Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle } from '../lib/firebaseClient';

const SyncCalendar = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { refreshProfile } = useAuth();

    const handleSync = async () => {
        setLoading(true);
        try {
            const { user, accessToken } = await signInWithGoogle();

            if (accessToken) {
                await apiClient.post('/calendar/sync', {
                    provider: 'google',
                    token: accessToken
                });
                await refreshProfile();
                navigate('/dashboard');
            } else {
                alert("Failed to get Google Calendar access. Please make sure you grant the requested permissions.");
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred during calendar sync.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-8 text-center">
            <Calendar className="w-20 h-20 text-blue-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-white mb-4">Sync Your Calendar</h1>
            <p className="text-blue-200 mb-8">Orca needs to see your availability to help you find the best meeting times.</p>
            <button
                onClick={handleSync}
                disabled={loading}
                className="btn-primary w-full py-4 text-lg"
            >
                {loading ? 'Syncing...' : 'Connect Google Calendar'}
            </button>
        </div>
    );
};

export default SyncCalendar;
