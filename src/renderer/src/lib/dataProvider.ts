import { DataProvider } from 'ra-core';

export const dataProvider: DataProvider = {
  async getList(resource: string, params: any) {
    if (resource !== 'pods') {
      throw new Error(`Resource ${resource} not supported`);
    }

    try {
      const { page = 1, perPage = 25 } = params.pagination || {};
      const { field = 'name', order = 'ASC' } = params.sort || {};
      const filter = params.filter || {};

      const result = await window.api.kubernetes.listPods({ filter });
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch pods');
      }

      let pods = result.data || [];

      pods.sort((a, b) => {
        const aVal = a[field];
        const bVal = b[field];
        if (order === 'ASC') {
          return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        } else {
          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        }
      });

      const total = pods.length;
      const start = (page - 1) * perPage;
      const end = start + perPage;
      const data = pods.slice(start, end);

      return {
        data,
        total,
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch pods: ${error.message}`);
    }
  },

  async getOne(resource: string, params: any) {
    if (resource !== 'pods') {
      throw new Error(`Resource ${resource} not supported`);
    }

    try {
      const result = await window.api.kubernetes.getPod(params.id);
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch pod');
      }
      return { data: result.data };
    } catch (error: any) {
      throw new Error(`Failed to fetch pod: ${error.message}`);
    }
  },

  async getMany(resource: string, params: any) {
    if (resource !== 'pods') {
      throw new Error(`Resource ${resource} not supported`);
    }

    try {
      const pods = await Promise.all(
        params.ids.map(async (id: string) => {
          try {
            const result = await window.api.kubernetes.getPod(id);
            return result.success ? result.data : null;
          } catch {
            return null;
          }
        })
      );

      return { data: pods.filter(Boolean) };
    } catch (error: any) {
      throw new Error(`Failed to fetch pods: ${error.message}`);
    }
  },

  async getManyReference(resource: string, params: any) {
    return this.getList(resource, {
      ...params,
      filter: { ...params.filter, [params.target]: params.id },
    });
  },

  async create(resource: string, params: any) {
    if (resource !== 'pods') {
      throw new Error(`Resource ${resource} not supported`);
    }

    try {
      const result = await window.api.kubernetes.updatePod('new', params.data);
      if (!result.success) {
        throw new Error(result.error || 'Failed to create pod');
      }
      return { data: result.data };
    } catch (error: any) {
      throw new Error(`Failed to create pod: ${error.message}`);
    }
  },

  async update(resource: string, params: any) {
    if (resource !== 'pods') {
      throw new Error(`Resource ${resource} not supported`);
    }

    try {
      const result = await window.api.kubernetes.updatePod(params.id, params.data);
      if (!result.success) {
        throw new Error(result.error || 'Failed to update pod');
      }
      return { data: result.data };
    } catch (error: any) {
      throw new Error(`Failed to update pod: ${error.message}`);
    }
  },

  async updateMany(resource: string, params: any) {
    if (resource !== 'pods') {
      throw new Error(`Resource ${resource} not supported`);
    }

    try {
      const results = await Promise.all(
        params.ids.map((id: string) =>
          this.update(resource, { id, data: params.data, previousData: {} })
        )
      );

      return { data: results.map(r => r.data.id) };
    } catch (error: any) {
      throw new Error(`Failed to update pods: ${error.message}`);
    }
  },

  async delete(resource: string, params: any) {
    if (resource !== 'pods') {
      throw new Error(`Resource ${resource} not supported`);
    }

    try {
      const result = await window.api.kubernetes.deletePod(params.id);
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete pod');
      }
      return { data: result.data };
    } catch (error: any) {
      throw new Error(`Failed to delete pod: ${error.message}`);
    }
  },

  async deleteMany(resource: string, params: any) {
    if (resource !== 'pods') {
      throw new Error(`Resource ${resource} not supported`);
    }

    try {
      const result = await window.api.kubernetes.deleteMultiplePods(params.ids);
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete pods');
      }
      return { data: result.data };
    } catch (error: any) {
      throw new Error(`Failed to delete pods: ${error.message}`);
    }
  },
};