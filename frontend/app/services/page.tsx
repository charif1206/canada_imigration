import React from 'react';
import Link from 'next/link';

interface Service {
    icon: React.ReactNode;
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
}

const serviceData: Service[] = [
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
        title: "Évaluation de profil",
        description: "Découvrez vos chances d'immigrer au Canada selon votre âge, diplôme, expérience et profil linguistique.",
        buttonText: "Évaluer mon profil",
        buttonLink: '/contact',
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
        title: "Équivalence de diplôme",
        description: "Nous vous guidons dans la demande d'équivalence auprès des organismes reconnus (WES, IQAS, etc.).",
        buttonText: "Remplir le formulaire",
        buttonLink: '/forms#equivalence',
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>,
        title: "Préparation TCF Canada",
        description: "Accédez à des simulateurs identiques à l'examen officiel et atteignez le niveau C1/C2 grâce à nos formations ciblées.",
        buttonText: "Découvrir la formation",
        buttonLink: '/contact',
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
        title: "Suivi CSQ",
        description: "Accompagnement complet pour votre dossier Québec — dépôt, suivi et mise à jour.",
        buttonText: "Suivre mon dossier CSQ",
        buttonLink: '/forms#residence',
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
        title: "Suivi Fédéral (Entrée Express, etc.)",
        description: "Suivi étape par étape de votre dossier fédéral jusqu'à la réception de votre visa.",
        buttonText: "Suivre mon dossier fédéral",
        buttonLink: '/forms#residence',
    },
];

const ServiceCard: React.FC<Service> = ({ icon, title, description, buttonText, buttonLink }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform duration-300">
            <div className="mb-4">{icon}</div>
            <h3 className="text-xl font-bold text-blue-900 mb-2">{title}</h3>
            <p className="text-slate-600 mb-6 flex-grow">{description}</p>
            <Link
                href={buttonLink}
                className="mt-auto bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300"
            >
                {buttonText}
            </Link>
        </div>
    );
};

const ServicesPage: React.FC = () => {
    return (
        <div className="py-20 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-blue-900">Nos services d&apos;accompagnement</h1>
                    <p className="text-lg text-slate-600 mt-2">Un soutien complet pour chaque étape de votre projet.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {serviceData.map((service, index) => (
                        <ServiceCard key={index} {...service} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ServicesPage;