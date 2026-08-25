# Blueprint 3D Studio

Main application repository for Blueprint 3D Studio.

## Current version

**v0.17.0**

The recovered v0.13 application source is preserved in `src/source/` as verified Brotli/Base64 chunks. `scripts/restore-source.cjs` reconstructs `src/App.jsx` and `src/styles.css`, then automatically applies all checked-in upgrades through v0.17.

### v0.17 highlights

- Improves wall recovery on real residential floor plans with fragmented wall lines.
- Lowers false rejection of connected double-line wall geometry near doors, fixtures and labels.
- Keeps obvious measurement extensions and annotation geometry out of the structural model.
- Uses a wider review band so uncertain walls remain editable instead of disappearing.
- Recovers more incomplete exterior-perimeter evidence before wall consolidation.
- Keeps the all-detected-lines overlay for comparison with the source blueprint.
- Runs the stable production preview from `RUN.bat` instead of the Vite dev server.
- Retains garage-door presets for 9 ft, 16 ft and 18 ft, continuous walls above openings, Undo/Redo, multi-level editing, kitchen layout, furnishing and 2D/3D views.

## Windows quick start

1. Install Node.js if it is not already installed.
2. In GitHub Desktop, select `blueprint-3d-studio` and Pull the latest `main` branch.
3. Use **Repository → Show in Explorer**.
4. Double-click `RUN.bat`.

`RUN.bat` restores, upgrades, validates and builds the canonical source before launching the stable production preview.

## Development

```bash
npm run restore
npm run validate
npm install
npm run build
npm run preview
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
- `scripts/upgrade-v017.cjs` — residential wall recovery tuning
- `scripts/validate-source.cjs` — source integrity checks
- `VERIFY.bat` — one-click source verification
- `INSTALL.bat` — Windows setup
- `RUN.bat` — Windows launcher

Cabinet model repositories remain separate from this main application repository.
