import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  kubernetes: {
    init: (kubeconfigContent: string) => ipcRenderer.invoke('k8s-init', kubeconfigContent),
    getIdentity: (kubeconfigContent: string) => ipcRenderer.invoke('k8s-get-identity', kubeconfigContent),
    listPods: (params: any) => ipcRenderer.invoke('k8s-list-pods', params),
    getPod: (id: string) => ipcRenderer.invoke('k8s-get-pod', id),
    updatePod: (id: string, data: any) => ipcRenderer.invoke('k8s-update-pod', id, data),
    deletePod: (id: string) => ipcRenderer.invoke('k8s-delete-pod', id),
    deleteMultiplePods: (ids: string[]) => ipcRenderer.invoke('k8s-delete-multiple-pods', ids),
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
