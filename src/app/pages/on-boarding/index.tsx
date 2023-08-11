import OnBoardingForm from '@/shared/components/organism/OnBoardingForm';
import OnBoardingHeader from '@/shared/components/organism/OnBoardingHeader';

function OnBoarding() {
    return (
        <main className="h-full w-full flex flex-col">
            <OnBoardingHeader />
            <section className="flex grow center p-4">
                <OnBoardingForm />
            </section>
        </main>
    );
}

export default OnBoarding;
