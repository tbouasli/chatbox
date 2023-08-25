import { Link } from 'react-router-dom';

import ChatBoxLogoWithTitle from '@/shared/components/molecule/ChatBoxLogoWithTitle';

import DividerWithInfix from '@/auth/components/molecule/Divider';
import SocialLogin from '@/auth/components/molecule/SocialLogin';
import SignInForm from '@/auth/components/organism/SignInForm';

function SignInPage() {
    return (
        <main className="h-full w-full flex flex-col justify-center p-6 gap-4">
            <div className="center">
                <ChatBoxLogoWithTitle />
            </div>
            <SignInForm />
            <DividerWithInfix infix="or" />
            <SocialLogin />
            <span className="text-xs text-center">
                Doesn’t have an account?{' '}
                <Link className="text-secondary" to="/auth/sign-up">
                    Sign Up
                </Link>
            </span>
        </main>
    );
}

export default SignInPage;
