import axios from "axios";

// const API_BASE_URL = "http://192.168.0.9:5000/api/products";
const API_BASE_URL = "https://medstock-server.onrender.com/api/products";

export const productApi = {
    // Get all products
    getProducts: async (search?: string) => {
        const params = search ? { params: { search } } : {};
        const response = await axios.get(API_BASE_URL, params);
        return response.data;
    },

    // Get a product by ID
    getProductById: async (id: string) => {
        const response = await axios.get(`${API_BASE_URL}/${id}`);
        return response.data;
    },

    // Create a new product
    createProduct: async (product: any) => {
        const response = await axios.post(API_BASE_URL, product);
        return response.data;
    },

    // Update a product
    updateProduct: async (id: string, product: any) => {
        const response = await axios.put(`${API_BASE_URL}/${id}`, product);
        return response.data;
    },

    // Delete a product
    deleteProduct: async (id: string) => {
        const response = await axios.delete(`${API_BASE_URL}/${id}`);
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
            ? `${API_BASE_URL}/${productId}/stock-movements`
            : `${API_BASE_URL}/""/stock-movements`;
        const response = await axios.get(url);
        return response.data;
    },

    // Add stock movement (in/out)
    addStockMovement: async (movement: any) => {
        const response = await axios.post(`${API_BASE_URL}/stock-movements`, movement);
        return response.data;
    },

    // Get purchase report data (products below ideal quantity)
    getPurchaseReportData: async () => {
        const response = await axios.get(`${API_BASE_URL}/report/monthly`);
        return response.data;
    }

};
