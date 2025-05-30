import { Sector, Unity } from "./models/Utis";
import * as api from "./utilsApi";

export const utilService = {
    getUnities: async (): Promise<Unity[]> => {
        const unities = await api.utilsApi.getUnities();
        return unities.sort((a, b) => a.description.localeCompare(b.description));
    },

    createUnity: async (data: { description: string, abreviation: string }): Promise<Unity> => {
        return await api.utilsApi.createUnity(data);
    },

    removeUnity: async (id: string): Promise<boolean> => {
        const unities = await api.utilsApi.getUnities();
        const index = unities.findIndex((u) => u._id === id);
        if (index !== -1) {
            await api.utilsApi.removeUnity(id);
            return true;
        }
        return false;
    },

    getSectors: async (): Promise<Sector[]> => {
        const sectors = await api.utilsApi.getSectors();
        return sectors.sort((a, b) => a.description.localeCompare(b.description));
    },

    createSector: async (data: { description: string }): Promise<Sector> => {
        return await api.utilsApi.createSector(data);
    },

    removeSector: async (id: string): Promise<boolean> => {
        const sectors = await api.utilsApi.getSectors();
        const index = sectors.findIndex((s) => s._id === id);
        if (index !== -1) {
            await api.utilsApi.removeSector(id);
            return true;
        }
        return false;
    },
}
