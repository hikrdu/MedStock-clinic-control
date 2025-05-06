import React, { createContext, useContext, useState, useCallback } from "react";
import { Product } from "@/services/api/models/Product";
import { productService } from "@/services/api/productService";

type ProductCacheContextType = {
    products: Product[] | null;
    loading: boolean;
    fetchProducts: () => Promise<void>;
    invalidateCache: () => void;
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
};

const ProductCacheContext = createContext<ProductCacheContextType | undefined>(undefined);

export const ProductCacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[] | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchProducts = useCallback(async () => {
        if (products !== null) return; // Already cached
        setLoading(true);
        try {
            const data = await productService.getProducts();
            setProducts(data);
        } finally {
            setLoading(false);
        }
    }, [products]);

    const invalidateCache = useCallback(() => {
        setProducts(null);
    }, []);

    return (
        <ProductCacheContext.Provider value={{ products, loading, fetchProducts, invalidateCache, setProducts }}>
            {children}
        </ProductCacheContext.Provider>
    );
};

export const useProductCache = () => {
    const ctx = useContext(ProductCacheContext);
    if (!ctx) throw new Error("useProductCache must be used within a ProductCacheProvider");
    return ctx;
};