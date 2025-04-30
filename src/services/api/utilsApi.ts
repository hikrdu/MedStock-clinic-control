import { API_BASE_URL } from "@/lib/utils";
import axios from "axios";


const ENDPOINT = `${API_BASE_URL}/utils`;


export const utilsApi = {
    getUnities: async () => {
        const response = await axios.get(`${ENDPOINT}/unities`);
        return response.data;
    },

    createUnity: async (data: { description: string, abreviation: string }) => {
        data.description = data.description.trim().toUpperCase()
        const response = await axios.post(`${ENDPOINT}/unities`, data);
        return response.data;
    },

    removeUnity: async (id: string) => {
        const response = await axios.delete(`${ENDPOINT}/unities/${id}`);
        return response.data;
    },

    getSectors: async () => {
        const response = await axios.get(`${ENDPOINT}/sectors`);
        return response.data;
    },

    createSector: async (data: { description: string }) => {
        data.description = data.description.trim().toUpperCase()
        const response = await axios.post(`${ENDPOINT}/sectors`, data);
        return response.data;
    },

    removeSector: async (id: string) => {
        const response = await axios.delete(`${ENDPOINT}/sectors/${id}`);
        return response.data;
    },
}
