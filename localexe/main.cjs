const path = require("node:path");
const { app, BrowserWindow, dialog, shell } = require("electron");
const { startDesktopServer } = require("./desktop-server.cjs");

app.setName("WHAMO Network Designer Local");

let mainWindow;
let desktopServer;

function getDesktopPaths() {
  const isPackaged = app.isPackaged;
  return {
    assetDirectory: isPackaged
      ? path.join(process.resourcesPath, "app-assets")
      : path.join(__dirname, "app-assets"),
    enginePath: isPackaged
      ? path.join(process.resourcesPath, "WHAMO.EXE")
      : path.join(__dirname, "engine", "WHAMO.EXE"),
    dataDirectory: path.join(app.getPath("userData"), "local-data"),
  };
}

async function createWindow() {
  if (!desktopServer) {
    desktopServer = await startDesktopServer(getDesktopPaths());
  }

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1050,
    minHeight: 700,
    title: "WHAMO Network Designer Local",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  const appUrl = `${desktopServer.url}/designer`;

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith(desktopServer.url) && /^https?:\/\//i.test(url)) {
      void shell.openExternal(url);
    }
    return { action: "deny" };
  });

  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith(desktopServer.url)) {
      event.preventDefault();
      if (/^https?:\/\//i.test(url)) void shell.openExternal(url);
    }
  });

  await mainWindow.loadURL(appUrl);
  mainWindow.on("closed", () => {
    mainWindow = undefined;
  });
}

app.whenReady().then(createWindow).catch((error) => {
  console.error("Could not start the local WHAMO desktop app:", error);
  dialog.showErrorBox(
    "WHAMO Network Designer could not start",
    error instanceof Error ? error.message : String(error)
  );
  app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow().catch((error) => {
      console.error("Could not reopen the local WHAMO desktop app:", error);
      dialog.showErrorBox("WHAMO Network Designer could not reopen", String(error));
    });
  }
});

app.on("before-quit", () => {
  desktopServer?.close();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
