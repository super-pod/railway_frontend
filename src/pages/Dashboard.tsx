import React, { useEffect, useState } from 'react';
import apiClient from '../lib/apiClient';
import { Link } from 'react-router-dom';
import { Plus, Users } from 'lucide-react';

const Dashboard = () => {
    const [pods, setPods] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchPods = async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }
        try {
            const res = await apiClient.get('/pods');
            setPods(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchPods();
    }, []);

    const getTokenFromLink = (link: string | null) => {
        if (!link) return null;
        const marker = '/pod-invite/';
        const index = link.indexOf(marker);
        if (index === -1) return null;
        return link.slice(index + marker.length);
    };

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
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => fetchPods(true)}
                        disabled={refreshing || loading}
                        className="btn btn-secondary"
                    >
                        {refreshing ? 'Refreshing...' : 'Refresh'}
                    </button>
                    <Link to="/pods/create" className="btn btn-primary">
                        <Plus className="w-4 h-4" />
                        New Pod
                    </Link>
                </div>
            </div>

            {/* Pods Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pods.map(pod => {
                    const token = getTokenFromLink(pod.link || '');
                    const podPath = token ? `/pod/${token}` : '#';
                    const relationship = (pod.relationship || 'owner').toLowerCase();
                    const relationshipLabel = relationship === 'joined'
                        ? 'Joined'
                        : relationship === 'invited'
                            ? 'Invited'
                            : 'Owner';
                    const relationshipClass = relationship === 'joined'
                        ? 'bg-emerald-100 text-emerald-700'
                        : relationship === 'invited'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-[#EEF2F3] text-[#061E29]/70';
                    return (
                    <Link
                        key={pod.id}
                        to={podPath}
                        className={`card p-5 hover:border-[#5F9598]/30 group ${token ? '' : 'opacity-60 cursor-not-allowed'}`}
                        onClick={(e) => {
                            if (!token) {
                                e.preventDefault();
                            }
                        }}
                    >
                        <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 bg-[#061E29] rounded-lg flex items-center justify-center flex-shrink-0">
                                <Users className="text-[#5F9598] w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                    <h2 className="text-base font-medium text-[#061E29]">Pod #{pod.id}</h2>
                                    <div className="flex items-center gap-1">
                                        <span className={`text-[10px] px-2 py-0.5 rounded ${relationshipClass}`}>
                                            {relationshipLabel}
                                        </span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded ${pod.status === 'running'
                                            ? 'bg-blue-100 text-blue-700'
                                            : pod.status === 'pending_review'
                                                ? 'bg-amber-100 text-amber-700'
                                                : pod.status === 'closed'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-[#F3F4F4] text-[#061E29]/60'
                                        }`}>
                                            {(pod.status || 'idle').replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
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
                    );
                })}

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
