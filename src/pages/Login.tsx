import React, { useEffect, useState } from 'react';
import { signInWithGoogle } from '../lib/firebaseClient';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, profile, loading, refreshProfile } = useAuth();
    const [profileRetry, setProfileRetry] = useState(false);

    useEffect(() => {
        if (!user || loading) {
            return;
        }
        if (!profile && !profileRetry) {
            setProfileRetry(true);
            refreshProfile().catch((error) => console.error('Failed to refresh profile', error));
            return;
        }
        if (!profile && profileRetry) {
            navigate('/dashboard');
            return;
        }
        if (profile) {
            const from = (location.state as any)?.from?.pathname;
            if (!profile.is_calendar_synced) {
                navigate('/sync-calendar', { state: { from: (location.state as any)?.from || location } });
                return;
            }
            if (!profile.has_orca) {
                navigate('/setup-orca', { state: { from: (location.state as any)?.from || location } });
                return;
            }
            navigate(from || '/dashboard');
        }
    }, [user, profile, loading, profileRetry, refreshProfile, navigate, location]);

    const handleLogin = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
        <div className="min-h-screen flex bg-[#F7F6F2]">
            {/* Left Side: Entry */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 lg:p-16 border-b lg:border-b-0 lg:border-r border-[#061E29]/10">
                <div className="max-w-md mx-auto w-full">
                    {/* Logo */}
                    <div className="flex items-center gap-2.5 mb-16">
                        <img
                            src="/Orca_Logo.png"
                            alt="Orca logo"
                            className="w-10 h-10 rounded-lg object-contain"
                        />
                        <span className="text-xl font-semibold tracking-tight text-[#061E29]">Orca</span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-3xl lg:text-4xl font-semibold mb-4 leading-tight text-[#061E29]">
                        Orca runs decisions for you.
                    </h1>
                    <p className="text-[#061E29]/70 mb-10 text-base">
                        Create an orca. Others create theirs. They negotiate and commit without you in the loop.
                    </p>

                    {/* Login Button */}
                    <button
                        onClick={handleLogin}
                        className="flex items-center justify-center w-full bg-[#1D546D] py-3.5 px-6 rounded-lg hover:bg-[#17475C] transition-all gap-3 font-medium text-white"
                    >
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            className="w-5 h-5 bg-white p-0.5 rounded"
                            alt="Google"
                        />
                        Continue with Google
                    </button>
                    <p className="text-xs text-[#061E29]/50 mt-3">
                        Calendar access is required to create or join pods.
                    </p>
                </div>

                {/* Footer Links */}
                <div className="flex gap-6 text-xs text-[#061E29]/40 mt-12">
                    <a href="/privacy" className="hover:text-[#061E29] transition-colors">Privacy</a>
                    <a href="/terms" className="hover:text-[#061E29] transition-colors">Terms</a>
                    <a href="mailto:hello@orca.app" className="hover:text-[#061E29] transition-colors">Contact</a>
                </div>
            </div>

            {/* Right Side: System Diagram */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#F7F6F2] items-center justify-center">
                <div className="w-full max-w-xl px-14 py-16">
                    <div className="text-[11px] uppercase tracking-[0.2em] text-[#061E29]/40 mb-6">
                        System Model
                    </div>
                    <div className="space-y-8 divide-y divide-[#061E29]/10">
                        <div className="pt-0">
                            <div className="text-[11px] uppercase tracking-wide text-[#061E29]/40">Agents</div>
                            <div className="mt-3 flex items-start justify-between gap-6">
                                <div className="space-y-2">
                                    <div className="text-base font-semibold text-[#061E29]">Orcas</div>
                                    <p className="text-sm text-[#061E29]/60">You create an orca with preferences, constraints, and authority.</p>
                                    <p className="text-sm text-[#061E29]/60">Others bring their own orcas.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full border border-[#061E29]/30 bg-[#FDFCF9]" />
                                    <div className="w-3 h-3 rounded-full border border-[#061E29]/30 bg-[#FDFCF9]" />
                                    <div className="w-3 h-3 rounded-full border border-[#061E29]/30 bg-[#FDFCF9]" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-8">
                            <div className="text-[11px] uppercase tracking-wide text-[#061E29]/40">Coordination</div>
                            <div className="mt-3 flex items-start justify-between gap-6">
                                <div className="space-y-2">
                                    <div className="text-base font-semibold text-[#061E29]">Pods</div>
                                    <p className="text-sm text-[#061E29]/60">Orcas form pods to solve a shared goal.</p>
                                    <p className="text-sm text-[#061E29]/60">Context is shared only inside the pod.</p>
                                </div>
                                <div className="rounded-xl border border-[#061E29]/15 bg-[#FDFCF9] px-3 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full border border-[#061E29]/30 bg-[#FDFCF9]" />
                                        <div className="w-3 h-3 rounded-full border border-[#061E29]/30 bg-[#FDFCF9]" />
                                        <div className="w-3 h-3 rounded-full border border-[#061E29]/30 bg-[#FDFCF9]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8">
                            <div className="text-[11px] uppercase tracking-wide text-[#061E29]/40">Negotiation</div>
                            <div className="mt-3 flex items-start justify-between gap-6">
                                <div className="space-y-2">
                                    <div className="text-base font-semibold text-[#061E29]">Negotiation</div>
                                    <p className="text-sm text-[#061E29]/60">Orcas exchange constraints and trade-offs.</p>
                                    <p className="text-sm text-[#061E29]/60">No chat. No manual coordination.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full border border-[#061E29]/30 bg-[#FDFCF9]" />
                                    <div className="h-px w-8 bg-[#1D546D]/40" />
                                    <div className="w-3 h-3 rounded-full border border-[#061E29]/30 bg-[#FDFCF9]" />
                                    <div className="h-px w-8 bg-[#1D546D]/40" />
                                    <div className="w-3 h-3 rounded-full border border-[#061E29]/30 bg-[#FDFCF9]" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-8">
                            <div className="text-[11px] uppercase tracking-wide text-[#061E29]/40">Outcome</div>
                            <div className="mt-3 flex items-start justify-between gap-6">
                                <div className="space-y-2">
                                    <div className="text-base font-semibold text-[#061E29]">Outcome</div>
                                    <p className="text-sm text-[#061E29]/60">A single committed result is produced.</p>
                                    <p className="text-sm text-[#061E29]/60">You see the outcome, not the process.</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full border border-[#061E29]/30 bg-[#FDFCF9]" />
                                    <div className="h-px w-8 bg-[#1D546D]/40" />
                                    <div className="h-8 w-16 rounded-lg border border-[#061E29]/20 bg-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
