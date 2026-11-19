'use client'

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', display: 'grid', placeItems: 'center', minHeight: '100dvh', margin: 0 }}>
        <div style={{ textAlign: 'center', padding: 24 }}>
          <h1 style={{ fontSize: 28, margin: 0 }}>Venuze is having a moment</h1>
          <p style={{ color: '#616161' }}>Something went wrong while loading the app.</p>
          <button
            onClick={reset}
            style={{ background: '#ff5037', color: '#fff', border: 0, borderRadius: 10, padding: '12px 24px', fontWeight: 600, cursor: 'pointer' }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
