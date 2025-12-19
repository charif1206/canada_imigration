import React from 'react';

interface TimeRemaining {
    canResubmit: boolean;
    hoursLeft: number;
    minutesLeft: number;
}

interface RejectedStatusAlertProps {
    rejectionReason?: string;
    timeRemaining: TimeRemaining;
}

export const RejectedStatusAlert: React.FC<RejectedStatusAlertProps> = ({ 
    rejectionReason, 
    timeRemaining 
}) => (
    <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-md">
        <div className="flex items-center">
            <div className="shrink-0">
                <svg 
                    className="h-10 w-10 text-red-400" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                >
                    <path 
                        fillRule="evenodd" 
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                        clipRule="evenodd" 
                    />
                </svg>
            </div>
            <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800">
                    ❌ Demande de partenariat rejetée
                </h3>
                {rejectionReason && (
                    <p className="mt-2 text-sm text-red-700">
                        <strong>Raison :</strong> {rejectionReason}
                    </p>
                )}
                {!timeRemaining.canResubmit ? (
                    <p className="mt-2 text-sm font-semibold text-red-800">
                        🕒 Vous pouvez soumettre à nouveau après {timeRemaining.hoursLeft}h {timeRemaining.minutesLeft}min
                    </p>
                ) : (
                    <p className="mt-2 text-sm font-semibold text-green-700">
                        ✅ Vous pouvez maintenant soumettre à nouveau
                    </p>
                )}
            </div>
        </div>
    </div>
);
