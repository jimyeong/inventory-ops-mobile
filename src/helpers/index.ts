export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Calculate days until expiry
 export const calculateDaysUntilExpiry = (expiryDate: Date | string | undefined): number | null => {
    if (!expiryDate) return null;
    
    const expiry = new Date(expiryDate);
    const today = new Date();
    
    // Reset time portion to compare just the dates
    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);
    
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
};
// Get expiry status info
export const getExpiryInfo = (daysLeft: number | null) => {
    if (daysLeft === null) {
        return {
            color: '#7f8c8d',
            text: 'No expiry date',
            icon: 'calendar-blank',
            backgroundColor: 'transparent'
        };
    }
    
    if (daysLeft < 0) {
        return {
            color: '#e74c3c',
            text: `Expired ${Math.abs(daysLeft)} days ago`,
            icon: 'calendar-alert',
            backgroundColor: 'rgba(231, 76, 60, 0.1)'
        };
    }
    
    if (daysLeft <= 7) {
        return {
            color: '#e74c3c',
            text: `${daysLeft} days left`,
            icon: 'calendar-alert',
            backgroundColor: 'rgba(231, 76, 60, 0.1)'
        };
    }
    
    if (daysLeft <= 14) {
        return {
            color: '#e67e22',
            text: `${daysLeft} days left`,
            icon: 'calendar-alert',
            backgroundColor: 'rgba(230, 126, 34, 0.1)'
        };
    }
    
    if (daysLeft <= 30) {
        return {
            color: '#f39c12',
            text: `${daysLeft} days left`,
            icon: 'calendar-clock',
            backgroundColor: 'rgba(243, 156, 18, 0.1)'
        };
    }
    
    return {
        color: '#27ae60',
        text: `${daysLeft} days left`,
        icon: 'calendar-check',
        backgroundColor: 'transparent'
    };
};