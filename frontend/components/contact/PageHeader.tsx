import React from 'react';

export const PageHeader: React.FC = () => {
    return (
        <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900">
                Contactez-nous dès aujourd&apos;hui !
            </h1>
            <p className="text-base sm:text-lg text-slate-600 mt-2">
                Notre équipe vous répond dans les plus brefs délais pour vous aider dans votre projet d&apos;immigration.
            </p>
        </div>
    );
};
