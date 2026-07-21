import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('offlineDB', {
  saveTest: () =>
    ipcRenderer.invoke('offline:test-save'),

  getTest: () =>
    ipcRenderer.invoke('offline:test-get'),
});

contextBridge.exposeInMainWorld('testDB', {
  create: (data) => ipcRenderer.invoke('test:create', data),
  getAll: () => ipcRenderer.invoke('test:get'),
});