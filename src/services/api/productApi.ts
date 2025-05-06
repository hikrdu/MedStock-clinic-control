import { getApiBaseUrl } from "@/lib/utils";
import axios from "axios";

const ENDPOINT = `${getApiBaseUrl()}/products`;

export const productApi = {
    // Get all products
    getProducts: async (search?: string) => {
        const params = search ? { params: { search } } : {};
        const response = await axios.get(ENDPOINT, params);
        return response.data;
    },

    // Get a product by ID
    getProductById: async (id: string) => {
        const response = await axios.get(`${ENDPOINT}/${id}`);
        return response.data;
    },

    // Create a new product
    createProduct: async (product: any) => {
        const response = await axios.post(ENDPOINT, product);
        return response.data;
    },

    // Update a product
    updateProduct: async (id: string, product: any) => {
        const response = await axios.put(`${ENDPOINT}/${id}`, product);
        return response.data;
    },

    // Delete a product
    deleteProduct: async (id: string) => {
        const response = await axios.delete(`${ENDPOINT}/${id}`);
        return response.data;
    },

    // // Get monthly report
    // getMonthlyReport: async () => {
    //     const response = await axios.get(`${API_BASE_URL}/report/monthly`);
    //     return response.data;
    // }

    // Get stock movements for a product
    getStockMovements: async (productId?: string) => {
        // If productId is provided, use it in the path; otherwise, call the base endpoint
        const url = productId
            ? `${ENDPOINT}/${productId}/stock-movements`
            : `${ENDPOINT}/""/stock-movements`;
        const response = await axios.get(url);
        return response.data;
    },

    // Add stock movement (in/out)
    addStockMovement: async (productId: string, movement: any) => {
        // productId is required as per the route definition
        const response = await axios.post(`${ENDPOINT}/${productId}/stock-movements`, movement);
        return response.data;
    },

    // Get purchase report data (products below ideal quantity)
    getPurchaseReportData: async () => {
        const response = await axios.get(`${ENDPOINT}/report/monthly`);
        return response.data;
    }

};
