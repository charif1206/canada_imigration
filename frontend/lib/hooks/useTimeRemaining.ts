interface TimeRemaining {
    canResubmit: boolean;
    hoursLeft: number;
    minutesLeft: number;
}

export const useTimeRemaining = (rejectedAt?: string): TimeRemaining => {
    if (!rejectedAt) {
        return { canResubmit: true, hoursLeft: 0, minutesLeft: 0 };
    }

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
