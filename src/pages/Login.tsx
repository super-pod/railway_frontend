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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            <div className="glass-card p-10 text-center max-w-md w-full">
                <h1 className="text-4xl font-bold mb-6 text-white tracking-tight">Orca</h1>
                <p className="text-blue-200 mb-8">Coordinate like a pod. Fast, group-sync for scheduling.</p>
                <button
                    onClick={handleLogin}
                    className="flex items-center justify-center w-full bg-white text-gray-900 font-semibold py-3 px-6 rounded-xl hover:bg-blue-50 transition-all transform hover:-translate-y-1"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6 mr-3" alt="Google" />
                    Continue with Google
                </button>
            </div>
        </div>
    );
};

export default Login;
