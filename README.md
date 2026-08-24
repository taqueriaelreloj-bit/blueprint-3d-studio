# Blueprint 3D Studio

Main application repository for Blueprint 3D Studio.

## Current version

**v0.14.0**

The recovered v0.13 application source is preserved in `src/source/` as verified Brotli/Base64 chunks. `scripts/restore-source.cjs` reconstructs `src/App.jsx` and `src/styles.css`, then automatically applies the checked-in v0.14 upgrade.

### v0.14 highlights

- Detects and strengthens all blueprint lines before structural classification.
- Lets you show/hide the complete detected-line overlay during wall review.
- Keeps dimension/annotation geometry visible for review without converting it into 3D walls.
- Adds a dedicated editable 16 ft double garage door to Architecture > Doors.
- Keeps global Undo/Redo, multi-level editing, AI wall classification, AI kitchen layout, room furnishing and 2D/3D views from v0.13.

## Windows quick start

1. Install Node.js if it is not already installed.
2. Double-click `INSTALL.bat` once.
3. Double-click `RUN.bat` whenever you want to launch Blueprint 3D Studio.

`RUN.bat` restores the canonical source and applies the latest upgrade before starting Vite.

## Development

```bash
node scripts/restore-source.cjs
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Main files

- `src/main.jsx` — React entry point
- `src/App.jsx` — reconstructed and upgraded automatically
- `src/styles.css` — reconstructed and upgraded automatically
- `src/source/` — canonical recovered v0.13 source chunks
- `scripts/restore-source.cjs` — source reconstruction utility
- `scripts/upgrade-v014.cjs` — v0.14 application upgrade
- `INSTALL.bat` — Windows setup
- `RUN.bat` — Windows launcher

Cabinet model repositories remain separate from this main application repository.
