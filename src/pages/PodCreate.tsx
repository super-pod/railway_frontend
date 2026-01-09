import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import apiClient from '../lib/apiClient';

interface Goal {
    name: string;
    type: string;
    instructions: string;
}

const PodCreate = () => {
    const [description, setDescription] = useState('');
    const [podType, setPodType] = useState<'Meeting' | 'Generic'>('Generic');

    const [meetingGoalInstructions, setMeetingGoalInstructions] = useState({
        location: '',
        duration: '',
        startDateTime: ''
    });

    // Generic pod goals
    const [goals, setGoals] = useState<Goal[]>([]);
    const [inviteEmails, setInviteEmails] = useState<string[]>([]);
    const [inviteEmailInput, setInviteEmailInput] = useState('');

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const addGoal = () => {
        if (goals.length < 5) {
            setGoals([...goals, { name: '', type: '', instructions: '' }]);
        }
    };

    const removeGoal = (index: number) => {
        setGoals(goals.filter((_, i) => i !== index));
    };

    const updateGoal = (index: number, field: keyof Goal, value: string) => {
        const updatedGoals = [...goals];
        updatedGoals[index][field] = value;
        setGoals(updatedGoals);
    };

    const getTokenFromLink = (link: string | null) => {
        if (!link) return null;
        const marker = '/pod-invite/';
        const index = link.indexOf(marker);
        if (index === -1) return null;
        return link.slice(index + marker.length);
    };

    const addInviteEmail = () => {
        const trimmed = inviteEmailInput.trim();
        if (!trimmed) {
            return;
        }
        const exists = inviteEmails.some(email => email.toLowerCase() === trimmed.toLowerCase());
        if (!exists) {
            setInviteEmails([...inviteEmails, trimmed]);
        }
        setInviteEmailInput('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload: any = {
                description,
                pod_type: podType,
                invite_emails: inviteEmails
            };

            if (podType === 'Meeting') {
                payload.goals = [
                    {
                        name: 'Location',
                        type: 'location',
                        instructions: meetingGoalInstructions.location.trim()
                    },
                    {
                        name: 'Duration',
                        type: 'duration',
                        instructions: meetingGoalInstructions.duration.trim()
                    },
                    {
                        name: 'Start DateTime',
                        type: 'start_datetime',
                        instructions: meetingGoalInstructions.startDateTime.trim()
                    }
                ];
            } else {
                // Generic pod with custom goals
                payload.goals = goals.filter(g => g.name && g.type && g.instructions);
            }

            const res = await apiClient.post('/pods', payload);
            const newPod = res.data;
            if (newPod?.link) {
                const token = getTokenFromLink(newPod.link);
                if (token) {
                    navigate(`/pod/${token}`);
                } else {
                    navigate('/dashboard');
                }
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-[#061E29] mb-1">Create New Pod</h1>
                <p className="text-sm text-[#061E29]/60">Set up a new coordination group</p>
            </div>

            <form onSubmit={handleSubmit} className="card p-6 space-y-6">
                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-[#061E29] mb-2">
                        Description
                    </label>
                    <textarea
                        required
                        className="w-full"
                        rows={3}
                        placeholder="Describe the purpose of this pod..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {/* Pod Type */}
                <div>
                    <label className="block text-sm font-medium text-[#061E29] mb-2">
                        Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setPodType('Meeting')}
                            className={`p-4 rounded-lg border-2 transition-all ${podType === 'Meeting'
                                    ? 'border-[#5F9598] bg-[#5F9598]/5'
                                    : 'border-[#061E29]/10 hover:border-[#061E29]/20'
                                }`}
                        >
                            <div className="font-medium text-[#061E29]">Meeting</div>
                            <div className="text-xs text-[#061E29]/60 mt-1">
                                Scheduling goals for a meeting
                            </div>
                        </button>
                        <button
                            type="button"
                            onClick={() => setPodType('Generic')}
                            className={`p-4 rounded-lg border-2 transition-all ${podType === 'Generic'
                                    ? 'border-[#5F9598] bg-[#5F9598]/5'
                                    : 'border-[#061E29]/10 hover:border-[#061E29]/20'
                                }`}
                        >
                            <div className="font-medium text-[#061E29]">Generic</div>
                            <div className="text-xs text-[#061E29]/60 mt-1">
                                Custom goals and objectives
                            </div>
                        </button>
                        <div className="p-4 rounded-lg border-2 border-dashed border-[#061E29]/15 bg-[#F3F4F4] opacity-60">
                            <div className="font-medium text-[#061E29]">Travel Planning</div>
                            <div className="text-xs text-[#061E29]/60 mt-1">
                                Coming soon
                            </div>
                        </div>
                        <div className="p-4 rounded-lg border-2 border-dashed border-[#061E29]/15 bg-[#F3F4F4] opacity-60">
                            <div className="font-medium text-[#061E29]">Restaurant Choosing</div>
                            <div className="text-xs text-[#061E29]/60 mt-1">
                                Coming soon
                            </div>
                        </div>
                    </div>
                </div>

                {/* Meeting-specific fields */}
                {podType === 'Meeting' && (
                    <div className="space-y-4 p-4 bg-[#F3F4F4] rounded-lg">
                        <div>
                            <h3 className="text-sm font-medium text-[#061E29]">Meeting Goals</h3>
                            <p className="text-xs text-[#061E29]/60 mt-1">
                                Location, duration, and start time are decided later. Add instructions if needed.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="p-3 bg-white rounded border border-[#061E29]/10">
                                <p className="text-xs font-medium text-[#061E29] mb-2">Location</p>
                                <textarea
                                    className="w-full"
                                    rows={2}
                                    placeholder="Optional instructions for how to decide the location"
                                    value={meetingGoalInstructions.location}
                                    onChange={(e) =>
                                        setMeetingGoalInstructions({
                                            ...meetingGoalInstructions,
                                            location: e.target.value
                                        })
                                    }
                                />
                            </div>

                            <div className="p-3 bg-white rounded border border-[#061E29]/10">
                                <p className="text-xs font-medium text-[#061E29] mb-2">Duration</p>
                                <textarea
                                    className="w-full"
                                    rows={2}
                                    placeholder="Optional instructions for how to decide the duration"
                                    value={meetingGoalInstructions.duration}
                                    onChange={(e) =>
                                        setMeetingGoalInstructions({
                                            ...meetingGoalInstructions,
                                            duration: e.target.value
                                        })
                                    }
                                />
                            </div>

                            <div className="p-3 bg-white rounded border border-[#061E29]/10">
                                <p className="text-xs font-medium text-[#061E29] mb-2">Start Date & Time</p>
                                <textarea
                                    className="w-full"
                                    rows={2}
                                    placeholder="Optional instructions for how to decide the start time"
                                    value={meetingGoalInstructions.startDateTime}
                                    onChange={(e) =>
                                        setMeetingGoalInstructions({
                                            ...meetingGoalInstructions,
                                            startDateTime: e.target.value
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Generic pod goals */}
                {podType === 'Generic' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-[#061E29]">
                                Goals (up to 5)
                            </h3>
                            {goals.length < 5 && (
                                <button
                                    type="button"
                                    onClick={addGoal}
                                    className="btn btn-secondary text-xs py-2 px-3"
                                >
                                    <Plus className="w-3 h-3" />
                                    Add Goal
                                </button>
                            )}
                        </div>

                        {goals.length === 0 && (
                            <div className="text-center py-8 text-[#061E29]/40 text-sm">
                                No goals added yet. Click "Add Goal" to create one.
                            </div>
                        )}

                        {goals.map((goal, index) => (
                            <div
                                key={index}
                                className="p-4 bg-[#F3F4F4] rounded-lg space-y-3 relative"
                            >
                                <button
                                    type="button"
                                    onClick={() => removeGoal(index)}
                                    className="absolute top-2 right-2 p-1 hover:bg-white rounded transition-colors"
                                >
                                    <X className="w-4 h-4 text-[#061E29]/40" />
                                </button>

                                <div>
                                    <label className="block text-xs font-medium text-[#061E29] mb-1">
                                        Goal Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full"
                                        placeholder="e.g., Complete project proposal"
                                        value={goal.name}
                                        onChange={(e) =>
                                            updateGoal(index, 'name', e.target.value)
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-[#061E29] mb-1">
                                        Type
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full"
                                        placeholder="e.g., deliverable, milestone, task"
                                        value={goal.type}
                                        onChange={(e) =>
                                            updateGoal(index, 'type', e.target.value)
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-[#061E29] mb-1">
                                        Instructions
                                    </label>
                                    <textarea
                                        required
                                        className="w-full"
                                        rows={2}
                                        placeholder="Describe what needs to be done..."
                                        value={goal.instructions}
                                        onChange={(e) =>
                                            updateGoal(index, 'instructions', e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-[#061E29]">Invite Emails</h3>
                        <p className="text-xs text-[#061E29]/60">
                            Only invited emails can join the pod.
                        </p>
                    </div>
                    <div className="flex gap-2">
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

                <button
                    disabled={loading}
                    type="submit"
                    className="btn btn-primary w-full"
                >
                    {loading ? 'Creating...' : 'Create Pod'}
                </button>
            </form>
        </div>
    );
};

export default PodCreate;
