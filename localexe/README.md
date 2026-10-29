# WHAMO Network Designer Local

This folder contains the separate Electron desktop wrapper. It does not change the existing web application's source or database configuration.

## Local desktop behavior

- Opens the Designer directly at `/designer`; the desktop build seeds a local session and does not require a web account.
- Saves the saved-project library as `local-data/projects.json` under Electron's local `userData` directory. Project autosaves use this local library.
- Runs the bundled `WHAMO.EXE` on the same computer in a temporary per-run folder. Temporary simulation files are removed after the response is collected.
- Keeps project content, simulation input/output handling, and profile information on the local computer. The local server binds to `127.0.0.1` only.
- Uses the existing Designer frontend and packages it as static files when preparing the desktop build.

Account sharing, cloud accounts, admin management, and account password changes are not available in this local-only build. The project sharing control is hidden. Individual projects can still be exported as JSON using the Designer's Save As command.

## Build scripts

From this folder, `npm run start` builds the parent project's Designer, prepares the local resources, and starts Electron. `npm run package:win` does the same preparation and creates a Windows x64 NSIS installer in `release/`.

The asset preparation script copies the built frontend from `../dist/public` and the engine from `../server/engines/WHAMO.EXE`. Those generated copies are ignored by Git.

The Windows package must be built and tested on a Windows computer. This workspace runs on Linux and cannot verify the final Windows installer or execute the Windows WHAMO engine.
