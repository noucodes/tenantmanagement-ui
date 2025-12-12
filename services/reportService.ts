import api from "@/lib/api";

export const reportService = {
  getOccupancy: async () => {
    const response = await api.get("/reports/occupancy");
    return response.data;
  },

  getRevenue: async (startDate: string, endDate: string) => {
    const response = await api.get(
      `/reports/revenue?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data;
  },

  getMonthlyRevenue: async (year: number) => {
    const response = await api.get(`/reports/revenue/monthly?year=${year}`);
    return response.data;
  },

  getPropertyPerformance: async () => {
    const response = await api.get("/reports/property-performance");
    return response.data;
  },

  getTenantReport: async () => {
    const response = await api.get("/reports/tenants");
    return response.data;
  },

  getLeaseExpirations: async (days: number = 90) => {
    const response = await api.get(`/reports/lease-expirations?days=${days}`);
    return response.data;
  },

  getMaintenance: async () => {
    const response = await api.get("/reports/maintenance");
    return response.data;
  },

  getPaymentTrends: async (months: number = 6) => {
    const response = await api.get(`/reports/payment-trends?months=${months}`);
    return response.data;
  },
};
