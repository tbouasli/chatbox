import { Link } from 'react-router-dom';

import ChatBoxLogoWithTitle from '@/shared/components/molecule/ChatBoxLogoWithTitle';
import DividerWithInfix from '@/shared/components/molecule/Divider';
import SignUpForm from '@/shared/components/organism/SignUpForm';
import SocialLogin from '@/shared/components/organism/SocialLogin';

function SignUpPage() {
    return (
        <main className="h-full w-full flex flex-col justify-center p-6 gap-4">
            <div className="center">
                <ChatBoxLogoWithTitle />
            </div>
            <SignUpForm />
            <DividerWithInfix infix="or" />
            <SocialLogin />
            <span className="text-xs text-center">
                Already has an account?{' '}
                <Link className="text-secondary" to="/auth/sign-in">
                    Sign In
                </Link>
            </span>
        </main>
    );
}

export default SignUpPage;
