import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../lib/apiClient';
import { useAuth } from '../context/AuthContext';

const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

const SettingsPage = () => {
    const { profile, refresh } = useAuth();
    const [duration, setDuration] = useState<number>(profile?.default_duration || 30);
    const [meetingType, setMeetingType] = useState<'virtual' | 'physical' | 'either'>(profile?.default_meeting_type || 'virtual');
    const [windowDays, setWindowDays] = useState<number>(profile?.default_window_days || 14);
    const [message, setMessage] = useState<string>('');

    const save = async () => {
        setMessage('Saving...');
        try {
            await apiClient.patch('/mvp/settings', {
                default_duration: duration,
                default_meeting_type: meetingType,
                default_window_days: windowDays,
                timezone: localTimezone,
            });
            await refresh();
            setMessage('Saved');
        } catch (error: any) {
            setMessage(error?.response?.data?.detail || 'Save failed');
        }
    };

    return (
        <div className="min-h-screen bg-[#f4f8f7] px-5 py-8">
            <div className="mx-auto max-w-3xl space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-semibold text-[#09343a]">Settings</h1>
                    <Link to="/app" className="text-sm text-[#0a4f56]">Back</Link>
                </div>

                <div className="grid gap-4 rounded-2xl border border-[#0a4f56]/12 bg-white p-6 md:grid-cols-2">
                    <label className="text-sm text-[#33585d]">
                        Default duration
                        <select
                            className="mt-2 w-full rounded-lg border border-[#0a4f56]/20 px-3 py-2"
                            value={duration}
                            onChange={(event) => setDuration(Number(event.target.value))}
                        >
                            <option value={15}>15</option>
                            <option value={30}>30</option>
                            <option value={45}>45</option>
                            <option value={60}>60</option>
                        </select>
                    </label>

                    <label className="text-sm text-[#33585d]">
                        Meeting type
                        <select
                            className="mt-2 w-full rounded-lg border border-[#0a4f56]/20 px-3 py-2"
                            value={meetingType}
                            onChange={(event) => setMeetingType(event.target.value as 'virtual' | 'physical' | 'either')}
                        >
                            <option value="virtual">Virtual</option>
                            <option value="physical">Physical</option>
                            <option value="either">Either</option>
                        </select>
                    </label>

                    <label className="text-sm text-[#33585d]">
                        Date range window
                        <select
                            className="mt-2 w-full rounded-lg border border-[#0a4f56]/20 px-3 py-2"
                            value={windowDays}
                            onChange={(event) => setWindowDays(Number(event.target.value))}
                        >
                            <option value={14}>Next 2 weeks</option>
                            <option value={30}>Next 30 days</option>
                        </select>
                    </label>

                </div>

                <div className="rounded-2xl border border-[#0a4f56]/12 bg-white p-6">
                    <p className="text-sm text-[#33585d]">Current link</p>
                    <code className="mt-2 block rounded-lg bg-[#eef7f6] px-3 py-2 text-sm text-[#0a4f56]">{profile?.orca_link}</code>
                </div>

                <div className="flex gap-3">
                    <button onClick={save} className="rounded-lg bg-[#0a4f56] px-4 py-2 text-sm font-semibold text-white">
                        Save settings
                    </button>
                    {message && <p className="self-center text-sm text-[#33585d]">{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
