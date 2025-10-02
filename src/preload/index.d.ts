import { ElectronAPI } from '@electron-toolkit/preload'

interface KubernetesAPI {
  init: (kubeconfigContent: string) => Promise<{ success: boolean; error?: string }>
  getIdentity: (kubeconfigContent: string) => Promise<{ success: boolean; data?: any; error?: string }>
  listPods: (params: any) => Promise<{ success: boolean; data?: any[]; error?: string }>
  getPod: (id: string) => Promise<{ success: boolean; data?: any; error?: string }>
  updatePod: (id: string, data: any) => Promise<{ success: boolean; data?: any; error?: string }>
  deletePod: (id: string) => Promise<{ success: boolean; data?: any; error?: string }>
  deleteMultiplePods: (ids: string[]) => Promise<{ success: boolean; data?: string[]; error?: string }>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      kubernetes: KubernetesAPI
    }
  }
}
