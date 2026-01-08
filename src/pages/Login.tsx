import React, { useEffect } from 'react';
import { signInWithGoogle } from '../lib/firebaseClient';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
            // The useEffect will handle navigation once state updates
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 px-4">
            <div className="glass-card p-10 text-center max-w-md w-full">
                <h1 className="text-5xl font-bold mb-6 text-white tracking-tight">Orca</h1>

                <div className="space-y-4 mb-10">
                    <p className="text-xl text-blue-100 font-medium">Group Scheduling. Simplified.</p>
                    <p className="text-blue-200 text-sm leading-relaxed">
                        Orca helps teams and friend groups find the perfect time to meet.
                        By securely syncing with your Google Calendar, we identify availability gaps
                        across your entire 'pod' to suggest meeting slots that work for everyone.
                    </p>
                </div>

                <button
                    onClick={handleLogin}
                    className="flex items-center justify-center w-full bg-white text-gray-900 font-bold py-4 px-6 rounded-2xl hover:bg-blue-50 transition-all shadow-xl hover:shadow-blue-500/20 transform hover:-translate-y-1"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6 mr-3" alt="Google" />
                    Connect with Google
                </button>
            </div>

            <footer className="mt-12 text-blue-300 text-sm flex space-x-6">
                <a href="/privacy" className="hover:text-white transition-colors underline underline-offset-4">Privacy Policy</a>
                <a href="/terms" className="hover:text-white transition-colors underline underline-offset-4">Terms of Service</a>
            </footer>
        </div>
    );
};

export default Login;
