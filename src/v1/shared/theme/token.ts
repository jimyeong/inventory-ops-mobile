// Design Tokens for the Application


export const chips = {
  chipSelected: {
    backgroundColor: '#2196f3',
    borderColor: '#2196f3',
  },
  chipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  chip: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ddd',
    borderRadius: 20,
    borderWidth: 1,
  },
  chipTextUnselected: {
    color: '#666',
  },
  chipTextDisabled: {
    color: '#9e9e9e',
  },
}
export const colors = {
  // Primary Colors
  primary: {
    main: '#2196f3',
    light: '#64b5f6',
    dark: '#1976d2',
    contrast: '#ffffff',
  },

  // Secondary Colors
  secondary: {
    main: '#ff9800',
    light: '#ffb74d',
    dark: '#f57c00',
    contrast: '#000000',
  },

  // Success Colors
  success: {
    main: '#4caf50',
    light: '#81c784',
    dark: '#388e3c',
    background: '#e8f5e9',
    contrast: '#ffffff',
  },

  // Error Colors
  error: {
    main: '#f44336',
    light: '#e57373',
    dark: '#d32f2f',
    background: '#ffebee',
    contrast: '#ffffff',
  },

  // Warning Colors
  warning: {
    main: '#ff9800',
    light: '#ffb74d',
    dark: '#f57c00',
    background: '#fff3e0',
    contrast: '#000000',
  },

  // Info Colors
  info: {
    main: '#2196f3',
    light: '#64b5f6',
    dark: '#1976d2',
    background: '#e3f2fd',
    contrast: '#ffffff',
  },
  edit: {
    backgroundColor: '#4caf50',
    borderColor: '#2196f3',
    color: '#ffffff',
  },
  cancel: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
    color: '#ffffff',
  },
  purple:{
    main: "#ec4899",
    light: "#ede9fe",
    dark: "#6d28d9",
  },
  pink:{
    main: "#ec4899",
    light: "#fce7f3",
    dark: "#be185d"
  },
  // Neutral/Gray Scale
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },

  // Text Colors
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#9e9e9e',
    hint: '#bdbdbd',
    inverse: '#ffffff',
  },

  // Background Colors
  background: {
    default: '#fafafa',
    paper: '#ffffff',
    elevated: '#ffffff',
    disabled: '#f5f5f5',
  },

  // Border Colors
  border: {
    main: '#e0e0e0',
    light: '#eeeeee',
    dark: '#bdbdbd',
    focus: '#2196f3',
  },

  // Overlay Colors
  overlay: {
    light: 'rgba(0, 0, 0, 0.3)',
    medium: 'rgba(0, 0, 0, 0.5)',
    dark: 'rgba(0, 0, 0, 0.7)',
  },

  // Status Colors for Stock/Inventory
  status: {
    inStock: '#4caf50',
    lowStock: '#ff9800',
    outOfStock: '#f44336',
    expired: '#d32f2f',
    expiringSoon: '#ff9800',
  },

  // Common Colors
  common: {
    black: '#000000',
    white: '#ffffff',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

export const borderRadius = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 20,
  full: 9999,
};

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },

  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    display: 32,
  },

  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const shadows = {
  none: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const zIndex = {
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
};

export const theme = {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
  iconSizes,
  zIndex,
};

export const layout = {
  screenHorizontalPadding: 10,
};

export default theme;
