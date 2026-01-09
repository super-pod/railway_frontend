import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../lib/apiClient';
import { Target, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PodDetail = () => {
    const { podId } = useParams();
    const { profile } = useAuth();
    const [pod, setPod] = useState<any>(null);
    const [goals, setGoals] = useState<any[]>([]);
    const [inviteEmails, setInviteEmails] = useState<string[]>([]);
    const [inviteJoinedEmails, setInviteJoinedEmails] = useState<string[]>([]);
    const [inviteEmailInput, setInviteEmailInput] = useState('');
    const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        const fetchPod = async () => {
            try {
                const [podRes, goalsRes] = await Promise.all([
                    apiClient.get(`/pods/${podId}`),
                    apiClient.get(`/goals/${podId}`)
                ]);
                setPod(podRes.data);
                setGoals(goalsRes.data);
                setInviteEmails(podRes.data?.invite_emails || []);
                setInviteJoinedEmails(podRes.data?.invite_joined_emails || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPod();
    }, [podId]);

    useEffect(() => {
        if (!podId || !pod || !profile?.email) {
            return;
        }
        const invited = (pod.invite_emails || []).some(
            (email: string) => email.toLowerCase() === profile.email.toLowerCase()
        );
        const alreadyJoined = (pod.invite_joined_emails || []).some(
            (email: string) => email.toLowerCase() === profile.email.toLowerCase()
        );
        if (!invited || alreadyJoined) {
            return;
        }
        apiClient.post(`/pods/${podId}/join`)
            .then(res => {
                setInviteEmails(res.data?.invite_emails || []);
                setInviteJoinedEmails(res.data?.invite_joined_emails || []);
            })
            .catch(err => console.error(err));
    }, [podId, pod, profile]);

    const addInviteEmail = () => {
        if (!podId) {
            return;
        }
        const trimmed = inviteEmailInput.trim();
        if (!trimmed) {
            return;
        }
        const exists = inviteEmails.some(email => email.toLowerCase() === trimmed.toLowerCase());
        if (!exists) {
            apiClient.post(`/pods/${podId}/invites`, { emails: [trimmed] })
                .then(res => {
                    setInviteEmails(res.data?.invite_emails || []);
                    setInviteJoinedEmails(res.data?.invite_joined_emails || []);
                })
                .catch(err => console.error(err));
        }
        setInviteEmailInput('');
    };

    const removeInviteEmail = (email: string) => {
        if (!podId) {
            return;
        }
        apiClient.post(`/pods/${podId}/invites/remove`, { emails: [email] })
            .then(res => {
                setInviteEmails(res.data?.invite_emails || []);
                setInviteJoinedEmails(res.data?.invite_joined_emails || []);
            })
            .catch(err => console.error(err));
    };

    const refreshInviteStatus = async () => {
        if (!podId) {
            return;
        }
        setRefreshing(true);
        try {
            const podRes = await apiClient.get(`/pods/${podId}`);
            setPod(podRes.data);
            setInviteEmails(podRes.data?.invite_emails || []);
            setInviteJoinedEmails(podRes.data?.invite_joined_emails || []);
        } catch (err) {
            console.error(err);
        } finally {
            setRefreshing(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!pod) {
        return (
            <div className="p-8">
                <div className="card p-8 text-center">
                    <p className="text-red-600">Pod not found</p>
                </div>
            </div>
        );
    }

    const shareLink = pod.link || `${window.location.origin}/pods/${pod.id}`;
    const isOwner = profile?.id === pod.owner_user_id;
    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareLink);
            setCopyStatus('copied');
            window.setTimeout(() => setCopyStatus('idle'), 1500);
        } catch (err) {
            console.error(err);
            setCopyStatus('error');
            window.setTimeout(() => setCopyStatus('idle'), 1500);
        }
    };

    const normalizedInvites = inviteEmails.map(email => email.toLowerCase());
    const normalizedJoined = inviteJoinedEmails.map(email => email.toLowerCase());
    const allInviteesJoined = normalizedInvites.length === 0
        || normalizedInvites.every(email => normalizedJoined.includes(email));

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-[#061E29] mb-1">Pod Details</h1>
                <div className="card p-5 mt-4">
                    <p className="text-base text-[#061E29]">{pod.description}</p>
                </div>
            </div>

            <div className="mb-6 space-y-3">
                <div className="card p-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-sm font-medium text-[#061E29]">Share Link</h2>
                        <button
                            type="button"
                            onClick={copyLink}
                            className="btn btn-secondary text-xs px-3"
                        >
                            {copyStatus === 'copied' ? 'Copied' : 'Copy Link'}
                        </button>
                    </div>
                    <p className="text-xs text-[#061E29]/60 mb-2">
                        Send this link to invitees. They must sign in and sync their calendar.
                    </p>
                    <div className="p-2 bg-[#F3F4F4] rounded text-xs text-[#061E29] break-all">
                        {shareLink}
                    </div>
                </div>

                <div className="card p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-medium text-[#061E29]">Invite Emails</h2>
                        <div className="flex items-center gap-3">
                            <p className="text-xs text-[#061E29]/60">Only added emails can join.</p>
                            <button
                                type="button"
                                onClick={refreshInviteStatus}
                                className="btn btn-secondary text-xs px-3"
                                disabled={refreshing}
                            >
                                {refreshing ? 'Refreshing...' : 'Refresh Status'}
                            </button>
                        </div>
                    </div>
                    {isOwner && (
                        <div className="flex gap-2 mb-3">
                            <input
                                type="email"
                                className="w-full"
                                placeholder="name@example.com"
                                value={inviteEmailInput}
                                onChange={(e) => setInviteEmailInput(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={addInviteEmail}
                                className="btn btn-secondary text-xs px-3"
                            >
                                Add
                            </button>
                        </div>
                    )}
                    {inviteEmails.length > 0 ? (
                        <div className="space-y-2">
                            {inviteEmails.map(email => {
                                const isJoined = normalizedJoined.includes(email.toLowerCase());
                                return (
                                    <div
                                        key={email}
                                        className="flex items-center justify-between rounded bg-[#F3F4F4] px-2 py-2 text-xs text-[#061E29]"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>{email}</span>
                                            <span className={`rounded px-2 py-0.5 ${isJoined ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {isJoined ? 'Joined' : 'Pending'}
                                            </span>
                                        </div>
                                        {isOwner && (
                                            <button
                                                type="button"
                                                onClick={() => removeInviteEmail(email)}
                                                className="text-xs text-red-500 hover:text-red-600"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-xs text-[#061E29]/40">No invite emails yet.</p>
                    )}
                    {inviteEmails.length > 0 && (
                        <p className="text-xs text-[#061E29]/60 mt-3">
                            {inviteJoinedEmails.length} of {inviteEmails.length} invitees joined.
                        </p>
                    )}
                </div>
            </div>

            <div className="mb-6">
                <h2 className="text-lg font-medium text-[#061E29] mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#5F9598]" />
                    Pod Goals
                </h2>
                <div className="space-y-3">
                    {goals.map(goal => (
                        <div key={goal.id} className="card p-4 flex items-center justify-between">
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-[#061E29] mb-1">{goal.goal_name}</h3>
                                <p className="text-xs text-[#061E29]/60">{goal.goal_instructions}</p>
                            </div>
                            <div className="flex items-center ml-4">
                                {goal.goal_status === 'completed' ? (
                                    <CheckCircle className="text-green-500 w-5 h-5" />
                                ) : (
                                    <div className="flex items-center text-amber-500 gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-xs">Pending</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {goals.length === 0 && (
                        <p className="text-sm text-[#061E29]/40 italic">No goals defined yet.</p>
                    )}
                </div>
            </div>

            <button className="btn btn-primary w-full" disabled={!allInviteesJoined}>
                Start the hunt
            </button>
        </div>
    );
};

export default PodDetail;
