'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/layout/Providers'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { TransactionModal } from '@/components/transactions/TransactionModal'
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'

const inter = Inter({ subsets: ['latin'] })
const SIDEBAR_STORAGE_KEY = 'ff-sidebar-collapsed'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    if (window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === '1') setSidebarCollapsed(true)
  }, [])

  function toggleSidebar() {
    setSidebarCollapsed((prev) => {
      const next = !prev
      window.localStorage.setItem(SIDEBAR_STORAGE_KEY, next ? '1' : '0')
      return next
    })
  }

  return (
    <html lang="es">
      <head><title>FinanceFlow</title></head>
      <body className={inter.className}>
        <Providers>
          <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            <Sidebar
              collapsed={sidebarCollapsed}
              onToggleCollapse={toggleSidebar}
              mobileOpen={mobileNavOpen}
              onMobileClose={() => setMobileNavOpen(false)}
            />
            <Box sx={{ flex: 1, minWidth: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Navbar
                onAddTransaction={() => setModalOpen(true)}
                onMenuClick={() => setMobileNavOpen(true)}
              />
              <Box component="main" sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>{children}</Box>
            </Box>
          </Box>
          <TransactionModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </Providers>
      </body>
    </html>
  )
}
