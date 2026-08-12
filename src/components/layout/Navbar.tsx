'use client'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import MenuIcon from '@mui/icons-material/Menu'
import AddIcon from '@mui/icons-material/Add'
import { BrandMark, BRAND_ACCENT_TEXT_SX, BRAND_WORDMARK_CLASS } from './BrandMark'
import Link from 'next/link'
import { getPrevMonths, formatMonth } from '@/lib/finance'
import { useMemo } from 'react'
import { useMonth } from '@/hooks/useMonth'

interface NavbarProps {
  onAddTransaction: () => void
  onMenuClick: () => void
}

export function Navbar({ onAddTransaction, onMenuClick }: NavbarProps) {
  const { month, setMonth } = useMonth()
  const months = useMemo(() => getPrevMonths(12), [])

  return (
    <AppBar position="sticky">
      <Toolbar sx={{ height: 58, minHeight: '58px !important', px: { xs: 1.5, sm: 2, md: 2.5 }, justifyContent: 'space-between', gap: { xs: 0.75, sm: 2 } }}>
        {/* Mobile menu + brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 }, minWidth: 0 }}>
          <IconButton
            onClick={onMenuClick}
            sx={{ display: { xs: 'inline-flex', md: 'none' }, color: '#1C1917', flexShrink: 0 }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            component={Link}
            href="/"
            sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1, textDecoration: 'none', minWidth: 0 }}
          >
            <BrandMark size={30} />
            <Typography
              className={BRAND_WORDMARK_CLASS}
              sx={{
                fontSize: 18, fontWeight: 700, color: '#1B3A6B', letterSpacing: '-0.2px',
                whiteSpace: 'nowrap', overflow: 'hidden',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Finance<Box component="span" sx={BRAND_ACCENT_TEXT_SX}>Flow</Box>
            </Typography>
          </Box>
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.75, sm: 1.25 }, ml: 'auto', flexShrink: 0 }}>
          <Select
            size="small"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            sx={{
              height: 34, fontSize: 12, minWidth: { xs: 108, sm: 140, md: 160 },
              '& .MuiSelect-select': { py: '6px' },
            }}
          >
            {months.map((m) => (
              <MenuItem key={m} value={m}>{formatMonth(m)}</MenuItem>
            ))}
          </Select>
          <Button
            variant="contained"
            size="small"
            onClick={onAddTransaction}
            sx={{
              height: 34, whiteSpace: 'nowrap', mr: { xs: 0, md: 0.75 },
              minWidth: 0, px: { xs: 1, sm: 1.75 },
            }}
          >
            <AddIcon sx={{ fontSize: 18, mr: { xs: 0, sm: 0.5 } }} />
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Agregar</Box>
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
