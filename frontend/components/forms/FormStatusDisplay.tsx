import React from 'react';

interface FormStatusDisplayProps {
    status: string | null;
    rejectedAt: string | null;
    rejectionReason: string | null;
    formTitle: string;
}

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

export const FormStatusDisplay: React.FC<FormStatusDisplayProps> = ({
    status,
    rejectedAt,
    rejectionReason,
    formTitle
}) => {
    if (status === 'validated') {
        return (
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-md">
                <div className="flex items-center">
                    <div className="shrink-0">
                        <svg className="h-10 w-10 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-lg font-medium text-green-800">✅ {formTitle} validé !</h3>
                        <p className="mt-2 text-sm text-green-700">
                            Félicitations ! Votre demande a été approuvée par notre équipe. Un conseiller vous contactera prochainement.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'pending') {
        return (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-md">
                <div className="flex items-center">
                    <div className="shrink-0">
                        <svg className="h-10 w-10 text-blue-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-lg font-medium text-blue-800">⏳ En attente de validation</h3>
                        <p className="mt-2 text-sm text-blue-700">
                            Votre {formTitle.toLowerCase()} est en cours de traitement. Un conseiller vous contactera dans les 24 heures. Vous recevrez également les tarifs et les moyens de paiement par e-mail.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'rejected' && rejectedAt) {
        const { canResubmit, hoursLeft, minutesLeft } = calculateTimeRemaining(rejectedAt);

        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-md">
                <div className="flex items-center">
                    <div className="shrink-0">
                        <svg className="h-10 w-10 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-lg font-medium text-red-800">❌ {formTitle} rejeté</h3>
                        {rejectionReason && (
                            <p className="mt-2 text-sm text-red-700">
                                <strong>Raison :</strong> {rejectionReason}
                            </p>
                        )}
                        {!canResubmit ? (
                            <p className="mt-2 text-sm font-semibold text-red-800">
                                🕒 Vous pouvez soumettre à nouveau les données après {hoursLeft}h {minutesLeft}min
                            </p>
                        ) : (
                            <p className="mt-2 text-sm font-semibold text-green-700">
                                ✅ Vous pouvez maintenant soumettre à nouveau le formulaire
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return null;
};
