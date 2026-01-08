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

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-bold text-white">Your Pods</h1>
                <Link to="/pods/create" className="btn-primary flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Create New Pod
                </Link>
            </div>

            {loading ? (
                <div className="text-blue-300">Loading pods...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pods.map(pod => (
                        <Link key={pod.id} to={`/pods/${pod.id}`} className="glass-card p-6 hover:bg-slate-800 transition-colors">
                            <div className="flex items-center mb-4">
                                <Users className="text-blue-400 mr-2" />
                                <h2 className="text-xl font-semibold text-white">Pod #{pod.id}</h2>
                            </div>
                            <p className="text-blue-200 line-clamp-2">{pod.description}</p>
                        </Link>
                    ))}
                    {pods.length === 0 && (
                        <div className="col-span-full text-center py-20 glass-card">
                            <p className="text-blue-300">No pods active. Create your first one to start coordinating.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
