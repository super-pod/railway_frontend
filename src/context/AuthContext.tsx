import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../lib/firebaseClient';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import apiClient from '../lib/apiClient';

interface UserProfile {
    id: number;
    email: string;
    firebaseid: string;
    is_calendar_synced: boolean;
    has_orca: boolean;
}

interface AuthContextType {
    user: FirebaseUser | null;
    profile: UserProfile | null;
    loading: boolean;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    loading: true,
    refreshProfile: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const res = await apiClient.post('/auth/me');
            setProfile(res.data.user);
        } catch (err) {
            console.error('Failed to fetch profile', err);
            setProfile(null);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (u) => {
            setUser(u);
            if (u) {
                await fetchProfile();
            } else {
                setProfile(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const refreshProfile = async () => {
        if (user) {
            await fetchProfile();
        }
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
