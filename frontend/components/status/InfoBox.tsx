import React from 'react';

type InfoBoxVariant = 'blue' | 'green' | 'yellow' | 'red';

interface InfoBoxProps {
    variant?: InfoBoxVariant;
    title: string;
    items: string[];
}

const variantClasses = {
    blue: 'bg-blue-50 border-blue-500 text-blue-800',
    green: 'bg-green-50 border-green-500 text-green-800',
    yellow: 'bg-yellow-50 border-yellow-500 text-yellow-800',
    red: 'bg-red-50 border-red-500 text-red-800'
};

export const InfoBox: React.FC<InfoBoxProps> = ({ variant = 'blue', title, items }) => {
    return (
        <div className={`${variantClasses[variant]} border-l-4 p-4 mb-6 text-left`}>
            <p className="text-sm">
                <strong>{title}</strong>
                <br />
                {items.map((item, index) => (
                    <React.Fragment key={index}>
                        • {item}
                        {index < items.length - 1 && <br />}
                    </React.Fragment>
                ))}
            </p>
        </div>
    );
};
