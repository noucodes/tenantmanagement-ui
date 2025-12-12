import api from "@/lib/api";

export const propertyService = {
  getAll: async () => {
    const response = await api.get("/properties");
    return response.data;
  },

  getById: async (id: string | number) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  create: async (propertyData: any) => {
    const response = await api.post("/properties", propertyData);
    return response.data;
  },

  update: async (id: string | number, propertyData: any) => {
    const response = await api.put(`/properties/${id}`, propertyData);
    return response.data;
  },

  delete: async (id: string | number) => {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  },

  getUnits: async (id: string | number) => {
    const response = await api.get(`/properties/${id}/units`);
    return response.data;
  },
};
