const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("whamoDesktop", Object.freeze({
  isDesktop: true,
  storageMode: "local",
}));
