import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../lib/apiClient';
import { useAuth } from '../context/AuthContext';

type CopyTarget = 'share' | 'permanent' | null;

const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

const AppHome = () => {
    const { profile, refresh } = useAuth();

    const [copyTarget, setCopyTarget] = useState<CopyTarget>(null);
    const [settingsMessage, setSettingsMessage] = useState('');
    const [savingSettings, setSavingSettings] = useState(false);

    const [duration, setDuration] = useState<number>(30);
    const [meetingType, setMeetingType] = useState<'virtual' | 'physical' | 'either'>('virtual');
    const [windowDays, setWindowDays] = useState<number>(14);
    const [saturdayOff, setSaturdayOff] = useState<boolean>(true);
    const [sundayOff, setSundayOff] = useState<boolean>(true);
    const [instructions, setInstructions] = useState<string>('');

    const permanentLink = profile?.orca_link || '';
    const shareLink = profile?.default_single_use_link || '';
    const showGmailPrompt = Boolean(profile?.last_meeting_at && !profile?.gmail_connected);

    useEffect(() => {
        if (!profile) {
            return;
        }
        setDuration(profile.default_duration || 30);
        setMeetingType(profile.default_meeting_type || 'virtual');
        setWindowDays(profile.default_window_days || 14);
        setSaturdayOff(profile.saturday_off ?? true);
        setSundayOff(profile.sunday_off ?? true);
        setInstructions(profile.instructions || '');
    }, [profile]);

    const copyText = async (text: string, target: Exclude<CopyTarget, null>) => {
        if (!text) {
            return;
        }
        await navigator.clipboard.writeText(text);
        setCopyTarget(target);
        window.setTimeout(() => setCopyTarget(null), 1200);
    };

    const saveSettings = async () => {
        setSavingSettings(true);
        setSettingsMessage('Saving...');
        try {
            await apiClient.patch('/mvp/settings', {
                default_duration: duration,
                default_meeting_type: meetingType,
                default_window_days: windowDays,
                saturday_off: saturdayOff,
                sunday_off: sundayOff,
                timezone: localTimezone,
                instructions,
            });
            await refresh();
            setSettingsMessage('Saved');
        } catch (error: any) {
            setSettingsMessage(error?.response?.data?.detail || 'Save failed');
        } finally {
            setSavingSettings(false);
        }
    };

    if (!profile) {
        return (
            <div className="grid min-h-[70vh] place-items-center text-[#33585d]">
                Loading dashboard...
            </div>
        );
    }

    return (
        <div className="px-4 py-8 sm:px-5 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-3xl font-semibold text-[#09343a]">Dashboard</h1>
                        <p className="mt-1 text-sm text-[#33585d]">Manage links, pod history, and Orca behavior.</p>
                    </div>
                    <button onClick={() => refresh()} className="rounded-lg border border-[#0a4f56]/20 px-3 py-2 text-sm text-[#0a4f56]">
                        Refresh
                    </button>
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,1fr)]">
                    <div className="space-y-6">
                        <section className="rounded-2xl border border-[#0a4f56]/12 bg-white p-6">
                            <h2 className="text-lg font-semibold text-[#09343a]">Links</h2>
                            <p className="mt-1 text-sm text-[#33585d]">Use these links in your profile and outreach.</p>
                            <div className="mt-4 rounded-xl border border-[#0a4f56]/20 bg-[#eef7f6] p-4">
                                <p className="text-base font-semibold text-[#09343a]">Permanent Orca link</p>
                                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <code className="min-w-0 flex-1 break-all rounded-lg bg-white px-3 py-2 text-sm text-[#0a4f56]">
                                        {permanentLink || 'Generating...'}
                                    </code>
                                    <button
                                        onClick={() => copyText(permanentLink, 'permanent')}
                                        disabled={!permanentLink}
                                        className="w-full rounded-lg bg-[#0a4f56] px-3 py-2 text-sm font-semibold text-white disabled:opacity-60 sm:w-auto"
                                    >
                                        {copyTarget === 'permanent' ? 'Copied' : 'Copy permanent link'}
                                    </button>
                                </div>
                            </div>

                            <p className="mt-4 text-sm font-semibold text-[#09343a]">Default single-use share link</p>
                            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                                <code className="min-w-0 flex-1 break-all rounded-lg bg-[#eef7f6] px-3 py-2 text-sm text-[#0a4f56]">
                                    {shareLink || 'Generating...'}
                                </code>
                                <button
                                    onClick={() => copyText(shareLink, 'share')}
                                    disabled={!shareLink}
                                    className="w-full rounded-lg border border-[#0a4f56]/20 px-3 py-2 text-sm text-[#0a4f56] disabled:opacity-60 sm:w-auto"
                                >
                                    {copyTarget === 'share' ? 'Copied' : 'Copy single-use link'}
                                </button>
                            </div>
                        </section>

                        {showGmailPrompt && (
                            <div className="rounded-2xl border border-[#f0b770] bg-[#fff8ef] p-6">
                                <p className="text-sm font-semibold text-[#8a4f13]">Upgrade to Tier 2: Gmail Enhanced</p>
                                <p className="mt-1 text-sm text-[#8a4f13]">Enable Gmail read-only sync to improve slot ranking with communication patterns.</p>
                                <Link to="/app/gmail-sync" className="mt-3 inline-flex rounded-lg bg-[#8a4f13] px-4 py-2 text-sm font-semibold text-white">
                                    Join Gmail waitlist
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6 xl:sticky xl:top-8 xl:h-fit">
                        <section className="rounded-2xl border border-[#0a4f56]/12 bg-white p-6">
                            <h2 className="text-lg font-semibold text-[#09343a]">Instructions</h2>
                            <p className="mt-1 text-sm text-[#33585d]">Tell Orca your scheduling preferences and constraints.</p>
                            <textarea
                                className="mt-3 min-h-36 w-full rounded-lg border border-[#0a4f56]/20 px-3 py-2"
                                value={instructions}
                                onChange={(event) => setInstructions(event.target.value)}
                                placeholder="Example: Prefer afternoons, avoid Fridays, keep meetings to 30 minutes."
                            />
                        </section>

                        <section className="rounded-2xl border border-[#0a4f56]/12 bg-white p-6">
                            <h2 className="text-lg font-semibold text-[#09343a]">Settings</h2>
                            <div className="mt-4 grid gap-4">
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

                                <div className="rounded-lg border border-[#0a4f56]/12 bg-[#f8fcfb] px-3 py-3">
                                    <p className="text-sm font-semibold text-[#09343a]">Weekend defaults</p>
                                    <p className="mt-1 text-xs text-[#33585d]">Used when Orca proposes slots.</p>
                                    <div className="mt-3 flex flex-wrap gap-4">
                                        <label className="inline-flex items-center gap-2 text-sm text-[#33585d]">
                                            <input
                                                type="checkbox"
                                                checked={saturdayOff}
                                                onChange={(event) => setSaturdayOff(event.target.checked)}
                                                className="h-4 w-4 rounded border border-[#0a4f56]/30"
                                            />
                                            Saturday off
                                        </label>
                                        <label className="inline-flex items-center gap-2 text-sm text-[#33585d]">
                                            <input
                                                type="checkbox"
                                                checked={sundayOff}
                                                onChange={(event) => setSundayOff(event.target.checked)}
                                                className="h-4 w-4 rounded border border-[#0a4f56]/30"
                                            />
                                            Sunday off
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-3">
                                <button
                                    onClick={saveSettings}
                                    disabled={savingSettings}
                                    className="rounded-lg bg-[#0a4f56] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                                >
                                    {savingSettings ? 'Saving...' : 'Save settings'}
                                </button>
                                {settingsMessage && <p className="text-sm text-[#33585d]">{settingsMessage}</p>}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppHome;
