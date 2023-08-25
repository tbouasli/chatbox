import OnBoardingForm from '@/app/components/organism/OnBoardingForm';
import OnBoardingHeader from '@/app/components/organism/OnBoardingHeader';

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
