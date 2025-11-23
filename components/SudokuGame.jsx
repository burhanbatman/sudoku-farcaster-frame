'use client';
import { useEffect, useMemo, useState } from 'react';

/**
 * Simple Sudoku generator + UI.
 * - Generates a full solution via backtracking
 * - Removes numbers to produce a puzzle (moderate difficulty)
 * - Allows user input, checking, and scoring saved to localStorage
 */

function range(n){ return Array.from({length:n},(_,i)=>i) }

function copy(board){
  return board.map(row=>row.slice())
}

function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]] }
  return arr
}

// Check validity for placement
function isValid(board, r, c, val){
  for(let i=0;i<9;i++){ if(board[r][i]===val) return false; if(board[i][c]===val) return false }
  const br = Math.floor(r/3)*3, bc = Math.floor(c/3)*3
  for(let i=0;i<3;i++) for(let j=0;j<3;j++) if(board[br+i][bc+j]===val) return false
  return true
}

// Backtracking to fill board
function solveBoard(board){
  for(let r=0;r<9;r++){
    for(let c=0;c<9;c++){
      if(board[r][c]===0){
        for(let v=1;v<=9;v++){
          if(isValid(board,r,c,v)){
            board[r][c]=v
            if(solveBoard(board)) return true
            board[r][c]=0
          }
        }
        return false
      }
    }
  }
  return true
}

function generateFullSolution(){
  const board = Array.from({length:9},()=>Array(9).fill(0))
  // fill diagonal 3x3 boxes first with random numbers to speed up
  for(let k=0;k<3;k++){
    const nums = shuffle([1,2,3,4,5,6,7,8,9].slice())
    const br = k*3, bc = k*3
    for(let i=0;i<3;i++) for(let j=0;j<3;j++) board[br+i][bc+j]=nums[i*3+j]
  }
  solveBoard(board)
  return board
}

function makePuzzle(solution, removals=45){
  const puzzle = copy(solution)
  const cells = shuffle(range(81))
  let removed=0, idx=0
  while(removed<removals && idx<cells.length){
    const cell = cells[idx++]; const r=Math.floor(cell/9), c=cell%9
    const backup = puzzle[r][c]; puzzle[r][c]=0
    // optionally, we could check for unique solution; skipping for speed but removals moderate
    removed++
  }
  return puzzle
}

function formatBoard(board){ return board.map(r=>r.join('')).join('\n') }

export default function SudokuGame({ onUpdateBest }){
  const [solution, setSolution] = useState(null)
  const [puzzle, setPuzzle] = useState(null)
  const [board, setBoard] = useState(null)
  const [startTime, setStartTime] = useState(null)
  const [message, setMessage] = useState('')

  function newGame(){
    const sol = generateFullSolution()
    const puz = makePuzzle(sol, 45) // moderate: 45 removals
    setSolution(sol); setPuzzle(puz); setBoard(puz.map(r=>r.slice())); setStartTime(Date.now()); setMessage('')
  }

  useEffect(()=>{ newGame() }, [])

  function updateCell(r,c,val){
    if(!board) return
    const n = val === '' ? 0 : Math.max(0, Math.min(9, parseInt(val||'0')))
    const nb = copy(board); nb[r][c]=n; setBoard(nb)
  }

  function checkSolution(){
    if(!solution || !board) return
    for(let r=0;r<9;r++) for(let c=0;c<9;c++){
      if(board[r][c]!==solution[r][c]){
        setMessage('There are mistakes — keep trying!'); return
      }
    }
    const time = Math.round((Date.now()-startTime)/1000)
    setMessage('Solved! Time: '+time+'s')
    try{
      const prev = JSON.parse(localStorage.getItem('sudoku_best')||'null')
      if(!prev || time < prev) { localStorage.setItem('sudoku_best', JSON.stringify(time)); onUpdateBest(time) }
    }catch(e){}
  }

  function revealSolution(){
    if(!solution) return
    setBoard(copy(solution)); setMessage('Solution revealed')
  }

  if(!board) return <div>Loading...</div>

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <button onClick={newGame}>New Puzzle</button>
        <button onClick={checkSolution}>Check</button>
        <button onClick={revealSolution}>Reveal</button>
        <button onClick={()=>{ localStorage.removeItem('sudoku_best'); onUpdateBest(null); }}>Reset Best</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 34px)', gap: 4, background: '#888', padding: 6, width: 9*34 + 8*4 + 12 }}>
        {board.map((row,r)=> row.map((val,c)=> {
          const isGiven = puzzle[r][c] !== 0
          return (
            <input key={r+'-'+c}
              value={val===0 ? '' : val}
              onChange={(e)=> updateCell(r,c,e.target.value.replace(/[^0-9]/g,''))}
              readOnly={isGiven}
              style={{
                width: 34, height:34, textAlign:'center', fontSize:16,
                background: isGiven ? '#eee' : '#fff', border: '1px solid #444',
                boxSizing: 'border-box', padding:0
              }}
            />
          )
        }))}
      </div>

      <div style={{ marginTop: 10, color: '#333' }}>{message}</div>
      <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>Tip: click New Puzzle to generate another board.</div>
    </div>
  )
}
