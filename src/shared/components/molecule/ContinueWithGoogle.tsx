import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { auth } from '@/lib/firebase';

import GoogleLogo from '@/shared/assets/logo/google.svg';
import { Button } from '@/shared/components/ui/button';

const provider = new GoogleAuthProvider();

function ContinueWithGoogle() {
    function handleClick() {
        signInWithPopup(auth, provider);
    }

    return (
        <Button variant="outline" className="w-full" onClick={handleClick}>
            <img src={GoogleLogo} alt="Google Logo" height={24} width={24} />
            Continue with Google
        </Button>
    );
}

export default ContinueWithGoogle;
