import React from 'react';
import Link from 'next/link';

export const LoginHelpFooter: React.FC = () => {
    return (
        <div className="mt-4 pt-4 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
                Need help?{' '}
                <Link href="/contact" className="text-blue-600 hover:text-blue-700">
                    Contact us
                </Link>
            </p>
        </div>
    );
};
