export interface Unity {
    _id: string; // MongoDB uses _id as the primary key
    description: string;
    abreviation: string;
    createdAt: Date;
    lastUpdated: Date;
}

export interface Sector {
    _id: string; // MongoDB uses _id as the primary key
    description: string;
    createdAt: Date;
    lastUpdated: Date;
}
