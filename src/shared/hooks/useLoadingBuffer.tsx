import React from 'react';

export default function useLoadingBuffer() {
    const [loading, setLoading] = React.useState<boolean>(false); // [1
    const [buffer, setBuffer] = React.useState(false);

    // delay the loading state to avoid flickering when the loading is fast
    React.useEffect(() => {
        if (loading) {
            const timeout = setTimeout(() => {
                setBuffer(true);
            }, 1000);

            return () => {
                clearTimeout(timeout);
            };
        }

        setBuffer(false);
    }, [loading]);

    return {
        setLoading,
        buffer,
    };
}
