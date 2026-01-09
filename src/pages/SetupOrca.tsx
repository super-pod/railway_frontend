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
        <div className="p-6 max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-[#061E29] mb-1">Settings</h1>
                <p className="text-sm text-[#061E29]/60">Configure your preferences</p>
            </div>

            <div className="card p-6">
                <label className="block text-sm font-medium text-[#061E29] mb-2">
                    Scheduling Preferences
                </label>
                <p className="text-xs text-[#061E29]/60 mb-4">
                    Tell Orca what to prioritize (e.g., afternoons only, focus time)
                </p>
                <input
                    type="text"
                    className="w-full mb-6"
                    value={pref}
                    onChange={(e) => setPref(e.target.value)}
                    placeholder="Enter your preferences..."
                />
                <button onClick={handleSave} className="btn btn-primary w-full">
                    Save Preferences
                </button>
            </div>
        </div>
    );
};

export default SetupOrca;
