export interface Product {
    _id: string; // MongoDB uses _id as the primary key
    description: string;
    unit: string;
    quantity: number;
    expirationDate?: string;
    monthlyIdealQuantity: number;
    sector: string;
    lastUpdated: Date;
    createdAt: Date;
}

// // // Initial mock data for products
// export const productList: Product[] = [

// ];

export interface ProductStock {
    _id: string; // MongoDB uses _id as the primary key
    productId: string;
    type: 'IN' | 'OUT';
    quantity: number;
    date: Date;
    notes?: string;
}

// export const stockMovements: ProductStock[] = [

// ];
