import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import apiClient from '../lib/apiClient';

interface Slot {
    start: string;
    end: string;
    duration: number;
    meeting_type: 'virtual' | 'physical' | 'either';
    label: string;
    reason?: string;
    reason_token?: string;
}

interface LinkPayload {
    owner: {
        name: string;
        username: string;
        default_meeting_type: 'virtual' | 'physical' | 'either';
        default_duration: number;
    };
    viewer: { signed_in: boolean };
    preferred_slot?: Slot;
    alternative_slots?: Slot[];
    available_slots?: Slot[];
    algorithm_reason?: string;
    message?: string;
}

const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

const formatLocal = (iso: string) =>
    new Intl.DateTimeFormat(undefined, { dateStyle: 'full', timeStyle: 'short', timeZone: localTimezone }).format(new Date(iso));

const OrcaLinkPage = () => {
    const { username, shareToken } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [data, setData] = useState<LinkPayload | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [guestName, setGuestName] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [selectedSlotStart, setSelectedSlotStart] = useState<string | null>(null);
    const [booking, setBooking] = useState(false);

    const [countdown, setCountdown] = useState(60);
    const [timerStopped, setTimerStopped] = useState(false);

    useEffect(() => {
        let active = true;
        const endpoint = shareToken ? `/mvp/share/${shareToken}` : username ? `/mvp/link/${username}` : null;

        const load = async () => {
            if (!endpoint) {
                setError('Invalid link.');
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const res = await apiClient.get(endpoint);
                if (active) {
                    setData(res.data as LinkPayload);
                }
            } catch (err: any) {
                setError(err?.response?.data?.detail || 'Could not load this orca link.');
            } finally {
                setLoading(false);
            }
        };

        void load();
        return () => {
            active = false;
        };
    }, [username, shareToken]);

    useEffect(() => {
        if (!data?.viewer?.signed_in || !data.preferred_slot || timerStopped) {
            return;
        }
        if (countdown <= 0) {
            void confirm(data.preferred_slot);
            return;
        }

        const timer = window.setTimeout(() => setCountdown((value) => value - 1), 1000);
        return () => window.clearTimeout(timer);
    }, [countdown, data?.viewer?.signed_in, data?.preferred_slot, timerStopped]);

    useEffect(() => {
        if (!data?.viewer?.signed_in || !data.preferred_slot) {
            return;
        }
        setCountdown(60);
        setTimerStopped(false);
    }, [data?.viewer?.signed_in, data?.preferred_slot?.start]);

    useEffect(() => {
        if (!data || data.viewer.signed_in) {
            setSelectedSlotStart(null);
            return;
        }
        const slots = data.available_slots || [];
        if (slots.length === 0) {
            setSelectedSlotStart(null);
            return;
        }
        setSelectedSlotStart((current) => (current && slots.some((slot) => slot.start === current) ? current : slots[0].start));
    }, [data]);

    const progress = useMemo(() => (countdown / 60) * 100, [countdown]);

    const confirm = async (slot: Slot) => {
        const endpoint = shareToken
            ? `/mvp/share/${shareToken}/book`
            : username
                ? `/mvp/link/${username}/book`
                : null;
        if (!endpoint) {
            return;
        }
        setBooking(true);
        setError(null);
        try {
            const res = await apiClient.post(endpoint, {
                slot_start: slot.start,
                slot_end: slot.end,
                guest_name: guestName || undefined,
                guest_email: guestEmail || undefined,
                selected_meeting_type: slot.meeting_type,
                reason_token: slot.reason_token,
            });
            const podToken = res.data.pod?.pod_token as string;
            navigate(`/pod/${podToken}`);
        } catch (err: any) {
            setError(err?.response?.data?.detail || 'Could not confirm this slot.');
        } finally {
            setBooking(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen grid place-items-center bg-[#f4f8f7] text-[#33585d]">Loading link...</div>;
    }

    if (error) {
        return (
            <div className="min-h-screen grid place-items-center bg-[#f4f8f7] px-4">
                <div className="max-w-md rounded-2xl border border-[#d9a4a4] bg-[#fff5f5] p-6 text-center text-[#8b2b2b]">{error}</div>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    const isSignedIn = data.viewer.signed_in;
    const availableSlots = data.available_slots || [];
    const nextPath = `${location.pathname}${location.search}${location.hash}`;
    const selectedSlot = availableSlots.find((slot) => slot.start === selectedSlotStart) || null;

    return (
        <div className="min-h-screen bg-[#f4f8f7] px-5 py-8">
            <div className="mx-auto max-w-5xl rounded-3xl border border-[#0a4f56]/12 bg-white p-6">
                <h1 className="text-3xl font-semibold text-[#09343a]">Schedule time with {data.owner.name}</h1>

                <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.9fr]">
                    <section className="space-y-6">
                        {!isSignedIn && (
                            <>
                                {availableSlots.length === 0 ? (
                                    <p className="rounded-xl bg-[#fff8ef] p-4 text-sm text-[#8a4f13]">{data.message || 'No slots available right now.'}</p>
                                ) : (
                                    <div className="space-y-3">
                                        <p className="text-sm text-[#33585d]">{availableSlots.length} available slots</p>
                                        {availableSlots.map((slot) => (
                                            <button
                                                key={slot.start}
                                                disabled={booking}
                                                onClick={() => setSelectedSlotStart(slot.start)}
                                                className={`flex w-full items-start justify-between rounded-xl border p-4 text-left transition ${
                                                    selectedSlotStart === slot.start
                                                        ? 'border-[#0a4f56] bg-[#eef7f6]'
                                                        : 'border-[#0a4f56]/12 hover:bg-[#f8fcfb]'
                                                }`}
                                            >
                                                <div>
                                                    <p className="font-semibold text-[#09343a]">{formatLocal(slot.start)}</p>
                                                    <p className="text-sm text-[#33585d]">
                                                        {slot.duration} min, {slot.meeting_type === 'virtual' ? 'Virtual' : slot.meeting_type === 'physical' ? 'Physical' : 'Either'}
                                                    </p>
                                                </div>
                                                <span className="rounded-full bg-[#eef7f6] px-2 py-1 text-xs text-[#0a4f56]">{localTimezone}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div className="grid gap-3 md:grid-cols-2">
                                    <input
                                        className="rounded-lg border border-[#0a4f56]/20 px-3 py-2"
                                        placeholder="Your name"
                                        value={guestName}
                                        onChange={(event) => setGuestName(event.target.value)}
                                    />
                                    <input
                                        className="rounded-lg border border-[#0a4f56]/20 px-3 py-2"
                                        placeholder="Your email"
                                        value={guestEmail}
                                        onChange={(event) => setGuestEmail(event.target.value)}
                                    />
                                </div>
                                <button
                                    type="button"
                                    disabled={booking || !selectedSlot || !guestEmail.trim()}
                                    onClick={() => selectedSlot && confirm(selectedSlot)}
                                    className="w-full rounded-lg bg-[#0a4f56] px-4 py-2 text-sm font-semibold text-white hover:bg-[#083b42] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {booking ? 'Confirming...' : 'Confirm meeting'}
                                </button>

                                <p className="text-xs text-[#33585d]">Meeting scheduled? Check your email for Google Calendar invite.</p>
                            </>
                        )}

                        {isSignedIn && data.preferred_slot && (
                            <>
                                <div className="rounded-xl border border-[#0a4f56]/12 bg-[#f8fcfb] p-4">
                                    <p className="text-sm text-[#33585d]">Your orcas found the best time</p>
                                    <p className="mt-1 text-lg font-semibold text-[#09343a]">{formatLocal(data.preferred_slot.start)}</p>
                                    <p className="text-sm text-[#33585d]">
                                        {data.preferred_slot.duration} min, {data.preferred_slot.meeting_type === 'virtual' ? 'Virtual' : data.preferred_slot.meeting_type === 'physical' ? 'Physical' : 'Either'}
                                    </p>
                                    <p className="mt-1 text-xs text-[#33585d]">{data.preferred_slot.reason || data.algorithm_reason}</p>
                                    <button
                                        onClick={() => confirm(data.preferred_slot as Slot)}
                                        disabled={booking}
                                        className="mt-4 rounded-lg bg-[#0a4f56] px-4 py-2 text-sm font-semibold text-white hover:bg-[#083b42]"
                                    >
                                        Confirm now
                                    </button>
                                </div>

                                <div className="rounded-xl border border-[#0a4f56]/12 bg-white p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-[#33585d]">
                                        {timerStopped ? `Auto-confirm paused at ${countdown}s` : `Confirming in ${countdown}s`}
                                    </p>
                                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#d6ebe8]">
                                        <div className="h-full bg-[#0a4f56] transition-all" style={{ width: `${progress}%` }} />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setTimerStopped((value) => !value)}
                                        disabled={booking}
                                        className="mt-3 rounded-lg border border-[#0a4f56]/25 px-3 py-2 text-sm font-semibold text-[#0a4f56] hover:bg-[#eef7f6] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {timerStopped ? 'Resume timer' : 'Stop timer'}
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm text-[#33585d]">Other options</p>
                                    {(data.alternative_slots || []).map((slot) => (
                                        <button
                                            key={slot.start}
                                            onClick={() => confirm(slot)}
                                            disabled={booking}
                                            className="block w-full rounded-lg border border-[#0a4f56]/12 px-3 py-2 text-left text-sm text-[#09343a] hover:bg-[#f8fcfb]"
                                        >
                                            <p>{formatLocal(slot.start)}</p>
                                            {slot.reason && <p className="mt-1 text-xs text-[#5b7278]">{slot.reason}</p>}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}

                        <p className="text-xs text-[#33585d]">Times shown in your local timezone: {localTimezone}</p>
                    </section>

                    <aside className="h-fit space-y-4 rounded-xl border border-[#0a4f56]/15 bg-[#eef7f6] p-4">
                        {!isSignedIn ? (
                            <>
                                <p className="text-sm font-semibold text-[#09343a]">Already have an Orca account?</p>
                                <p className="text-sm text-[#33585d]">
                                    If this opened in another browser or session, log in or sign up. We will bring you back here after login.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => navigate(`/login?next=${encodeURIComponent(nextPath)}`)}
                                    className="rounded-lg bg-[#0a4f56] px-4 py-2 text-sm font-semibold text-white hover:bg-[#083b42]"
                                >
                                    Log in / Sign up
                                </button>
                            </>
                        ) : (
                            <>
                                <p className="text-sm font-semibold text-[#09343a]">Signed in</p>
                                <p className="text-sm text-[#33585d]">The sidebar stays available while you review options and timing details.</p>
                                <p className="text-xs text-[#33585d]">
                                    Auto-confirm status: {timerStopped ? `paused at ${countdown}s` : `running (${countdown}s left)`}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => navigate('/app')}
                                    className="rounded-lg border border-[#0a4f56]/25 px-4 py-2 text-sm font-semibold text-[#0a4f56] hover:bg-white"
                                >
                                    Open dashboard
                                </button>
                            </>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default OrcaLinkPage;
