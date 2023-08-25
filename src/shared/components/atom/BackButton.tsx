import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
    onClick?: () => void;
}

function BackButton({ onClick }: BackButtonProps) {
    const navigate = useNavigate();

    return (
        <button onClick={onClick ? onClick : () => navigate(-1)}>
            <img src="/assets/icon/back.svg" alt="Back" height={24} width={24} />
        </button>
    );
}

export default BackButton;
