import OnBoardingForm from '@/shared/components/organism/OnBoardingForm';
import OnBoardingHeader from '@/shared/components/organism/OnBoardingHeader';

function OnBoardingPage() {
    return (
        <main className="page">
            <OnBoardingHeader />
            <section className="flex grow center p-4">
                <OnBoardingForm />
            </section>
        </main>
    );
}

export default OnBoardingPage;
