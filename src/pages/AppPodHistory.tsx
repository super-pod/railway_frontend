import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../lib/apiClient';
import { useAuth } from '../context/AuthContext';

interface PodRecord {
    id: number;
    pod_token: string;
    guest_name: string | null;
    guest_email: string;
    start_at: string;
    status: string;
    owner_slot_reason?: string;
}

const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

const formatLocal = (iso: string) => {
    const date = new Date(iso);
    return new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: localTimezone,
    }).format(date);
};

const AppPodHistory = () => {
    const { profile } = useAuth();
    const [pods, setPods] = useState<PodRecord[]>([]);
    const [loadingPods, setLoadingPods] = useState(false);
    const [loadError, setLoadError] = useState('');

    useEffect(() => {
        const load = async () => {
            if (!profile) {
                setPods([]);
                return;
            }

            setLoadingPods(true);
            setLoadError('');
            try {
                const res = await apiClient.get('/mvp/me');
                setPods(res.data.pods || []);
            } catch (error: any) {
                setLoadError(error?.response?.data?.detail || 'Could not load pod history.');
            } finally {
                setLoadingPods(false);
            }
        };

        void load();
    }, [profile?.username]);

    if (!profile) {
        return <div className="grid min-h-[70vh] place-items-center text-[#33585d]">Loading pod history...</div>;
    }

    return (
        <div className="px-4 py-8 sm:px-5 lg:px-8">
            <div className="mx-auto max-w-5xl space-y-6">
                <div>
                    <h1 className="text-3xl font-semibold text-[#09343a]">Pod History</h1>
                    <p className="mt-1 text-sm text-[#33585d]">All your completed and scheduled pod meetings.</p>
                </div>

                {loadError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {loadError}
                    </div>
                )}

                {loadingPods && <p className="text-sm text-[#33585d]">Loading pods...</p>}

                {!loadingPods && !loadError && pods.length === 0 && (
                    <p className="text-sm text-[#33585d]">No pods yet.</p>
                )}

                {!loadingPods && pods.length > 0 && (
                    <div className="space-y-3">
                        {pods.map((pod) => (
                            <Link key={pod.id} to={`/pod/${pod.pod_token}`} className="block rounded-xl border border-[#0a4f56]/12 bg-white p-4 hover:bg-[#f8fcfb]">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <p className="break-words text-sm font-semibold text-[#09343a]">{pod.guest_name || pod.guest_email}</p>
                                    <span className="rounded-full bg-[#eef7f6] px-2 py-1 text-xs text-[#0a4f56]">{pod.status}</span>
                                </div>
                                <p className="mt-1 text-sm text-[#33585d]">{formatLocal(pod.start_at)}</p>
                                {pod.owner_slot_reason && <p className="mt-1 text-xs text-[#527177]">AI reason: {pod.owner_slot_reason}</p>}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppPodHistory;
