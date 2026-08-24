# Blueprint 3D Studio

Main application repository for Blueprint 3D Studio.

## Current version

**v0.15.0**

The recovered v0.13 application source is preserved in `src/source/` as verified Brotli/Base64 chunks. `scripts/restore-source.cjs` reconstructs `src/App.jsx` and `src/styles.css`, then automatically applies the checked-in v0.14 and v0.15 upgrades.

### v0.15 highlights

- Keeps the v0.14 detect-and-strengthen-all-lines workflow before wall classification.
- Keeps dimension and annotation lines visible for review without turning them into structural 3D walls.
- Adds the editable 16 ft double garage door to Architecture > Doors.
- Renders the garage opening in 3D as a sectional overhead door instead of a generic hinged slab.
- Preserves continuous wall material above doors and windows in the generated 3D wall geometry.
- Keeps project-wide Undo/Redo, multi-level editing, AI wall classification, AI kitchen layout, room furnishing and 2D/3D views.

## Windows quick start

1. Install Node.js if it is not already installed.
2. Double-click `INSTALL.bat` once.
3. Double-click `RUN.bat` whenever you want to launch Blueprint 3D Studio.

`RUN.bat` restores the canonical source and applies the latest upgrades before starting Vite.

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
- `scripts/upgrade-v014.cjs` — detected-line and garage catalog upgrade
- `scripts/upgrade-v015.cjs` — sectional garage-door 3D upgrade
- `INSTALL.bat` — Windows setup
- `RUN.bat` — Windows launcher

Cabinet model repositories remain separate from this main application repository.
