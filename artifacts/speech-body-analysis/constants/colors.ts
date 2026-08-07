/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    text: '#F8FAFC',
    tint: '#67E8C5',

    background: '#0F172A',
    foreground: '#F8FAFC',

    card: '#16213A',
    cardForeground: '#F8FAFC',

    primary: '#67E8C5',
    primaryForeground: '#0F172A',

    secondary: '#243451',
    secondaryForeground: '#F8FAFC',

    muted: '#1E2C47',
    mutedForeground: '#93A4C3',

    accent: '#FF9F80',
    accentForeground: '#0F172A',

    destructive: '#FB7185',
    destructiveForeground: '#0F172A',

    border: '#2A3A58',
    input: '#2A3A58',
  },
  dark: {
    text: '#F8FAFC',
    tint: '#67E8C5',
    background: '#0F172A',
    foreground: '#F8FAFC',
    card: '#16213A',
    cardForeground: '#F8FAFC',
    primary: '#67E8C5',
    primaryForeground: '#0F172A',
    secondary: '#243451',
    secondaryForeground: '#F8FAFC',
    muted: '#1E2C47',
    mutedForeground: '#93A4C3',
    accent: '#FF9F80',
    accentForeground: '#0F172A',
    destructive: '#FB7185',
    destructiveForeground: '#0F172A',
    border: '#2A3A58',
    input: '#2A3A58',
  },
  radius: 18,
};

export default colors;
