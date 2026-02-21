import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../lib/firebaseClient';
import apiClient from '../lib/apiClient';

export type Tier = 'basic' | 'gmail';

export interface Profile {
    user_id: number;
    username: string | null;
    display_name: string | null;
    instructions?: string;
    timezone: string;
    default_duration: number;
    default_meeting_type: 'virtual' | 'physical' | 'either';
    default_window_days: number;
    saturday_off?: boolean;
    sunday_off?: boolean;
    gmail_connected: boolean;
    calendar_connected: boolean;
    last_meeting_at: string | null;
    tier: Tier;
    orca_link: string | null;
    signature_text?: string;
    default_single_use_link?: string | null;
    default_single_use_token?: string | null;
}

interface AuthContextValue {
    user: FirebaseUser | null;
    profile: Profile | null;
    loading: boolean;
    refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
    user: null,
    profile: null,
    loading: true,
    refresh: async () => undefined,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    const refresh = async () => {
        if (!auth.currentUser) {
            setProfile(null);
            return;
        }
        const bootstrap = await apiClient.post('/mvp/auth/bootstrap');
        const me = await apiClient.get('/mvp/me');
        const merged: Profile = {
            ...(bootstrap.data.profile as Profile),
            ...(me.data.profile as Profile),
        };
        setProfile(merged);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
            setUser(nextUser);
            if (!nextUser) {
                setProfile(null);
                setLoading(false);
                return;
            }

            try {
                await refresh();
            } catch (error) {
                console.error('Failed to initialize session', error);
                setProfile(null);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const value = useMemo(
        () => ({
            user,
            profile,
            loading,
            refresh,
        }),
        [user, profile, loading],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
