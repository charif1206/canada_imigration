import React from 'react';

interface Testimonial {
    quote: string;
    author: string;
}

const TESTIMONIAL: Testimonial = {
    quote: 'Grâce à Canada Guide Immigration, j\'ai obtenu mon CSQ et ma résidence permanente sans stress !',
    author: 'Client satisfait',
};

export const TestimonialsSection: React.FC = () => {
    return (
        <section className="py-12 sm:py-16 md:py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 mb-4">
                    Témoignages
                </h2>
                <p className="text-sm sm:text-base text-slate-600 mb-8 sm:mb-10">
                    Ce que nos clients disent de nous (à venir).
                </p>
                <div className="max-w-3xl mx-auto bg-slate-100 p-6 sm:p-8 rounded-lg shadow-md italic">
                    <p className="text-slate-700 text-base sm:text-lg">
                        "{TESTIMONIAL.quote}"
                    </p>
                    <p className="text-end mt-4 font-semibold text-blue-900">
                        - {TESTIMONIAL.author}
                    </p>
                </div>
            </div>
        </section>
    );
};
