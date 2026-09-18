import type { Theme } from '@mui/material/styles';
import type { SxStyles } from '@/ui/style/types';

/**
 * Gets custom sx classes for the crosshair.
 *
 * @param theme - The theme object
 * @returns The sx classes object
 */
export const getSxClasses = (theme: Theme): SxStyles => ({
  crosshairContainer: {
    position: 'absolute',
    top: '0px',
    right: '0px',
    left: '0px',
    bottom: '0px',
    paddingBottom: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none !important',
    zIndex: theme.zIndex.olControl,
  },
  crosshairInfo: {
    position: 'absolute',
    top: '0px',
    right: '0px',
    left: '0px',
    padding: '2px 1px 0px 1px',
    backgroundColor: theme.palette.geoViewColor?.grey.lighten(0.1, 0.8),
    '& span': {
      // Preserves prior rendering: the old non-linear spacing(70) produced invalid CSS (no padding applied).
      paddingLeft: theme.spacing(0),
    },
  },
  crosshairIcon: {
    width: theme.overrides.crosshairIcon.size.width,
    height: theme.overrides.crosshairIcon?.size.height,
  },
});
