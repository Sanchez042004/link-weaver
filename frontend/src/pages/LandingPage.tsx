import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../features/landing/components/Hero';

const LandingPage: React.FC = () => {
    return (
        <div className="flex flex-col h-[100dvh] overflow-hidden bg-bg text-text-primary page-transition">
            <Navbar />
            <Hero />
        </div>
    );
};

export default LandingPage;
