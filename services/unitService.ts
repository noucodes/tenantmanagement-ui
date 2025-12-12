import api from "@/lib/api";

export const unitService = {
  getAll: async (filters?: {
    vacant?: boolean;
    occupied?: boolean;
    property_id?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.vacant) params.append("vacant", "true");
    if (filters?.occupied) params.append("occupied", "true");
    if (filters?.property_id) params.append("property_id", filters.property_id);

    const response = await api.get(`/units?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string | number) => {
    const response = await api.get(`/units/${id}`);
    return response.data;
  },

  create: async (unitData: any) => {
    const response = await api.post("/units", unitData);
    return response.data;
  },

  update: async (id: string | number, unitData: any) => {
    const response = await api.put(`/units/${id}`, unitData);
    return response.data;
  },

  delete: async (id: string | number) => {
    const response = await api.delete(`/units/${id}`);
    return response.data;
  },

  getVacant: async () => {
    const response = await api.get("/units?vacant=true");
    return response.data;
  },
};
