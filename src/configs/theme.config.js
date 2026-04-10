export const lightTheme = {
  mode: 'light',
  colors: {
    bg: '#f4f7fb',
    surface: '#ffffff',
    text: '#111827',
    muted: '#667085',
    primary: '#2563eb',
    primaryContrast: '#ffffff',
    danger: '#dc2626',
    border: '#d7dde8',
    hover: '#eff4ff'
  },
  radius: '18px',
  spacing: '16px',
  shadow: '0 18px 40px rgba(15, 23, 42, 0.10)'
};

export const defaultTheme = lightTheme;

export function normalizeTheme(theme = {}) {
  const base = lightTheme;
  return {
    ...base,
    ...theme,
    colors: {
      ...base.colors,
      ...(theme.colors || {})
    }
  };
}
