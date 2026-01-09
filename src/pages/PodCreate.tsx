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

    // Meeting-specific fields
    const [location, setLocation] = useState('');
    const [duration, setDuration] = useState('');
    const [startDateTime, setStartDateTime] = useState('');

    // Generic pod goals
    const [goals, setGoals] = useState<Goal[]>([]);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload: any = {
                description,
                pod_type: podType,
            };

            if (podType === 'Meeting') {
                payload.location = location;
                payload.duration = parseInt(duration);
                payload.start_datetime = new Date(startDateTime).toISOString();

                // Add fixed meeting goals
                payload.goals = [
                    {
                        name: 'Meeting Preparation',
                        type: 'preparation',
                        instructions: 'Prepare agenda and materials for the meeting'
                    },
                    {
                        name: 'Meeting Execution',
                        type: 'execution',
                        instructions: 'Conduct the meeting as scheduled'
                    },
                    {
                        name: 'Follow-up Actions',
                        type: 'follow-up',
                        instructions: 'Complete action items from the meeting'
                    }
                ];
            } else {
                // Generic pod with custom goals
                payload.goals = goals.filter(g => g.name && g.type && g.instructions);
            }

            await apiClient.post('/pods', payload);
            navigate('/dashboard');
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
                                Scheduled event with location
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
                    </div>
                </div>

                {/* Meeting-specific fields */}
                {podType === 'Meeting' && (
                    <div className="space-y-4 p-4 bg-[#F3F4F4] rounded-lg">
                        <h3 className="text-sm font-medium text-[#061E29]">Meeting Details</h3>

                        <div>
                            <label className="block text-sm font-medium text-[#061E29] mb-2">
                                Location
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full"
                                placeholder="e.g., Conference Room A, Zoom Link, etc."
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[#061E29] mb-2">
                                    Duration (minutes)
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    className="w-full"
                                    placeholder="60"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#061E29] mb-2">
                                    Start Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    required
                                    className="w-full"
                                    value={startDateTime}
                                    onChange={(e) => setStartDateTime(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mt-4 p-3 bg-white rounded border border-[#061E29]/10">
                            <p className="text-xs text-[#061E29]/60 mb-2">Fixed Goals:</p>
                            <ul className="text-xs text-[#061E29] space-y-1">
                                <li>• Meeting Preparation</li>
                                <li>• Meeting Execution</li>
                                <li>• Follow-up Actions</li>
                            </ul>
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
