import React, { useEffect } from 'react';
import { signInWithGoogle } from '../lib/firebaseClient';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Waves } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, profile } = useAuth();

    useEffect(() => {
        if (user && profile) {
            const from = (location.state as any)?.from?.pathname;
            if (profile.is_calendar_synced) {
                navigate(from || '/dashboard');
            } else {
                navigate('/sync-calendar', { state: { from: (location.state as any)?.from || location } });
            }
        }
    }, [user, profile, navigate, location]);

    const handleLogin = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    return (
        <div className="min-h-screen flex bg-[#F3F4F4]">
            {/* Left Side: Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 lg:p-16 bg-[#061E29] text-white">
                <div className="max-w-md mx-auto w-full">
                    {/* Logo */}
                    <div className="flex items-center gap-2.5 mb-20">
                        <div className="w-10 h-10 bg-[#5F9598] rounded-lg flex items-center justify-center">
                            <Waves className="text-[#061E29] w-5 h-5" strokeWidth={2.5} />
                        </div>
                        <span className="text-xl font-semibold tracking-tight">Orca</span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-4xl font-semibold mb-3 leading-tight text-white">
                        Sync your team's rhythm
                    </h1>
                    <p className="text-white/70 mb-12 text-base">
                        Intelligent scheduling for modern teams
                    </p>

                    {/* Login Button */}
                    <button
                        onClick={handleLogin}
                        className="flex items-center justify-center w-full bg-[#1D546D] py-3.5 px-6 rounded-lg hover:bg-[#5F9598] transition-all gap-3 font-medium shadow-sm"
                    >
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            className="w-5 h-5 bg-white p-0.5 rounded"
                            alt="Google"
                        />
                        Continue with Google
                    </button>

                    {/* About Section */}
                    <div className="mt-16 p-6 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="accent-border h-6 pl-2">
                                <h3 className="text-base font-medium text-white">About Orca</h3>
                            </div>
                        </div>
                        <p className="text-white/70 text-sm leading-relaxed">
                            Orca analyzes your team's availability patterns to find optimal meeting times
                            that respect everyone's focus hours.
                        </p>
                    </div>
                </div>

                {/* Footer Links */}
                <div className="flex gap-6 text-xs text-white/40 mt-12">
                    <a href="/privacy" className="hover:text-[#5F9598] transition-colors">Privacy</a>
                    <a href="/terms" className="hover:text-[#5F9598] transition-colors">Terms</a>
                    <a href="mailto:hello@orca.app" className="hover:text-[#5F9598] transition-colors">Contact</a>
                </div>
            </div>

            {/* Right Side: Image/Visual */}
            <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-[#F3F4F4]">
                <div className="absolute inset-0 flex items-center justify-center p-16">
                    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg border border-white/50 bg-gradient-to-br from-[#E8F1F2] via-white to-[#C7DDE0]">
                        <div className="absolute inset-0">
                            <div className="absolute -top-20 -right-16 h-64 w-64 rounded-full bg-[#5F9598]/25 blur-2xl"></div>
                            <div className="absolute bottom-10 -left-10 h-72 w-72 rounded-full bg-[#1D546D]/15 blur-3xl"></div>
                        </div>
                        <div className="absolute inset-0 p-10">
                            <div className="grid gap-4">
                                <div className="bg-white/90 backdrop-blur rounded-xl p-5 shadow-sm border border-white/60">
                                    <p className="text-xs uppercase tracking-wide text-[#061E29]/50">Today</p>
                                    <p className="text-lg font-semibold text-[#061E29] mt-1">Team availability summary</p>
                                    <div className="mt-4 h-2 w-full rounded-full bg-[#061E29]/10 overflow-hidden">
                                        <div className="h-full w-2/3 bg-[#5F9598] rounded-full"></div>
                                    </div>
                                </div>
                                <div className="bg-white/90 backdrop-blur rounded-xl p-5 shadow-sm border border-white/60">
                                    <p className="text-xs uppercase tracking-wide text-[#061E29]/50">Next best slot</p>
                                    <p className="text-lg font-semibold text-[#061E29] mt-1">Wed · 2:30pm – 3:00pm</p>
                                    <p className="text-sm text-[#061E29]/60 mt-2">4 people available · Focus hours respected</p>
                                </div>
                                <div className="bg-white/90 backdrop-blur rounded-xl p-5 shadow-sm border border-white/60">
                                    <p className="text-xs uppercase tracking-wide text-[#061E29]/50">Pod velocity</p>
                                    <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                                        <div className="rounded-lg bg-[#F3F4F4] py-3 text-[#061E29]">
                                            <div className="text-lg font-semibold">12</div>
                                            <div className="text-[11px] text-[#061E29]/60">Meetings</div>
                                        </div>
                                        <div className="rounded-lg bg-[#F3F4F4] py-3 text-[#061E29]">
                                            <div className="text-lg font-semibold">87%</div>
                                            <div className="text-[11px] text-[#061E29]/60">Focus kept</div>
                                        </div>
                                        <div className="rounded-lg bg-[#F3F4F4] py-3 text-[#061E29]">
                                            <div className="text-lg font-semibold">5h</div>
                                            <div className="text-[11px] text-[#061E29]/60">Saved</div>
                                        </div>
                                    </div>
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
