import React from 'react';

interface ResubmitNoticeProps {
    canResubmit: boolean;
}

export const ResubmitNotice: React.FC<ResubmitNoticeProps> = ({ canResubmit }) => {
    if (!canResubmit) return null;

    return (
        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md max-w-4xl mx-auto">
            <p className="text-sm text-yellow-700">
                ℹ️ Votre précédente demande a été rejetée. Vous pouvez maintenant soumettre à nouveau avec les corrections nécessaires.
            </p>
        </div>
    );
};
