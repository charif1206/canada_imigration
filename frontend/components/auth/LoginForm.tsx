import React, { useState } from 'react';
import Link from 'next/link';
import { AuthFormField } from './AuthFormField';
import { AuthSubmitButton } from './AuthSubmitButton';

interface LoginFormProps {
    onSubmit: (data: { email: string; password: string }) => void;
    isPending: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isPending }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 text-black">
            <AuthFormField
                id="email"
                name="email"
                type="email"
                label="Email Address"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
            />

            <AuthFormField
                id="password"
                name="password"
                type="password"
                label="Password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Your password"
                extraLabel={
                    <Link href="/forgot-password" className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium">
                        Forgot Password?
                    </Link>
                }
            />

            <AuthSubmitButton
                isLoading={isPending}
                loadingText="Logging in..."
                buttonText="Login"
            />
        </form>
    );
};
