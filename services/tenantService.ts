import api from "@/lib/api";

export const tenantService = {
  getAll: async () => {
    const response = await api.get("/tenants");
    return response.data;
  },

  getById: async (id: string | number) => {
    const response = await api.get(`/tenants/${id}`);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get("/tenants/profile");
    return response.data;
  },

  create: async (tenantData: any) => {
    const response = await api.post("/tenants", tenantData);
    return response.data;
  },

  update: async (id: string | number, tenantData: any) => {
    const response = await api.put(`/tenants/${id}`, tenantData);
    return response.data;
  },

  delete: async (id: string | number) => {
    const response = await api.delete(`/tenants/${id}`);
    return response.data;
  },

  getLeases: async (id: string | number) => {
    const response = await api.get(`/tenants/${id}/leases`);
    return response.data;
  },

  getPayments: async (id: string | number) => {
    const response = await api.get(`/tenants/${id}/payments`);
    return response.data;
  },
};
