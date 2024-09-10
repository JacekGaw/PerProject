import React, {useState} from 'react';
import TermsStep from './TermsStep';
import Button from '../../components/UI/Button';

const InitialOnboardingRoot: React.FC = () => {
    const [onboardingStep, setOnboardingStep] = useState<number>(0);


    const goToNextStep = () => setOnboardingStep((prevState) => prevState + 1);
    const goToPreviousStep = () => setOnboardingStep((prevState) => prevState - 1);

    const steps = [
        <TermsStep nextAction={goToNextStep} />
    ];
    return ( 
        <section className='w-full p-5 flex flex-col justify-center items-center min-h-screen'>
            <div className='max-w-screen-md flex flex-col gap-5 p-5 items-center'>
                <header>
                    <h1 className='text-normal-orange font-[800] text-xl border-b px-10 py-2 border-dark-blue'>PerProject</h1>
                </header>
                {steps[onboardingStep]}
            </div>
        </section>
    );
}
 
export default InitialOnboardingRoot;