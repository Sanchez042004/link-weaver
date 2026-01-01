import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../features/landing/components/Hero';
import Features from '../features/landing/components/Features';
import SocialProof from '../features/landing/components/SocialProof';
import Footer from '../features/landing/components/Footer';

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col font-display">
            <Navbar />
            <Hero />
            <Features />
            <SocialProof />
            <Footer />
        </div>
    );
};

export default LandingPage;
