'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavLinkItem: React.FC<{ href: string; children: React.ReactNode; onClick: () => void }> = ({ href, children, onClick }) => {
    const pathname = usePathname();
    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
    
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`block py-2 px-3 rounded md:p-0 transition-colors duration-200 ${
                isActive
                    ? 'text-white bg-red-600 md:bg-transparent md:text-red-600'
                    : 'text-gray-700 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-red-600'
            }`}
        >
            {children}
        </Link>
    );
};

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className="bg-white shadow-md fixed w-full z-50">
            <div className="container mx-auto flex justify-between items-center p-4">
                <Link href="/" className="flex items-center space-x-2" onClick={closeMenu}>
                    <span className="text-xl font-bold text-blue-900">Canada Guide</span>
                    <span className="text-xl font-bold text-red-600">Immigration</span>
                </Link>

                <div className="flex items-center md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
                        </svg>
                    </button>
                </div>

                <div className={`flex-grow md:flex md:items-center md:justify-end ${isMenuOpen ? 'block' : 'hidden'} absolute md:relative top-16 left-0 md:top-auto md:left-auto w-full md:w-auto bg-white md:bg-transparent shadow-lg md:shadow-none`}>
                    <nav className="flex-grow">
                        <ul className="flex flex-col p-4 md:p-0 md:flex-row md:space-x-8 font-medium md:justify-center">
                            <li><NavLinkItem href="/" onClick={closeMenu}>Accueil</NavLinkItem></li>
                            <li><NavLinkItem href="/services" onClick={closeMenu}>Services</NavLinkItem></li>
                            <li><NavLinkItem href="/forms" onClick={closeMenu}>Formulaires</NavLinkItem></li>
                            <li><NavLinkItem href="/partners" onClick={closeMenu}>Agences partenaires</NavLinkItem></li>
                            <li><NavLinkItem href="/contact" onClick={closeMenu}>Contact</NavLinkItem></li>
                            <li><NavLinkItem href="/login" onClick={closeMenu}>Espace client</NavLinkItem></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
