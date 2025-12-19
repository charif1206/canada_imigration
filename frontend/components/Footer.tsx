import React from 'react';

const SocialIcon: React.FC<{ href: string, children: React.ReactNode }> = ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
        {children}
    </a>
);

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-blue-900 text-white" style={{backgroundColor: '#0A2540'}}>
            <div className="container mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-center md:text-start">
                    <div>
                        <h3 className="text-base sm:text-lg font-bold mb-2">Canada Guide Immigration</h3>
                        <p className="text-sm sm:text-base text-gray-400">Votre partenaire de confiance pour réussir votre projet d'immigration.</p>
                    </div>
                    <div>
                        <h3 className="text-base sm:text-lg font-bold mb-2">Contact Direct</h3>
                        <ul className="space-y-2 text-sm sm:text-base text-gray-300">
                            <li><a href="https://wa.me/213000000000" className="hover:text-white break-words">WhatsApp: +213 [Numéro WhatsApp]</a></li>
                            <li><a href="mailto:contact@canadaguideimmigration.com" className="hover:text-white break-words">Email: contact@canadaguideimmigration.com</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-base sm:text-lg font-bold mb-2">Suivez-nous</h3>
                        <div className="flex justify-center md:justify-start space-x-4">
                            <SocialIcon href="#">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                            </SocialIcon>
                            <SocialIcon href="#">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.345 2.525c.636-.247 1.363-.416 2.427-.465C9.792 2.013 10.146 2 12.315 2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6zm6.406-11.845a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z" clipRule="evenodd" /></svg>
                            </SocialIcon>
                            <SocialIcon href="#">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.65 4.31 1.72v3.25c-1.93.07-3.85-.5-5.38-1.73-.74-.59-1.27-1.42-1.6-2.31-.2-.53-.29-1.09-.3-1.65-.08.18-.16.36-.24.54-.79 1.83-2.16 3.33-3.96 4.35-1.81 1.02-3.89 1.48-5.98 1.23-1.97-.22-3.83-1.04-5.26-2.38-1.4-1.31-2.2-3.09-2.42-5.01-.22-1.97.16-3.97 1.13-5.71 1-1.76 2.53-3.19 4.35-4.04 1.83-.85 3.86-.99 5.75-.42.23.07.45.15.67.24-.07-1.32-.14-2.64-.2-3.95z"/></svg>
                            </SocialIcon>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
                    © {currentYear} Canada Guide Immigration. Tous droits réservés.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
