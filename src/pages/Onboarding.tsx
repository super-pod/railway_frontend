import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../lib/apiClient';
import { useAuth } from '../context/AuthContext';
import { signOutUser } from '../lib/firebaseClient';

const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
type AvailabilityState = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';

const Onboarding = () => {
    const { user, profile, refresh } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState(profile?.username || '');
    const [normalizedUsername, setNormalizedUsername] = useState(profile?.username || '');
    const [availability, setAvailability] = useState<AvailabilityState>('idle');
    const [availabilityMessage, setAvailabilityMessage] = useState('');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!username.trim()) {
            setNormalizedUsername('');
            setAvailability('idle');
            setAvailabilityMessage('');
            return;
        }

        let active = true;
        const timer = window.setTimeout(async () => {
            setAvailability('checking');
            setAvailabilityMessage('Checking username...');
            try {
                const res = await apiClient.get('/mvp/username/check', {
                    params: { username },
                });
                if (!active) {
                    return;
                }
                const normalized = res.data?.normalized || username;
                setNormalizedUsername(normalized);
                if (res.data?.available) {
                    setAvailability('available');
                    setAvailabilityMessage('Username is available.');
                    return;
                }
                if (res.data?.reason === 'invalid_format') {
                    setAvailability('invalid');
                    setAvailabilityMessage('Use 3-32 characters: lowercase letters, numbers, and hyphens.');
                    return;
                }
                setAvailability('taken');
                setAvailabilityMessage('That username is already taken.');
            } catch (error) {
                if (!active) {
                    return;
                }
                console.error(error);
                setAvailability('idle');
                setAvailabilityMessage('Could not verify username right now.');
            }
        }, 250);

        return () => {
            active = false;
            window.clearTimeout(timer);
        };
    }, [username]);

    const linkPreview = useMemo(() => `getorca.in/calendar/${normalizedUsername || 'your-name'}`, [normalizedUsername]);

    const save = async () => {
        if (availability !== 'available') {
            return;
        }
        setSaving(true);
        setMessage(null);
        try {
            await apiClient.post('/mvp/onboarding', {
                username: normalizedUsername,
                timezone: localTimezone,
            });
            await refresh();
            navigate('/app', { replace: true });
        } catch (error: any) {
            console.error(error);
            setMessage(error?.response?.data?.detail || 'Could not save onboarding.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f4f8f7] px-5 py-8">
            <div className="mx-auto max-w-2xl space-y-6">
                <h1 className="text-3xl font-semibold text-[#09343a]">Choose your Orca username</h1>
                <div className="flex items-center gap-3 text-sm text-[#33585d]">
                    <p>Signed in as {user?.email || 'your Google account'}</p>
                    <button
                        type="button"
                        onClick={() => signOutUser()}
                        className="text-[#0a4f56] underline underline-offset-2 hover:text-[#09343a]"
                    >
                        Logout
                    </button>
                </div>
                <div className="rounded-2xl border border-[#0a4f56]/12 bg-white p-6">
                    <p className="text-sm text-[#33585d]">Pick a unique username for your permanent link.</p>
                    <input
                        className="mt-3 w-full rounded-lg border border-[#0a4f56]/20 px-3 py-2"
                        value={username}
                        onChange={(event) => setUsername(event.target.value.toLowerCase())}
                        placeholder="username"
                    />
                    <p className="mt-2 text-xs text-[#33585d]">Your link: {linkPreview}</p>
                    {availabilityMessage && (
                        <p
                            className={`mt-2 text-xs ${
                                availability === 'available'
                                    ? 'text-[#1b6f3a]'
                                    : availability === 'checking'
                                        ? 'text-[#33585d]'
                                        : 'text-[#a83f3f]'
                            }`}
                        >
                            {availabilityMessage}
                        </p>
                    )}
                </div>

                {message && <p className="text-sm text-[#a83f3f]">{message}</p>}

                <button
                    onClick={save}
                    disabled={availability !== 'available' || saving}
                    className="rounded-xl bg-[#0a4f56] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                    {saving ? 'Saving...' : 'Continue to dashboard'}
                </button>
            </div>
        </div>
    );
};

export default Onboarding;
