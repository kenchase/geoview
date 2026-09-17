import type { Theme, SxStyles } from 'geoview-core/ui/style/types';

/**
 * Gets the sx classes for the STAC browser components.
 *
 * @param theme - The MUI theme
 * @returns The sx style definitions
 */
export const getSxClasses = (theme: Theme): SxStyles => ({
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  },
  panelContent: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'auto',
    gap: '1px',
  },
  backLink: {
    display: 'flex',
    gap: '1px',
    padding: '1px 1.5px 0px',
  },
  stickyNav: {
    display: 'flex',
    gap: '1px',
    padding: '1px 1.5px 0.5px',
    position: 'sticky',
    top: 0,
    backgroundColor: theme.palette.geoViewColor?.bgColor.dark[50] ?? theme.palette.background.paper,
    zIndex: 1,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  browseToolbar: {
    display: 'flex',
    gap: '1px',
    alignItems: 'center',
    marginBottom: '1px',
  },
  mapControls: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1px',
    alignItems: 'center',
  },
  modeToggle: {
    display: 'flex',
    borderBottom: `1px solid ${theme.palette.divider}`,
    flexShrink: 0,
  },
  modeButton: {
    flex: 1,
    borderRadius: 0,
    borderBottom: '2px solid transparent',
    padding: '1px',
    fontWeight: 500,
    fontSize: theme.palette.geoViewFontSize?.sm,
    color: theme.palette.geoViewColor?.textColor.light[200],
    cursor: 'pointer',
    textAlign: 'center',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  modeButtonActive: {
    borderBottom: `2px solid ${theme.palette.geoViewColor?.primary.main}`,
    color: theme.palette.geoViewColor?.primary.main,
    fontWeight: 600,
  },
  filterPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5px',
    padding: '1.5px',
    flex: 1,
  },
  searchButton: {
    marginTop: 'auto',
  },
  filterRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5px',
  },
  filterLabel: {
    fontWeight: 600,
    fontSize: theme.palette.geoViewFontSize?.sm,
    color: theme.palette.geoViewColor?.textColor.main,
  },
  resultsList: {
    padding: '1px',
  },
  resultCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5px',
    padding: '1.5px',
    marginBottom: '1px',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  resultTitle: {
    fontWeight: 600,
    fontSize: theme.palette.geoViewFontSize?.default,
    color: theme.palette.geoViewColor?.textColor.main,
  },
  resultMeta: {
    fontSize: theme.palette.geoViewFontSize?.sm,
    color: theme.palette.geoViewColor?.textColor.light[200],
    display: 'flex',
    alignItems: 'center',
    gap: '0.5px',
  },
  thumbnail: {
    width: '100%',
    maxHeight: 150,
    objectFit: 'cover',
    borderRadius: theme.shape.borderRadius,
  },
  detailTitle: {
    fontWeight: 600,
    fontSize: theme.palette.geoViewFontSize?.lg,
    color: theme.palette.geoViewColor?.textColor.main,
  },
  detailDescription: {
    fontSize: theme.palette.geoViewFontSize?.default,
    color: theme.palette.geoViewColor?.textColor.main,
  },
  assetList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5px',
  },
  assetItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1px',
    padding: '0.5px',
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5px',
  },
  noResults: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5px',
    color: theme.palette.geoViewColor?.textColor.light[200],
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1px',
    padding: '1px',
  },
  dateInputRow: {
    display: 'flex',
    gap: '1px',
    alignItems: 'center',
  },
  dateInput: {
    flex: 1,
    '& input': {
      fontSize: theme.palette.geoViewFontSize?.sm,
      padding: '0.75px',
    },
  },
  collectionsListBox: {
    maxHeight: 150,
    overflow: 'auto',
  },
  detailSection: {
    padding: '0 12px',
  },

  // Collection card styles
  collectionCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5px',
    padding: '1.5px',
    marginBottom: '1px',
    border: `1px solid ${theme.palette.divider}`,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      borderColor: theme.palette.geoViewColor?.primary.main,
    },
  },
  collectionTitle: {
    fontWeight: 600,
    fontSize: theme.palette.geoViewFontSize?.default,
    color: theme.palette.geoViewColor?.textColor.main,
  },
  collectionDescription: {
    fontSize: theme.palette.geoViewFontSize?.sm,
    color: theme.palette.geoViewColor?.textColor.light[200],
    lineHeight: 1.4,
  },

  // Keyword chips
  keywordChipsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5px',
  },
  keywordChip: {
    display: 'inline-block',
    padding: '2px 8px',
    fontSize: '0.75rem',
    backgroundColor: theme.palette.action.selected,
    color: theme.palette.geoViewColor?.textColor.main,
    whiteSpace: 'nowrap',
  },

  // Metadata section (collection detail)
  metadataSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
    padding: '0px 1.5px 1px',
  },
  metadataColumnsRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    padding: '0px 1.5px 1px',
    '@media (min-width: 500px)': {
      flexDirection: 'row',
    },
  },
  metadataColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
    flex: 1,
    minWidth: 0,
  },
  metadataRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25px',
  },
  metadataLabel: {
    fontWeight: 600,
    fontSize: theme.palette.geoViewFontSize?.sm,
    color: theme.palette.geoViewColor?.textColor.main,
  },
  zoomButton: {
    fontSize: theme.palette.geoViewFontSize?.sm,
  },

  // Items section (collection detail)
  itemsSectionTitle: {
    fontWeight: 600,
    fontSize: theme.palette.geoViewFontSize?.default,
    color: theme.palette.geoViewColor?.textColor.main,
    marginBottom: '0.5px',
  },
  itemRow: {
    display: 'flex',
    gap: '5px',
    padding: '6px 4px',
    marginBottom: '15px',
    border: `1px solid ${theme.palette.divider}`,
    cursor: 'pointer',
    alignItems: 'center',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  itemRowText: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minWidth: 0,
  },
  itemThumbnail: {
    width: 60,
    height: 60,
    objectFit: 'cover',
    borderRadius: theme.shape.borderRadius,
    flexShrink: 0,
  },
  assetTypeBadge: {
    display: 'inline-block',
    padding: '1px 6px',
    fontSize: '0.7rem',
    fontWeight: 600,
    borderRadius: '4px',
    backgroundColor: theme.palette.geoViewColor?.primary.main,
    color: theme.palette.geoViewColor?.white,
    marginRight: '0.5px',
  },
  assetRoleBadge: {
    display: 'inline-block',
    padding: '1px 6px',
    fontSize: '0.65rem',
    fontWeight: 500,
    borderRadius: '4px',
    border: `1px solid ${theme.palette.divider}`,
    color: theme.palette.geoViewColor?.textColor.light[200],
    textTransform: 'uppercase',
  },
  assetActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5px',
    flexShrink: 0,
  },
  paginationBar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1px 0px',
  },

  // Search results grouped by collection
  collectionGroup: {
    marginBottom: '1.5px',
  },
  collectionGroupTitle: {
    fontWeight: 600,
    fontSize: theme.palette.geoViewFontSize?.default,
    color: theme.palette.geoViewColor?.primary.main,
    padding: '0.5px 0px',
    borderBottom: `1px solid ${theme.palette.divider}`,
    marginBottom: '0.5px',
  },
});
