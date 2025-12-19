import React from 'react';
import { ContactInfoItem } from './ContactInfoItem';
import { LocationIcon, EmailIcon, PhoneIcon } from './ContactIcons';
import { SocialLinks } from './SocialLinks';

export const DirectContactInfo: React.FC = () => {
    return (
        <div className="bg-blue-900 text-white p-6 sm:p-8 rounded-xl shadow-lg flex flex-col justify-center text-start">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">Contact Direct</h2>
            <div className="space-y-3 sm:space-y-4 text-sm sm:text-base">
                <ContactInfoItem icon={<LocationIcon />}>
                    Service 100% en ligne
                </ContactInfoItem>
                <ContactInfoItem icon={<EmailIcon />}>
                    <a href="mailto:canadaguideimmigration@gmail.com" className="hover:text-red-300">
                        Email: canadaguideimmigration@gmail.com
                    </a>
                </ContactInfoItem>
                <ContactInfoItem icon={<PhoneIcon />}>
                    <a href="https://wa.me/213000000000" className="hover:text-red-300">
                        WhatsApp: +213 [Numéro]
                    </a>
                </ContactInfoItem>
            </div>
            <SocialLinks />
        </div>
    );
};
