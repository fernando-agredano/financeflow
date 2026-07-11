'use client'

import Box from '@mui/material/Box'

interface BrandMarkProps {
  size?: number
}

/** The FinanceFlow mark: a flat navy tile with a bold "F" monogram. */
export function BrandMark({ size = 34 }: BrandMarkProps) {
  const fontSize = Math.round(size * 0.5)

  return (
    <Box
      sx={{
        width: size, height: size, borderRadius: size >= 32 ? '11px' : '9px',
        background: '#1B3A6B',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}
    >
      <Box
        component="span"
        aria-hidden="true"
        sx={{ fontSize, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.5px', color: '#FEFCF8' }}
      >
        F
      </Box>
    </Box>
  )
}

export const BRAND_ACCENT_TEXT_SX = {
  fontWeight: 700,
  color: '#1B3A6B',
} as const
