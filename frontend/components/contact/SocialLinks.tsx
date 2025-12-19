import React from 'react';

interface SocialLink {
    name: string;
    url: string;
}

const socialLinks: SocialLink[] = [
    { name: 'Facebook', url: '#' },
    { name: 'Instagram', url: '#' },
    { name: 'TikTok', url: '#' }
];

export const SocialLinks: React.FC = () => {
    return (
        <div className="border-t border-blue-700 mt-8 pt-6">
            <h3 className="text-lg font-semibold mb-3">Suivez-nous</h3>
            <div className="flex space-x-4">
                {socialLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.url}
                        className="text-blue-200 hover:text-white transition-colors duration-200"
                    >
                        {link.name}
                    </a>
                ))}
            </div>
        </div>
    );
};
