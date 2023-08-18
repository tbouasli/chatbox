import { Link } from 'react-router-dom';

import ChatBoxLogoWithTitle from '@/shared/components/molecule/ChatBoxLogoWithTitle';
import DividerWithInfix from '@/shared/components/molecule/Divider';
import SignInForm from '@/shared/components/organism/SignInForm';
import SocialLogin from '@/shared/components/organism/SocialLogin';

function SignIn() {
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

export default SignIn;
