import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../lib/apiClient';
import { Waves } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SyncCalendar = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { refreshProfile } = useAuth();
    const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const oauthStatus = searchParams.get('status');
    const oauthMessage = searchParams.get('message');
    const oauthFrom = searchParams.get('from');

    const handleSync = async () => {
        setLoading(true);
        try {
            const from = (location.state as any)?.from?.pathname || '';
            const res = await apiClient.post('/calendar/oauth/start', { from_path: from });
            const authUrl = res.data?.auth_url;
            if (!authUrl) {
                alert('Failed to start Google Calendar OAuth flow.');
                return;
            }
            window.location.assign(authUrl);
        } catch (err: any) {
            console.error(err);
            const message = err.response?.data?.detail || err.message || "An error occurred during calendar sync.";
            alert(`Sync Failed: ${message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!oauthStatus) {
            return;
        }
        if (oauthStatus === 'error') {
            if (oauthMessage) {
                alert(`Sync Failed: ${oauthMessage}`);
            }
            return;
        }
        const finish = async () => {
            await refreshProfile();
            const profileRes = await apiClient.post('/auth/me');
            if (!profileRes.data.user?.has_orca) {
                navigate('/setup-orca', { state: { from: oauthFrom ? { pathname: oauthFrom } : location } });
                return;
            }
            navigate(oauthFrom || '/dashboard');
        };
        finish().catch((err) => console.error(err));
    }, [oauthStatus, oauthMessage, oauthFrom, refreshProfile, navigate, location]);

    return (
        <div className="min-h-screen bg-[#F3F4F4] flex items-center justify-center p-6">
            <div className="max-w-md w-full">
                <div className="card p-10 text-center">
                    {/* Logo */}
                    <div className="w-12 h-12 bg-[#061E29] rounded-lg flex items-center justify-center mx-auto mb-6">
                        <Waves className="w-6 h-6 text-[#5F9598]" strokeWidth={2} />
                    </div>

                    <h1 className="text-2xl font-semibold text-[#061E29] mb-3">Sync Your Calendar</h1>
                    <p className="text-sm text-[#061E29]/60 mb-8 leading-relaxed">
                        Connect your Google Calendar to help Orca find the best meeting times for your group.
                    </p>

                    <button
                        onClick={handleSync}
                        disabled={loading}
                        className="w-full btn btn-primary py-3"
                    >
                        {loading ? 'Connecting...' : 'Connect Google Calendar'}
                    </button>

                    <p className="mt-6 text-xs text-[#061E29]/40">
                        Secured via Google OAuth
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SyncCalendar;
