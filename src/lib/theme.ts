'use client'
import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary:    { main: '#1B3A6B', light: '#2952A3', dark: '#0F2449', contrastText: '#FEFCF8' },
    secondary:  { main: '#7A5A00', light: '#B08A20', dark: '#543D00', contrastText: '#FEFCF8' },
    background: { default: '#F7F6F3', paper: '#FEFCF8' },
    text:       { primary: '#1C1917', secondary: '#6B6560', disabled: '#9C9589' },
    divider: '#DDD8CE',
    success: { main: '#1A6B45', light: '#E8F5EE', dark: '#0F4A2D' },
    error:   { main: '#8B2020', light: '#FDEAEA', dark: '#5E1515' },
    warning: { main: '#7A4F00', light: '#FFF3DC', dark: '#543500' },
    info:    { main: '#2952A3', light: '#EBF1FC', dark: '#1B3A6B' },
  },
  typography: {
    fontFamily: '"Inter", "Georgia", system-ui, sans-serif',
    button: { textTransform: 'none', fontWeight: 500 },
    h1: { fontWeight: 500, letterSpacing: '-0.3px' },
    h2: { fontWeight: 500 },
    h3: { fontWeight: 500 },
    h4: { fontWeight: 500 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
    caption: { color: '#9C9589' },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { background: '#F7F6F3', minHeight: '100vh' },
        '::-webkit-scrollbar': { width: 6, height: 6 },
        '::-webkit-scrollbar-track': { background: 'transparent' },
        '::-webkit-scrollbar-thumb': { background: '#C8C0B0', borderRadius: 99 },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          background: 'rgba(254,252,248,0.96)',
          backdropFilter: 'blur(12px)',
          borderBottom: '0.5px solid #DDD8CE',
          color: '#1C1917',
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          background: '#FEFCF8',
          border: '0.5px solid #DDD8CE',
          borderRadius: 12,
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'none', background: '#FEFCF8' } },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999, fontWeight: 500, boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
        contained: { background: '#1B3A6B', '&:hover': { background: '#0F2449', boxShadow: 'none' } },
        outlined: { borderColor: '#C8C0B0', color: '#6B6560', '&:hover': { background: '#F0EBE0', borderColor: '#9C9589' } },
        sizeSmall: { fontSize: 12, padding: '5px 14px' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 999, fontWeight: 500, fontSize: 11 },
        colorDefault: { background: '#F0EBE0', color: '#6B6560', border: '0.5px solid #DDD8CE' },
        colorPrimary: { background: '#1B3A6B14', color: '#1B3A6B', border: '0.5px solid #1B3A6B28' },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: '999px !important', border: '0.5px solid #DDD8CE !important',
          color: '#9C9589', background: '#FEFCF8', fontWeight: 500, fontSize: 12,
          textTransform: 'none', padding: '5px 16px',
          '&.Mui-selected': { background: '#1B3A6B', color: '#FEFCF8', borderColor: '#1B3A6B !important' },
          '&:hover': { background: '#F0EBE0' },
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: { gap: 6, background: 'transparent', border: 'none' },
        grouped: { border: '0.5px solid #DDD8CE', margin: '0 !important' },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10, background: '#FEFCF8',
            '& fieldset': { borderColor: '#DDD8CE' },
            '&:hover fieldset': { borderColor: '#C8C0B0' },
            '&.Mui-focused fieldset': { borderColor: '#1B3A6B' },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: '#1B3A6B' },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: { root: { fontSize: 13 }, input: { fontSize: 13 } },
    },
    MuiInputLabel: {
      styleOverrides: { root: { fontSize: 13 } },
    },
    MuiSelect: {
      styleOverrides: { root: { borderRadius: 10, background: '#FEFCF8', fontSize: 13 } },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 16, border: '0.5px solid #DDD8CE', background: '#FEFCF8', margin: 16 },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { background: '#1C1917', color: '#F5F0E8', fontSize: 12, borderRadius: 8 },
        arrow: { color: '#1C1917' },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 999, background: '#E8E0D0', height: 6 },
        bar: { borderRadius: 999 },
      },
    },
    MuiSkeleton: {
      styleOverrides: { root: { background: '#E8E0D0' } },
    },
    MuiTabs: {
      styleOverrides: {
        root: { minHeight: 36 },
        indicator: { display: 'none' },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 34, minWidth: 'unset', px: 2, borderRadius: 8,
          fontSize: 13, fontWeight: 500, color: '#9C9589', textTransform: 'none',
          '&.Mui-selected': { color: '#1C1917', background: '#FEFCF8' },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: { background: '#FEFCF8', border: '0.5px solid #DDD8CE', borderRadius: 12, boxShadow: '0 4px 16px rgba(28,25,23,0.08)' },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: { fontSize: 13, '&:hover': { background: '#F0EBE0' }, '&.Mui-selected': { background: '#1B3A6B14', color: '#1B3A6B' } },
      },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: '#DDD8CE' } },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 12, fontSize: 13, boxShadow: '0 8px 24px rgba(28,25,23,0.18)', alignItems: 'flex-start' },
        message: { padding: '2px 0' },
        colorSuccess: { background: '#1A6B45', color: '#FEFCF8' },
        colorError: { background: '#8B2020', color: '#FEFCF8' },
        colorInfo: { background: '#1B3A6B', color: '#FEFCF8' },
      },
    },
    MuiAlertTitle: {
      styleOverrides: { root: { fontSize: 13, fontWeight: 600 } },
    },
  },
})
