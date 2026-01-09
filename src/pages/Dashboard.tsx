import React, { useEffect, useState } from 'react';
import apiClient from '../lib/apiClient';
import { Link } from 'react-router-dom';
import { Plus, Users } from 'lucide-react';

const Dashboard = () => {
    const [pods, setPods] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get('/pods')
            .then(res => setPods(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-[#061E29] mb-1">Pods</h1>
                    <p className="text-sm text-[#061E29]/60">Manage your coordination groups</p>
                </div>
                <Link to="/pods/create" className="btn btn-primary">
                    <Plus className="w-4 h-4" />
                    New Pod
                </Link>
            </div>

            {/* Pods Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pods.map(pod => (
                    <Link
                        key={pod.id}
                        to={`/pods/${pod.id}`}
                        className="card p-5 hover:border-[#5F9598]/30 group"
                    >
                        <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 bg-[#061E29] rounded-lg flex items-center justify-center flex-shrink-0">
                                <Users className="text-[#5F9598] w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-base font-medium text-[#061E29] mb-1">Pod #{pod.id}</h2>
                                <p className="text-xs text-[#061E29]/60 line-clamp-2">
                                    {pod.description || 'No description'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-[#5F9598] group-hover:gap-2 transition-all">
                            <span>View details</span>
                            <span>→</span>
                        </div>
                    </Link>
                ))}

                {pods.length === 0 && (
                    <div className="col-span-full card p-16 text-center">
                        <Users className="w-12 h-12 text-[#061E29]/10 mx-auto mb-3" />
                        <h3 className="text-base font-medium text-[#061E29] mb-1">No pods yet</h3>
                        <p className="text-sm text-[#061E29]/60">
                            Create your first pod to get started
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
