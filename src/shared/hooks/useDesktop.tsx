import React from 'react';

import { useToast } from '../components/ui/use-toast';

function useDesktop() {
    const { toast } = useToast();

    React.useEffect(() => {
        function onResize() {
            if (window.innerWidth > 768) {
                toast({
                    title: 'Desktop Unsupported',
                    description: 'This app is not supported on desktop yet.',
                });
            }
        }

        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, [toast]);
}
export default useDesktop;
