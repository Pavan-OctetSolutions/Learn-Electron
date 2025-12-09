const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  readDirectory: (dirPath) => ipcRenderer.invoke('read-directory', dirPath)
});


