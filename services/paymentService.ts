import api from "@/lib/api";

export const paymentService = {
  getAll: async (filters?: {
    overdue?: boolean;
    pending?: boolean;
    lease_id?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.overdue) params.append("overdue", "true");
    if (filters?.pending) params.append("pending", "true");
    if (filters?.lease_id) params.append("lease_id", filters.lease_id);

    const response = await api.get(`/payments?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string | number) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  getMyPayments: async () => {
    const response = await api.get("/payments/my-payments");
    return response.data;
  },

  create: async (paymentData: any) => {
    const response = await api.post("/payments", paymentData);
    return response.data;
  },

  update: async (id: string | number, paymentData: any) => {
    const response = await api.put(`/payments/${id}`, paymentData);
    return response.data;
  },

  delete: async (id: string | number) => {
    const response = await api.delete(`/payments/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get("/payments/stats");
    return response.data;
  },

  getMonthlyStats: async (year: number, month: number) => {
    const response = await api.get(
      `/payments/stats/monthly?year=${year}&month=${month}`
    );
    return response.data;
  },

  getOverdue: async () => {
    const response = await api.get("/payments?overdue=true");
    return response.data;
  },

  getPending: async () => {
    const response = await api.get("/payments?pending=true");
    return response.data;
  },
};
