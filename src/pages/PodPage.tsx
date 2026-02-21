import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PartyPopper, Sparkles } from 'lucide-react';
import apiClient from '../lib/apiClient';

interface PodData {
    pod_token: string;
    owner_username: string;
    guest_name: string | null;
    guest_email: string;
    start_at: string;
    end_at: string;
    meeting_type: 'virtual' | 'physical' | 'either';
    notes: string;
    status: string;
    owner_slot_reason?: string;
    booker_slot_reason?: string;
}

const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

const fmt = (iso: string) =>
    new Intl.DateTimeFormat(undefined, { dateStyle: 'full', timeStyle: 'short', timeZone: localTimezone }).format(new Date(iso));

const meetingTypeLabel = (meetingType: PodData['meeting_type']) => {
    if (meetingType === 'virtual') {
        return 'Virtual';
    }
    if (meetingType === 'physical') {
        return 'Physical';
    }
    return 'Either';
};

const PodPage = () => {
    const { podToken } = useParams();
    const [pod, setPod] = useState<PodData | null>(null);
    const [showSignup, setShowSignup] = useState(false);
    const [viewerRole, setViewerRole] = useState<'owner' | 'guest' | 'anonymous'>('anonymous');
    const [notes, setNotes] = useState('');
    const [message, setMessage] = useState<string>('');

    const load = async () => {
        if (!podToken) {
            return;
        }
        try {
            const res = await apiClient.get(`/mvp/pods/${podToken}`);
            setPod(res.data.pod as PodData);
            setShowSignup(Boolean(res.data.viewer?.show_signup_cta));
            setViewerRole((res.data.viewer?.role as 'owner' | 'guest' | 'anonymous') || 'anonymous');
            setNotes((res.data.pod as PodData).notes || '');
        } catch (error: any) {
            setMessage(error?.response?.data?.detail || 'Could not load pod');
        }
    };

    useEffect(() => {
        void load();
    }, [podToken]);

    const reschedule = async () => {
        if (!podToken) {
            return;
        }
        const res = await apiClient.post(`/mvp/pods/${podToken}/reschedule`);
        setMessage(`${res.data.message} ${res.data.reschedule_link}`);
        await load();
    };

    const cancel = async () => {
        if (!podToken) {
            return;
        }
        await apiClient.post(`/mvp/pods/${podToken}/cancel`);
        setMessage('Meeting canceled for both sides.');
        await load();
    };

    const saveNotes = async () => {
        if (!podToken) {
            return;
        }
        await apiClient.patch(`/mvp/pods/${podToken}/notes`, { notes });
        setMessage('Notes saved.');
    };

    if (!pod) {
        return <div className="min-h-screen grid place-items-center bg-[#f4f8f7] text-[#33585d]">{message || 'Loading pod...'}</div>;
    }

    const nextPath = podToken ? `/pod/${podToken}` : '/app';

    return (
        <div className="min-h-screen bg-[#f4f8f7] px-5 py-8">
            <div className="mx-auto max-w-6xl space-y-6 rounded-3xl border border-[#0a4f56]/12 bg-white p-4 sm:p-6">
                <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
                    <section className="space-y-6 rounded-2xl border border-[#0a4f56]/12 bg-[#f8fcfb] p-6">
                        <div className="mx-auto flex max-w-md flex-col items-center text-center">
                            <div className="relative grid h-24 w-24 place-items-center rounded-full bg-[#0a4f56] text-white shadow-[0_20px_45px_rgba(10,79,86,0.25)]">
                                <PartyPopper className="h-11 w-11" />
                                <Sparkles className="absolute -right-1 -top-1 h-5 w-5 text-[#f8c74f]" />
                                <Sparkles className="absolute -left-2 top-5 h-4 w-4 text-[#90d4de]" />
                            </div>
                            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[#50777c]">Meeting Scheduled</p>
                            <h1 className="mt-2 text-3xl font-semibold text-[#09343a]">Success</h1>
                            <p className="mt-2 text-sm text-[#33585d]">Your pod is confirmed and calendars are updated for both sides.</p>
                        </div>

                        <div className="rounded-xl border border-[#0a4f56]/12 bg-white p-4">
                            <p className="text-sm text-[#33585d]">Meeting info</p>
                            <p className="mt-1 font-semibold text-[#09343a]">{fmt(pod.start_at)}</p>
                            <p className="text-sm text-[#33585d]">Ends: {fmt(pod.end_at)}</p>
                            <p className="mt-1 text-sm text-[#33585d]">Meeting type: {meetingTypeLabel(pod.meeting_type)}</p>
                            <p className="text-sm text-[#33585d]">Timezone: {localTimezone}</p>
                            <p className="text-sm text-[#33585d]">Participant: {pod.guest_name || pod.guest_email}</p>
                            <p className="mt-1 text-sm text-[#33585d]">Status: {pod.status}</p>
                            {viewerRole === 'guest' && pod.booker_slot_reason && (
                                <p className="mt-2 text-sm text-[#33585d]">Why this slot for you: {pod.booker_slot_reason}</p>
                            )}
                            {viewerRole !== 'guest' && pod.owner_slot_reason && (
                                <p className="mt-2 text-sm text-[#33585d]">Why Orca picked this for you: {pod.owner_slot_reason}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#09343a]">Add context</label>
                            <textarea
                                value={notes}
                                onChange={(event) => setNotes(event.target.value)}
                                className="min-h-[120px] w-full rounded-xl border border-[#0a4f56]/20 bg-white px-3 py-2"
                                placeholder="Add context for this meeting"
                            />
                            <button onClick={saveNotes} className="rounded-lg border border-[#0a4f56]/20 px-3 py-2 text-sm text-[#0a4f56] hover:bg-[#eef7f6]">
                                Save context
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button onClick={reschedule} className="rounded-lg bg-[#0a4f56] px-4 py-2 text-sm font-semibold text-white hover:bg-[#083b42]">
                                Reschedule
                            </button>
                            <button onClick={cancel} className="rounded-lg border border-[#b85858]/40 px-4 py-2 text-sm text-[#9f3e3e] hover:bg-[#fff1f1]">
                                Cancel
                            </button>
                        </div>
                    </section>

                    <aside className="rounded-2xl border border-[#0a4f56]/12 bg-[#fff8ef] p-6">
                        {showSignup ? (
                            <div className="space-y-5">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-[#9b7b53]">Get Your Own Orca</p>
                                    <h2 className="mt-2 text-2xl font-semibold text-[#09343a]">Sign up and automate scheduling</h2>
                                    <p className="mt-2 text-sm text-[#5f6f74]">Use Orca to let agents negotiate time and commit outcomes without back-and-forth.</p>
                                </div>

                                <Link
                                    className="inline-flex w-full items-center justify-center rounded-lg bg-[#115a78] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0f506a]"
                                    to={`/login?next=${encodeURIComponent(nextPath)}`}
                                >
                                    Sign up with Google
                                </Link>
                                <p className="text-xs text-[#8f7c65]">Calendar access is required to create or join pods.</p>

                                <div className="space-y-3 pt-1">
                                    <div className="rounded-xl border border-[#e8dccd] bg-white p-3">
                                        <p className="text-xs uppercase tracking-[0.18em] text-[#a48a6a]">Agents</p>
                                        <p className="mt-1 text-sm text-[#4a5f66]">Create an orca with preferences, constraints, and authority.</p>
                                    </div>
                                    <div className="rounded-xl border border-[#e8dccd] bg-white p-3">
                                        <p className="text-xs uppercase tracking-[0.18em] text-[#a48a6a]">Pods</p>
                                        <p className="mt-1 text-sm text-[#4a5f66]">Orcas form pods to solve shared goals with committed outcomes.</p>
                                    </div>
                                    <div className="rounded-xl border border-[#e8dccd] bg-white p-3">
                                        <p className="text-xs uppercase tracking-[0.18em] text-[#a48a6a]">Negotiation</p>
                                        <p className="mt-1 text-sm text-[#4a5f66]">Orcas exchange constraints and trade-offs. No chat. No manual coordination.</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-[#9b7b53]">Account</p>
                                <h2 className="text-2xl font-semibold text-[#09343a]">You are signed in</h2>
                                <p className="text-sm text-[#5f6f74]">Manage your links, pods, and scheduling preferences from your Orca dashboard.</p>
                                <Link className="inline-flex rounded-lg bg-[#0a4f56] px-4 py-2 text-sm font-semibold text-white hover:bg-[#083b42]" to="/app">
                                    Open dashboard
                                </Link>
                            </div>
                        )}
                    </aside>
                </div>

                {message && <p className="rounded-xl border border-[#0a4f56]/12 bg-[#eef7f6] p-3 text-sm text-[#33585d]">{message}</p>}
            </div>
        </div>
    );
};

export default PodPage;
