import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import apiClient from '../lib/apiClient';
import { useAuth } from '../context/AuthContext';

const PodInvite = () => {
    const { token } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { profile } = useAuth();
    const [pod, setPod] = useState<any>(null);
    const [inviteEmails, setInviteEmails] = useState<string[]>([]);
    const [inviteJoinedEmails, setInviteJoinedEmails] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            setError('Invalid invite link.');
            setLoading(false);
            return;
        }
        const fetchInvite = async () => {
            setLoading(true);
            try {
                const res = await apiClient.get(`/pods/invite/${token}`);
                setPod(res.data?.pod || null);
                setInviteEmails(res.data?.invite_emails || []);
                setInviteJoinedEmails(res.data?.invite_joined_emails || []);
                setError(null);
            } catch (err: any) {
                const message = err.response?.data?.detail || 'Unable to load invite.';
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        fetchInvite();
    }, [token]);

    const isJoined = useMemo(() => {
        if (!profile?.email) {
            return false;
        }
        return inviteJoinedEmails
            .map(email => email.toLowerCase())
            .includes(profile.email.toLowerCase());
    }, [inviteJoinedEmails, profile]);

    useEffect(() => {
        if (!pod || !profile?.is_calendar_synced || isJoined || joining) {
            return;
        }
        if (pod.status === 'closed') {
            return;
        }
        setJoining(true);
        apiClient.post(`/pods/${pod.id}/join`)
            .then(res => {
                setInviteEmails(res.data?.invite_emails || []);
                setInviteJoinedEmails(res.data?.invite_joined_emails || []);
            })
            .catch(err => console.error(err))
            .finally(() => setJoining(false));
    }, [pod, profile, isJoined, joining]);

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 max-w-xl mx-auto">
                <div className="card p-8 text-center">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    const fromState = (location.state as any)?.from;

    return (
        <div className="p-6 max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-[#061E29] mb-2">You are invited</h1>
                <p className="text-sm text-[#061E29]/60">
                    This invite lets you join a pod after signing in and syncing your calendar.
                </p>
            </div>

            <div className="card p-5">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-medium text-[#061E29]">Pod Details</h2>
                    <span className={`text-xs px-2 py-1 rounded ${pod?.status === 'running'
                            ? 'bg-blue-100 text-blue-700'
                            : pod?.status === 'pending_review'
                                ? 'bg-amber-100 text-amber-700'
                                : pod?.status === 'closed'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-[#F3F4F4] text-[#061E29]/60'
                        }`}>
                        {pod?.status ? pod.status.replace('_', ' ') : 'idle'}
                    </span>
                </div>
                <p className="text-base text-[#061E29]">{pod?.description || 'Pod invitation'}</p>
            </div>

            <div className="card p-5 space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-medium text-[#061E29]">Your Status</h2>
                    <span className={`text-xs px-2 py-1 rounded ${isJoined ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {isJoined ? 'Joined' : 'Pending'}
                    </span>
                </div>
                <p className="text-xs text-[#061E29]/60">
                    {pod?.status === 'closed'
                        ? 'This pod has been closed by the owner.'
                        : isJoined
                            ? 'You have joined this pod.'
                            : 'Sync your calendar to join the pod.'}
                </p>
                {pod?.status !== 'closed' && !profile?.is_calendar_synced && (
                    <button
                        type="button"
                        className="btn btn-primary w-full"
                        onClick={() => navigate('/sync-calendar', { state: { from: fromState || location } })}
                    >
                        Sync Calendar
                    </button>
                )}
                {pod?.status !== 'closed' && profile?.is_calendar_synced && (
                    <button
                        type="button"
                        className="btn btn-secondary w-full"
                        onClick={() => navigate(`/pods/${pod.id}`)}
                    >
                        Open Pod
                    </button>
                )}
                {pod?.status === 'closed' && (
                    <button
                        type="button"
                        className="btn btn-secondary w-full"
                        onClick={() => navigate('/dashboard')}
                    >
                        Back to Dashboard
                    </button>
                )}
            </div>
        </div>
    );
};

export default PodInvite;
