import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../lib/apiClient';

const PodCreate = () => {
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await apiClient.post('/pods', { description });
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8">
            <h1 className="text-3xl font-bold text-white mb-8">Create New Pod</h1>
            <form onSubmit={handleSubmit} className="glass-card p-8">
                <div className="mb-6">
                    <label className="block text-blue-200 mb-2 font-medium">Pod Context / Description</label>
                    <textarea
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        placeholder="e.g., Weekly Sync for Team Orca or Dinner Party Planning"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <button
                    disabled={loading}
                    type="submit"
                    className="btn-primary w-full disabled:opacity-50"
                >
                    {loading ? 'Creating...' : 'Initialize Pod'}
                </button>
            </form>
        </div>
    );
};

export default PodCreate;
