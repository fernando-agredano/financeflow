'use client'

import { Quicksand } from 'next/font/google'

const quicksand = Quicksand({ subsets: ['latin'], weight: ['600', '700'] })

interface BrandMarkProps {
  size?: number
}

/**
 * The FinanceFlow mark: a rising flow line with a highlighted peak — no
 * filled tile behind it, just the line itself against the page background.
 */
export function BrandMark({ size = 34 }: BrandMarkProps) {
  const strokeWidth = size * 0.1
  const dotRadius = size * 0.1

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 34 34"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M4 25C8 25 9 17 13 17C16.5 17 17.5 22 21.5 22C25 22 27 13 30 7"
        stroke="#1B3A6B"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={30} cy={7} r={dotRadius} fill="#059669" />
    </svg>
  )
}

export const BRAND_WORDMARK_CLASS = quicksand.className

export const BRAND_ACCENT_TEXT_SX = {
  fontWeight: 700,
  color: '#059669',
} as const
