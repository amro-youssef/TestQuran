// Each theme defines accent colors for light and dark modes
// plus the MUI primary color for each mode.

const themes = {
  blue: {
    label: 'Blue',
    swatch: '#4a90d9',
    light: {
      primary: '#4a90d9',
      secondary: '#6b7b8d',
      linkColor: '#4a90d9',
      selectionShadow: 'rgba(74, 144, 217, 0.12)',
      selectionOutline: 'rgba(74, 144, 217, 0.25)',
      selectionBg: 'rgba(74, 144, 217, 0.04)',
    },
    dark: {
      primary: '#90caf9',
      secondary: '#90a4ae',
      linkColor: '#90caf9',
      selectionShadow: 'rgba(144, 202, 249, 0.15)',
      selectionOutline: 'rgba(144, 202, 249, 0.25)',
      selectionBg: 'rgba(144, 202, 249, 0.06)',
    },
  },
  sage: {
    label: 'Sage',
    swatch: '#6b7f5e',
    light: {
      primary: '#6b7f5e',
      secondary: '#8a7e6b',
      linkColor: '#6b7f5e',
      selectionShadow: 'rgba(107, 127, 94, 0.12)',
      selectionOutline: 'rgba(107, 127, 94, 0.25)',
      selectionBg: 'rgba(107, 127, 94, 0.04)',
    },
    dark: {
      primary: '#a3b899',
      secondary: '#b0a58f',
      linkColor: '#a3b899',
      selectionShadow: 'rgba(163, 184, 153, 0.15)',
      selectionOutline: 'rgba(163, 184, 153, 0.25)',
      selectionBg: 'rgba(163, 184, 153, 0.06)',
    },
  },
  purple: {
    label: 'Purple',
    swatch: '#7e57c2',
    light: {
      primary: '#7e57c2',
      secondary: '#8d6e9f',
      linkColor: '#7e57c2',
      selectionShadow: 'rgba(126, 87, 194, 0.12)',
      selectionOutline: 'rgba(126, 87, 194, 0.25)',
      selectionBg: 'rgba(126, 87, 194, 0.04)',
    },
    dark: {
      primary: '#b39ddb',
      secondary: '#ba9cc5',
      linkColor: '#b39ddb',
      selectionShadow: 'rgba(179, 157, 219, 0.15)',
      selectionOutline: 'rgba(179, 157, 219, 0.25)',
      selectionBg: 'rgba(179, 157, 219, 0.06)',
    },
  },
  teal: {
    label: 'Teal',
    swatch: '#26a69a',
    light: {
      primary: '#26a69a',
      secondary: '#6d8f8b',
      linkColor: '#26a69a',
      selectionShadow: 'rgba(38, 166, 154, 0.12)',
      selectionOutline: 'rgba(38, 166, 154, 0.25)',
      selectionBg: 'rgba(38, 166, 154, 0.04)',
    },
    dark: {
      primary: '#80cbc4',
      secondary: '#9bb5b1',
      linkColor: '#80cbc4',
      selectionShadow: 'rgba(128, 203, 196, 0.15)',
      selectionOutline: 'rgba(128, 203, 196, 0.25)',
      selectionBg: 'rgba(128, 203, 196, 0.06)',
    },
  },
  rose: {
    label: 'Rose',
    swatch: '#c2727e',
    light: {
      primary: '#c2727e',
      secondary: '#9f7e83',
      linkColor: '#c2727e',
      selectionShadow: 'rgba(194, 114, 126, 0.12)',
      selectionOutline: 'rgba(194, 114, 126, 0.25)',
      selectionBg: 'rgba(194, 114, 126, 0.04)',
    },
    dark: {
      primary: '#ef9a9a',
      secondary: '#c5a3a6',
      linkColor: '#ef9a9a',
      selectionShadow: 'rgba(239, 154, 154, 0.15)',
      selectionOutline: 'rgba(239, 154, 154, 0.25)',
      selectionBg: 'rgba(239, 154, 154, 0.06)',
    },
  },
  amber: {
    label: 'Amber',
    swatch: '#c49040',
    light: {
      primary: '#c49040',
      secondary: '#8f8060',
      linkColor: '#b07d30',
      selectionShadow: 'rgba(196, 144, 64, 0.12)',
      selectionOutline: 'rgba(196, 144, 64, 0.25)',
      selectionBg: 'rgba(196, 144, 64, 0.04)',
    },
    dark: {
      primary: '#ffcc80',
      secondary: '#c5b28a',
      linkColor: '#ffcc80',
      selectionShadow: 'rgba(255, 204, 128, 0.15)',
      selectionOutline: 'rgba(255, 204, 128, 0.25)',
      selectionBg: 'rgba(255, 204, 128, 0.06)',
    },
  },
};

export default themes;
