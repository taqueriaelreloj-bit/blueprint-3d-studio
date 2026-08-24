# Blueprint 3D Studio

Main application repository for Blueprint 3D Studio.

## Current recovered version

**v0.13.0**

The complete recovered application source is preserved in `src/source/` as verified Brotli/Base64 chunks. `INSTALL.bat` and `RUN.bat` automatically reconstruct `src/App.jsx` and `src/styles.css` before installing or launching the application.

## Windows quick start

1. Install Node.js if it is not already installed.
2. Double-click `INSTALL.bat` once.
3. Double-click `RUN.bat` whenever you want to launch Blueprint 3D Studio.

`RUN.bat` restores the latest checked-in source before starting Vite, so the working source always matches the repository recovery files.

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
- `src/App.jsx` — reconstructed automatically
- `src/styles.css` — reconstructed automatically
- `src/source/` — canonical recovered source chunks
- `scripts/restore-source.cjs` — source reconstruction utility
- `INSTALL.bat` — Windows setup
- `RUN.bat` — Windows launcher

Cabinet model repositories remain separate from this main application repository.
