import React from 'react';

interface CheckListItemProps {
    children: React.ReactNode;
}

export const CheckListItem: React.FC<CheckListItemProps> = ({ children }) => (
    <li className="flex items-start">
        <svg 
            className="w-6 h-6 text-green-500 mr-3 shrink-0" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
        >
            <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M5 13l4 4L19 7"
            />
        </svg>
        <span>{children}</span>
    </li>
);
