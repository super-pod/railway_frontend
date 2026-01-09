import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../lib/apiClient';
import { useAuth } from '../context/AuthContext';

const SetupOrca = () => {
    const [pref, setPref] = useState('');
    const [originalPref, setOriginalPref] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { refreshProfile } = useAuth();

    useEffect(() => {
        const loadOrca = async () => {
            try {
                const res = await apiClient.get('/orcas/me');
                const first = res.data?.[0];
                const instructions = first?.instructions || '';
                setPref(instructions);
                setOriginalPref(instructions);
                setIsEditing(!instructions);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadOrca();
    }, []);

    const handleSave = async () => {
        if (saving) {
            return;
        }
        const trimmed = pref.trim();
        if (!trimmed) {
            return;
        }
        setSaving(true);
        try {
            await apiClient.post('/orcas', { instructions: trimmed });
            await refreshProfile();
            setOriginalPref(trimmed);
            setIsEditing(false);
            const from = (location.state as any)?.from?.pathname;
            navigate(from || '/dashboard');
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const hasChanges = pref.trim() !== originalPref.trim();

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-[#061E29] mb-1">Settings</h1>
                <p className="text-sm text-[#061E29]/60">Edit your Orca instructions</p>
            </div>

            <div className="card p-6 space-y-4">
                {loading && (
                    <div className="text-xs text-[#061E29]/60">
                        Loading instructions...
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-[#061E29] mb-2">
                        Orca Instructions
                    </label>
                    <p className="text-xs text-[#061E29]/60 mb-3">
                        Describe how your Orca should make decisions for scheduling and coordination.
                    </p>
                    <textarea
                        className="w-full"
                        rows={4}
                        value={pref}
                        onChange={(e) => setPref(e.target.value)}
                        placeholder="Example: prioritize afternoons, avoid lunch hours, allow 30-min slots..."
                        disabled={!isEditing}
                    />
                </div>
                <div className="flex items-center gap-3">
                    {!isEditing ? (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="btn btn-primary w-full"
                            disabled={loading}
                        >
                            Edit Instructions
                        </button>
                    ) : (
                        <button
                            onClick={handleSave}
                            className="btn btn-primary w-full"
                            disabled={loading || saving || !hasChanges || !pref.trim()}
                        >
                            {saving ? 'Saving...' : 'Save Instructions'}
                        </button>
                    )}
                    <button
                        type="button"
                        className="btn btn-primary w-full bg-[#5F9598]/20 text-[#5F9598] border border-[#5F9598]/30 hover:bg-[#5F9598]/30"
                        disabled
                    >
                        Add another Orca
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SetupOrca;
