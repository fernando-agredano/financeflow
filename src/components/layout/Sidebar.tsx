'use client'

import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { BrandMark, BRAND_ACCENT_TEXT_SX, BRAND_WORDMARK_CLASS } from './BrandMark'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined'
import TrackChangesOutlinedIcon from '@mui/icons-material/TrackChangesOutlined'
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const SIDEBAR_WIDTH = 276
export const SIDEBAR_WIDTH_COLLAPSED = 92

// Fixed-size slot every icon (brand + nav + toggle) sits in. Because this
// value never changes between collapsed/expanded states, and rows never
// toggle their own padding/justify-content, icons stay pixel-locked in
// place — only the label text next to them fades in/out.
const ICON_SLOT = 44
const SIDE_PAD = 3 // MUI spacing unit -> 24px, same on both sides, constant in both states

const NAV_ITEMS = [
  { href: '/',              label: 'Dashboard',    icon: DashboardOutlinedIcon },
  { href: '/transactions',  label: 'Movimientos',  icon: SwapHorizOutlinedIcon },
  { href: '/budgets',       label: 'Presupuestos', icon: TrackChangesOutlinedIcon },
  { href: '/reports',       label: 'Reportes',     icon: BarChartOutlinedIcon },
]

interface SidebarContentProps {
  collapsed: boolean
  onToggleCollapse?: () => void
  showCollapseToggle: boolean
}

function SidebarContent({ collapsed, onToggleCollapse, showCollapseToggle }: SidebarContentProps) {
  const pathname = usePathname()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Brand + collapse toggle */}
      <Box sx={{ display: 'flex', alignItems: 'center', minHeight: 58, px: SIDE_PAD }}>
        {/* Logo slot: shows the mark when expanded, crossfades to an "expand"
            button in the exact same spot when collapsed — so nothing shifts. */}
        <Box sx={{ position: 'relative', width: ICON_SLOT, minWidth: ICON_SLOT, height: 34, flexShrink: 0 }}>
          <Box
            component={Link}
            href="/"
            sx={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: collapsed ? 0 : 1, pointerEvents: collapsed ? 'none' : 'auto',
              transition: 'opacity 0.15s ease',
            }}
          >
            <BrandMark size={34} />
          </Box>
          {showCollapseToggle && (
            <Tooltip title="Expandir" placement="right" arrow>
              <IconButton
                size="small"
                onClick={onToggleCollapse}
                sx={{
                  position: 'absolute', inset: 0, margin: 'auto', width: 34, height: 34,
                  color: '#9C9589', '&:hover': { background: '#F0EBE0', color: '#1B3A6B' },
                  opacity: collapsed ? 1 : 0, pointerEvents: collapsed ? 'auto' : 'none',
                  transition: 'opacity 0.15s ease',
                }}
              >
                <ChevronRightIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Typography
          className={BRAND_WORDMARK_CLASS}
          sx={{
            fontSize: 19, fontWeight: 700, color: '#1B3A6B', letterSpacing: '-0.2px', flex: 1,
            whiteSpace: 'nowrap', overflow: 'hidden', minWidth: 0,
            opacity: collapsed ? 0 : 1,
            transition: 'opacity 0.12s ease',
          }}
        >
          Finance<Box component="span" sx={BRAND_ACCENT_TEXT_SX}>Flow</Box>
        </Typography>

        {showCollapseToggle && !collapsed && (
          <Tooltip title="Contraer" placement="right" arrow>
            <IconButton
              size="small"
              onClick={onToggleCollapse}
              sx={{ color: '#9C9589', flexShrink: 0, '&:hover': { background: '#F0EBE0', color: '#1B3A6B' } }}
            >
              <ChevronLeftIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Nav items */}
      <Box component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, px: SIDE_PAD, mt: 1, flex: 1 }}>
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href
          const Icon = item.icon
          const link = (
            <Box
              component={Link}
              href={item.href}
              sx={{
                position: 'relative',
                display: 'flex', alignItems: 'center',
                minHeight: 46,
                borderRadius: '10px',
                textDecoration: 'none',
                color: active ? '#1B3A6B' : '#6B6560',
                background: active ? '#1B3A6B14' : 'transparent',
                transition: 'background 0.15s ease, color 0.15s ease',
                '&:hover': { background: active ? '#1B3A6B14' : '#F0EBE0' },
                '&::before': {
                  content: '""',
                  position: 'absolute', left: '-18px', top: '22%', bottom: '22%', width: '3px',
                  borderRadius: '0 3px 3px 0',
                  background: active ? '#1B3A6B' : 'transparent',
                  transition: 'background 0.15s ease',
                },
              }}
            >
              <Box sx={{ width: ICON_SLOT, minWidth: ICON_SLOT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon sx={{ fontSize: 21 }} />
              </Box>
              <Typography
                sx={{
                  fontSize: 14.5, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', minWidth: 0,
                  opacity: collapsed ? 0 : 1,
                  transition: 'opacity 0.12s ease',
                }}
              >
                {item.label}
              </Typography>
            </Box>
          )
          return collapsed ? (
            <Tooltip key={item.href} title={item.label} placement="right" arrow>
              {link}
            </Tooltip>
          ) : (
            <Box key={item.href}>{link}</Box>
          )
        })}
      </Box>
    </Box>
  )
}

interface SidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
  mobileOpen: boolean
  onMobileClose: () => void
}

export function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onMobileClose }: SidebarProps) {
  return (
    <>
      {/* Desktop persistent sidebar */}
      <Box
        component="aside"
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'sticky', top: 0, alignSelf: 'flex-start',
          height: '100vh', flexShrink: 0,
          width: collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH,
          background: '#FEFCF8',
          borderRight: '0.5px solid #DDD8CE',
          overflow: 'hidden',
          transition: collapsed
            ? 'width 190ms cubic-bezier(0.4, 0, 0.6, 1)'
            : 'width 225ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <SidebarContent collapsed={collapsed} onToggleCollapse={onToggleCollapse} showCollapseToggle />
      </Box>

      {/* Mobile overlay drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        sx={{ display: { xs: 'block', md: 'none' } }}
        slotProps={{ paper: { sx: { width: SIDEBAR_WIDTH, background: '#FEFCF8' } } }}
      >
        <Box onClick={onMobileClose}>
          <SidebarContent collapsed={false} showCollapseToggle={false} />
        </Box>
      </Drawer>
    </>
  )
}
