import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { signInWithGoogle } from '../lib/firebaseClient';
import { useAuth } from '../context/AuthContext';
import apiClient from '../lib/apiClient';

const PROBLEM_LINES = ['"When works for you?"', '"How about Tuesday?"', '"Actually, can we do Thursday?"'];
const SOLUTION_LINES = ['Share one link', 'They pick a time', "It's on both calendars"];
const CORE_BENEFITS = [
    {
        icon: '\uD83D\uDD12',
        text: 'Your calendar is never exposed to anyone.',
    },
    {
        icon: '\u2728',
        text: 'Orca AI helps keep you organized automatically.',
    },
];
const TRUST_BADGES = [
    { icon: '\u26A1', text: 'Free forever' },
    { icon: '\u23F1\uFE0F', text: 'Setup in 30 seconds' },
    { icon: '\uD83D\uDD12', text: 'We never send emails on your behalf' },
];
const SOCIAL_PROOF_COUNT = 1247;
const PROBLEM_ICON = '\u274C';
const CHECK_ICON = '\u2713';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { user, loading } = useAuth();
    const requestedNext = searchParams.get('next');
    const fromState = (location.state as { from?: { pathname?: string; search?: string } } | null)?.from;
    const fromStatePath =
        fromState?.pathname && fromState.pathname.startsWith('/') ? `${fromState.pathname}${fromState.search || ''}` : null;
    const nextPath = requestedNext && requestedNext.startsWith('/') ? requestedNext : fromStatePath || '/app';
    const [isPanelVisible, setIsPanelVisible] = useState(false);
    const [displayedUsers, setDisplayedUsers] = useState(0);
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [loginError, setLoginError] = useState('');

    useEffect(() => {
        if (!isSigningIn && !loading && user) {
            navigate(nextPath, { replace: true });
        }
    }, [isSigningIn, loading, user, navigate, nextPath]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            setIsPanelVisible(true);
            setDisplayedUsers(SOCIAL_PROOF_COUNT);
            return;
        }

        const revealFrame = window.requestAnimationFrame(() => setIsPanelVisible(true));
        const durationMs = 900;
        let countFrame = 0;
        let startTime: number | null = null;

        const step = (timestamp: number) => {
            if (startTime === null) {
                startTime = timestamp;
            }

            const progress = Math.min((timestamp - startTime) / durationMs, 1);
            setDisplayedUsers(Math.round(SOCIAL_PROOF_COUNT * progress));

            if (progress < 1) {
                countFrame = window.requestAnimationFrame(step);
            }
        };

        countFrame = window.requestAnimationFrame(step);

        return () => {
            window.cancelAnimationFrame(revealFrame);
            window.cancelAnimationFrame(countFrame);
        };
    }, []);

    const handleLogin = async () => {
        setLoginError('');
        setIsSigningIn(true);
        try {
            await signInWithGoogle();
            const bootstrap = await apiClient.post('/mvp/auth/bootstrap');
            const calendarConnected = Boolean(bootstrap.data?.profile?.calendar_connected);

            if (calendarConnected) {
                navigate(nextPath, { replace: true });
                return;
            }

            const oauthStart = await apiClient.post('/mvp/oauth/start', {
                provider: 'calendar',
                from_path: nextPath,
            });

            const authUrl = oauthStart.data?.auth_url;
            if (!authUrl) {
                throw new Error('Could not start Google Calendar authorization.');
            }
            window.location.href = authUrl;
        } catch (error: any) {
            console.error('Login failed', error);
            setLoginError(error?.response?.data?.detail || 'Could not finish sign in. Please try again.');
            setIsSigningIn(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f5f4] text-[#0f2632]">
            <div className="mx-auto grid min-h-screen max-w-[1680px] lg:grid-cols-2">
                <section className="flex flex-col px-6 py-8 sm:px-14 sm:py-12 lg:px-20 lg:py-12">
                    <div className="inline-flex items-center gap-3">
                        <img
                            src="/Orca_Logo.png"
                            alt="Orca logo"
                            className="h-10 w-10 rounded-xl border border-[#d8dde0] bg-white p-1.5 sm:h-11 sm:w-11"
                        />
                        <span className="text-[1.3rem] font-semibold tracking-[-0.02em] sm:text-[1.5rem]">Orca</span>
                    </div>

                    <div className="mt-10 max-w-[620px] space-y-4 lg:mt-14">
                        <h1 className="text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-[#0d2634] sm:text-[2.75rem] lg:text-[3.35rem]">
                            Orca runs decisions for you.
                        </h1>
                        <p className="max-w-[560px] text-base leading-relaxed text-[#5c707a] sm:text-[1.05rem] lg:text-[1.35rem] lg:leading-[1.35]">
                            Create an orca. Others create theirs. They negotiate and commit without you in the loop.
                        </p>

                        <div className="pt-3">
                            <button
                                onClick={handleLogin}
                                disabled={isSigningIn}
                                className="inline-flex w-full max-w-[560px] items-center justify-center gap-3 rounded-xl bg-[#115a78] px-5 py-3 text-[0.95rem] font-semibold text-white transition hover:bg-[#0f506a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#115a78]/40"
                            >
                                <img
                                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                    alt="Google"
                                    className="h-5 w-5 rounded bg-white p-0.5"
                                />
                                {isSigningIn ? 'Connecting Google...' : 'Continue with Google'}
                            </button>
                            {loginError && <p className="mt-3 text-[13px] text-[#a83f3f]">{loginError}</p>}
                            <p className="mt-3 text-[13px] text-[#8e9ba3]">Calendar access is required to create or join pods.</p>
                        </div>
                    </div>

                    <div className="mt-auto hidden items-center gap-7 pt-8 text-sm text-[#97a4aa] lg:flex">
                        <Link to="/privacy" className="hover:text-[#5a6b73]">
                            Privacy
                        </Link>
                        <Link to="/terms" className="hover:text-[#5a6b73]">
                            Terms
                        </Link>
                        <a href="mailto:contact@getorca.in" className="hover:text-[#5a6b73]">
                            Contact
                        </a>
                    </div>
                </section>

                <section className="border-t border-[#e3e5e6] px-6 py-8 sm:px-14 sm:py-12 lg:border-l lg:border-t-0 lg:px-20 lg:py-12">
                    <div
                        className={`mx-auto flex h-full max-w-[620px] flex-col pt-8 sm:pt-12 lg:pt-24 transition-all duration-500 motion-reduce:transition-none ${
                            isPanelVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                        }`}
                    >
                        <div className="space-y-9 sm:space-y-11">
                            <h2 className="max-w-[560px] text-[2rem] font-bold leading-[1.03] tracking-[-0.03em] text-[#0f2632] sm:text-[2.5rem] lg:text-[3rem]">
                                Stop the scheduling ping-pong
                            </h2>

                            <section className="rounded-2xl border border-[#d5e3e7] bg-white/75 p-4 sm:p-5" aria-label="Key Orca benefits">
                                <ul className="space-y-3">
                                    {CORE_BENEFITS.map((benefit) => (
                                        <li key={benefit.text} className="flex items-start gap-3 text-[0.98rem] font-medium leading-relaxed text-[#32515f] sm:text-[1.05rem]">
                                            <span aria-hidden="true" className="mt-[1px] text-[1rem]">
                                                {benefit.icon}
                                            </span>
                                            <span>{benefit.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section className="space-y-4" aria-labelledby="scheduling-problem">
                                <h3 id="scheduling-problem" className="text-xs uppercase tracking-[0.2em] text-[#ac8f94]">
                                    The Back-and-Forth
                                </h3>
                                <ul className="space-y-3" aria-label="Scheduling pain points">
                                    {PROBLEM_LINES.map((line) => (
                                        <li key={line} className="flex items-center gap-3 text-[1rem] font-normal leading-snug text-[#8f7479] sm:text-[1.125rem]">
                                            <span aria-hidden="true" className="text-[1.05rem] leading-none text-[#b36f77]">
                                                {PROBLEM_ICON}
                                            </span>
                                            <span>{line}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section className="space-y-4 border-t border-[#d7e6d9] pt-8 sm:pt-9" aria-labelledby="scheduling-solution">
                                <h3 id="scheduling-solution" className="text-xs uppercase tracking-[0.2em] text-[#5f8b6b]">
                                    The Orca Flow
                                </h3>
                                <ul className="space-y-4" aria-label="Simple scheduling steps">
                                    {SOLUTION_LINES.map((line, index) => (
                                        <li
                                            key={line}
                                            className={`flex items-center gap-3 text-[1.05rem] font-semibold leading-snug text-[#196c3d] transition-all duration-300 motion-reduce:transition-none sm:text-[1.25rem] ${
                                                isPanelVisible ? 'translate-x-0 opacity-100' : '-translate-x-1 opacity-0'
                                            }`}
                                            style={{ transitionDelay: `${180 + index * 120}ms` }}
                                        >
                                            <span aria-hidden="true" className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#e4f3e7] text-[1rem] text-[#196c3d]">
                                                {CHECK_ICON}
                                            </span>
                                            <span>{line}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <p className="max-w-[560px] text-base font-medium leading-relaxed text-[#4c5d65] sm:text-[1rem]">
                                Join <span className="font-semibold tabular-nums text-[#0f2632]">{displayedUsers.toLocaleString()}</span> people who've eliminated scheduling back-and-forth
                            </p>
                        </div>

                        <div className="mt-8 border-t border-[#e3e5e6] pt-6 sm:mt-10 sm:pt-7 lg:mt-12">
                            <ul className="flex flex-col gap-3 text-sm text-[#7f8c92] sm:flex-row sm:items-center sm:justify-between sm:gap-4" aria-label="Trust badges">
                                {TRUST_BADGES.map((badge) => (
                                    <li key={badge.text} className="inline-flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2 ring-1 ring-[#d7dee1]">
                                        <span aria-hidden="true">{badge.icon}</span>
                                        <span>{badge.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                <div className="px-6 pb-8 pt-3 sm:px-14 lg:hidden">
                    <div className="flex items-center gap-7 text-sm text-[#97a4aa]">
                        <Link to="/privacy" className="hover:text-[#5a6b73]">
                            Privacy
                        </Link>
                        <Link to="/terms" className="hover:text-[#5a6b73]">
                            Terms
                        </Link>
                        <a href="mailto:contact@getorca.in" className="hover:text-[#5a6b73]">
                            Contact
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
