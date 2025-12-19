import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { AuthFormField } from './AuthFormField';
import { AuthSubmitButton } from './AuthSubmitButton';

interface RegisterFormProps {
    onSubmit: (data: { name: string; email: string; password: string }) => void;
    isPending: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isPending }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        // Validate password length
        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        onSubmit({
            name: formData.name,
            email: formData.email,
            password: formData.password,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 text-black">
            <AuthFormField
                id="name"
                name="name"
                type="text"
                label="Full Name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
            />

            <AuthFormField
                id="email"
                name="email"
                type="email"
                label="Email Address"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
            />

            <AuthFormField
                id="password"
                name="password"
                type="password"
                label="Password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
            />

            <AuthFormField
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
            />

            <AuthSubmitButton
                isLoading={isPending}
                loadingText="Registering..."
                buttonText="Register"
            />
        </form>
    );
};
