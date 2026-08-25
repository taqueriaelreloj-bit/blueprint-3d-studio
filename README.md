# Blueprint 3D Studio

Main application repository for Blueprint 3D Studio.

## Current version

**v0.23.0**

The recovered v0.13 application source is preserved in `src/source/` as verified Brotli/Base64 chunks. `scripts/restore-source.cjs` reconstructs `src/App.jsx` and `src/styles.css`, then automatically applies all checked-in upgrades through v0.23.

### v0.23 highlights

- Extracts wall and opening geometry into a reusable engine module.
- Adds unit coverage for calibrated lengths, projections, snapping, overlaps and vertical opening constraints.
- Splits PDF.js and the React Three stack into cacheable production chunks.

### v0.22 highlights

- Extracts global Undo/Redo transitions into a reusable, tested project-history module.
- Adds deterministic unit coverage for history ordering, limits and unavailable transitions.
- Pins dependencies with a committed lockfile and updates PDF.js to a secure release.
- Keeps the v0.21 toolbar cleanup and Chrome smoke coverage.

### v0.21 highlights

- Removes the unfinished AI Kitchen toolbar entry while preserving the stable kitchen tools already in the editor.
- Adds Playwright Chrome smoke and initial editor-state tests locally and in CI.
- Retains the v0.20 manual-ground-truth wall centerline fidelity tuning and all earlier detector improvements.

### Wall detection highlights

- Fixes the main bottleneck found in the Maricopa residential-plan test: short wall fragments were being discarded before classification.
- Detects much shorter horizontal and vertical wall segments before trying to pair the two wall faces.
- Allows slightly thicker raster edge bands so scaled PDF walls are not rejected merely because of rendering thickness.
- Uses a more tolerant parallel-edge overlap test for walls interrupted by doors, fixtures, labels and intersections.
- Keeps the v0.17 structural classifier protections against obvious dimensions and annotation geometry.
- Expands connected-wall recovery while retaining Review/Edit for uncertain geometry.
- Runs restore, validation and a production build before `RUN.bat` launches the app.
- Retains garage-door presets, continuous wall material above openings, Undo/Redo, multi-level editing, kitchen layout, furnishing and 2D/3D views.

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
- `scripts/upgrade-v018.cjs` — fine wall-segment detector tuning
- `scripts/validate-source.cjs` — source integrity checks
- `VERIFY.bat` — one-click source verification
- `INSTALL.bat` — Windows setup
- `RUN.bat` — Windows launcher

Cabinet model repositories remain separate from this main application repository.
