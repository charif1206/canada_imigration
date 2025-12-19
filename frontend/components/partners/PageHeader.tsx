import React from 'react';

interface PageHeaderProps {
    title: string;
    subtitle: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => (
    <div className="text-center mb-12 sm:mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold" style={{ color: '#0A2540' }}>
            {title}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 mt-4 max-w-3xl mx-auto">
            {subtitle}
        </p>
    </div>
);
