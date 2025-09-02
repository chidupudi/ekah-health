// Dark Theme Configuration for Admin Interface
export const darkTheme = {
  // Primary Colors
  colors: {
    primary: '#00d4aa',
    primaryHover: '#00b894',
    primaryActive: '#00a085',
    secondary: '#6c5ce7',
    secondaryHover: '#5f3dc4',
    
    // Background Colors
    background: {
      primary: '#0d1117',      // Main background
      secondary: '#161b22',     // Cards, modals
      tertiary: '#21262d',      // Input fields, borders
      elevated: '#30363d',      // Elevated elements
    },
    
    // Text Colors
    text: {
      primary: '#f0f6fc',      // Main text
      secondary: '#8b949e',     // Secondary text
      muted: '#6e7681',         // Muted text
      inverse: '#24292f',       // Text on light backgrounds
    },
    
    // Border Colors
    border: {
      primary: '#30363d',
      secondary: '#21262d',
      accent: '#fd7e14',
    },
    
    // Status Colors
    status: {
      success: '#238636',
      successText: '#2ea043',
      warning: '#9a6700',
      warningText: '#d29922',
      error: '#da3633',
      errorText: '#f85149',
      info: '#0969da',
      infoText: '#58a6ff',
    },
    
    // Booking Status Colors
    booking: {
      pending: '#d29922',
      pendingBg: '#332701',
      confirmed: '#2ea043',
      confirmedBg: '#0d2818',
      rejected: '#f85149',
      rejectedBg: '#490202',
      cancelled: '#8b949e',
      cancelledBg: '#1c2128',
    },
  },
  
  // Shadows
  shadows: {
    small: '0 1px 3px rgba(0, 0, 0, 0.3)',
    medium: '0 4px 6px rgba(0, 0, 0, 0.4)',
    large: '0 10px 25px rgba(0, 0, 0, 0.5)',
    elevated: '0 8px 32px rgba(0, 0, 0, 0.6)',
  },
  
  // Typography
  typography: {
    fontFamily: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace",
    },
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  
  // Spacing
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  
  // Border Radius
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  
  // Component specific styles
  components: {
    // Button variants
    button: {
      primary: {
        background: '#00d4aa',
        backgroundHover: '#00b894',
        color: '#ffffff',
        border: 'transparent',
      },
      secondary: {
        background: '#6c5ce7',
        backgroundHover: '#5f3dc4',
        color: '#ffffff',
        border: 'transparent',
      },
      danger: {
        background: '#e74c3c',
        backgroundHover: '#c0392b',
        color: '#ffffff',
        border: 'transparent',
      },
      ghost: {
        background: 'transparent',
        backgroundHover: '#30363d',
        color: '#f0f6fc',
        border: '#30363d',
      },
    },
    
    // Card styles
    card: {
      background: '#161b22',
      border: '#30363d',
      shadow: '0 4px 6px rgba(0, 0, 0, 0.4)',
    },
    
    // Input styles
    input: {
      background: '#21262d',
      backgroundFocus: '#30363d',
      border: '#30363d',
      borderFocus: '#00d4aa',
      color: '#f0f6fc',
      placeholder: '#6e7681',
    },
    
    // Table styles
    table: {
      headerBackground: '#21262d',
      headerColor: '#f0f6fc',
      rowBackground: '#161b22',
      rowBackgroundHover: '#21262d',
      borderColor: '#30363d',
    },
    
    // Modal styles
    modal: {
      overlay: 'rgba(1, 4, 9, 0.8)',
      background: '#161b22',
      border: '#30363d',
    },
    
    // Navigation styles
    navigation: {
      background: '#0d1117',
      itemColor: '#8b949e',
      itemColorHover: '#f0f6fc',
      itemColorActive: '#00d4aa',
      itemBackground: 'transparent',
      itemBackgroundHover: '#21262d',
      itemBackgroundActive: '#0d2818',
    },
  },
};

// CSS Variables for the dark theme
export const darkThemeCSSVariables = `
  :root {
    /* Primary Colors */
    --color-primary: ${darkTheme.colors.primary};
    --color-primary-hover: ${darkTheme.colors.primaryHover};
    --color-primary-active: ${darkTheme.colors.primaryActive};
    --color-secondary: ${darkTheme.colors.secondary};
    --color-secondary-hover: ${darkTheme.colors.secondaryHover};
    
    /* Background Colors */
    --bg-primary: ${darkTheme.colors.background.primary};
    --bg-secondary: ${darkTheme.colors.background.secondary};
    --bg-tertiary: ${darkTheme.colors.background.tertiary};
    --bg-elevated: ${darkTheme.colors.background.elevated};
    
    /* Text Colors */
    --text-primary: ${darkTheme.colors.text.primary};
    --text-secondary: ${darkTheme.colors.text.secondary};
    --text-muted: ${darkTheme.colors.text.muted};
    --text-inverse: ${darkTheme.colors.text.inverse};
    
    /* Border Colors */
    --border-primary: ${darkTheme.colors.border.primary};
    --border-secondary: ${darkTheme.colors.border.secondary};
    --border-accent: ${darkTheme.colors.border.accent};
    
    /* Status Colors */
    --status-success: ${darkTheme.colors.status.success};
    --status-success-text: ${darkTheme.colors.status.successText};
    --status-warning: ${darkTheme.colors.status.warning};
    --status-warning-text: ${darkTheme.colors.status.warningText};
    --status-error: ${darkTheme.colors.status.error};
    --status-error-text: ${darkTheme.colors.status.errorText};
    --status-info: ${darkTheme.colors.status.info};
    --status-info-text: ${darkTheme.colors.status.infoText};
    
    /* Shadows */
    --shadow-small: ${darkTheme.shadows.small};
    --shadow-medium: ${darkTheme.shadows.medium};
    --shadow-large: ${darkTheme.shadows.large};
    --shadow-elevated: ${darkTheme.shadows.elevated};
  }
`;

export default darkTheme;