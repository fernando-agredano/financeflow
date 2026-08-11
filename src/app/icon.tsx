import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 26,
          fontWeight: 800,
          letterSpacing: '-1px',
          color: '#FEFCF8',
          WebkitTextStroke: '1.5px #1B3A6B',
        }}
      >
        F
      </div>
    ),
    { ...size }
  )
}
