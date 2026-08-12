import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  const stroke = '#FFFFFF'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            left: 9,
            top: 4,
            width: 6,
            height: 24,
            background: stroke,
            borderRadius: '0 0 3px 3px',
          }}
        />
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            left: 9,
            top: 4,
            width: 15,
            height: 6,
            background: stroke,
            borderRadius: '0 3px 3px 0',
          }}
        />
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            left: 9,
            top: 13,
            width: 12,
            height: 6,
            background: stroke,
            borderRadius: '0 3px 3px 0',
          }}
        />
      </div>
    ),
    { ...size }
  )
}
