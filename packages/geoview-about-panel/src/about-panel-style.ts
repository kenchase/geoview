import type { Theme, SxStyles } from 'geoview-core/ui/style/types';

/**
 * Returns the sx style classes for the About Panel components.
 *
 * @param theme - The MUI theme object
 * @returns The sx style classes
 */
export const getSxClasses = (theme: Theme): SxStyles => ({
  container: {
    padding: '16px',
    height: '100%',
    overflow: 'auto',
  },
  markdownContainer: {
    '& h1, & h2, & h3, & h4, & h5, & h6': {
      marginTop: '16px',
      marginBottom: '10px',
    },
    '& p': {
      marginBottom: '16px',
    },
    '& ul, & ol': {
      paddingLeft: '16px',
      marginBottom: '16px',
    },
    '& a': {
      color: theme.palette.primary.main,
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
    '& img': {
      display: 'block',
      maxWidth: '100%',
      height: 'auto',
    },
    '& code': {
      backgroundColor: theme.palette.action.hover,
      padding: '0.5px 1px',
      borderRadius: theme.shape.borderRadius,
      fontFamily: 'monospace',
    },
    '& pre': {
      backgroundColor: theme.palette.action.hover,
      padding: '16px',
      borderRadius: theme.shape.borderRadius,
      overflow: 'auto',
      '& code': {
        backgroundColor: 'transparent',
        padding: 0,
      },
    },
  },
  markdownItem: {
    marginBottom: '2px',
  },
  defaultContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  title: {
    marginTop: '16px',
    fontSize: theme.palette.geoViewFontSize?.xl,
    fontWeight: theme.typography.fontWeightBold,
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '16px',
    '& img': {
      display: 'block',
      maxWidth: '100%',
      height: 'auto',
    },
  },
  description: {
    lineHeight: theme.typography.body1.lineHeight,
  },
  linkContainer: {
    marginTop: '16px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
  },
  errorContainer: {
    padding: '16px',
  },
});
