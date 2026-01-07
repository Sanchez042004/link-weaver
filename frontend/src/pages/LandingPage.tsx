import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../features/landing/components/Hero';
import Features from '../features/landing/components/Features';
import { CallToAction } from '../features/landing/components/CallToAction';
import Footer from '../features/landing/components/Footer';

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col font-display bg-background-light dark:bg-background-dark text-[#181311] dark:text-white overflow-x-hidden page-transition">
            <Navbar />
            <Hero />
            <Features />
            <CallToAction />
            <Footer />
        </div>
    );
};

export default LandingPage;
