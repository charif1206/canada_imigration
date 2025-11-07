'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import NotificationBell from './NotificationBell';

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
    const { client } = useAuth();

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

                <div className={`grow md:flex md:items-center md:justify-end ${isMenuOpen ? 'block' : 'hidden'} absolute md:relative top-16 left-0 md:top-auto md:left-auto w-full md:w-auto bg-white md:bg-transparent shadow-lg md:shadow-none`}>
                    <nav className="grow">
                        <ul className="flex flex-col p-4 md:p-0 md:flex-row md:space-x-8 font-medium md:justify-center">
                            <li><NavLinkItem href="/" onClick={closeMenu}>Accueil</NavLinkItem></li>
                            <li><NavLinkItem href="/services" onClick={closeMenu}>Services</NavLinkItem></li>
                            <li><NavLinkItem href="/forms" onClick={closeMenu}>Formulaires</NavLinkItem></li>
                            <li><NavLinkItem href="/partners" onClick={closeMenu}>Agences partenaires</NavLinkItem></li>
                            <li><NavLinkItem href="/contact" onClick={closeMenu}>Contact</NavLinkItem></li>
                        </ul>
                    </nav>
                    
                    {/* Profile Section */}
                    <div className="relative">
                        {client ? (
                            <div className="md:flex md:items-center md:space-x-2 p-4 md:p-0 border-t md:border-t-0 md:border-l md:pl-4">
                                {/* Notification Bell - Navigate to Status */}
                                <Link href="/status" className="block md:inline-block">
                                    <NotificationBell />
                                </Link>
                                
                                {/* Profile Icon - Navigate to Profile */}
                                <Link
                                    href="/profile"
                                    onClick={closeMenu}
                                    className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                                    title="Mon Profil"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                                    </svg>
                                    <span className="text-sm font-medium md:hidden">{client.name}</span>
                                </Link>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                onClick={closeMenu}
                                className="block md:inline-block px-4 py-2 md:px-6 md:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-center m-4 md:m-0"
                            >
                                🔑 Se connecter
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
