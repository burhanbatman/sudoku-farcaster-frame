'use client';
import SudokuGame from './SudokuGame';
import { useEffect, useState } from 'react';

export default function GameShell() {
  const [best, setBest] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sudoku_best') || 'null') } catch { return null }
  });

  useEffect(() => {
    // sync best score from localStorage in client
    try { setBest(JSON.parse(localStorage.getItem('sudoku_best') || 'null')) } catch {}
  }, [])

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <button onClick={() => window.location.reload()} title="Reload">Reload</button>
        <a href="/manifest.json" target="_blank" rel="noreferrer">Open Manifest</a>
        <div style={{ marginLeft: 'auto', color: '#333' }}>Best: {best ? best : '-'}</div>
      </div>
      <SudokuGame onUpdateBest={(v)=>{ localStorage.setItem('sudoku_best', JSON.stringify(v)); setBest(v); }} />
    </div>
  )
}
