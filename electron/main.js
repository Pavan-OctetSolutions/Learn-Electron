import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
 if (process.env.VITE_ISDEVMODE) {
    // Development mode: Load Vite dev server
    await win.loadURL('http://localhost:5173');
  } else {
    // Production mode: Load dist/index.html
    await win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
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
  if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("read-directory", (event, dirPath) => {
  try {
    const item = fs.readdirSync(dirPath, { withFileTypes: true });
    
    return item.map((item) => {
      return {
        name: item.name,
        isDirectory: item.isDirectory(),
      };
    });
  } catch (error) {
    return { error: error.message };
  }
});
