import api from "@/lib/api";

export const leaseService = {
  getAll: async (filters?: { expiring?: boolean; days?: number }) => {
    const params = new URLSearchParams();
    if (filters?.expiring) params.append("expiring", "true");
    if (filters?.days) params.append("days", filters.days.toString());

    const response = await api.get(`/leases?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string | number) => {
    const response = await api.get(`/leases/${id}`);
    return response.data;
  },

  getMyLease: async () => {
    const response = await api.get("/leases/my-lease");
    return response.data;
  },

  create: async (leaseData: any) => {
    const response = await api.post("/leases", leaseData);
    return response.data;
  },

  update: async (id: string | number, leaseData: any) => {
    const response = await api.put(`/leases/${id}`, leaseData);
    return response.data;
  },

  terminate: async (id: string | number) => {
    const response = await api.post(`/leases/${id}/terminate`);
    return response.data;
  },

  delete: async (id: string | number) => {
    const response = await api.delete(`/leases/${id}`);
    return response.data;
  },

  getPayments: async (id: string | number) => {
    const response = await api.get(`/leases/${id}/payments`);
    return response.data;
  },

  getExpiring: async (days: number = 30) => {
    const response = await api.get(`/leases?expiring=true&days=${days}`);
    return response.data;
  },
};
