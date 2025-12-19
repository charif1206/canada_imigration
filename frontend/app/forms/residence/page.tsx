'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/useAuth';
import { FormSection, FormStatusDisplay, ResubmissionWarning } from '@/components/forms';
import { FormulaireResidence } from '@/components/forms/FormulaireResidence';
import Link from 'next/link';

const calculateTimeRemaining = (rejectedAt: string): { canResubmit: boolean; hoursLeft: number; minutesLeft: number } => {
    const rejectedTime = new Date(rejectedAt).getTime();
    const now = new Date().getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    const elapsed = now - rejectedTime;
    const remaining = twentyFourHours - elapsed;

    if (remaining <= 0) {
        return { canResubmit: true, hoursLeft: 0, minutesLeft: 0 };
    }

    const hoursLeft = Math.floor(remaining / (60 * 60 * 1000));
    const minutesLeft = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));

    return { canResubmit: false, hoursLeft, minutesLeft };
};

const ResidenceFormPage: React.FC = () => {
    const { client, refreshAuth } = useAuth();

    const [isSendingTemporarily, setIsSendingTemporarily] = useState(() => {
        if (typeof window !== 'undefined' && client?.id) {
            return localStorage.getItem(`temp_sending_residence_${client.id}`) === 'true';
        }
        return false;
    });

    useEffect(() => {
        if (!client?.id) return;

        if (typeof window !== 'undefined') {
            const allKeys = Object.keys(localStorage);
            allKeys.forEach(key => {
                if (key.startsWith('temp_sending_residence_') && !key.includes(client.id)) {
                    localStorage.removeItem(key);
                }
            });
        }

        if (isSendingTemporarily && client?.isSendingFormulaireResidence) {
            if (client?.residenceStatus === 'validated' || client?.residenceStatus === 'rejected') {
                localStorage.removeItem(`temp_sending_residence_${client.id}`);
                setIsSendingTemporarily(false);
            }
        }
    }, [client?.id, client?.isSendingFormulaireResidence, client?.residenceStatus, isSendingTemporarily]);

    useEffect(() => {
        const interval = setInterval(() => {
            refreshAuth();
        }, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [refreshAuth]);

    const handleSubmit = async () => {
        if (!client?.id) return;
        localStorage.setItem(`temp_sending_residence_${client.id}`, 'true');
        setIsSendingTemporarily(true);
        window.scrollTo(0, 0);
        await refreshAuth();
    };

    const canResubmit = client?.residenceStatus !== 'rejected' ||
        (client?.residenceRejectedAt && calculateTimeRemaining(client.residenceRejectedAt).canResubmit);

    return (
        <ProtectedRoute>
            <div className="py-12 sm:py-16 md:py-20 bg-slate-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Link */}
                    <Link
                        href="/forms"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-6 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Retour aux formulaires
                    </Link>

                    <div className="text-center mb-8 sm:mb-12">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900">🧩 Formulaire Résidence Permanente</h1>
                        <p className="text-base sm:text-lg text-slate-600 mt-2">Mettez à jour votre dossier de résidence permanente (CSQ et Fédéral).</p>
                    </div>

                    <FormSection id="residence" title="" subtitle="">
                        {(client?.isSendingFormulaireResidence && !canResubmit) || isSendingTemporarily ? (
                            <FormStatusDisplay
                                status={isSendingTemporarily ? 'pending' : (client?.residenceStatus || null)}
                                rejectedAt={client?.residenceRejectedAt || null}
                                rejectionReason={client?.residenceRejectionReason || null}
                                formTitle="Formulaire de résidence"
                            />
                        ) : (
                            <>
                                {client?.residenceStatus === 'rejected' && canResubmit && <ResubmissionWarning />}
                                <FormulaireResidence onSubmitSuccess={handleSubmit} />
                            </>
                        )}
                    </FormSection>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default ResidenceFormPage;
