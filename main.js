import { app, BrowserWindow, Menu } from "electron";

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 800,
  });

  win.webContents.openDevTools();
  win.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  console.log(process.platform);
  if (process.platform !== "darwin") app.quit();
});




