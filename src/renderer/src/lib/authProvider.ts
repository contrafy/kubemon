import { AuthProvider } from 'ra-core';

const AUTH_KEY = 'kubeconfig';

export const authProvider: AuthProvider = {
  async login({ kubeconfig }: { kubeconfig: string }) {
    if (!kubeconfig || kubeconfig.trim() === '') {
      throw new Error('Kubeconfig is required');
    }

    const result = await window.api.kubernetes.init(kubeconfig);
    if (!result.success) {
      throw new Error(result.error || 'Failed to initialize Kubernetes client');
    }

    localStorage.setItem(AUTH_KEY, kubeconfig);
    return Promise.resolve();
  },

  async logout() {
    localStorage.removeItem(AUTH_KEY);
    return Promise.resolve();
  },

  async checkError(error: any) {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem(AUTH_KEY);
      return Promise.reject();
    }
    return Promise.resolve();
  },

  async checkAuth() {
    const kubeconfig = localStorage.getItem(AUTH_KEY);
    if (!kubeconfig) {
      return Promise.reject();
    }
    
    const result = await window.api.kubernetes.init(kubeconfig);
    if (!result.success) {
      localStorage.removeItem(AUTH_KEY);
      return Promise.reject();
    }
    
    return Promise.resolve();
  },

  async getIdentity() {
    const kubeconfig = localStorage.getItem(AUTH_KEY);
    if (!kubeconfig) {
      return Promise.reject();
    }

    const result = await window.api.kubernetes.getIdentity(kubeconfig);
    if (!result.success) {
      return Promise.reject();
    }

    return Promise.resolve(result.data);
  },

  async getPermissions() {
    return Promise.resolve(['admin']);
  },
};