import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
    onClick?: () => void;
}

function BackButton({ onClick }: BackButtonProps) {
    const navigate = useNavigate();

    const handleClick = React.useCallback(() => {
        if (onClick) {
            onClick();
        } else {
            navigate(-1);
        }
    }, [navigate, onClick]);

    return (
        <button onClick={handleClick}>
            <img src="/assets/icon/back.svg" alt="Back" height={24} width={24} />
        </button>
    );
}

export default BackButton;
