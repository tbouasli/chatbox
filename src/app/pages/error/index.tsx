import { logEvent } from 'firebase/analytics';
import { Undo2 } from 'lucide-react';
import React from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';

import { analytics } from '@/lib/firebase';

import ChatBoxLogo from '@/shared/components/atom/ChatBoxLogo';
import { Button } from '@/shared/components/ui/button';

interface ErrorType {
    status: number;
    statusText: string;
    data: string;
}

function ErrorPage() {
    const error = useRouteError() as ErrorType;
    const navigate = useNavigate();

    React.useEffect(() => {
        async function logError() {
            const analyticsInstance = await analytics;

            if (!analyticsInstance) return;

            logEvent(analyticsInstance, 'exception', {
                description: error?.data,
                fatal: true,
            });
        }

        logError();
    }, [error?.data]);

    function getErrorMessage() {
        // in english
        switch (error?.status) {
            case 404:
                return {
                    title: 'Page not found',
                    description: 'The page you are looking for does not exist.',
                };
            case 500:
                return {
                    title: 'Internal server error',
                    description: 'Oops! Something went wrong...',
                };
            default:
                return {
                    title: "We're sorry, but something went wrong.",
                    description: 'Please try again later.',
                };
        }
    }

    const { title, description } = getErrorMessage();

    return (
        <div className="page center">
            <div className="flex flex-col items-center container gap-6">
                <ChatBoxLogo />
                <h1 className="text-3xl font-bold">{title}</h1>
                <p className="text-lg text-gray-500">{description}</p>
                <Button onClick={() => navigate('/app')}>
                    <Undo2 />
                </Button>
            </div>
        </div>
    );
}
export default ErrorPage;
