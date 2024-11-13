

export const getWelcomeMessage = (role: 'salesman' | 'inventoryagent' | 'admin'): string => {
    switch (role) {
        case 'inventoryagent':
            return 'Welcome to ImsHomepage';
        case 'salesman':
            return 'Welcome to PostHomepage';
        case 'admin':
        default:
            return 'dashboard';
    }
};
