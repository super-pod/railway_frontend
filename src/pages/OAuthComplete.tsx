import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuthComplete = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const { refresh } = useAuth();

    useEffect(() => {
        const complete = async () => {
            await refresh();
            const from = params.get('from') || '/app';
            navigate(from, { replace: true });
        };
        void complete();
    }, []);

    return (
        <div className="min-h-screen grid place-items-center bg-[#f4f8f7] text-[#33585d]">
            Finalizing Google connection...
        </div>
    );
};

export default OAuthComplete;
