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

const BOOTSTRAP_CACHE_TTL_MS = 15000;

let bootstrapCache: { uid: string; profile: Profile; at: number } | null = null;
let bootstrapInFlight: { uid: string; promise: Promise<Profile> } | null = null;

const loadBootstrapProfile = async (uid: string, force: boolean): Promise<Profile> => {
    if (!force && bootstrapCache && bootstrapCache.uid === uid && Date.now() - bootstrapCache.at < BOOTSTRAP_CACHE_TTL_MS) {
        return bootstrapCache.profile;
    }

    if (!force && bootstrapInFlight && bootstrapInFlight.uid === uid) {
        return bootstrapInFlight.promise;
    }

    const promise = apiClient.post('/mvp/auth/bootstrap')
        .then((bootstrap) => {
            const nextProfile = bootstrap.data?.profile as Profile | undefined;
            if (!nextProfile) {
                throw new Error('Bootstrap response missing profile');
            }
            bootstrapCache = { uid, profile: nextProfile, at: Date.now() };
            return nextProfile;
        })
        .finally(() => {
            if (bootstrapInFlight?.uid === uid) {
                bootstrapInFlight = null;
            }
        });

    bootstrapInFlight = { uid, promise };
    return promise;
};

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
        const currentUser = auth.currentUser;
        if (!currentUser) {
            setProfile(null);
            return;
        }
        const nextProfile = await loadBootstrapProfile(currentUser.uid, true);
        setProfile(nextProfile);
    };

    useEffect(() => {
        let active = true;
        const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
            if (!active) {
                return;
            }
            setUser(nextUser);
            if (!nextUser) {
                setProfile(null);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const nextProfile = await loadBootstrapProfile(nextUser.uid, false);
                if (!active) {
                    return;
                }
                setProfile(nextProfile);
            } catch (error) {
                console.error('Failed to initialize session', error);
                if (!active) {
                    return;
                }
                setProfile(null);
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        });

        return () => {
            active = false;
            unsubscribe();
        };
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
