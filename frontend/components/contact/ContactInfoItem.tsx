import React from 'react';

interface ContactInfoItemProps {
    icon: React.ReactNode;
    children: React.ReactNode;
}

export const ContactInfoItem: React.FC<ContactInfoItemProps> = ({ icon, children }) => {
    return (
        <div className="flex items-center">
            {icon}
            <span>{children}</span>
        </div>
    );
};
