import GameShell from '../components/GameShell'

export default function Page() {
  return (
    <main>
      <h1 style={{ marginBottom: 8 }}>Farcaster Sudoku Frame</h1>
      <p style={{ marginTop: 0, marginBottom: 12 }}>Play a 9x9 Sudoku. Click "New Puzzle" to generate a new board.</p>
      <GameShell />
      <footer style={{ marginTop: 20, fontSize: 12, color: '#555' }}>
        Exported as mini-app for Farcaster. Manifest available at <code>/manifest.json</code>
      </footer>
    </main>
  )
}
