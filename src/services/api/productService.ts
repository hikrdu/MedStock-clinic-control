import { Product, ProductStock, } from "./models/Product";
import * as api from "./productApi";

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const productService = {
    // Get all products
    getProducts: async (): Promise<Product[]> => {
        return await api.productApi.getProducts();
    },

    // Get a product by ID
    getProductById: async (id: string): Promise<Product | undefined> => {
        return await api.productApi.getProductById(id);
    },

    // Create a new product
    createProduct: async (product: Omit<Product, '_id' | 'lastUpdated' | 'createdAt'>): Promise<Product> => {
        const { _id, lastUpdated, createdAt, ...productData } = product as any;
        const created = await api.productApi.createProduct(productData);
        return created;
    },

    // Update an existing product
    updateProduct: async (id: string, product: Partial<Product>): Promise<Product | undefined> => {
        const productData = await api.productApi.getProducts();
        const index = productData.findIndex(p => p._id === id);
        if (index !== -1) {
            const updatedProduct = {
                ...productData[index],
                ...product,
                lastUpdated: new Date()
            };
            await api.productApi.updateProduct(id, updatedProduct);
            return updatedProduct;
        }
        return undefined;
    },

    // Delete a product
    deleteProduct: async (id: string): Promise<boolean> => {
        const productData = await api.productApi.getProducts();
        const index = productData.findIndex(p => p._id === id);
        if (index !== -1) {
            await api.productApi.deleteProduct(id);
            return true;
        }
        return false;
    },

    // Get stock movements for a product
    getStockMovements: async (productId?: string): Promise<ProductStock[]> => {
        const stockMovements = await api.productApi.getStockMovements();
        if (productId) {
            return stockMovements.filter(m => m.productId === productId);
        }
        return [...stockMovements];
    },

    // Add stock movement (in/out)
    addStockMovement: async (movement: Omit<ProductStock, '_id'>): Promise<ProductStock> => {
        // const stockMovements = await api.productApi.getStockMovements();
        const newMovement: ProductStock = {
            ...movement,
            _id: Date.now().toString()
        };

        await api.productApi.addStockMovement(newMovement);

        const productData = await api.productApi.getProducts();
        const product = productData.find(p => p._id === movement.productId);
        if (product) {
            product.quantity += movement.type === 'IN' ? movement.quantity : -movement.quantity;
            product.lastUpdated = new Date();
        }

        return newMovement;
    },

    // Get purchase report data (products below ideal quantity)
    getPurchaseReportData: async (): Promise<Array<{
        _id: string;
        description: string;
        unit: string;
        currentQuantity: number;
        idealQuantity: number;
        needsToBuy: number;
        sector: string;
    }>> => {
        const productData = await api.productApi.getProducts();
        return productData
            .filter(product => product.quantity < product.monthlyIdealQuantity)
            .map(product => ({
                _id: product._id,
                description: product.description,
                unit: product.unit,
                currentQuantity: product.quantity,
                idealQuantity: product.monthlyIdealQuantity,
                needsToBuy: product.monthlyIdealQuantity - product.quantity,
                sector: product.sector
            }));
    }
};
