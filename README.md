# Farcaster Sudoku Frame (Next.js 14)

This is a minimal Next.js 14 (App Router) project prepared as a Farcaster mini app "frame".
It includes:
- A playable 9x9 Sudoku with generator (new puzzle on button click)
- Frame buttons and score saving (localStorage)
- `public/manifest.json` for Farcaster usage

How to use:
1. Extract and push this repo to GitHub.
2. Connect the repo to Vercel, select Production branch (`main`), and deploy.
3. After deploy, find your production domain on Vercel (e.g. https://your-app.vercel.app).
4. Use the manifest URL in Farcaster: `https://your-app.vercel.app/manifest.json`

Notes:
- Client-only interactive components are marked with `'use client'` to avoid Server Component errors.
- If you want the manifest at `/manifest.js`, use `/manifest.js` as well (included).
