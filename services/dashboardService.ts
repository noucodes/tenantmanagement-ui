import api from "@/lib/api";

export const dashboardService = {
  getAdminDashboard: async () => {
    const response = await api.get("/dashboard/admin");
    return response.data;
  },

  getTenantDashboard: async () => {
    const response = await api.get("/dashboard/tenant");
    return response.data;
  },
};
