import React from 'react';

const Features: React.FC = () => {
    const features = [
        {
            icon: 'bolt',
            title: 'Lightning Speed',
            description: 'Redirects that happen in milliseconds. Our global CDN ensures your users never wait, no matter where they are clicking from.'
        },
        {
            icon: 'security',
            title: 'Privacy First',
            description: 'We strip PII (Personally Identifiable Information) by default. Get the insights you need without compromising your users\' trust.'
        },
        {
            icon: 'tune',
            title: 'Total Control',
            description: 'Edit destinations after sharing. Password protect sensitive content. You are the captain.'
        }
    ];

    return (
        <section id="features" className="py-20 md:py-32 bg-background-dark relative">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="group p-8 rounded-2xl bg-surface-dark border border-[#392e28] hover:border-primary/50 transition-all hover:shadow-[0_0_30px_-5px_rgba(236,91,19,0.15)] flex flex-col gap-4">
                            <div className="size-14 rounded-xl bg-[#221610] flex items-center justify-center border border-[#392e28] group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors text-primary mb-2">
                                <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            {/* Visual Divider */}
            <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-[#392e28] to-transparent"></div>
        </section>
    );
};

export default Features;
