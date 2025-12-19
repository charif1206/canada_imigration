import React from 'react';

interface FormSectionProps {
    title: string;
    subtitle: string;
    children: React.ReactNode;
    id: string;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, subtitle, children, id }) => (
    <section id={id} className="mb-12 sm:mb-16 scroll-mt-24">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
            <div className="mb-4 sm:mb-6 text-center md:text-start">
                <h2 className="text-xl sm:text-2xl font-bold text-blue-900">{title}</h2>
                <p className="text-sm sm:text-base text-slate-500 mt-1">{subtitle}</p>
            </div>
            {children}
        </div>
    </section>
);
