'use client'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import WorkOutlinedIcon from '@mui/icons-material/WorkOutlined'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined'
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined'
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import MovieOutlinedIcon from '@mui/icons-material/MovieOutlined'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import Link from 'next/link'
import { getCategoryById, formatCurrency, formatDate } from '@/lib/finance'
import type { Transaction } from '@/types/finance'

const ICON_MAP: Record<string, React.ReactNode> = {
  trabajo:         <WorkOutlinedIcon sx={{ fontSize: 17 }} />,
  inversiones:     <TrendingUpIcon sx={{ fontSize: 17 }} />,
  vivienda:        <HomeOutlinedIcon sx={{ fontSize: 17 }} />,
  alimentacion:    <ShoppingCartOutlinedIcon sx={{ fontSize: 17 }} />,
  transporte:      <DirectionsCarOutlinedIcon sx={{ fontSize: 17 }} />,
  entretenimiento: <MovieOutlinedIcon sx={{ fontSize: 17 }} />,
  salud:           <LocalHospitalOutlinedIcon sx={{ fontSize: 17 }} />,
  educacion:       <SchoolOutlinedIcon sx={{ fontSize: 17 }} />,
  dispositivos:    <PhoneIphoneOutlinedIcon sx={{ fontSize: 17 }} />,
  default:         <MoreHorizIcon sx={{ fontSize: 17 }} />,
}

export function RecentTransactions({ transactions }: { transactions: Transaction[] | undefined }) {
  return (
    <Card elevation={0}>
      <CardContent sx={{ p: '16px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#1C1917' }}>Movimientos recientes</Typography>
          <Link href="/transactions" style={{ textDecoration: 'none' }}>
            <Typography sx={{ fontSize: 12, color: '#9C9589', '&:hover': { color: '#1B3A6B' }, transition: 'color .15s', cursor: 'pointer' }}>
              Ver todos →
            </Typography>
          </Link>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {!transactions
            ? Array.from({ length: 5 }).map((_, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.25, py: 1.1 }}>
                  <Skeleton variant="rounded" width={32} height={32} sx={{ borderRadius: '9px', flexShrink: 0 }} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="60%" sx={{ fontSize: 12 }} />
                    <Skeleton variant="text" width="35%" sx={{ fontSize: 11 }} />
                  </Box>
                  <Skeleton variant="text" width={60} sx={{ fontSize: 13 }} />
                </Box>
              ))
            : transactions.slice(0, 6).map((tx, i) => {
                const cat = getCategoryById(tx.categoryId)
                const isIncome = tx.type === 'income'
                const icon = ICON_MAP[tx.categoryId] ?? ICON_MAP.default
                return (
                  <Box key={tx.id ?? i}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, py: 1.1 }}>
                      <Box sx={{
                        width: 32, height: 32, borderRadius: '9px', flexShrink: 0,
                        background: isIncome ? '#E8F5EE' : '#1B3A6B14',
                        color: isIncome ? '#1A6B45' : '#1B3A6B',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {icon}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#1C1917', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {tx.description}
                        </Typography>
                        <Typography sx={{ fontSize: 11, color: '#9C9589' }}>
                          {formatDate(tx.date)} · {cat?.name ?? tx.categoryId}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: 13, fontWeight: 500, color: isIncome ? '#1A6B45' : '#8B2020', flexShrink: 0 }}>
                        {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                      </Typography>
                    </Box>
                    {i < Math.min(transactions.length, 6) - 1 && (
                      <Box sx={{ borderBottom: '0.5px solid #DDD8CE' }} />
                    )}
                  </Box>
                )
              })
          }
        </Box>
      </CardContent>
    </Card>
  )
}
