import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../features/landing/components/Hero';

const LandingPage: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-bg text-text-primary page-transition">
            <Navbar />
            <Hero />
        </div>
    );
};

export default LandingPage;
