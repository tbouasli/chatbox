import { useNavigate } from 'react-router-dom';

function BackButton() {
    const navigate = useNavigate();

    return (
        <button onClick={() => navigate(-1)}>
            <img src="/assets/icon/back.svg" alt="Back" height={24} width={24} />
        </button>
    );
}

export default BackButton;
