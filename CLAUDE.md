# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `yarn start` (runs on http://localhost:3000)
- **Build:** `yarn build`
- **Tests:** `yarn test` (launches Jest in watch mode)
- **Run single test:** `yarn test -- --testPathPattern=<pattern>` (e.g. `yarn test -- --testPathPattern=App`)

## Architecture

Create React App (react-scripts 3.4.1) project using React 16 with hooks. No TypeScript, no routing library.

The app is a single-page memory card matching game with dog photos. UI text is in **Portuguese (pt-BR)**.

### Structure

- `src/index.js` — React entry point, renders `<App />`
- `src/App.js` — Renders the `<Game />` component
- `src/pages/index.jsx` — Main game logic: `Game`, `Timer`, `Backdrop` components (all in one file)
- `src/pages/colors.js` — Color name list used for randomizing the score display color
- `src/pages/index.css` — All styling (no CSS modules, no CSS-in-JS)
- `src/img/` — Dog photos (Unsplash JPGs); first 8 are loaded via `require.context` as card faces
- `src/img/backImg/cardBack.jpg` — Card back image

### Game mechanics

8 unique dog images are duplicated to make 16 cards, shuffled into a grid. Players flip two cards at a time; matching pairs stay face-up with a gold border. A timer runs until all 8 pairs are found, then an end-game overlay shows the elapsed time with a replay button.
