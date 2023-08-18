import { Construction, Undo2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/shared/components/ui/button';

function WorkInProgressPage() {
    const navigate = useNavigate();

    return (
        <div className="h-[100dvh] w-full center">
            <div className="flex flex-col items-center container gap-6">
                <Construction size={48} />
                <h1 className="text-3xl font-bold">Work in Progress</h1>
                <p className="text-lg text-gray-500">This page is still under development. Please come back later.</p>
                <Button onClick={() => navigate(-1)}>
                    <Undo2 />
                </Button>
            </div>
        </div>
    );
}
export default WorkInProgressPage;
