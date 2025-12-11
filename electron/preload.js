const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("notesAPI", {
  getAllNotes: async () => ipcRenderer.invoke("get-all-notes"),
  getNote: async (id) => ipcRenderer.invoke("get-note", id),
  createNote: async (payload) => ipcRenderer.invoke("create-note", payload),
  updateNote: async (payload) => ipcRenderer.invoke("update-note", payload),
  deleteNote: async (id) => ipcRenderer.invoke("delete-note", id),
});
