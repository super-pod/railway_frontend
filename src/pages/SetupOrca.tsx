import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SetupOrca = () => {
    const [pref, setPref] = useState('');
    const navigate = useNavigate();

    const handleSave = () => {
        // Stub save
        navigate('/dashboard');
    };

    return (
        <div className="max-w-xl mx-auto p-8">
            <h1 className="text-3xl font-bold text-white mb-6">Setup Your Orca</h1>
            <div className="glass-card p-8">
                <label className="block text-blue-200 mb-4">What should your Orca prioritize? (e.g. afternoons only, prioritize focus time)</label>
                <input
                    type="text"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white mb-6"
                    value={pref}
                    onChange={(e) => setPref(e.target.value)}
                    placeholder="Enter preferences..."
                />
                <button onClick={handleSave} className="btn-primary w-full">Save and Continue</button>
            </div>
        </div>
    );
};

export default SetupOrca;
