import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../lib/apiClient';
import { Target, CheckCircle, Clock } from 'lucide-react';

const PodDetail = () => {
    const { podId } = useParams();
    const [pod, setPod] = useState<any>(null);
    const [goals, setGoals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            apiClient.get(`/pods/${podId}`),
            apiClient.get(`/goals/${podId}`)
        ]).then(([podRes, goalsRes]) => {
            setPod(podRes.data);
            setGoals(goalsRes.data);
        }).catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [podId]);

    if (loading) return <div className="p-8 text-blue-300">Loading details...</div>;
    if (!pod) return <div className="p-8 text-red-400">Pod not found</div>;

    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="mb-10">
                <h1 className="text-4xl font-bold text-white mb-4">Pod Details</h1>
                <div className="glass-card p-6">
                    <p className="text-xl text-blue-100">{pod.description}</p>
                </div>
            </div>

            <div className="mb-10">
                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                    <Target className="w-6 h-6 mr-2 text-blue-400" />
                    Pod Goals
                </h2>
                <div className="space-y-4">
                    {goals.map(goal => (
                        <div key={goal.id} className="glass-card p-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-medium text-white">{goal.goal_name}</h3>
                                <p className="text-sm text-blue-300">{goal.goal_instructions}</p>
                            </div>
                            <div className="flex items-center">
                                {goal.goal_status === 'completed' ? (
                                    <CheckCircle className="text-green-400" />
                                ) : (
                                    <div className="flex items-center text-amber-400">
                                        <Clock className="w-5 h-5 mr-1" />
                                        <span className="text-sm">Pending</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {goals.length === 0 && (
                        <p className="text-blue-400 italic">No goals defined yet.</p>
                    )}
                </div>
            </div>

            <button className="btn-primary w-full py-4 text-lg font-bold shadow-lg shadow-blue-500/20">
                Trigger AI Scheduling
            </button>
        </div>
    );
};

export default PodDetail;
