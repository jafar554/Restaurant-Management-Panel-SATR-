// Configuration file for Restaurant Dashboard
// Update these settings to customize your dashboard

const CONFIG = {
        // Admin Configuration
        ADMIN: {
            // Change this password to secure your admin access
            // IMPORTANT: Change this password before deployment!
            PASSWORD: 'admin123',
            
            // Session timeout in minutes (0 = no timeout)
            SESSION_TIMEOUT: 0,
            
            // Admin features
            CAN_ADD_RESTAURANTS: true,
            CAN_EDIT_RESTAURANTS: true,
            CAN_DELETE_RESTAURANTS: false,
            CAN_VIEW_SETTINGS: true
        },
    
    // Dashboard Settings
    DASHBOARD: {
        // Default settings
        DEFAULT_COMPACT_VIEW: true,
        DEFAULT_SHOW_DELIVERY_PRICES: true,
        
        // Auto-refresh interval (in milliseconds)
        AUTO_REFRESH_INTERVAL: 300000, // 5 minutes
        
        // Toast notification duration (in milliseconds)
        TOAST_DURATION: 3000
    },
    
    // UI Configuration
    UI: {
        // Animation durations
        ANIMATION_DURATION: 300,
        
        // Colors (can be customized)
        PRIMARY_COLOR: '#667eea',
        SECONDARY_COLOR: '#764ba2',
        
        // Breakpoints for responsive design
        BREAKPOINTS: {
            MOBILE: 480,
            TABLET: 768,
            DESKTOP: 1024
        }
    },
    
    // Local Storage Configuration
    STORAGE: {
        // Key for storing restaurant data
        RESTAURANTS_KEY: 'restaurantDashboardData',
        
        // Key for storing admin session
        ADMIN_KEY: 'restaurantDashboardAdminMode',
        
        // Key for storing settings
        SETTINGS_KEY: 'restaurantDashboardSettings'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}
