'use client';

import React from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { HeroSection, WhyChooseUsSection, TestimonialsSection, BlogSection } from '@/components/home';

const HomePage: React.FC = () => {
    const { user } = useAuth();
    
    return (
        <div className="animate-fade-in">
            <HeroSection isAuthenticated={!!user} />
            <WhyChooseUsSection />
            <TestimonialsSection />
            <BlogSection />
        </div>
    );
};

export default HomePage;