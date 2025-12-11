import { app, BrowserWindow, ipcMain } from "electron";
import path, { dirname } from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import DatabaseSync from "better-sqlite3";
import { error } from "node:console";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db;

function initDatabase() {
  const userDataPath = app.getPath("userData");
  if (!fs.existsSync(userDataPath))
    fs.mkdirSync(userDataPath, { readdirSync: true });
  const dbPath = path.join(userDataPath, "notes.db");
  
  db = new DatabaseSync(dbPath);
  db.pragma("journal_mode=WAL");

  db.prepare(
    `
   CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    created_at INTEGER,
    updated_at INTEGER
   )  
  `
  ).run();
}

function getAllNotes() {
  const stmt = db.prepare("SELECT * FROM notes ORDER BY updated_at DESC").all();
  return stmt;
}

function getNote(id) {
  if (!id) return error("id required!");
  const stmt = db.prepare("SELECT * FROM notes WHERE id = ?").get(id);
  return stmt;
}

function createNote({ title = "", content = "" }) {
  const now = Date.now();
  const stmt = db.prepare(
    "INSERT INTO notes (title, content, created_at, updated_at) VALUES (?, ?, ?, ?)"
  );
  const info = stmt.run(title, content, now, now);
  return getNote(info.lastInsertRowid);
}

function updateNote({ title, content, id }) {
  if (!id && !title && !content) {
    return error("id,title and content required!");
  }
  const now = Date.now();
  const stmt = db.prepare(
    "UPDATE notes SET title= ?, content= ?, updated_at= ? WHERE id= ?"
  );
  stmt.run(title, content, now, id);
  return getNote(id);
}

function deleteNote(id) {
  if (id) return error("id required!");
  const stmt = db.prepare("DELETE FROM notes WHERE id= ?");
  const info = stmt.run(id);
  return info.changes > 0;
}

function ResponseWrapper({ ok, data, message = "", error = null }) {
  const response = { ok, message };
  if (data !== undefined) response.data = data;
  if (error) response.error = error.toString();
  return response;
}

function setUpIPC() {
  ipcMain.handle("get-all-notes", () => {
    try {
      const data = getAllNotes();
      return ResponseWrapper({
        ok: true,
        data,
        message: "Data Retried Successfully",
      });
    } catch (error) {
      return ResponseWrapper({ ok: false, message: error.message });
    }
  });

  ipcMain.handle("get-note", (event, id) => {
    try {
      const data = getNote(id);
      return ResponseWrapper({
        ok: true,
        data,
        message: "Data Retried Successfully",
      });
    } catch (error) {
      return ResponseWrapper({ ok: false, message: error.message });
    }
  });

  ipcMain.handle("create-note", (event, { title, content }) => {
    try {
      const data = createNote({ title, content });
      return ResponseWrapper({
        ok: true,
        data,
        message: "Created Successfully",
      });
    } catch (error) {
      return ResponseWrapper({ ok: false, message: error.message });
    }
  });

  ipcMain.handle("update-note", (event, { title, content, id }) => {
    try {
      const data = updateNote({ title, content, id });
      return ResponseWrapper({
        ok: true,
        data,
        message: "Data Updated Successfully",
      });
    } catch (error) {
      return ResponseWrapper({ ok: false, message: error.message });
    }
  });

  ipcMain.handle("delete-note", (event, { id }) => {
    try {
      const data = deleteNote(id);
      return ResponseWrapper({
        ok: true,
        data,
        message: "Data Deleted Successfully",
      });
    } catch (error) {
      return ResponseWrapper({ ok: false, message: error.message });
    }
  });
}

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
    await win.loadURL("http://localhost:5173");
  } else {
    // Production mode: Load dist/index.html
    await win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

app.whenReady().then(() => {
  try {
    initDatabase();
    setUpIPC();
  } catch (err) {
    console.error("DB init error", err);
    app.quit();
  }
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
