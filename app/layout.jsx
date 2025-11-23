export const metadata = {
  title: 'Farcaster Sudoku Frame',
  description: 'Play Sudoku inside Farcaster'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'Arial, sans-serif', padding: 16 }}>{children}</body>
    </html>
  )
}
