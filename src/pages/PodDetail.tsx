import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../lib/apiClient';
import { Target, CheckCircle, Clock } from 'lucide-react';

const PodDetail = () => {
    const { podId } = useParams();
    const [pod, setPod] = useState<any>(null);
    const [goals, setGoals] = useState<any[]>([]);
    const [inviteEmails, setInviteEmails] = useState<string[]>([]);
    const [inviteEmailInput, setInviteEmailInput] = useState('');
    const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            apiClient.get(`/pods/${podId}`),
            apiClient.get(`/goals/${podId}`)
        ]).then(([podRes, goalsRes]) => {
            setPod(podRes.data);
            setGoals(goalsRes.data);
            setInviteEmails(podRes.data?.invite_emails || []);
        }).catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [podId]);

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
                })
                .catch(err => console.error(err));
        }
        setInviteEmailInput('');
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
                        <p className="text-xs text-[#061E29]/60">Only added emails can join.</p>
                    </div>
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
                    {inviteEmails.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {inviteEmails.map(email => (
                                <span
                                    key={email}
                                    className="px-2 py-1 bg-[#F3F4F4] text-xs text-[#061E29] rounded"
                                >
                                    {email}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-[#061E29]/40">No invite emails yet.</p>
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

            <button className="btn btn-primary w-full">
                Trigger AI Scheduling
            </button>
        </div>
    );
};

export default PodDetail;
