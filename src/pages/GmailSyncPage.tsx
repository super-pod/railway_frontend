import React, { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import apiClient from '../lib/apiClient';
import { useAuth } from '../context/AuthContext';

interface GmailWaitlistStatus {
    joined: boolean;
    signup_tier: string | null;
    signed_up_at: string | null;
    email: string | null;
}

const GmailSyncPage = () => {
    const { user } = useAuth();
    const [status, setStatus] = useState<GmailWaitlistStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [joinError, setJoinError] = useState('');

    useEffect(() => {
        const loadStatus = async () => {
            try {
                const response = await apiClient.get('/mvp/gmail-sync/waitlist');
                setStatus(response.data as GmailWaitlistStatus);
            } catch (err: any) {
                const statusCode = err?.response?.status;
                const detail = err?.response?.data?.detail;
                if (statusCode === 404 || detail === 'Not Found') {
                    setStatus({
                        joined: false,
                        signup_tier: null,
                        signed_up_at: null,
                        email: user?.email || null,
                    });
                }
            } finally {
                setLoading(false);
            }
        };
        void loadStatus();
    }, [user?.email]);

    const joinWaitlist = async () => {
        if (joining || status?.joined) {
            return;
        }
        setJoining(true);
        setJoinError('');
        try {
            const response = await apiClient.post('/mvp/gmail-sync/waitlist');
            setStatus(response.data as GmailWaitlistStatus);
        } catch (err: any) {
            setJoinError(err?.response?.data?.detail || 'Could not join the waitlist right now.');
        } finally {
            setJoining(false);
        }
    };

    const notifyEmail = status?.email || user?.email || 'your account email';
    const isJoined = Boolean(status?.joined);
    const benefits = [
        { icon: '🎯', title: 'Prioritizes meetings with frequent contacts' },
        { icon: '⚡', title: 'Understands urgency from email context' },
        { icon: '🧠', title: 'Learns your communication patterns' },
        { icon: '💎', title: 'Suggests optimal times based on relationship importance' },
    ];

    return (
        <div className="px-5 py-8 lg:px-8">
            <div className="mx-auto max-w-4xl">
                <section className="rounded-2xl border border-[#0a4f56]/12 bg-gradient-to-br from-[#fcfefe] via-white to-[#f5fbfa] p-6 lg:p-8">
                    <header className="text-center">
                        <h1 className="text-3xl font-bold leading-tight text-[#072e35] lg:text-4xl">
                            🚀 Smarter Scheduling with Gmail
                        </h1>
                        <p className="mx-auto mt-3 max-w-2xl text-sm text-[#2f575d] lg:text-base">
                            Your orca learns from your email patterns to make even better scheduling decisions.
                        </p>
                    </header>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                        {benefits.map((benefit) => (
                            <div
                                key={benefit.title}
                                className="gmail-benefit-card rounded-xl border border-[#0a4f56]/12 bg-white p-4"
                            >
                                <p className="text-2xl leading-none">{benefit.icon}</p>
                                <p className="mt-3 text-sm font-semibold text-[#103f47]">{benefit.title}</p>
                            </div>
                        ))}
                    </div>

                    {loading && (
                        <p className="mt-8 text-center text-sm text-[#33585d]">Loading your Gmail sync status...</p>
                    )}

                    {!loading && !isJoined && (
                        <div className="mt-9 text-center">
                            <p className="text-lg font-semibold text-[#083740]">⚡ Coming Soon - Be First in Line</p>
                            <button
                                type="button"
                                onClick={joinWaitlist}
                                disabled={joining}
                                className="mt-5 inline-flex rounded-lg bg-[#1D546D] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#18475d] disabled:opacity-60"
                            >
                                {joining ? 'Joining...' : 'Get Early Access'}
                            </button>
                            {joinError && <p className="mt-3 text-sm text-[#a83f3f]">{joinError}</p>}
                        </div>
                    )}

                    {!loading && isJoined && (
                        <div className="mt-9 rounded-2xl border border-emerald-200 bg-emerald-50/95 p-5 sm:p-6">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-700" />
                                <div className="flex-1">
                                    <h2 className="text-lg font-bold text-emerald-900">✓ You&apos;re on the waitlist!</h2>
                                    <p className="mt-2 text-sm text-emerald-800">
                                        We&apos;ll notify you at {notifyEmail} when Gmail sync launches.
                                    </p>
                                    <p className="mt-2 text-sm text-emerald-800">
                                        Want to help us prioritize features?{' '}
                                        <a
                                            href="mailto:contact@getorca.in?subject=Gmail%20Sync%20Feedback"
                                            className="font-semibold text-emerald-900 underline underline-offset-2"
                                        >
                                            Send Feedback
                                        </a>
                                    </p>
                                    <Link
                                        to="/app"
                                        className="mt-5 inline-flex rounded-lg border border-emerald-600/25 bg-white px-4 py-2 text-sm font-semibold text-emerald-900 hover:border-emerald-700/40"
                                    >
                                        Back to Dashboard
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default GmailSyncPage;
