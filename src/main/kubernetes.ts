import * as k8s from '@kubernetes/client-node';

let kubeConfig: k8s.KubeConfig | null = null;
let coreV1Api: k8s.CoreV1Api | null = null;

export function initializeKubeConfig(kubeconfigContent: string) {
  try {
    kubeConfig = new k8s.KubeConfig();
    kubeConfig.loadFromString(kubeconfigContent);
    coreV1Api = kubeConfig.makeApiClient(k8s.CoreV1Api);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export function getKubeClient() {
  if (!coreV1Api) {
    throw new Error('Kubernetes client not initialized. Please login first.');
  }
  return coreV1Api;
}

function transformPod(pod: k8s.V1Pod): any {
  return {
    id: `${pod.metadata?.namespace || 'default'}/${pod.metadata?.name}`,
    name: pod.metadata?.name,
    namespace: pod.metadata?.namespace || 'default',
    status: pod.status?.phase || 'Unknown',
    ready: pod.status?.containerStatuses?.every(cs => cs.ready) || false,
    restarts: pod.status?.containerStatuses?.reduce((acc, cs) => acc + (cs.restartCount || 0), 0) || 0,
    age: pod.metadata?.creationTimestamp ? new Date(pod.metadata.creationTimestamp).toISOString() : '',
    node: pod.spec?.nodeName || '',
    containers: pod.spec?.containers?.map(c => ({
      name: c.name,
      image: c.image,
      ports: c.ports || [],
    })) || [],
    labels: pod.metadata?.labels || {},
    annotations: pod.metadata?.annotations || {},
    creationTimestamp: pod.metadata?.creationTimestamp,
    uid: pod.metadata?.uid,
    resourceVersion: pod.metadata?.resourceVersion,
    spec: pod.spec,
    status_details: pod.status,
  };
}

export async function listPods(params: any = {}) {
  const client = getKubeClient();
  
  try {
    let response;
    const filter = params.filter || {};

    if (filter.namespace && filter.namespace !== 'all') {
      response = await client.listNamespacedPod({ namespace: filter.namespace });
    } else {
      response = await client.listPodForAllNamespaces();
    }

    let pods = response.items.map(transformPod);

    if (filter.q) {
      const query = filter.q.toLowerCase();
      pods = pods.filter(pod => 
        pod.name.toLowerCase().includes(query) ||
        pod.namespace.toLowerCase().includes(query) ||
        pod.status.toLowerCase().includes(query)
      );
    }

    if (filter.status) {
      pods = pods.filter(pod => pod.status.toLowerCase() === filter.status.toLowerCase());
    }

    return { success: true, data: pods };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getPod(id: string) {
  const client = getKubeClient();
  const [namespace, name] = id.split('/');

  try {
    const response = await client.readNamespacedPod({ name, namespace });
    return { success: true, data: transformPod(response) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updatePod(id: string, data: any) {
  const client = getKubeClient();
  const [namespace, name] = id.split('/');

  try {
    const pod: k8s.V1Pod = {
      apiVersion: 'v1',
      kind: 'Pod',
      metadata: {
        name: data.name,
        namespace: data.namespace,
        labels: data.labels,
        annotations: data.annotations,
      },
      spec: data.spec,
    };

    const response = await client.replaceNamespacedPod({ name, namespace, body: pod });
    return { success: true, data: transformPod(response) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deletePod(id: string) {
  const client = getKubeClient();
  const [namespace, name] = id.split('/');

  try {
    await client.deleteNamespacedPod({ name, namespace });
    return { success: true, data: { id } };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteMultiplePods(ids: string[]) {
  const client = getKubeClient();

  try {
    await Promise.all(
      ids.map(async (id: string) => {
        const [namespace, name] = id.split('/');
        return client.deleteNamespacedPod({ name, namespace });
      })
    );

    return { success: true, data: ids };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export function getUserIdentity(kubeconfigContent: string) {
  try {
    let config;
    try {
      config = JSON.parse(kubeconfigContent);
    } catch {
      const lines = kubeconfigContent.split('\n');
      const userLine = lines.find(line => line.includes('name:') && !line.includes('cluster:'));
      const userName = userLine ? userLine.split('name:')[1].trim() : 'kubernetes-user';
      return {
        success: true,
        data: {
          id: userName,
          fullName: userName,
          avatar: undefined,
        }
      };
    }

    const currentContext = config['current-context'] || config.contexts?.[0]?.name;
    const context = config.contexts?.find((ctx: any) => ctx.name === currentContext);
    const userName = context?.context?.user || 'kubernetes-user';

    return {
      success: true,
      data: {
        id: userName,
        fullName: userName,
        avatar: undefined,
      }
    };
  } catch {
    return {
      success: true,
      data: {
        id: 'kubernetes-user',
        fullName: 'Kubernetes User',
        avatar: undefined,
      }
    };
  }
}