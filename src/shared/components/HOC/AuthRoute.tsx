import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate, Outlet } from 'react-router-dom';

import { auth } from '@/lib/firebase';

import ChatBoxLogo from '../atom/ChatBoxLogo';

interface AuthRouteProps {
    redirectIf: 'authenticated' | 'unauthenticated';
    redirectTo: string;
}

function AuthRoute({ redirectIf, redirectTo }: AuthRouteProps) {
    const [user, loading] = useAuthState(auth);

    const authState = React.useMemo(() => {
        return user ? 'authenticated' : 'unauthenticated';
    }, [user]);

    if (loading)
        return (
            <div className="h-[100dvh] w-full center">
                <ChatBoxLogo />
            </div>
        );

    if (redirectIf === authState) return <Navigate to={redirectTo} />;

    return <Outlet />;
}

export default AuthRoute;
