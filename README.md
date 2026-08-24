# Blueprint 3D Studio

Main application repository for Blueprint 3D Studio.

## Current version

**v0.16.0**

The recovered v0.13 application source is preserved in `src/source/` as verified Brotli/Base64 chunks. `scripts/restore-source.cjs` reconstructs `src/App.jsx` and `src/styles.css`, then automatically applies the checked-in v0.14, v0.15 and v0.16 upgrades.

### v0.16 highlights

- Detects and strengthens all blueprint lines before structural wall classification.
- Keeps dimensions and annotations visible for review without converting them into 3D walls.
- Adds garage-door presets for 9 ft, 16 ft and 18 ft openings.
- Renders garage openings in 3D as sectional overhead doors.
- Preserves continuous wall material above doors and windows.
- Adds automatic source validation before install and launch.
- Adds `VERIFY.bat` for one-click restore + validation without starting the app.
- Keeps project-wide Undo/Redo, multi-level editing, AI wall classification, room furnishing, kitchen layout and 2D/3D views.

## Windows quick start

1. Install Node.js if it is not already installed.
2. Double-click `VERIFY.bat` to confirm the recovered source is intact.
3. Double-click `INSTALL.bat` once.
4. Double-click `RUN.bat` whenever you want to launch Blueprint 3D Studio.

`RUN.bat` restores, upgrades and validates the canonical source before starting Vite.

## Development

```bash
npm run restore
npm run validate
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
- `scripts/upgrade-v016.cjs` — garage-size presets
- `scripts/validate-source.cjs` — source integrity checks
- `VERIFY.bat` — one-click source verification
- `INSTALL.bat` — Windows setup
- `RUN.bat` — Windows launcher

Cabinet model repositories remain separate from this main application repository.
