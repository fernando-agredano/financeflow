'use client'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useEffect, useState } from 'react'
import { useFilteredTransactions, txActions } from '@/hooks/useFinance'
import { CATEGORIES, formatCurrency, formatDate, exportToCSV, exportToPDF } from '@/lib/finance'
import type { FilterState, Transaction } from '@/types/finance'

const DEFAULT_FILTERS: FilterState = { type: 'all', categoryId: null, dateFrom: null, dateTo: null, search: '' }
const PAGE_SIZE = 12
const TABLE_COLUMNS = '90px 1fr 120px 100px 60px'
const NAVBAR_HEIGHT = 58

const pageButtonSx = {
  color: '#6B6560', border: '0.5px solid #DDD8CE',
  '&:hover': { background: '#F0EBE0' },
  '&.Mui-disabled': { color: '#DDD8CE', border: '0.5px solid #F0EBE0' },
}

export default function TransactionsPage() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)
  const transactions = useFilteredTransactions(filters)

  useEffect(() => { setPage(1) }, [filters])

  const total = transactions?.length ?? 0
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pageTransactions = transactions?.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE) ?? []
  const rangeStart = total ? (currentPage - 1) * PAGE_SIZE + 1 : 0
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, total)

  return (
    <Box
      sx={{
        maxWidth: 1600, mx: 'auto', px: { xs: 2, md: 3 }, py: { xs: 2, sm: 3 },
        height: `calc(100vh - ${NAVBAR_HEIGHT}px)`, overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, rowGap: 1, mb: { xs: 1.5, sm: 2.5 }, flexShrink: 0 }}>
        <SwapHorizOutlinedIcon sx={{ color: '#1B3A6B' }} />
        <Typography sx={{ fontSize: 18, fontWeight: 500, color: '#1C1917', flex: 1, minWidth: 0 }}>Movimientos</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined" size="small"
            startIcon={<FileDownloadOutlinedIcon />}
            onClick={() => transactions && exportToCSV(transactions)}
            sx={{ minWidth: 0, px: { xs: 1.25, sm: 1.75 }, '& .MuiButton-startIcon': { mr: { xs: 0, sm: 0.75 } } }}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Exportar CSV</Box>
          </Button>
          <Button
            variant="outlined" size="small"
            startIcon={<PictureAsPdfOutlinedIcon />}
            onClick={() => transactions && exportToPDF(transactions, 'Movimientos')}
            sx={{ minWidth: 0, px: { xs: 1.25, sm: 1.75 }, '& .MuiButton-startIcon': { mr: { xs: 0, sm: 0.75 } } }}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Exportar PDF</Box>
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Card elevation={0} sx={{ mb: { xs: 1.5, sm: 2 }, flexShrink: 0 }}>
        <CardContent sx={{ p: { xs: '12px !important', sm: '14px !important' } }}>
          <Box sx={{ display: 'flex', gap: { xs: 1, sm: 1.5 }, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              size="small" placeholder="Buscar…" value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchOutlinedIcon sx={{ fontSize: 17, color: '#9C9589' }} /></InputAdornment> } }}
              sx={{ minWidth: { xs: '100%', sm: 200 }, flex: { xs: '1 1 100%', sm: '0 1 auto' } }}
            />
            <FormControl size="small" sx={{ minWidth: { xs: 110, sm: 130 }, flex: { xs: 1, sm: '0 1 auto' } }}>
              <InputLabel>Tipo</InputLabel>
              <Select label="Tipo" value={filters.type} onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value as any }))}>
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="income">Ingresos</MenuItem>
                <MenuItem value="expense">Gastos</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: { xs: 120, sm: 150 }, flex: { xs: 1, sm: '0 1 auto' } }}>
              <InputLabel>Categoría</InputLabel>
              <Select label="Categoría" value={filters.categoryId ?? ''} onChange={(e) => setFilters((f) => ({ ...f, categoryId: e.target.value || null }))}>
                <MenuItem value="">Todas</MenuItem>
                {CATEGORIES.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField size="small" type="date" label="Desde" slotProps={{ inputLabel: { shrink: true } }}
              sx={{ minWidth: { xs: 'calc(50% - 4px)', sm: 'auto' }, flex: { xs: '1 1 auto', sm: '0 1 auto' } }}
              onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value || null }))} />
            <TextField size="small" type="date" label="Hasta" slotProps={{ inputLabel: { shrink: true } }}
              sx={{ minWidth: { xs: 'calc(50% - 4px)', sm: 'auto' }, flex: { xs: '1 1 auto', sm: '0 1 auto' } }}
              onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value || null }))} />
            <Button variant="outlined" size="small" onClick={() => setFilters(DEFAULT_FILTERS)} sx={{ flex: { xs: '1 1 100%', sm: '0 1 auto' } }}>Limpiar</Button>
          </Box>
        </CardContent>
      </Card>

      {/* Table */}
      <Card elevation={0} sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ p: '0 !important', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ display: { xs: 'none', sm: 'grid' }, gridTemplateColumns: TABLE_COLUMNS, gap: 1, px: 2, py: 1.25, borderBottom: '0.5px solid #DDD8CE', flexShrink: 0 }}>
            {['Fecha', 'Descripción', 'Categoría', 'Monto', ''].map((h) => (
              <Typography key={h} sx={{ fontSize: 11, fontWeight: 600, color: '#9C9589', letterSpacing: '.2px' }}>{h}</Typography>
            ))}
          </Box>

          {/* Rows — flexes to fill the remaining height; overflow is a safety net for very short viewports */}
          <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
            {!pageTransactions.length
              ? <Box sx={{ py: 8, textAlign: 'center' }}>
                  <Typography sx={{ fontSize: 14, color: '#9C9589' }}>Sin movimientos</Typography>
                </Box>
              : pageTransactions.map((tx: Transaction, i: number) => {
                  const isIncome = tx.type === 'income'
                  const cat = CATEGORIES.find((c) => c.id === tx.categoryId)
                  return (
                    <Box key={tx.id ?? i} sx={{ borderBottom: '0.5px solid #F0EBE0', '&:hover': { background: '#F8F4EC' }, '&:last-child': { borderBottom: 'none' } }}>
                      {/* Desktop/tablet row */}
                      <Box sx={{ display: { xs: 'none', sm: 'grid' }, gridTemplateColumns: TABLE_COLUMNS, gap: 1, px: 2, py: 1.25, alignItems: 'center' }}>
                        <Typography sx={{ fontSize: 12, color: '#9C9589' }}>{formatDate(tx.date)}</Typography>
                        <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#1C1917', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.description}</Typography>
                        <Chip
                          label={cat?.name ?? tx.categoryId}
                          size="small"
                          sx={{ fontSize: 10, height: 20, maxWidth: 110, background: `${cat?.color ?? '#9C9589'}18`, color: cat?.color ?? '#6B6560', border: `0.5px solid ${cat?.color ?? '#9C9589'}40`, fontWeight: 500 }}
                        />
                        <Typography sx={{ fontSize: 13, fontWeight: 500, color: isIncome ? '#059669' : '#8B2020' }}>
                          {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                        </Typography>
                        <Tooltip title="Eliminar" arrow>
                          <IconButton size="small" onClick={() => tx.id && txActions.delete(tx.id)} sx={{ p: 0.5, color: '#C8C0B0', '&:hover': { color: '#8B2020' } }}>
                            <DeleteOutlineOutlinedIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>

                      {/* Mobile card row */}
                      <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexDirection: 'column', gap: 0.6, px: 2, py: 1.25 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                          <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#1C1917', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>
                            {tx.description}
                          </Typography>
                          <Typography sx={{ fontSize: 13, fontWeight: 600, color: isIncome ? '#059669' : '#8B2020', flexShrink: 0, whiteSpace: 'nowrap' }}>
                            {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0 }}>
                            <Chip
                              label={cat?.name ?? tx.categoryId}
                              size="small"
                              sx={{ fontSize: 10, height: 20, maxWidth: 110, background: `${cat?.color ?? '#9C9589'}18`, color: cat?.color ?? '#6B6560', border: `0.5px solid ${cat?.color ?? '#9C9589'}40`, fontWeight: 500 }}
                            />
                            <Typography sx={{ fontSize: 11, color: '#9C9589', whiteSpace: 'nowrap' }}>{formatDate(tx.date)}</Typography>
                          </Box>
                          <IconButton size="small" onClick={() => tx.id && txActions.delete(tx.id)} sx={{ p: 0.5, color: '#C8C0B0', '&:hover': { color: '#8B2020' }, flexShrink: 0 }}>
                            <DeleteOutlineOutlinedIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  )
                })
            }
          </Box>

          {/* Pagination */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.25, borderTop: '0.5px solid #DDD8CE', flexShrink: 0 }}>
            <Typography sx={{ fontSize: 12, color: '#9C9589' }}>
              {total ? `${rangeStart}–${rangeEnd} de ${total}` : 'Sin movimientos'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton size="small" disabled={currentPage <= 1} onClick={() => setPage((p) => p - 1)} sx={pageButtonSx}>
                <ChevronLeftIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <Typography sx={{ fontSize: 12, color: '#6B6560', minWidth: 76, textAlign: 'center' }}>
                Página {currentPage} de {pageCount}
              </Typography>
              <IconButton size="small" disabled={currentPage >= pageCount} onClick={() => setPage((p) => p + 1)} sx={pageButtonSx}>
                <ChevronRightIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
