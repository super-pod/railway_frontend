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

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-[#061E29] mb-1">Pod Details</h1>
                <div className="card p-5 mt-4">
                    <p className="text-base text-[#061E29]">{pod.description}</p>
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
