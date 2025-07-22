import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  loadConfig: () => ipcRenderer.invoke('load-config'),
  saveConfig: (data: unknown) => ipcRenderer.send('save-config', data),
  triggerTestURI: (uri: string) => ipcRenderer.send('test-uri', uri),
  backupConfig: () => ipcRenderer.invoke('backup-config'),
  restoreConfig: () => ipcRenderer.invoke('restore-config'),
  exportConfig: () => ipcRenderer.invoke('export-config'),
  importConfig: () =>
    window.showOpenFilePicker
      ? window.showOpenFilePicker().then(async ([handle]) => {
          const file = await handle.getFile();
          const text = await file.text();
          return ipcRenderer.invoke('import-config', text);
        })
      : Promise.resolve({})
});
