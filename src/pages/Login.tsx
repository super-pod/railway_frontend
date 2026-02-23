import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { signInWithGoogle } from '../lib/firebaseClient';
import { useAuth } from '../context/AuthContext';
import apiClient from '../lib/apiClient';

const PROBLEM_LINES = ['"When works for you?"', '"How about Tuesday?"', '"Actually, can we do Thursday?"'];
const SOLUTION_LINES = ['Share one link', 'They pick a time', "It's on both calendars"];
const CORE_BENEFITS = [
    {
        icon: '🔒',
        text: 'Your calendar is never exposed to anyone.',
    },
    {
        icon: '✨',
        text: 'Orca AI helps keep you organized automatically.',
    },
];
const TRUST_BADGES = [
    { icon: '⚡', text: 'Free forever' },
    { icon: '⏱️', text: 'Setup in 30 seconds' },
    { icon: '🔒', text: 'We never send emails on your behalf' },
];
const SOCIAL_PROOF_COUNT = 1247;
const PROBLEM_ICON = '❌';
const CHECK_ICON = '✓';

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
                            Automated scheduling for busy people
                        </h1>
                        <p className="max-w-[560px] text-base leading-relaxed text-[#5c707a] sm:text-[1.05rem] lg:text-[1.35rem] lg:leading-[1.35]">
                            Share your availability. Let others pick a time. Meetings get added to both calendars automatically.
                        </p>

                        <div className="pt-3">
                            <button
                                type="button"
                                onClick={handleLogin}
                                disabled={isSigningIn}
                                className="gsi-material-button w-full max-w-[560px]"
                            >
                                <div className="gsi-material-button-state"></div>
                                <div className="gsi-material-button-content-wrapper">
                                    <div className="gsi-material-button-icon">
                                        <svg
                                            version="1.1"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 48 48"
                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                            style={{ display: 'block' }}
                                        >
                                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                            <path fill="none" d="M0 0h48v48H0z"></path>
                                        </svg>
                                    </div>
                                    <span className="gsi-material-button-contents">Sign in with Google</span>
                                    <span style={{ display: 'none' }}>Sign in with Google</span>
                                </div>
                            </button>
                            {loginError && <p className="mt-3 text-[13px] text-[#a83f3f]">{loginError}</p>}
                            
                            {/* CRITICAL: Clear disclosure about Google Calendar access */}
                            <div className="mt-4 space-y-2 rounded-lg border border-[#d5e3e7] bg-[#f8fafb] p-3">
                                <p className="text-[13px] font-medium text-[#0f2632]">
                                    What Orca accesses:
                                </p>
                                <ul className="ml-4 list-disc space-y-1 text-[13px] text-[#5c707a]">
                                    <li>Read your calendar events to check availability</li>
                                    <li>Create new calendar events when meetings are scheduled</li>
                                    <li>Access event details (time, title, location) for scheduling</li>
                                </ul>
                                <p className="text-[13px] text-[#5c707a]">
                                    You can disconnect at any time from Settings or your{' '}
                                    <a 
                                        href="https://myaccount.google.com/permissions" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="underline underline-offset-2"
                                    >
                                        Google Account
                                    </a>.
                                </p>
                            </div>

                            <p className="mt-3 text-[13px] text-[#8e9ba3]">
                                By continuing, you agree to our{' '}
                                <Link to="/terms" className="underline underline-offset-2">Terms of Service</Link>
                                {' '}and{' '}
                                <Link to="/privacy" className="underline underline-offset-2">Privacy Policy</Link>.
                                We follow Google's{' '}
                                <a 
                                    href="https://developers.google.com/terms/api-services-user-data-policy" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="underline underline-offset-2"
                                >
                                    Limited Use requirements
                                </a>.
                            </p>
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
