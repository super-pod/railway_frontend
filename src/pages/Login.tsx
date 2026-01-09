import React, { useEffect } from 'react';
import { signInWithGoogle } from '../lib/firebaseClient';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Waves } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const { user, profile } = useAuth();

    useEffect(() => {
        if (user && profile) {
            if (profile.is_calendar_synced) {
                navigate('/dashboard');
            } else {
                navigate('/sync-calendar');
            }
        }
    }, [user, profile, navigate]);

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
                    <h1 className="text-4xl font-semibold mb-3 leading-tight">
                        Sync your team's rhythm
                    </h1>
                    <p className="text-white/60 mb-12 text-base">
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
                                <h3 className="text-base font-medium">About Orca</h3>
                            </div>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed">
                            Orca analyzes your team's availability patterns to find optimal meeting times
                            that respect everyone's focus hours.
                        </p>
                    </div>
                </div>

                {/* Footer Links */}
                <div className="flex gap-6 text-xs text-white/40 mt-12">
                    <a href="#" className="hover:text-[#5F9598] transition-colors">Privacy</a>
                    <a href="#" className="hover:text-[#5F9598] transition-colors">Terms</a>
                    <a href="#" className="hover:text-[#5F9598] transition-colors">Contact</a>
                </div>
            </div>

            {/* Right Side: Image/Visual */}
            <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-[#F3F4F4]">
                <div className="absolute inset-0 flex items-center justify-center p-16">
                    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg border border-white/50">
                        <img
                            src="/login-bg.png"
                            alt="Workspace"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-[#061E29]/5"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
