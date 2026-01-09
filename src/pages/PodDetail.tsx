import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../lib/apiClient';
import { Target, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PodDetail = () => {
    const { token } = useParams();
    const { profile } = useAuth();
    const [pod, setPod] = useState<any>(null);
    const [goals, setGoals] = useState<any[]>([]);
    const [inviteEmails, setInviteEmails] = useState<string[]>([]);
    const [inviteJoinedEmails, setInviteJoinedEmails] = useState<string[]>([]);
    const [inviteEmailInput, setInviteEmailInput] = useState('');
    const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [huntStatus, setHuntStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
    const [huntError, setHuntError] = useState<string | null>(null);
    const [instructionEdits, setInstructionEdits] = useState<Record<number, string>>({});
    const [closingPod, setClosingPod] = useState(false);
    const [closeError, setCloseError] = useState<string | null>(null);
    const [editingGoals, setEditingGoals] = useState<Record<number, boolean>>({});
    const [savingGoals, setSavingGoals] = useState<Record<number, boolean>>({});
    const [savingAllGoals, setSavingAllGoals] = useState(false);
    const [addGoalOpen, setAddGoalOpen] = useState(false);
    const [newGoalName, setNewGoalName] = useState('');
    const [newGoalType, setNewGoalType] = useState('');
    const [newGoalInstructions, setNewGoalInstructions] = useState('');

    useEffect(() => {
        const fetchPod = async () => {
            try {
                const [podRes, goalsRes] = await Promise.all([
                    apiClient.get(`/pods/token/${token}`),
                    apiClient.get(`/goals/token/${token}`)
                ]);
                setPod(podRes.data);
                setGoals(goalsRes.data);
                setInviteEmails(podRes.data?.invite_emails || []);
                setInviteJoinedEmails(podRes.data?.invite_joined_emails || []);
                if (podRes.data?.status === 'running') {
                    setHuntStatus('running');
                } else if (podRes.data?.status === 'pending_review' || podRes.data?.status === 'closed') {
                    setHuntStatus('done');
                } else {
                    setHuntStatus('idle');
                }
                setInstructionEdits((prev) => {
                    if (Object.keys(prev).length > 0) {
                        return prev;
                    }
                    const next: Record<number, string> = {};
                    goalsRes.data.forEach((goal: any) => {
                        next[goal.id] = goal.goal_instructions || '';
                    });
                    return next;
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPod();
    }, [token]);

    useEffect(() => {
        if (!token || !pod || !profile?.email) {
            return;
        }
        const needsCalendar = (pod.type || '').toLowerCase() === 'meeting';
        if (needsCalendar && !profile?.is_calendar_synced) {
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
        apiClient.post(`/pods/token/${token}/join`)
            .then(res => {
                setInviteEmails(res.data?.invite_emails || []);
                setInviteJoinedEmails(res.data?.invite_joined_emails || []);
            })
            .catch(err => console.error(err));
    }, [token, pod, profile]);

    const addInviteEmail = () => {
        if (!token) {
            return;
        }
        const trimmed = inviteEmailInput.trim();
        if (!trimmed) {
            return;
        }
        const exists = inviteEmails.some(email => email.toLowerCase() === trimmed.toLowerCase());
        if (!exists) {
            apiClient.post(`/pods/token/${token}/invites`, { emails: [trimmed] })
                .then(res => {
                    setInviteEmails(res.data?.invite_emails || []);
                    setInviteJoinedEmails(res.data?.invite_joined_emails || []);
                })
                .catch(err => console.error(err));
        }
        setInviteEmailInput('');
    };

    const removeInviteEmail = (email: string) => {
        if (!token) {
            return;
        }
        apiClient.post(`/pods/token/${token}/invites/remove`, { emails: [email] })
            .then(res => {
                setInviteEmails(res.data?.invite_emails || []);
                setInviteJoinedEmails(res.data?.invite_joined_emails || []);
            })
            .catch(err => console.error(err));
    };

    const refreshInviteStatus = async () => {
        if (!token) {
            return;
        }
        setRefreshing(true);
        try {
            const podRes = await apiClient.get(`/pods/token/${token}`);
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

    const shareLink = pod.link || `${window.location.origin}/pod/${token}`;
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

    const formatGoalValue = (value: string | null) => {
        if (!value) return '';
        try {
            const parsed = JSON.parse(value);
            if (typeof parsed === 'string') {
                return parsed;
            }
            return JSON.stringify(parsed, null, 2);
        } catch {
            return value;
        }
    };

    const startHunt = async () => {
        if (!token || !isOwner) {
            return;
        }
        if (pod?.status === 'closed') {
            return;
        }
        setHuntStatus('running');
        setHuntError(null);
        try {
            const res = await apiClient.post(`/pods/token/${token}/hunt`);
            const nextGoals = res.data?.goals || [];
            setGoals(nextGoals);
            setPod((prev: any) => ({ ...prev, status: res.data?.status || 'pending_review' }));
            const hasAllValues = nextGoals.length > 0
                && nextGoals.every((goal: any) => Boolean(goal.goal_value));
            setHuntStatus(hasAllValues ? 'done' : 'running');
        } catch (err: any) {
            console.error('Hunt failed', err.response?.data || err);
            const message = err.response?.data?.detail || 'Failed to start the hunt.';
            setHuntError(message);
            setHuntStatus('error');
        }
    };

    const closePod = async () => {
        if (!token || !isOwner) {
            return;
        }
        setClosingPod(true);
        setCloseError(null);
        try {
            const res = await apiClient.post(`/pods/token/${token}/close`);
            if (res.data?.pod) {
                setPod(res.data.pod);
            } else {
                setPod(res.data);
            }
            window.location.assign('/dashboard');
        } catch (err) {
            console.error(err);
            const message = (err as any).response?.data?.detail || 'Failed to close pod.';
            setCloseError(message);
        } finally {
            setClosingPod(false);
        }
    };

    const handleInstructionChange = (goalId: number, value: string) => {
        setInstructionEdits((prev) => ({ ...prev, [goalId]: value }));
    };

    const normalizedInvites = inviteEmails.map(email => email.toLowerCase());
    const normalizedJoined = inviteJoinedEmails.map(email => email.toLowerCase());
    const allInviteesJoined = normalizedInvites.length === 0
        || normalizedInvites.every(email => normalizedJoined.includes(email));
    const podStatus = pod.status || 'idle';
    const isClosed = podStatus === 'closed';
    const allGoalsHaveValues = goals.length > 0 && goals.every(goal => Boolean(goal.goal_value));
    const showResults = allGoalsHaveValues;
    const showPostHuntActions = isOwner && !isClosed && (podStatus === 'pending_review' || allGoalsHaveValues);
    const showIdleActions = isOwner && !isClosed && podStatus === 'idle';
    const needsCalendar = (pod.type || '').toLowerCase() === 'meeting';
    const allowAddGoals = showIdleActions && (pod.type || '').toLowerCase() !== 'meeting';
    const canEditGoals = isOwner && !isClosed;
    const canDeleteGoals = canEditGoals && showIdleActions && allowAddGoals;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-[#061E29] mb-1">Pod Details</h1>
                    <span className={`text-xs px-2 py-1 rounded ${podStatus === 'running'
                            ? 'bg-blue-100 text-blue-700'
                            : podStatus === 'pending_review'
                                ? 'bg-amber-100 text-amber-700'
                                : podStatus === 'closed'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-[#F3F4F4] text-[#061E29]/60'
                        }`}>
                        {podStatus.replace('_', ' ')}
                    </span>
                </div>
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
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-[#061E29] flex items-center gap-2">
                        <Target className="w-5 h-5 text-[#5F9598]" />
                        Pod Goals
                    </h2>
                    {allowAddGoals && (
                        <button
                            type="button"
                            className="btn btn-secondary text-xs px-3"
                            onClick={() => setAddGoalOpen((prev) => !prev)}
                        >
                            {addGoalOpen ? 'Close' : 'Add Goal'}
                        </button>
                    )}
                </div>
                <div className="space-y-3">
                    {addGoalOpen && allowAddGoals && (
                        <div className="card p-4 space-y-2">
                            <div className="text-xs font-medium text-[#061E29]">New Goal</div>
                            <input
                                type="text"
                                className="w-full"
                                placeholder="Goal name"
                                value={newGoalName}
                                onChange={(e) => setNewGoalName(e.target.value)}
                            />
                            <input
                                type="text"
                                className="w-full"
                                placeholder="Type (e.g., deliverable, task)"
                                value={newGoalType}
                                onChange={(e) => setNewGoalType(e.target.value)}
                            />
                            <textarea
                                className="w-full"
                                rows={2}
                                placeholder="Instructions"
                                value={newGoalInstructions}
                                onChange={(e) => setNewGoalInstructions(e.target.value)}
                            />
                            <button
                                type="button"
                                className="btn btn-secondary"
                                disabled={!newGoalName.trim() || !newGoalType.trim()}
                                onClick={async () => {
                                    try {
                                        await apiClient.post(`/goals/token/${token}`, {
                                            name: newGoalName.trim(),
                                            type: newGoalType.trim(),
                                            instructions: newGoalInstructions.trim()
                                        });
                                        setNewGoalName('');
                                        setNewGoalType('');
                                        setNewGoalInstructions('');
                                        const refreshed = await apiClient.get(`/goals/token/${token}`);
                                        setGoals(refreshed.data);
                                    } catch (err) {
                                        console.error(err);
                                    }
                                }}
                            >
                                Add Goal
                            </button>
                        </div>
                    )}
                    {goals.map(goal => (
                        <div key={goal.id} className="card p-4 flex items-center justify-between">
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-[#061E29] mb-1">{goal.goal_name}</h3>
                                {canEditGoals && editingGoals[goal.id] ? (
                                    <div className="space-y-2">
                                        <textarea
                                            className="w-full"
                                            rows={2}
                                            value={instructionEdits[goal.id] ?? ''}
                                            onChange={(e) => handleInstructionChange(goal.id, e.target.value)}
                                        />
                                        <div className="text-[11px] text-amber-600 flex items-center gap-2">
                                            <Clock className="w-3 h-3" />
                                            Pending until hunt runs
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={() => {
                                                    setEditingGoals((prev) => ({ ...prev, [goal.id]: false }));
                                                    setInstructionEdits((prev) => ({
                                                        ...prev,
                                                        [goal.id]: goal.goal_instructions || ''
                                                    }));
                                                }}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                disabled={savingGoals[goal.id]}
                                                onClick={async () => {
                                                    setSavingGoals((prev) => ({ ...prev, [goal.id]: true }));
                                                    try {
                                                        await apiClient.patch(`/goals/${goal.id}`, {
                                                            instructions: instructionEdits[goal.id] || ''
                                                        });
                                                        const refreshed = await apiClient.get(`/goals/token/${token}`);
                                                        setGoals(refreshed.data);
                                                        setEditingGoals((prev) => ({ ...prev, [goal.id]: false }));
                                                    } catch (err) {
                                                        console.error(err);
                                                    } finally {
                                                        setSavingGoals((prev) => ({ ...prev, [goal.id]: false }));
                                                    }
                                                }}
                                            >
                                                {savingGoals[goal.id] ? 'Saving...' : 'Save'}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-xs text-[#061E29]/60">{goal.goal_instructions}</p>
                                )}
                                {goal.goal_value && (
                                    <pre className="mt-2 text-[11px] text-[#061E29]/80 whitespace-pre-wrap bg-[#F3F4F4] rounded p-2">
                                        {formatGoalValue(goal.goal_value)}
                                    </pre>
                                )}
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
                                {canEditGoals && !editingGoals[goal.id] && (
                                    <button
                                        type="button"
                                        className="ml-3 text-xs text-[#5F9598] hover:text-[#1D546D]"
                                        onClick={() => setEditingGoals((prev) => ({ ...prev, [goal.id]: true }))}
                                    >
                                        Edit
                                    </button>
                                )}
                                {canDeleteGoals && !editingGoals[goal.id] && (
                                    <button
                                        type="button"
                                        className="ml-2 text-xs text-red-500 hover:text-red-600"
                                        onClick={async () => {
                                            if (!window.confirm('Delete this goal?')) {
                                                return;
                                            }
                                            try {
                                                await apiClient.delete(`/goals/${goal.id}`);
                                                const refreshed = await apiClient.get(`/goals/token/${token}`);
                                                setGoals(refreshed.data);
                                            } catch (err) {
                                                console.error(err);
                                            }
                                        }}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {goals.length === 0 && (
                        <p className="text-sm text-[#061E29]/40 italic">No goals defined yet.</p>
                    )}
                </div>
            </div>

            <div className="card p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-medium text-[#061E29]">Start the Hunt</h2>
                        <p className="text-xs text-[#061E29]/60">
                            Combine Orca instructions and pod goals to fill goal outputs.
                        </p>
                    </div>
                    <button
                        className="btn btn-primary"
                        disabled={!allInviteesJoined || !isOwner || huntStatus === 'running' || isClosed || podStatus === 'pending_review'}
                        onClick={startHunt}
                    >
                        {huntStatus === 'running' ? 'Running...' : 'Start the hunt'}
                    </button>
                </div>

                {!allInviteesJoined && (
                    <p className="text-xs text-amber-600">
                        Waiting for all invitees to join before starting.
                    </p>
                )}
                {isClosed && (
                    <p className="text-xs text-[#061E29]/60">
                        Pod is closed. Reopen is not available.
                    </p>
                )}

                {huntStatus === 'running' && (
                    <div className="flex items-center gap-3 text-sm text-[#061E29]/70">
                        <div className="spinner"></div>
                        <span>Pod is running. Gathering context and instructions...</span>
                    </div>
                )}
                {!profile?.is_calendar_synced && needsCalendar && (
                    <p className="text-xs text-amber-600">
                        Calendar sync is required for meeting pods.
                    </p>
                )}

                {huntError && (
                    <p className="text-xs text-red-600">{huntError}</p>
                )}
                {closeError && (
                    <p className="text-xs text-red-600">{closeError}</p>
                )}

                {showResults && (
                    <div className="space-y-3">
                        <h3 className="text-xs uppercase tracking-widest text-[#5F9598]">Goal Outputs</h3>
                        {goals.map(goal => (
                            <div key={`result-${goal.id}`} className="rounded border border-[#061E29]/10 bg-white p-3">
                                <div className="text-xs font-medium text-[#061E29] mb-2">{goal.goal_name}</div>
                                <pre className="text-[11px] text-[#061E29]/80 whitespace-pre-wrap">
                                    {formatGoalValue(goal.goal_value) || 'No output yet.'}
                                </pre>
                            </div>
                        ))}
                    </div>
                )}

                {showPostHuntActions && (
                    <div className="space-y-3">
                        <h3 className="text-xs uppercase tracking-widest text-[#5F9598]">Review & Finish</h3>
                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                className="btn btn-primary"
                                disabled={savingAllGoals || huntStatus === 'running' || isClosed}
                                onClick={async () => {
                                    setSavingAllGoals(true);
                                    try {
                                        const updates = goals.filter((goal) => {
                                            const current = goal.goal_instructions || '';
                                            const next = instructionEdits[goal.id] ?? '';
                                            return current !== next;
                                        });
                                        for (const goal of updates) {
                                            await apiClient.patch(`/goals/${goal.id}`, {
                                                instructions: instructionEdits[goal.id] || ''
                                            });
                                        }
                                        const refreshed = await apiClient.get(`/goals/token/${token}`);
                                        setGoals(refreshed.data);
                                    } catch (err) {
                                        console.error(err);
                                    } finally {
                                        setSavingAllGoals(false);
                                    }
                                    await startHunt();
                                }}
                            >
                                {savingAllGoals ? 'Saving...' : 'Rerun Hunt'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                disabled={closingPod}
                                onClick={closePod}
                            >
                                {closingPod ? 'Closing...' : 'Save & Close'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PodDetail;
